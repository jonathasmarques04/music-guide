import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { INSTRUMENTOS } from '@/content/instrumentos';
import type { Instrumento } from '@/content/tipos';
import { useAuth } from '@/contexts/auth';
import { mensagemDeErro } from '@/lib/erros-auth';
import { supabase } from '@/lib/supabase';

type InstrumentoValue = {
  /** O instrumento escolhido, ou null enquanto o aluno não escolheu. */
  instrumento: Instrumento | null;
  /**
   * Se cabe abrir a tela de escolha: ninguém escolheu E ninguém disse "depois".
   * Fica `false` enquanto o perfil carrega, para a tela não piscar na frente de
   * quem já tem instrumento gravado.
   */
  precisaEscolher: boolean;
  escolher: (id: string) => void;
  /** "Decidir depois" — resposta guardada, não ausência de resposta. */
  adiar: () => void;
  /** Preenchido quando a gravação no servidor falhou (o app segue funcionando). */
  erroSincronizacao: string | null;
};

const InstrumentoContext = createContext<InstrumentoValue | null>(null);

const acharInstrumento = (id: string | null) =>
  INSTRUMENTOS.find((instrumento) => instrumento.id === id) ?? null;

export function InstrumentoProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const [adiado, setAdiado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erroSincronizacao, setErroSincronizacao] = useState<string | null>(null);

  /** null no modo visitante: a escolha vale a sessão e nunca vai ao banco. */
  const usuarioId = session?.usuarioId ?? null;

  // Troca de conta (ou saída) recarrega: o instrumento é de quem está logado.
  useEffect(() => {
    setEscolhido(null);
    setAdiado(false);
    setErroSincronizacao(null);

    if (!usuarioId) {
      // Visitante não tem o que buscar — e não pode ficar preso em "carregando".
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);

    supabase
      .from('perfis')
      .select('instrumento, instrumento_adiado')
      .eq('id', usuarioId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!ativo) return;

        /*
         * Coluna ausente derruba a consulta INTEIRA (PostgREST, 42703), e é o
         * estado normal de quem ainda não rodou a seção 4 do schema.sql. Aqui
         * isso vira "ninguém escolheu ainda" em vez de tela de erro: a escolha
         * continua funcionando na sessão, só não sobrevive ao fechar o app.
         * Quem diz o que falta é `npm run supabase`.
         */
        if (error) {
          setErroSincronizacao(mensagemDeErro(error));
        } else if (data) {
          setEscolhido(data.instrumento ?? null);
          setAdiado(!!data.instrumento_adiado);
        }

        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  /**
   * A tela muda na hora e a ida ao servidor acontece em seguida: escolher um
   * instrumento não pode ficar esperando a rede para a tela sair da frente.
   */
  const gravar = (instrumento: string | null, instrumentoAdiado: boolean) => {
    setEscolhido(instrumento);
    setAdiado(instrumentoAdiado);

    if (!usuarioId) return;

    supabase
      .from('perfis')
      .update({ instrumento, instrumento_adiado: instrumentoAdiado })
      .eq('id', usuarioId)
      .then(({ error }) => {
        setErroSincronizacao(error ? mensagemDeErro(error) : null);
      });
  };

  const value: InstrumentoValue = {
    // Um id que não existe mais no conteúdo é lido como "nenhum", em vez de
    // quebrar a tela que espera o objeto inteiro.
    instrumento: acharInstrumento(escolhido),
    precisaEscolher: !carregando && !acharInstrumento(escolhido) && !adiado,
    // Escolher também limpa o "depois": quem decidiu não está mais adiando.
    escolher: (id) => gravar(id, false),
    adiar: () => gravar(null, true),
    erroSincronizacao,
  };

  return <InstrumentoContext.Provider value={value}>{children}</InstrumentoContext.Provider>;
}

export function useInstrumento() {
  const context = useContext(InstrumentoContext);

  if (!context) {
    throw new Error('useInstrumento precisa estar dentro de <InstrumentoProvider>.');
  }

  return context;
}
