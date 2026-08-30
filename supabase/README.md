# Supabase — backend do musica

O projeto **já está criado e configurado**. Este arquivo documenta o que existe
lá, o que ainda é decisão sua, e como refazer tudo do zero se precisar.

| | |
| --- | --- |
| Projeto | `musica` |
| Organização | Devepex |
| Região | `sa-east-1` (São Paulo) |
| Ref | `blujzbdtulwpnnubqwmj` |
| Painel | <https://supabase.com/dashboard/project/blujzbdtulwpnnubqwmj> |

As chaves já estão em `.env.local` (fora do git). Basta rodar:

```bash
npx expo start --clear
```

---

## Conferir o que está aplicado

```bash
npm run supabase
```

Lê o `.env.local`, bate no projeto real e lista o que falta, por seção do
`schema.sql`. Só leitura, só com a chave publicável. Vale rodar depois de
mexer no schema e ao clonar o projeto numa máquina nova — foi o que pegou a
seção 3 (avatares) faltando no banco enquanto o código já a usava.

---

## O que já foi aplicado

- **Tabelas `perfis` e `progresso_modulos`**, com RLS ligada e 3 e 4 políticas
  respectivamente — via [`schema.sql`](schema.sql).
- **Triggers** `on_auth_user_created` (cria o perfil junto com a conta),
  `perfis_atualizado_em` e `progresso_modulos_atualizado_em`.
- **Função `registrar_nota`**, que mantém sempre a melhor nota.
- **Site URL** `http://localhost:8081` e **Redirect URLs**
  `musica://*`, `exp://*`, `http://localhost:8081/*`, `http://localhost:19006/*`.

### Verificado contra o projeto real

Um teste de ponta a ponta rodou no banco e foi desfeito em seguida (o banco
ficou zerado). Passaram:

| | |
| --- | --- |
| 1 | O trigger cria o perfil com o nome enviado no cadastro |
| 2 | O trigger copia o e-mail para o perfil |
| 3 | Com dois alunos no banco, cada um enxerga **1** perfil — o seu |
| 4 | Gravar 0,8 e depois 0,3 mantém **0,8** (regra da melhor nota) |
| 5 | O aluno lê o próprio progresso |
| 6 | O progresso do outro aluno aparece como **0 linhas** |
| 7 | `auth.uid()` resolve o aluno certo |
| 8 | Gravar nota no id de outro aluno é **recusado** pela RLS |
| 9-11 | Apagar a conta leva perfil e progresso junto (`on delete cascade`) |
| 12 | Login de conta não confirmada devolve `email_not_confirmed` (senha certa) |
| 13 | Login com senha errada devolve `invalid_credentials` — casos distintos |

---

## Confirmação de e-mail: ligada, e tratada no app

Ficou **ligada** (padrão do Supabase, e o mais seguro). O aluno se cadastra,
recebe um e-mail e só entra depois de clicar. O app cobre os quatro caminhos:

| Situação | O que o aluno vê |
| --- | --- |
| Acabou de se cadastrar | "Confirme o e-mail que enviamos para ..." + botão de reenvio |
| Tenta entrar sem ter confirmado | A mensagem de confirmação **e** o botão de reenvio — não só o erro |
| Pede reenvio cedo demais | Botão travado com contagem: "Reenviar em 45s" |
| Clica num link expirado ou já usado | "Esse link não funcionou (...). Peça um novo e-mail." |

O intervalo do botão (60s) é o mesmo `smtp_max_frequency` do projeto, então o
app não pede nada que o servidor vá recusar.

### O limite de e-mails vai atrapalhar seus testes

O envio embutido do Supabase está em `rate_limit_email_sent: 2` — **2 e-mails
por hora no projeto inteiro**, e ele serve só para desenvolvimento. Ao terceiro
cadastro o aluno leva "Já pedimos e-mails demais em pouco tempo".

