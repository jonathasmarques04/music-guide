const { test } = require('node:test');
const assert = require('node:assert/strict');
const { harness } = require('./harness.cjs');
const { coluna, storage } = require('../scripts/verifica-supabase.js');
const response = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
const changeAccount = (h, id) => { h.session = id ? { user: { id }, access_token: 'synthetic-' + id } : null; };
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const progresso = h => h.mount('src/contexts/progresso.tsx', 'ProgressoProvider');
const revisao = h => h.mount('src/contexts/revisao.tsx', 'RevisaoProvider');
const firstModule = h => h.load('src/content/modulos.ts').MODULOS[0].id;

test('revisão é isolada por conta e persiste após logout e remontagem', async () => {
  const h = harness(), app = revisao(h);
  const key = firstModule(h) + '::card sintético';
  (await app.settle()).registrar(key, 'bom');
  await app.settle();
  assert.ok(app.render().estadoDe(key));
  changeAccount(h, 'account-b');
  assert.equal(app.render().estadoDe(key), undefined, 'sem flash do estado anterior');
  assert.equal((await app.settle()).estadoDe(key), undefined);
  changeAccount(h, null); await app.settle();
  changeAccount(h, 'account-a');
  assert.ok((await app.settle()).estadoDe(key));
  app.unmount();
  assert.ok((await revisao(h).settle()).estadoDe(key));
});

test('troca direta para B não mantém notas de A mesmo com falha de leitura', async () => {
  const h = harness(), id = firstModule(h), app = progresso(h);
  h.select = async () => ({ data: [{ modulo_id: id, aproveitamento: 1 }], error: null });
  assert.equal((await app.settle()).notaDe(id), 1);
  changeAccount(h, 'account-b');
  h.select = async () => ({ data: null, error: Error('offline') });
  assert.equal(app.render().notaDe(id), undefined);
  assert.equal((await app.settle()).notaDe(id), undefined);
});

test('nota pendente persiste e a mesma nota tenta sincronizar novamente', async () => {
  const h = harness(), id = firstModule(h), app = progresso(h);
  h.rpc = async () => ({ error: Error('offline') });
  (await app.settle()).registrarNota(id, 1);
  await app.settle();
  assert.equal(h.calls.filter(c => c.operation === 'rpc').length, 1);
  assert.equal(app.render().notaDe(id), 1);
  assert.ok(app.render().erroSincronizacao);
  h.rpc = async () => ({ error: null });
  app.render().registrarNota(id, 1);
  await app.settle();
  assert.equal(h.calls.filter(c => c.operation === 'rpc').length, 2);
  assert.equal(app.render().erroSincronizacao, null);
  assert.deepEqual(JSON.parse(h.memory.get('progresso:v1:account-a')).pendentes, {});
  app.unmount();
  assert.equal((await progresso(h).settle()).notaDe(id), 1);
});

test('pendência offline é reenviada ao reabrir e usa o token da conta de origem', async () => {
  const h = harness(), id = firstModule(h), app = progresso(h);
  h.rpc = async () => ({ error: Error('offline') });
  (await app.settle()).registrarNota(id, 0.8);
  await app.settle(); app.unmount();
  h.rpc = async () => ({ error: null });
  await progresso(h).settle();
  const rpcs = h.calls.filter(c => c.operation === 'rpc');
  assert.equal(rpcs.length, 2);
  assert.equal(rpcs[1].headers.Authorization, 'Bearer synthetic-a');
});

test('consulta inicial atrasada não apaga nota obtida durante o carregamento', async () => {
  const h = harness(), id = firstModule(h), wait = deferred(), app = progresso(h);
  h.select = () => wait.promise;
  (await app.settle()).registrarNota(id, 0.8);
  assert.equal(app.render().notaDe(id), 0.8);
  wait.resolve({ data: [], error: null });
  assert.equal((await app.settle()).notaDe(id), 0.8);
  assert.equal(h.calls.filter(c => c.operation === 'rpc').length, 1);
});

test('resposta atrasada de A não entra em B', async () => {
  const h = harness(), id = firstModule(h), wait = deferred(), app = progresso(h);
  h.select = () => wait.promise;
  await app.settle();
  changeAccount(h, 'account-b');
  h.select = async () => ({ data: [], error: null });
  await app.settle();
  wait.resolve({ data: [{ modulo_id: id, aproveitamento: 1 }], error: null });
  assert.equal((await app.settle()).notaDe(id), undefined);
});

test('reiniciar durante gravação pendente apaga a gravação antiga antes de continuar', async () => {
  const h = harness(), id = firstModule(h), wait = deferred(), app = progresso(h);
  h.rpc = () => wait.promise;
  (await app.settle()).registrarNota(id, 1);
  await app.settle(); app.render().reiniciar();
  wait.resolve({ error: null });
  await app.settle();
  assert.equal(app.render().notaDe(id), undefined);
  const ops = h.calls.map(c => c.operation);
  assert.ok(ops.lastIndexOf('delete') > ops.lastIndexOf('rpc'));
  assert.equal(JSON.parse(h.memory.get('progresso:v1:account-a')).reinicioPendente, false);
});

test('falha no armazenamento local é comunicada sem derrubar a revisão', async () => {
  const h = harness(); h.storageFails = true;
  const app = revisao(h);
  assert.match((await app.settle()).erroPersistencia, /Não foi possível salvar/);
  app.render().registrar('card', 'bom'); await app.settle();
  assert.ok(app.render().estadoDe('card'));
  assert.ok(app.render().erroPersistencia);
});

