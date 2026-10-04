/** Verificações de leitura. Não substituem um teste autenticado de RLS com duas contas. */
const fs = require('node:fs');
const path = require('node:path');

async function coluna(fetcher, url, headers, tabela, nome) {
  const resposta = await fetcher(`${url}/rest/v1/${tabela}?select=${nome}&limit=1`, { headers, signal: AbortSignal.timeout(15000) });
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) return { ok: false, motivo: `HTTP ${resposta.status}; não foi possível verificar a coluna` };
  if (!Array.isArray(corpo)) return { ok: false, motivo: 'Resposta inesperada da API' };
  if (corpo.length) return { ok: false, motivo: 'FALHA DE PRIVACIDADE: consulta sem login retornou linhas; conteúdo omitido' };
  return { ok: true };
}

async function storage(fetcher, url, headers) {
  const lista = await fetcher(`${url}/storage/v1/object/list/avatares`, {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: '', limit: 1, offset: 0 }), signal: AbortSignal.timeout(15000),
  });
  const itens = await lista.json().catch(() => null);
  if (!lista.ok) return { ok: false, motivo: `Storage HTTP ${lista.status}; acesso não verificado` };
  if (!Array.isArray(itens)) return { ok: false, motivo: 'Resposta inesperada do Storage' };
  if (itens.length) return { ok: false, motivo: 'FALHA DE PRIVACIDADE: listagem anônima de avatares; caminhos omitidos' };
  const resposta = await fetcher(`${url}/storage/v1/object/public/avatares/.verificacao-inexistente`, { signal: AbortSignal.timeout(15000) });
  const corpo = await resposta.json().catch(() => null);
  if (resposta.ok || corpo?.code === 'NoSuchKey') {
    return { ok: false, motivo: 'Bucket com leitura pública; aplique a política privada da seção 3' };
  }
  if (resposta.status >= 500 || !['NoSuchBucket', 'not_found'].includes(corpo?.code)) {
    return { ok: false, motivo: `Storage HTTP ${resposta.status}; configuração não verificada` };
  }
  return { ok: false, inconclusivo: true, motivo: 'Não houve listagem anônima. Bucket privado e bucket ausente não podem ser distinguidos sem login; confirme com duas contas de teste' };
}

async function main() {
  const env = {};
  const arquivo = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(arquivo)) {
    for (const linha of fs.readFileSync(arquivo, 'utf8').split('\n')) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
  const chave = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) throw new Error('Configuração ausente');
  const headers = { apikey: chave, Authorization: `Bearer ${chave}` };
  const verificacoes = [
    ['Auth', async () => {
      const resposta = await fetch(`${url}/auth/v1/health`, { headers, signal: AbortSignal.timeout(15000) });
      return { ok: resposta.ok, motivo: `HTTP ${resposta.status}` };
    }],
    ...[['perfis', 'nome'], ['perfis', 'email'], ['perfis', 'avatar_url'], ['perfis', 'instrumento'],
      ['perfis', 'instrumento_adiado'], ['progresso_modulos', 'modulo_id'], ['progresso_modulos', 'aproveitamento']]
      .map(([tabela, nome]) => [`${tabela}.${nome}`, () => coluna(fetch, url, headers, tabela, nome)]),
    ['Storage', () => storage(fetch, url, headers)],
  ];
  const resultados = await Promise.all(verificacoes.map(async ([nome, verificar]) => {
    try { return { nome, ...await verificar() }; }
    catch { return { nome, ok: false, motivo: 'Falha de conexão; nenhum resultado confirmado' }; }
  }));
  for (const resultado of resultados) {
    console.log(`${resultado.ok ? 'OK' : resultado.inconclusivo ? 'INCONCLUSIVO' : 'FALHA'} ${resultado.nome}${resultado.ok ? '' : ': ' + resultado.motivo}`);
  }
  console.log('Escopo: colunas e sondas anônimas. Respostas vazias não provam RLS. RPC, triggers, bucket privado e isolamento entre contas precisam de teste autenticado.');
  process.exitCode = resultados.some(r => !r.ok && !r.inconclusivo) ? 1 : resultados.some(r => r.inconclusivo) ? 2 : 0;
}
module.exports = { coluna, storage };
if (require.main === module) main().catch(() => {
  console.error('Não foi possível executar as verificações. Confira configuração e conexão.');
  process.exitCode = 1;
});
