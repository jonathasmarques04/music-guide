import { createContext, useContext, useState, type ReactNode } from 'react';

import { MODULOS } from '@/content/modulos';
import { NOTA_MINIMA } from '@/content/tipos';

export type StatusModulo = 'concluido' | 'atual' | 'bloqueado';

type ProgressoValue = {
  /** Melhor aproveitamento por módulo, de 0 a 1. */
  notas: Record<string, number>;
  registrarNota: (moduloId: string, aproveitamento: number) => void;
  statusDe: (moduloId: string) => StatusModulo;
  notaDe: (moduloId: string) => number | undefined;
  concluidos: number;
  reiniciar: () => void;
};

const ProgressoContext = createContext<ProgressoValue | null>(null);

export function ProgressoProvider({ children }: { children: ReactNode }) {
  const [notas, setNotas] = useState<Record<string, number>>({});

  /** Guarda apenas a MELHOR nota: refazer a avaliação nunca piora o progresso. */
  const registrarNota = (moduloId: string, aproveitamento: number) => {
    setNotas((atual) => {
      const anterior = atual[moduloId] ?? 0;
      if (aproveitamento <= anterior) return atual;
      return { ...atual, [moduloId]: aproveitamento };
    });
  };

  const passou = (moduloId: string) => (notas[moduloId] ?? 0) >= NOTA_MINIMA;

  /**
   * Um módulo é liberado quando o anterior foi aprovado (>= 60%).
   * O primeiro módulo está sempre liberado.
   */
  const statusDe = (moduloId: string): StatusModulo => {
    const indice = MODULOS.findIndex((m) => m.id === moduloId);
    if (indice < 0) return 'bloqueado';
    if (passou(moduloId)) return 'concluido';

    const anterior = MODULOS[indice - 1];
    if (!anterior) return 'atual';
    return passou(anterior.id) ? 'atual' : 'bloqueado';
  };

  const value: ProgressoValue = {
    notas,
    registrarNota,
    statusDe,
    notaDe: (moduloId) => notas[moduloId],
    concluidos: MODULOS.filter((m) => passou(m.id)).length,
    reiniciar: () => setNotas({}),
  };

  return <ProgressoContext.Provider value={value}>{children}</ProgressoContext.Provider>;
}

export function useProgresso() {
  const context = useContext(ProgressoContext);

  if (!context) {
    throw new Error('useProgresso precisa estar dentro de <ProgressoProvider>.');
  }

  return context;
}
