/**
 * Formatações que aparecem em mais de uma tela.
 *
 * Cada uma existia repetida em duas ou três telas; qualquer divergência entre
 * as cópias apareceria como inconsistência visível ao aluno (um "8" onde as
 * outras telas mostram "08", um arredondamento diferente no mesmo percentual).
 */

/** "01", "05", "13" — a numeração de módulo e passo, sempre em duas casas. */
export function doisDigitos(numero: number) {
  return String(numero).padStart(2, '0');
}

/** Fração de 0 a 1 → percentual inteiro, como toda nota é mostrada no app. */
export function percentual(fracao: number) {
  return Math.round(fracao * 100);
}

/** "Ana Souza" → "AS". Uma letra quando o nome é só um. */
export function iniciais(nome: string) {
  const partes = nome.split(/\s+/).filter(Boolean);
  return [partes[0], partes.length > 1 ? partes[partes.length - 1] : undefined]
    .filter((parte): parte is string => !!parte)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}
