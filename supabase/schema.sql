-- =============================================================================
-- musica — esquema de autenticacao e dados do aluno
--
-- Rode este arquivo INTEIRO no SQL Editor do painel do Supabase
-- (Dashboard > SQL Editor > New query > cole > Run).
--
-- E idempotente: pode ser executado de novo sem quebrar nada.
--
-- Modelo:
--   auth.users            (gerenciada pelo Supabase — nunca escrevemos nela)
--     └─ public.perfis                 1:1  — nome de exibicao do aluno
--     └─ public.progresso_modulos      1:N  — melhor nota por modulo da trilha
--
-- Toda tabela tem RLS ligada: um aluno so enxerga e so escreve as proprias
-- linhas. A chave anon do app nao consegue ler dados de outro usuario.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Utilitario: mantem `atualizado_em` sempre coerente, sem depender do cliente.
-- -----------------------------------------------------------------------------
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;


-- =============================================================================
-- 1. perfis — dados do aluno que o app exibe (nome no "Ola, ...")
-- =============================================================================
create table if not exists public.perfis (
  id            uuid primary key references auth.users (id) on delete cascade,
  nome          text not null default '',
  email         text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.perfis is
  'Dados de exibicao do aluno. Uma linha por conta de auth.users, criada pelo trigger on_auth_user_created.';

alter table public.perfis enable row level security;

-- `(select auth.uid())` em vez de `auth.uid()`: o Postgres avalia uma vez por
-- query em vez de uma vez por linha (recomendacao de performance do Supabase).
drop policy if exists "perfis: aluno le o proprio perfil" on public.perfis;
create policy "perfis: aluno le o proprio perfil"
  on public.perfis for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "perfis: aluno cria o proprio perfil" on public.perfis;
create policy "perfis: aluno cria o proprio perfil"
  on public.perfis for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "perfis: aluno edita o proprio perfil" on public.perfis;
create policy "perfis: aluno edita o proprio perfil"
  on public.perfis for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop trigger if exists perfis_atualizado_em on public.perfis;
create trigger perfis_atualizado_em
  before update on public.perfis
  for each row execute function public.tocar_atualizado_em();


-- -----------------------------------------------------------------------------
-- Cria o perfil no mesmo instante em que a conta nasce.
--
-- `security definer` e obrigatorio aqui: o trigger roda no contexto do cadastro,
-- antes de existir uma sessao autenticada, entao a RLS de insert nao se aplica.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome, email)
  values (
    new.id,
    -- Nome vem do metadata enviado no signUp; sem ele, usa o usuario do e-mail.
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nome'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =============================================================================
-- 2. progresso_modulos — melhor aproveitamento do aluno em cada modulo
--
-- `aproveitamento` vai de 0 a 1 (0.6 = NOTA_MINIMA em src/content/tipos.ts).
-- Uma linha por (aluno, modulo): refazer a avaliacao atualiza a mesma linha.
-- =============================================================================
create table if not exists public.progresso_modulos (
  usuario_id     uuid not null references auth.users (id) on delete cascade,
  modulo_id      text not null,
  aproveitamento real not null check (aproveitamento >= 0 and aproveitamento <= 1),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  primary key (usuario_id, modulo_id)
);

comment on table public.progresso_modulos is
  'Melhor nota do aluno por modulo da trilha. modulo_id espelha MODULOS em src/content/modulos.ts.';

alter table public.progresso_modulos enable row level security;

drop policy if exists "progresso: aluno le o proprio progresso" on public.progresso_modulos;
create policy "progresso: aluno le o proprio progresso"
  on public.progresso_modulos for select
  to authenticated
  using ((select auth.uid()) = usuario_id);

drop policy if exists "progresso: aluno grava o proprio progresso" on public.progresso_modulos;
create policy "progresso: aluno grava o proprio progresso"
  on public.progresso_modulos for insert
  to authenticated
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "progresso: aluno atualiza o proprio progresso" on public.progresso_modulos;
create policy "progresso: aluno atualiza o proprio progresso"
  on public.progresso_modulos for update
  to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "progresso: aluno apaga o proprio progresso" on public.progresso_modulos;
create policy "progresso: aluno apaga o proprio progresso"
  on public.progresso_modulos for delete
  to authenticated
  using ((select auth.uid()) = usuario_id);

drop trigger if exists progresso_modulos_atualizado_em on public.progresso_modulos;
create trigger progresso_modulos_atualizado_em
  before update on public.progresso_modulos
  for each row execute function public.tocar_atualizado_em();


-- -----------------------------------------------------------------------------
-- registrar_nota — guarda APENAS a melhor nota.
--
-- A mesma regra do contexto `progresso` no app: refazer a avaliacao e ir pior
-- nunca derruba o progresso ja conquistado. Fica no banco (e nao so no cliente)
-- porque a regra precisa valer para qualquer origem de escrita.
--
-- `security invoker` (padrao): a RLS acima continua valendo, entao um aluno nao
-- consegue gravar nota no id de outro. `auth.uid()` resolve o dono da linha.
-- -----------------------------------------------------------------------------
create or replace function public.registrar_nota(
  p_modulo_id text,
  p_aproveitamento real
)
returns public.progresso_modulos
language sql
security invoker
set search_path = ''
as $$
  insert into public.progresso_modulos as pm (usuario_id, modulo_id, aproveitamento)
  values ((select auth.uid()), p_modulo_id, p_aproveitamento)
  on conflict (usuario_id, modulo_id) do update
    set aproveitamento = greatest(pm.aproveitamento, excluded.aproveitamento)
  returning pm.*;
$$;
