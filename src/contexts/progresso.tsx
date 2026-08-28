import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { MODULOS } from '@/content/modulos';
import { NOTA_MINIMA } from '@/content/tipos';
import { useAuth } from '@/contexts/auth';
import { mensagemDeErro } from '@/lib/erros-auth';
import { supabase } from '@/lib/supabase';

export type StatusModulo = 'concluido' | 'atual' | 'bloqueado';

type ProgressoValue = {
  /** Melhor aproveitamento por módulo, de 0 a 1. */
  notas: Record<string, number>;
  registrarNota: (moduloId: string, aproveitamento: number) => void;
  statusDe: (moduloId: string) => StatusModulo;
  notaDe: (moduloId: string) => number | undefined;
  concluidos: number;
  totalAulas: number;
  progressoDe: (moduloId: string) => number;
  reiniciar: () => void;
  /** true enquanto buscamos o progresso salvo no Supabase. */
  carregando: boolean;
  /** Preenchido quando a gravação no servidor falhou (o app segue funcionando). */
  erroSincronizacao: string | null;
};

const ProgressoContext = createContext<ProgressoValue | null>(null);

export function ProgressoProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [notas, setNotas] = useState<Record<string, number>>({});
  const [carregando, setCarregando] = useState(false);
  const [erroSincronizacao, setErroSincronizacao] = useState<string | null>(null);

  /** null no modo visitante: aí o progresso é só de memória, nunca vai ao banco. */
  const usuarioId = session?.usuarioId ?? null;

  // Troca de conta (ou saída) recarrega tudo: o progresso é por aluno.
  useEffect(() => {
    if (!usuarioId) {
      setNotas({});
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErroSincronizacao(null);

    supabase
      .from('progresso_modulos')
      .select('modulo_id, aproveitamento')
      .eq('usuario_id', usuarioId)
      .then(({ data, error }) => {
        if (!ativo) return;

        if (error) {
          setErroSincronizacao(mensagemDeErro(error));
        } else {
          const salvas: Record<string, number> = {};
          for (const linha of data) {
            salvas[linha.modulo_id] = linha.aproveitamento;
          }
          setNotas(salvas);
        }

        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  /**
   * Guarda apenas a MELHOR nota: refazer a avaliação nunca piora o progresso.
   * A mesma regra vale no banco (função `registrar_nota` em schema.sql), então
   * uma gravação fora de ordem também não derruba o que já foi conquistado.
   *
   * A tela é atualizada na hora e a ida ao servidor acontece em seguida: uma
   * falha de rede não pode travar o fim da avaliação.
   */
  const registrarNota = (moduloId: string, aproveitamento: number) => {
    const anterior = notas[moduloId] ?? 0;
    if (aproveitamento <= anterior) return;

    setNotas((atual) => ({ ...atual, [moduloId]: aproveitamento }));

    if (!usuarioId) return;

    supabase
      .rpc('registrar_nota', { p_modulo_id: moduloId, p_aproveitamento: aproveitamento })
      .then(({ error }) => {
        setErroSincronizacao(error ? mensagemDeErro(error) : null);
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

  const reiniciar = () => {
    setNotas({});

    if (!usuarioId) return;

    supabase
      .from('progresso_modulos')
      .delete()
      .eq('usuario_id', usuarioId)
      .then(({ error }) => {
        setErroSincronizacao(error ? mensagemDeErro(error) : null);
      });
  };

  const value: ProgressoValue = {
    notas,
    registrarNota,
    statusDe,
    notaDe: (moduloId) => notas[moduloId],
    concluidos: MODULOS.filter((m) => passou(m.id)).length,
    totalAulas: MODULOS.length,
    progressoDe: (moduloId) => (passou(moduloId) ? 1 : notas[moduloId] ?? 0),
    reiniciar,
    carregando,
    erroSincronizacao,
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
