import type { Session as SessaoSupabase } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { codigoDoErro, mensagemDeErro } from '@/lib/erros-auth';
import { supabase } from '@/lib/supabase';

/**
 * Sessão do ponto de vista do app — cobre tanto a conta real do Supabase
 * quanto o modo visitante (bypass de desenvolvimento, que não toca o servidor).
 */
export type Session = {
  /** Id do usuário no Supabase (`auth.users.id`); null no modo visitante. */
  usuarioId: string | null;
  /** E-mail da conta, ou null quando a sessão veio do bypass. */
  email: string | null;
  /** Nome de exibição vindo de `public.perfis`. */
  nome: string;
  /** true quando a sessão foi criada pelo bypass de desenvolvimento. */
  isGuest: boolean;
};

/** Toda operação de auth devolve isto: `erro` já vem traduzido para a tela. */
type Resultado = { erro: string | null };

type AuthValue = {
  session: Session | null;
  isAuthenticated: boolean;
  /** true enquanto restauramos a sessão salva — evita piscar a tela de login. */
  carregando: boolean;
  /**
   * true quando o aluno chegou por um link de recuperação de senha: o app deve
   * mostrar o formulário de nova senha em vez do conteúdo.
   */
  recuperandoSenha: boolean;
  /**
   * `precisaConfirmarEmail` = a conta existe, mas o e-mail nunca foi
   * confirmado. A tela usa isso para oferecer o reenvio em vez de só acusar
   * erro — é o caso de quem se cadastrou ontem e voltou hoje.
   */
  signIn: (
    email: string,
    senha: string
  ) => Promise<Resultado & { precisaConfirmarEmail: boolean }>;
  /** `precisaConfirmarEmail` = a conta nasceu, mas só entra após clicar no e-mail. */
  signUp: (
    nome: string,
    email: string,
    senha: string
  ) => Promise<Resultado & { precisaConfirmarEmail: boolean }>;
  /** Dispara o e-mail de recuperação. Não revela se a conta existe. */
  recuperarSenha: (email: string) => Promise<Resultado>;
  /** Aplica a nova senha na sessão aberta pelo link de recuperação. */
  definirNovaSenha: (senha: string) => Promise<Resultado>;
  /** Reenvia o e-mail de confirmação de cadastro. */
  reenviarConfirmacao: (email: string) => Promise<Resultado>;
  atualizarNome: (nome: string) => Promise<Resultado>;
  /**
   * Falha ao abrir um link de e-mail (expirado, já usado ou recusado). Sem
   * isso o aluno clica num link velho, o app não faz nada e ele fica sem
   * entender por quê.
   */
  erroLink: string | null;
  limparErroLink: () => void;
  /** Bypass de desenvolvimento: entra sem credencial e sem gravar nada. */
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Para onde o Supabase manda o aluno de volta depois do e-mail de confirmação
 * ou de recuperação. Precisa estar liberado em
 * Dashboard > Authentication > URL Configuration > Redirect URLs.
 *
 * Usamos a raiz (e não uma rota dedicada) de propósito: quem decide o que
 * mostrar é o evento `PASSWORD_RECOVERY`, não o caminho da URL — assim o export
 * estático da web não precisa de uma página que só existe para o redirect.
 */
function urlDeRetorno() {
  return Linking.createURL('/');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessaoSupabase, setSessaoSupabase] = useState<SessaoSupabase | null>(null);
  const [nome, setNome] = useState('');
  const [visitante, setVisitante] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [recuperandoSenha, setRecuperandoSenha] = useState(false);
  const [erroLink, setErroLink] = useState<string | null>(null);

  const usuario = sessaoSupabase?.user ?? null;
  const usuarioId = usuario?.id ?? null;

  // --- Restaura a sessão salva e acompanha as mudanças ----------------------
  useEffect(() => {
    let ativo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSessaoSupabase(data.session);
      setCarregando(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, sessao) => {
      // Não chame outros métodos do supabase daqui dentro: o SDK serializa as
      // chamadas de auth e isso trava. O que precisa de rede vai nos efeitos.
      setSessaoSupabase(sessao);
      setCarregando(false);

      if (sessao) setVisitante(false);
      if (evento === 'PASSWORD_RECOVERY') setRecuperandoSenha(true);
      if (evento === 'SIGNED_OUT') setRecuperandoSenha(false);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  // --- Carrega o perfil (nome de exibição) da conta -------------------------
  useEffect(() => {
    if (!usuarioId) {
      setNome('');
      return;
    }

    let ativo = true;

    supabase
      .from('perfis')
      .select('nome')
      .eq('id', usuarioId)
      .maybeSingle()
      .then(({ data }) => {
        if (ativo && data?.nome) setNome(data.nome);
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  // --- Deep link dos e-mails (confirmação / recuperação) --------------------
  // Na web o próprio SDK lê a URL (`detectSessionInUrl`); no nativo o link
  // chega por aqui e trocamos o `code` do PKCE por uma sessão.
  const urlRecebida = Linking.useURL();
  const urlsTratadas = useRef(new Set<string>());

  useEffect(() => {
    if (Platform.OS === 'web' || !urlRecebida) return;
    if (urlsTratadas.current.has(urlRecebida)) return;
    urlsTratadas.current.add(urlRecebida);

    const { queryParams } = Linking.parse(urlRecebida);

    // O Supabase devolve a falha na própria URL quando o link não vale mais.
    const recusa = queryParams?.error_description ?? queryParams?.error;
    if (typeof recusa === 'string') {
      setErroLink(`Esse link não funcionou (${recusa}). Peça um novo e-mail.`);
      return;
    }

    const code = queryParams?.code;
    if (typeof code !== 'string') return;

    // O evento PASSWORD_RECOVERY sai daqui quando o link era de recuperação —
    // o SDK sabe disso pelo verificador PKCE que ele mesmo guardou.
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setErroLink(mensagemDeErro(error));
    });
  }, [urlRecebida]);

  // Mesma falha, mas na web: lá o SDK lê a URL sozinho e engole o erro, então
  // olhamos os parâmetros nós mesmos. Roda só no cliente (efeito não executa
  // no prerender), e o `typeof window` protege qualquer outro caminho.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const busca = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const recusa =
      busca.get('error_description') ??
      busca.get('error') ??
      hash.get('error_description') ??
      hash.get('error');

    if (recusa) {
      setErroLink(`Esse link não funcionou (${recusa}). Peça um novo e-mail.`);
    }
  }, []);

  const session: Session | null = visitante
    ? { usuarioId: null, email: null, nome: 'estudante', isGuest: true }
    : usuario
      ? {
          usuarioId: usuario.id,
          email: usuario.email ?? null,
          nome: nome || usuario.email?.split('@')[0] || 'estudante',
          isGuest: false,
        }
      : null;

  const value: AuthValue = {
    session,
    isAuthenticated: session !== null,
    carregando,
    recuperandoSenha,

    erroLink,
    limparErroLink: () => setErroLink(null),

    signIn: async (email, senha) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      return {
        erro: error ? mensagemDeErro(error) : null,
        precisaConfirmarEmail: codigoDoErro(error) === 'email_not_confirmed',
      };
    },

    signUp: async (nomeInformado, email, senha) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          // Vira `raw_user_meta_data->>'nome'`, que o trigger do banco copia
          // para `public.perfis` no instante em que a conta é criada.
          data: { nome: nomeInformado.trim() },
          emailRedirectTo: urlDeRetorno(),
        },
      });

      if (error) {
        return { erro: mensagemDeErro(error), precisaConfirmarEmail: false };
      }

      // Com confirmação de e-mail ligada, o Supabase não acusa e-mail repetido
      // (evita descobrir quem tem conta): devolve um usuário sem identities.
      if (data.user && data.user.identities?.length === 0) {
        return {
          erro: 'Já existe uma conta com esse e-mail. Tente entrar.',
          precisaConfirmarEmail: false,
        };
      }

      // Sem sessão = a conta só abre depois que o aluno clicar no e-mail.
      return { erro: null, precisaConfirmarEmail: data.session === null };
    },

    recuperarSenha: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: urlDeRetorno(),
      });
      return { erro: error ? mensagemDeErro(error) : null };
    },

    definirNovaSenha: async (senha) => {
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) {
        return { erro: mensagemDeErro(error) };
      }

      setRecuperandoSenha(false);
      return { erro: null };
    },

    reenviarConfirmacao: async (email) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: urlDeRetorno() },
      });
      return { erro: error ? mensagemDeErro(error) : null };
    },

    atualizarNome: async (novoNome) => {
      if (!usuarioId) {
        return { erro: 'Entre na sua conta para mudar seu nome.' };
      }

      const limpo = novoNome.trim();
      const { error } = await supabase.from('perfis').update({ nome: limpo }).eq('id', usuarioId);

      if (error) {
        return { erro: mensagemDeErro(error) };
      }

      setNome(limpo);
      return { erro: null };
    },

    signInAsGuest: () => setVisitante(true),

    signOut: async () => {
      setVisitante(false);
      setRecuperandoSenha(false);
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  }

  return context;
}