- **Para testar em volume:** Authentication → Sign In / Providers → Email →
  desligue *Confirm email*. Qualquer e-mail inventado passa a criar conta —
  aceitável em desenvolvimento, ruim em produção.
- **Para produção:** mantenha ligada e configure um SMTP próprio em
  Project Settings → Authentication → SMTP Settings. Aí o limite sobe e os
  e-mails passam a sair do seu domínio.

---

## Chaves

Em Project Settings → API. O projeto usa o formato novo de chaves:

| Chave | Onde vai |
| --- | --- |
| `sb_publishable_...` | `.env.local`, embutida no app — é pública por design |
| `sb_secret_...` | **nunca** no app; só em servidor, se um dia houver |

Quem protege os dados é a RLS, não o segredo da chave publicável. Existem também
as chaves antigas (`anon` / `service_role`, em JWT) — o app não usa.

---

## Como refazer do zero

Se você criar outro projeto (ou quiser um ambiente de teste separado):

1. **SQL Editor → New query**, cole [`schema.sql`](schema.sql) inteiro e rode.
   O arquivo é idempotente: rodar de novo não apaga dados.
2. **Project Settings → API**: copie Project URL e a chave publicável para
   `.env.local`.
3. **Authentication → URL Configuration → Redirect URLs**, adicione:

   | Ambiente | URL |
   | --- | --- |
   | App instalado (iOS/Android) | `musica://*` |
   | Expo Go / dev client | `exp://*` |
   | Web em desenvolvimento | `http://localhost:8081/*` |
   | Web em produção | `https://SEU-DOMINIO/*` |

   O esquema `musica` vem do campo `scheme` do `app.json`.
4. `npx expo start --clear` (variáveis de ambiente só são lidas na inicialização).

---

## Como testar no app

1. **Criar conta** → nome, e-mail e senha (mín. 6 caracteres).
2. Confira em **Authentication → Users** que a conta apareceu, e em
   **Table Editor → perfis** que o nome foi para lá.
3. Faça uma avaliação de módulo e veja a linha nascer em **progresso_modulos**.
4. **Sair da conta** e entrar de novo: o progresso volta do banco.
5. Feche e reabra o app: entra direto, sem pedir login (sessão persistida).

---

## O que ficou onde

| Arquivo | Papel |
| --- | --- |
| `supabase/schema.sql` | Tabelas, RLS, triggers e a função `registrar_nota` |
| `src/lib/supabase.ts` | Cliente único (auth + banco), sessão persistida |
| `src/lib/database.types.ts` | Tipos das tabelas — mantenha em sincronia com o SQL |
| `src/lib/erros-auth.ts` | Erros do Supabase traduzidos para o aluno |
| `src/contexts/auth.tsx` | Sessão, login, cadastro, recuperação, logout |
| `src/contexts/progresso.tsx` | Progresso da trilha lido e gravado no banco |
| `src/components/login-screen.tsx` | Entrar / criar conta / recuperar senha |
| `src/components/redefinir-senha-screen.tsx` | Nova senha, vinda do link do e-mail |

### Regenerar `database.types.ts`

Se mexer no esquema, atualize os tipos à mão ou gere:

```bash
npx supabase login
npx supabase gen types typescript --project-id blujzbdtulwpnnubqwmj > src/lib/database.types.ts
```

---

## Segurança — o que está garantido

- **RLS ligada nas duas tabelas**, comparando `auth.uid()` com o dono da linha.
  Testado: a chave publicável sozinha não lê nem escreve dado de outro aluno.
- **A melhor nota é regra do banco**, não só do app: `registrar_nota` usa
  `greatest(...)`, então gravação atrasada não derruba o progresso.
- **O bypass de visitante só existe em desenvolvimento** (`__DEV__`) — some do
  build de produção.
- **A senha nunca passa pelo nosso código.** Quem valida, guarda com hash e
  emite os tokens é o Supabase Auth.
