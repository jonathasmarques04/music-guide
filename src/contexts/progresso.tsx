import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { MODULOS } from '@/content/modulos';
import { NOTA_MINIMA } from '@/content/tipos';
import { useAuth } from '@/contexts/auth';
import { useEstadoLocal } from '@/hooks/use-estado-local';
import { mensagemDeErro } from '@/lib/erros-auth';
import { supabase } from '@/lib/supabase';

export type StatusModulo = 'concluido' | 'atual' | 'bloqueado';
type ProgressoValue = {
  registrarNota: (moduloId: string, aproveitamento: number) => void;
  statusDe: (moduloId: string) => StatusModulo;
  notaDe: (moduloId: string) => number | undefined;
  concluidos: number;
  totalAulas: number;
  reiniciar: () => void;
  erroSincronizacao: string | null;
};
type Dados = { notas: Record<string, number>; pendentes: Record<string, number>; reinicioPendente: boolean };
const VAZIO: Dados = { notas: {}, pendentes: {}, reinicioPendente: false };
const ProgressoContext = createContext<ProgressoValue | null>(null);
const notaValida = (id: string, nota: unknown): nota is number =>
  MODULOS.some(m => m.id === id) && typeof nota === 'number' && Number.isFinite(nota) && nota >= 0 && nota <= 1;
function validarDados(valor: unknown): Dados {
  const dados = valor as Partial<Dados> | null;
  const limpar = (notas: unknown): Record<string, number> =>
    notas && typeof notas === 'object'
      ? Object.fromEntries(Object.entries(notas).filter(([id, nota]) => notaValida(id, nota))) : {};
  return { notas: limpar(dados?.notas), pendentes: limpar(dados?.pendentes), reinicioPendente: dados?.reinicioPendente === true };
}
export function ProgressoProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const usuarioId = session?.usuarioId ?? null;
  const identidade = usuarioId ?? (session?.isGuest ? 'visitante' : 'sem-sessao');
  return <ProgressoDoAluno key={identidade} identidade={identidade} usuarioId={usuarioId}>{children}</ProgressoDoAluno>;
}
function ProgressoDoAluno({ children, identidade, usuarioId }: {
  children: ReactNode; identidade: string; usuarioId: string | null;
}) {
  const { estado, atual, atualizar, pronto, erro, ativo } = useEstadoLocal(`progresso:v1:${identidade}`, VAZIO, validarDados);
  const [erroRemoto, setErroRemoto] = useState<string | null>(null);
  const sincronizando = useRef(false);
  const versao = useRef(0);
  // Fixa o token da conta de origem para uma RPC de A nunca gravar como B.
  const sincronizar = async (carregar = false) => {
    if (!usuarioId || !pronto || !ativo.current || sincronizando.current) return;
    sincronizando.current = true;
    const inicio = versao.current;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!ativo.current || data.session?.user.id !== usuarioId) return;
      const token = `Bearer ${data.session.access_token}`;
      if (atual.current.reinicioPendente) {
        const resposta = await supabase.from('progresso_modulos').delete()
          .eq('usuario_id', usuarioId).setHeader('Authorization', token);
        if (resposta.error) throw resposta.error;
        if (!ativo.current || inicio !== versao.current) return;
        atualizar(d => ({ ...d, reinicioPendente: false }));
      } else if (carregar) {
        const resposta = await supabase.from('progresso_modulos').select('modulo_id, aproveitamento')
          .eq('usuario_id', usuarioId).setHeader('Authorization', token);
        if (resposta.error) throw resposta.error;
        if (!ativo.current || inicio !== versao.current) return;
        atualizar(d => {
          const notas = { ...d.notas };
          for (const linha of resposta.data ?? []) {
            if (notaValida(linha.modulo_id, linha.aproveitamento)) {
              notas[linha.modulo_id] = Math.max(notas[linha.modulo_id] ?? 0, linha.aproveitamento);
            }
          }
          return { ...d, notas };
        });
      }
      for (const [id, nota] of Object.entries(atual.current.pendentes)) {
        if (!ativo.current || inicio !== versao.current) return;
        const resposta = await supabase.rpc('registrar_nota', { p_modulo_id: id, p_aproveitamento: nota })
          .setHeader('Authorization', token);
        if (resposta.error) throw resposta.error;
        if (!ativo.current || inicio !== versao.current) return;
        atualizar(d => {
          const pendentes = { ...d.pendentes };
          if (pendentes[id] === nota) delete pendentes[id];
          return { ...d, pendentes };
        });
      }
      if (ativo.current) setErroRemoto(null);
    } catch (falha) {
      if (ativo.current) setErroRemoto(mensagemDeErro(falha));
    } finally {
      sincronizando.current = false;
      if (ativo.current && inicio !== versao.current) void sincronizar();
    }
  };
  useEffect(() => {
    if (!pronto) return;
    void sincronizar(true);
    const intervalo = setInterval(() => { void sincronizar(); }, 30_000);
    const listener = AppState.addEventListener('change', estado => {
      if (estado === 'active') void sincronizar(true);
    });
    return () => { clearInterval(intervalo); listener.remove(); };
    // A identidade remonta o provider; as operações leem os dados mais recentes pela ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronto, usuarioId]);
  const passou = (id: string) => (estado.notas[id] ?? 0) >= NOTA_MINIMA;
  const statusDe = (id: string): StatusModulo => {
    const indice = MODULOS.findIndex(m => m.id === id);
    if (indice < 0) return 'bloqueado';
    if (passou(id)) return 'concluido';
    return indice === 0 || passou(MODULOS[indice - 1].id) ? 'atual' : 'bloqueado';
  };
  const registrarNota = (id: string, nota: number) => {
    if (!notaValida(id, nota) || statusDe(id) === 'bloqueado') return;
    atualizar(d => {
      const melhor = Math.max(d.notas[id] ?? 0, nota);
      return { ...d, notas: { ...d.notas, [id]: melhor },
        pendentes: usuarioId ? { ...d.pendentes, [id]: melhor } : d.pendentes };
    });
    void sincronizar();
  };
  const reiniciar = () => {
    versao.current++;
    atualizar(() => ({ notas: {}, pendentes: {}, reinicioPendente: !!usuarioId }));
    void sincronizar();
  };
  const value: ProgressoValue = {
    registrarNota, statusDe, notaDe: id => estado.notas[id],
    concluidos: MODULOS.filter(m => passou(m.id)).length, totalAulas: MODULOS.length,
    reiniciar, erroSincronizacao: erro ?? erroRemoto,
  };
  return <ProgressoContext.Provider value={value}>{pronto ? children : null}</ProgressoContext.Provider>;
}
export function useProgresso() {
  const contexto = useContext(ProgressoContext);
  if (!contexto) throw new Error('useProgresso precisa estar dentro de <ProgressoProvider>.');
  return contexto;
}
