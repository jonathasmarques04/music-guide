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
  /** Endereço da foto no bucket `avatares`; null para quem não subiu nenhuma. */
  avatarUrl: string | null;
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
   * Envia a foto para o bucket `avatares` e grava o endereço no perfil.
   * `uri` é o que o seletor de imagem devolve — arquivo local, não base64.
   */
  atualizarAvatar: (uri: string) => Promise<Resultado>;
  /** Apaga a foto do bucket e limpa o endereço no perfil. */
  removerAvatar: () => Promise<Resultado>;
  /**
   * Pede a troca de e-mail. O Supabase NÃO troca na hora: manda confirmação
   * para o endereço novo (e, se `Secure email change` estiver ligado, também
   * para o antigo). Só depois do clique a conta muda.
   */
  atualizarEmail: (email: string) => Promise<Resultado>;
  /** Troca a senha da sessão aberta. */
  atualizarSenha: (senha: string) => Promise<Resultado>;
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

/** Empacota o `error` do SDK no formato que a tela espera. */
function resultado(erro: unknown): Resultado {
  return { erro: erro ? mensagemDeErro(erro) : null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessaoSupabase, setSessaoSupabase] = useState<SessaoSupabase | null>(null);
  const [nome, setNome] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [visitante, setVisitante] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [recuperandoSenha, setRecuperandoSenha] = useState(false);
  const [erroLink, setErroLink] = useState<string | null>(null);

  const usuario = sessaoSupabase?.user ?? null;
  const usuarioId = usuario?.id ?? null;

  /**
   * A recusa das operações que exigem conta de verdade: no modo visitante não
   * há linha em `public.perfis` para atualizar, nem pasta no bucket.
   */
  const exigeConta = (acao: string): Resultado => ({
    erro: `Entre na sua conta para ${acao}.`,
  });

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

  // --- Carrega o perfil (nome de exibição e foto) da conta ------------------
  useEffect(() => {
    if (!usuarioId) {
      setNome('');
      setAvatarUrl(null);
      return;
    }

    let ativo = true;

    /*
     * A foto é opcional NO BANCO, não só na tela: `avatar_url` só existe depois
     * que `supabase/schema.sql` roda. Pedir a coluna direto faria o PostgREST
     * recusar a consulta INTEIRA — e o nome, que nada tem a ver com foto,
     * deixaria de carregar junto. Então: tenta com foto, e cai para só o nome
     * se o banco ainda não tiver a coluna.
     */
    const carregar = async () => {
      const comFoto = await supabase
        .from('perfis')
        .select('nome, avatar_url')
        .eq('id', usuarioId)
        .maybeSingle();

      if (!ativo) return;

      if (!comFoto.error) {
        if (comFoto.data?.nome) setNome(comFoto.data.nome);
        setAvatarUrl(comFoto.data?.avatar_url ?? null);
        return;
      }

      const soNome = await supabase
        .from('perfis')
        .select('nome')
        .eq('id', usuarioId)
        .maybeSingle();

      if (!ativo) return;

      if (soNome.data?.nome) setNome(soNome.data.nome);
      setAvatarUrl(null);
    };

    carregar();

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
    ? { usuarioId: null, email: null, nome: 'estudante', avatarUrl: null, isGuest: true }
    : usuario
      ? {
          usuarioId: usuario.id,
          email: usuario.email ?? null,
          nome: nome || usuario.email?.split('@')[0] || 'estudante',
          avatarUrl,
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
        ...resultado(error),
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
        return { ...resultado(error), precisaConfirmarEmail: false };
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
      return resultado(error);
    },

    definirNovaSenha: async (senha) => {
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) {
        return resultado(error);
      }

      setRecuperandoSenha(false);
      return resultado(null);
    },

    reenviarConfirmacao: async (email) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: urlDeRetorno() },
      });
      return resultado(error);
    },

    atualizarNome: async (novoNome) => {
      if (!usuarioId) return exigeConta('mudar seu nome');

      const limpo = novoNome.trim();
      const { error } = await supabase.from('perfis').update({ nome: limpo }).eq('id', usuarioId);

      if (error) {
        return resultado(error);
      }

      setNome(limpo);
      return resultado(null);
    },


    /*
     * A foto vai para `avatares/<uuid>/avatar.jpg`, sempre no mesmo caminho: a
     * pasta é o que amarra o arquivo ao dono na política de RLS, e o nome fixo
     * evita deixar avatares órfãos a cada troca.
     *
     * O endereço guardado leva `?v=<timestamp>` porque o bucket é público e
     * servido por CDN — sem isso a foto nova continuaria mostrando a antiga até
     * o cache expirar.
     */
    atualizarAvatar: async (uri) => {
      if (!usuarioId) return exigeConta('trocar a foto');

      const caminho = `${usuarioId}/avatar.jpg`;

      try {
        const resposta = await fetch(uri);
        const bytes = await resposta.arrayBuffer();

        const { error: falhaUpload } = await supabase.storage
          .from('avatares')
          .upload(caminho, bytes, { contentType: 'image/jpeg', upsert: true });

        if (falhaUpload) {
          return resultado(falhaUpload);
        }
      } catch (falha) {
        return resultado(falha);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatares').getPublicUrl(caminho);

      const endereco = `${publicUrl}?v=${Date.now()}`;

      const { error } = await supabase
        .from('perfis')
        .update({ avatar_url: endereco })
        .eq('id', usuarioId);

      if (error) {
        return resultado(error);
      }

      setAvatarUrl(endereco);
      return resultado(null);
    },

    removerAvatar: async () => {
      if (!usuarioId) return exigeConta('mexer na foto');

      // Some da tela mesmo que o arquivo resista: o que o app mostra é o
      // `avatar_url`, então limpar a coluna é o que de fato remove a foto.
      await supabase.storage.from('avatares').remove([`${usuarioId}/avatar.jpg`]);

      const { error } = await supabase
        .from('perfis')
        .update({ avatar_url: null })
        .eq('id', usuarioId);

      if (error) {
        return resultado(error);
      }

      setAvatarUrl(null);
      return resultado(null);
    },

    /*
     * Troca de e-mail é em DUAS etapas e isso precisa aparecer na tela: aqui só
     * disparamos a confirmação. Enquanto o aluno não clicar no link, a conta
     * continua no endereço antigo.
     */
    atualizarEmail: async (novoEmail) => {
      if (!usuarioId) return exigeConta('trocar o e-mail');

      const { error } = await supabase.auth.updateUser(
        { email: novoEmail.trim() },
        { emailRedirectTo: urlDeRetorno() }
      );

      return resultado(error);
    },

    atualizarSenha: async (senha) => {
      if (!usuarioId) return exigeConta('trocar a senha');

      const { error } = await supabase.auth.updateUser({ password: senha });
      return resultado(error);
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
