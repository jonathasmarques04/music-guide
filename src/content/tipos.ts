/**
 * Tipos do conteúdo didático.
 *
 * A trilha segue a ordem dos módulos da apostila: cada módulo tem uma aula
 * (seções de conteúdo), uma avaliação e um baralho de flashcards.
 */

export type Bloco =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'formula'; rotulo?: string; texto: string }
  | { tipo: 'destaque'; titulo: string; texto: string }
  | { tipo: 'tabela'; cabecalho: string[]; linhas: string[][] };

export type Secao = {
  titulo: string;
  blocos: Bloco[];
};

export type Modulo = {
  id: string;
  numero: number;
  titulo: string;
  resumo: string;
  secoes: Secao[];
};

export type Questao = {
  pergunta: string;
  alternativas: string[];
  /** Índice da alternativa correta em `alternativas`. */
  correta: number;
  explicacao: string;
};

export type Flashcard = {
  frente: string;
  verso: string;
};

/**
 * Uma corda solta do instrumento.
 *
 * `ordem` é o número da corda como o instrumentista a chama, e essa contagem
 * anda ao contrário da altura: a 1ª é a mais FINA e mais aguda, a última é a
 * mais grossa e mais grave. As telas listam da grave para a aguda — a mesma
 * ordem em que as cordas aparecem num diagrama de acorde.
 *
 * `oitava` segue a notação científica (o dó central é Dó4), que é a que põe o
 * Mi grave do violão em Mi2. Sem fixar uma convenção o número não quer dizer
 * nada: há tabelas por aí que chamam essa mesma nota de Mi3.
 */
export type Corda = {
  ordem: number;
  /** Nome em português, como a UI escreve: `Mi`, `Lá`, `Sol`. */
  nota: string;
  /** A mesma nota em cifra: `E`, `A`, `G`. */
  cifra: string;
  oitava: number;
};

export type Instrumento = {
  id: string;
  nome: string;
  resumo: string;
  /** Da mais grave para a mais aguda. */
  cordas: readonly Corda[];
  /** Que intervalo separa uma corda da vizinha. */
  intervalos: string;
  /** Clave em que se escreve, e se soa onde está escrito. */
  clave: string;
  /** O que ele faz na música — um parágrafo por ideia. */
  papel: readonly string[];
};

/** Fração mínima de acerto para concluir um módulo e liberar o próximo. */
export const NOTA_MINIMA = 0.6;

/** O mesmo mínimo como percentual inteiro — é assim que a tela o escreve. */
export const PERCENTUAL_MINIMO = Math.round(NOTA_MINIMA * 100);
