/**
 * Verificador do backend Supabase.
 *
 * Confere se o projeto REAL tem o que `supabase/schema.sql` promete. Existe
 * porque o SQL mora no git mas o banco mora na nuvem: as duas coisas saem de
 * sincronia em silêncio, e o app só reclama na hora em que o aluno clica.
 *
 * Foi assim que a foto de perfil quebrou — o código e o schema.sql traziam
 * `avatar_url` e o bucket `avatares`, e nenhum dos dois existia no projeto.
 *
 * Só faz leitura, e só com a chave publicável do `.env.local`: nada aqui
 * precisa de segredo, e nada aqui escreve. A RLS devolve zero linha para quem
 * não está autenticado, então uma tabela que existe responde `[]` — o que
 * interessa é a coluna, que o PostgREST recusa com 42703 quando falta.
 *
 *   npm run supabase
 */

const fs = require('fs');
const path = require('path');

// O `.env.local` não é lido por um processo node solto — quem carrega é o Expo.
const env = {};
const arquivoEnv = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(arquivoEnv)) {
  for (const linha of fs.readFileSync(arquivoEnv, 'utf8').split('\n')) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
const chave = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !chave) {
  console.error('Falta EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  console.error('Copie `.env.example` para `.env.local` e preencha os dois valores.');
  process.exit(1);
}

const cabecalhos = { apikey: chave, Authorization: `Bearer ${chave}` };

/** Uma coluna existe quando o PostgREST aceita selecioná-la (`[]` já é sim). */
async function coluna(tabela, nome) {
  const r = await fetch(`${url}/rest/v1/${tabela}?select=${nome}&limit=1`, { headers: cabecalhos });
  if (r.ok) return { ok: true };
  const corpo = await r.json().catch(() => ({}));
  // 42703 = coluna inexistente; 42P01 = tabela inexistente.
  return { ok: false, motivo: corpo.message || `HTTP ${r.status}` };
}

/**
 * Um bucket ausente e um objeto ausente se distinguem pela mensagem: `list`
 * devolve `[]` para os dois casos, então a pergunta tem de ser por um arquivo.
 */
async function bucket(nome) {
  const r = await fetch(`${url}/storage/v1/object/public/${nome}/.verificacao-inexistente`);
  const corpo = await r.json().catch(() => ({}));
  if (corpo.code === 'NoSuchBucket') return { ok: false, motivo: 'bucket não existe' };
  return { ok: true };
}

async function auth() {
  const r = await fetch(`${url}/auth/v1/health`, { headers: cabecalhos });
  const corpo = await r.json().catch(() => ({}));
  return r.ok ? { ok: true, nota: corpo.version } : { ok: false, motivo: `HTTP ${r.status}` };
}

/** Cada item é [seção do schema.sql, o que é, verificação]. */
const verificacoes = [
  ['auth', 'Auth (GoTrue) responde', auth()],
  ['1', 'perfis.nome', coluna('perfis', 'nome')],
  ['1', 'perfis.email', coluna('perfis', 'email')],
  ['2', 'progresso_modulos.modulo_id', coluna('progresso_modulos', 'modulo_id')],
  ['2', 'progresso_modulos.aproveitamento', coluna('progresso_modulos', 'aproveitamento')],
  ['3', 'perfis.avatar_url', coluna('perfis', 'avatar_url')],
  ['3', 'bucket avatares', bucket('avatares')],
];

(async () => {
  console.log(`\nProjeto: ${url}\n`);
  const faltando = new Set();

  for (const [secao, nome, promessa] of verificacoes) {
    const r = await promessa;
    if (r.ok) console.log(`  ok     ${nome}${r.nota ? `  (${r.nota})` : ''}`);
    else {
      console.log(`  FALTA  ${nome}  — ${r.motivo}`);
      faltando.add(secao);
    }
  }

  if (!faltando.size) {
    console.log('\nO banco tem tudo que o schema.sql promete.');
    process.exit(0);
  }

  console.log(`\nSeção(ões) ${[...faltando].join(', ')} do supabase/schema.sql não estão aplicadas.`);
  console.log('Cole o arquivo inteiro no SQL Editor e rode — ele é idempotente:');
  console.log(`  https://supabase.com/dashboard/project/${url.match(/\/\/([^.]+)\./)[1]}/sql/new`);
  process.exit(1);
})();
