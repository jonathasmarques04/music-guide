import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '@/contexts/auth';
import { useEstadoLocal } from '@/hooks/use-estado-local';

import { flashcardsPorModulo } from '@/content/flashcards';
import {
  estaVencido,
  revisar,
  type Avaliacao,
  type EstadoCard,
} from '@/content/repeticao';

/**
 * A chave usa o TEXTO da frente do card, não o índice: assim, reordenar ou
 * inserir cards no baralho não embaralha o histórico de quem já estudou.
 */
export function chaveCard(moduloId: string, frente: string) {
  return `${moduloId}::${frente}`;
}

export type ResumoModulo = {
  total: number;
  /** Cards nunca vistos. */
  novos: number;
  /** Cards já estudados cuja hora chegou. */
  vencidos: number;
  /** O que a fila de hoje tem para estudar: os novos mais os vencidos. */
  pendentes: number;
  /** Cards em dia (nenhuma ação necessária agora). */
  emDia: number;
  /** Quando o próximo card volta, se não há nada pendente. */
  proximaRevisao?: number;
};

type RevisaoValue = {
  erroPersistencia: string | null;
  estadoDe: (chave: string) => EstadoCard | undefined;
  registrar: (chave: string, avaliacao: Avaliacao) => void;
  /** Índices dos cards do módulo que devem ser estudados agora. */
  filaDoModulo: (moduloId: string, agora?: number) => number[];
  resumoDoModulo: (moduloId: string, agora?: number) => ResumoModulo;
};

const RevisaoContext = createContext<RevisaoValue | null>(null);
const VAZIO: Record<string, EstadoCard> = {};

function validarEstados(valor: unknown): Record<string, EstadoCard> {
  if (!valor || typeof valor !== 'object') return {};
  return Object.fromEntries(Object.entries(valor).filter(([, card]) =>
    card && Number.isInteger(card.repeticoes) && card.repeticoes >= 0 &&
    Number.isFinite(card.facilidade) && card.facilidade >= 1.3 && card.facilidade <= 2.8 &&
    Number.isFinite(card.intervaloMinutos) && card.intervaloMinutos >= 0 &&
    Number.isFinite(card.proximaRevisao) && card.proximaRevisao >= 0
  ));
}

export function RevisaoProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const identidade = session?.usuarioId ?? (session?.isGuest ? 'visitante' : 'sem-sessao');
  return <RevisaoDoAluno key={identidade} identidade={identidade}>{children}</RevisaoDoAluno>;
}

function RevisaoDoAluno({ children, identidade }: { children: ReactNode; identidade: string }) {
  const { estado: estados, atualizar: setEstados, pronto, erro } = useEstadoLocal(
    `revisao:v1:${identidade}`, VAZIO, validarEstados
  );

  const estadoDe = (chave: string) => estados[chave];

  const registrar = (chave: string, avaliacao: Avaliacao) => {
    setEstados((atual) => ({
      ...atual,
      [chave]: revisar(atual[chave], avaliacao),
    }));
  };

  /**
   * Ordem da fila: primeiro os que estão vencidos há mais tempo, depois os
   * cards novos. Quem errou volta em 10 minutos e naturalmente reaparece no
   * fim da sessão.
   */
  const filaDoModulo = (moduloId: string, agora = Date.now()) => {
    const cards = flashcardsPorModulo(moduloId);

    const pendentes = cards
      .map((card, indice) => ({ indice, estado: estados[chaveCard(moduloId, card.frente)] }))
      .filter(({ estado }) => estaVencido(estado, agora));

    const vistos = pendentes.filter((p) => p.estado !== undefined);
    const novos = pendentes.filter((p) => p.estado === undefined);

    vistos.sort((a, b) => a.estado!.proximaRevisao - b.estado!.proximaRevisao);

    return [...vistos, ...novos].map((p) => p.indice);
  };

  const resumoDoModulo = (moduloId: string, agora = Date.now()): ResumoModulo => {
    const cards = flashcardsPorModulo(moduloId);

    let novos = 0;
    let vencidos = 0;
    let proximaRevisao: number | undefined;

    for (const card of cards) {
      const estado = estados[chaveCard(moduloId, card.frente)];

      if (!estado) {
        novos++;
      } else if (estado.proximaRevisao <= agora) {
        vencidos++;
      } else if (proximaRevisao === undefined || estado.proximaRevisao < proximaRevisao) {
        proximaRevisao = estado.proximaRevisao;
      }
    }

    return {
      total: cards.length,
      novos,
      vencidos,
      pendentes: novos + vencidos,
      emDia: cards.length - novos - vencidos,
      proximaRevisao,
    };
  };

  const value: RevisaoValue = {
    erroPersistencia: erro,
    estadoDe,
    registrar,
    filaDoModulo,
    resumoDoModulo,
  };

  return <RevisaoContext.Provider value={value}>{pronto ? children : null}</RevisaoContext.Provider>;
}

export function useRevisao() {
  const context = useContext(RevisaoContext);

  if (!context) {
    throw new Error('useRevisao precisa estar dentro de <RevisaoProvider>.');
  }

  return context;
}
