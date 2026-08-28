/**
 * Traduz os erros do Supabase Auth para mensagens que o aluno entende.
 *
 * O SDK devolve mensagens em ingles e voltadas ao desenvolvedor ("Invalid login
 * credentials"). Mostrar isso na tela e ruim de ler e vaza detalhe de infra.
 * Preferimos o `code` (estavel) e so caimos no texto quando ele nao vem.
 */

import { AuthError, isAuthError } from '@supabase/supabase-js';

const PORCODIGO: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. Veja a mensagem que enviamos para voce.',
  user_already_exists: 'Ja existe uma conta com esse e-mail. Tente entrar.',
  email_exists: 'Ja existe uma conta com esse e-mail. Tente entrar.',
  weak_password: 'Senha fraca. Use pelo menos 6 caracteres.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  validation_failed: 'Confira os dados: algum campo esta em formato invalido.',
  // Sem SMTP próprio, o envio embutido do Supabase libera pouquíssimos e-mails
  // por hora — por isso a mensagem não promete um prazo curto.
  over_email_send_rate_limit: 'Já pedimos e-mails demais em pouco tempo. Espere um pouco antes de tentar de novo.',
  over_request_rate_limit: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  signup_disabled: 'O cadastro de novas contas esta desativado no momento.',
  user_not_found: 'Nao encontramos uma conta com esse e-mail.',
  session_expired: 'Sua sessao expirou. Entre de novo.',
  flow_state_expired: 'Esse link expirou. Peca um novo e-mail de recuperacao.',
  flow_state_not_found: 'Esse link nao vale mais. Peca um novo e-mail de recuperacao.',
};

/**
 * Código bruto do erro, para quando a tela precisa *reagir* a um caso e não só
 * mostrá-lo — por exemplo, oferecer o reenvio quando o e-mail não foi
 * confirmado. Devolve null quando o erro não veio do Supabase Auth.
 */
export function codigoDoErro(erro: unknown): string | null {
  return isAuthError(erro) ? erro.code ?? null : null;
}

/** Recebe o `error` de qualquer chamada do SDK e devolve o texto para a tela. */
export function mensagemDeErro(erro: unknown): string {
  if (!erro) {
    return '';
  }

  if (isAuthError(erro)) {
    const traduzida = erro.code ? PORCODIGO[erro.code] : undefined;
    if (traduzida) {
      return traduzida;
    }

    // Sem internet / servidor fora do ar: o SDK sinaliza com status 0.
    if (erro instanceof AuthError && (erro.status === undefined || erro.status === 0)) {
      return 'Nao foi possivel falar com o servidor. Verifique sua conexao e tente de novo.';
    }

    return erro.message;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return 'Algo deu errado. Tente de novo.';
}
