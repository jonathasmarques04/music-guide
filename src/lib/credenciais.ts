/**
 * As regras de e-mail e senha que a interface aplica antes de chamar o
 * servidor.
 *
 * Ficam em um lugar só porque as quatro telas que validam credenciais (entrada,
 * cadastro, recuperação e o perfil) precisam concordar: um mínimo de senha
 * diferente entre duas delas vira um botão habilitado que o Supabase recusa.
 */

/** Mesmo mínimo que o Supabase aplica no servidor. */
export const MINIMO_SENHA = 6;

/**
 * Validação de forma, não de existência: só evita mandar ao servidor o que
 * claramente não é um endereço. Quem diz se a conta existe é o Supabase.
 */
export function emailValido(email: string) {
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

/** Concordância certa no singular: "Falta 1 caractere", "Faltam 2 caracteres". */
export function faltamCaracteres(quantos: number) {
  return quantos === 1 ? 'Falta 1 caractere.' : `Faltam ${quantos} caracteres.`;
}