test('módulo bloqueado e notas inválidas não são registrados; nota zero válida é salva', async () => {
  const h = harness(), id = firstModule(h), app = progresso(h);
  let value = await app.settle();
  value.registrarNota('escalas', 1); value.registrarNota(id, NaN); value.registrarNota(id, 2);
  await app.settle();
  assert.equal(h.calls.filter(c => c.operation === 'rpc').length, 0);
  app.render().registrarNota(id, 0); await app.settle();
  assert.equal(app.render().notaDe(id), 0);
});

for (const file of ['quiz', 'flashcards']) {
  test(`rota direta de ${file} respeita o módulo bloqueado`, () => {
    const h = harness();
    h.stubs['@/contexts/progresso'] = { useProgresso: () => ({ statusDe: () => 'bloqueado' }) };
    h.stubs['@/contexts/revisao'] = { useRevisao: () => ({ filaDoModulo: () => [] }) };
    const tree = h.mount(`src/app/${file}/[id].tsx`, 'default', false).render();
    assert.match(JSON.stringify(tree), /Módulo bloqueado/);
    assert.doesNotMatch(JSON.stringify(tree), /radiogroup/);
  });
}

test('falha ao excluir foto não limpa o perfil nem informa sucesso', async () => {
  const h = harness();
  h.profile = async () => ({ data: { nome: 'Aluno A', avatar_url: 'account-a/avatar.jpg' }, error: null });
  h.remove = async () => ({ error: Error('synthetic backend details') });
  const app = h.mount('src/contexts/auth.tsx', 'AuthProvider', false);
  const auth = await app.settle();
  const result = await auth.removerAvatar();
  assert.ok(result.erro);
  assert.doesNotMatch(result.erro, /synthetic backend details/);
  assert.equal(h.calls.filter(c => c.operation === 'update').length, 0);
  assert.ok(app.render().session.avatarUrl);
  h.remove = async () => ({ error: null });
  assert.equal((await app.render().removerAvatar()).erro, null);
  assert.equal(app.render().session.avatarUrl, null);
  assert.ok(h.calls.find(c => c.operation === 'sign' && c.ttl === 3600));
});

test('perfil anterior não aparece em nova conta enquanto o carregamento falha', async () => {
  const h = harness();
  h.profile = async () => ({ data: { nome: 'Nome de A', avatar_url: 'account-a/avatar.jpg' }, error: null });
  const app = h.mount('src/contexts/auth.tsx', 'AuthProvider', false);
  assert.equal((await app.settle()).session.nome, 'Nome de A');
  h.profile = async () => ({ data: null, error: Error('offline') });
  changeAccount(h, 'account-b'); h.authChange('SIGNED_IN', h.session);
  assert.notEqual(app.render().session.nome, 'Nome de A');
  const next = await app.settle();
  assert.equal(next.session.avatarUrl, null);
  assert.notEqual(next.session.nome, 'Nome de A');
});

test('cadastro de conta existente e nova recebe resposta uniforme', async () => {
  const h = harness(), app = h.mount('src/contexts/auth.tsx', 'AuthProvider', false);
  const auth = await app.settle();
  const existing = await auth.signUp('Synthetic', 'test@example.invalid', 'synthetic');
  h.signup = async () => ({ data: { user: { identities: [{ id: 'synthetic' }] }, session: null }, error: null });
  const fresh = await auth.signUp('Synthetic', 'test@example.invalid', 'synthetic');
  assert.deepEqual({ ...existing }, { ...fresh });
  assert.equal(existing.erro, null); assert.equal(existing.precisaConfirmarEmail, true);
});

test('erros desconhecidos não expõem mensagens internas e email rejeita múltiplos arrobas', () => {
  const h = harness(), errors = h.load('src/lib/erros-auth.ts');
  assert.doesNotMatch(errors.mensagemDeErro(Error('SECRET_VALUE')), /SECRET_VALUE/);
  assert.equal(h.load('src/lib/credenciais.ts').emailValido('a@@example.com'), false);
});

test('verificador reprova linhas privadas, HTTP inválido e corpo inesperado', async () => {
  assert.equal((await coluna(async () => response(200, [{ email: 'synthetic@example.invalid' }]), 'https://example.invalid', {}, 'perfis', 'email')).ok, false);
  assert.equal((await coluna(async () => response(200, {}), '', {}, 'perfis', 'email')).ok, false);
  assert.equal((await coluna(async () => response(500, {}), '', {}, 'perfis', 'email')).ok, false);
  assert.equal((await coluna(async () => response(200, []), '', {}, 'perfis', 'email')).ok, true);
});

test('verificador não aprova Storage 403/500, listagem pública ou bucket inconclusivo', async () => {
  for (const status of [403, 500]) assert.equal((await storage(async () => response(status, {}), '', {})).ok, false);
  assert.equal((await storage(async () => response(200, [{ name: 'synthetic' }]), '', {})).ok, false);
  const probe = code => async url => url.includes('/list/') ? response(200, []) : response(404, { code });
  assert.equal((await storage(probe('NoSuchKey'), '', {})).ok, false);
  const privateOrMissing = await storage(probe('NoSuchBucket'), '', {});
  assert.equal(privateOrMissing.ok, false); assert.equal(privateOrMissing.inconclusivo, true);
});
