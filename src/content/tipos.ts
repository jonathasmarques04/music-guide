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

/** Fração mínima de acerto para concluir um módulo e liberar o próximo. */
export const NOTA_MINIMA = 0.6;

/** O mesmo mínimo como percentual inteiro — é assim que a tela o escreve. */
export const PERCENTUAL_MINIMO = Math.round(NOTA_MINIMA * 100);
