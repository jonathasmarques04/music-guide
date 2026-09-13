import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { INSTRUMENTOS } from '@/content/instrumentos';
import type { Instrumento } from '@/content/tipos';
import { useAuth } from '@/contexts/auth';
import { mensagemDeErro } from '@/lib/erros-auth';
import { supabase } from '@/lib/supabase';

/** O que fica guardado no aparelho — o mesmo par que mora no banco. */
type Resposta = { instrumento: string | null; adiado: boolean };

/**
 * Uma chave por identidade, com o visitante tendo a sua.
 *
 * Sem separar, a resposta de um aluno apareceria para o próximo que entrasse
 * no mesmo aparelho — e a do visitante vazaria para a conta de verdade.
 */
const chaveDe = (usuarioId: string | null) => `instrumento:${usuarioId ?? 'visitante'}`;

/*
 * O armazenamento local pode simplesmente não existir (janela anônima, dados
 * do site limpos, storage recusado). Em nenhum desses casos isso pode derrubar
 * o app: falhar aqui só significa que a pergunta volta na próxima abertura.
 */
async function lerResposta(usuarioId: string | null): Promise<Resposta | null> {
  try {
    const bruto = await AsyncStorage.getItem(chaveDe(usuarioId));
    return bruto ? (JSON.parse(bruto) as Resposta) : null;
  } catch {
    return null;
  }
}

async function gravarResposta(usuarioId: string | null, resposta: Resposta) {
  try {
    await AsyncStorage.setItem(chaveDe(usuarioId), JSON.stringify(resposta));
  } catch {
    // Sem storage a escolha vale a sessão; não há o que avisar ao aluno.
  }
}

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

  /*
   * Troca de conta (ou saída) recarrega: o instrumento é de quem está logado.
   *
   * A ordem é aparelho primeiro, conta depois, e ela é o que faz a pergunta
   * aparecer UMA vez só. O aparelho responde na hora e responde sempre —
   * inclusive para o visitante, que não tem linha no banco, e inclusive
   * enquanto a seção 4 do schema.sql não foi aplicada. A conta entra por cima
   * porque é ela que atravessa de um celular para outro.
   */
  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErroSincronizacao(null);

    (async () => {
      const local = await lerResposta(usuarioId);
      if (!ativo) return;

      setEscolhido(local?.instrumento ?? null);
      setAdiado(!!local?.adiado);

      if (!usuarioId) {
        // Visitante não tem banco — o que estava no aparelho já é a resposta.
        setCarregando(false);
        return;
      }

      const { data, error } = await supabase
        .from('perfis')
        .select('instrumento, instrumento_adiado')
        .eq('id', usuarioId)
        .maybeSingle();

      if (!ativo) return;

      /*
       * Coluna ausente derruba a consulta INTEIRA (PostgREST, 42703), e é o
       * estado normal de quem ainda não rodou a seção 4 do schema.sql. Aqui
       * isso não apaga nada: fica valendo o que o aparelho respondeu, e a
       * pergunta segue sem voltar. Quem diz o que falta é `npm run supabase`.
       */
      if (error) {
        setErroSincronizacao(mensagemDeErro(error));
      } else if (data?.instrumento || data?.instrumento_adiado) {
        /*
         * Só sobrepõe quando a conta TEM uma resposta. Uma linha recém-criada
         * traz os dois campos nulos, e deixá-la vencer apagaria a escolha que
         * o aluno acabou de fazer neste aparelho — trazendo de volta a tela
         * que ele já respondeu.
         */
        setEscolhido(data.instrumento ?? null);
        setAdiado(!!data.instrumento_adiado);
      }

      setCarregando(false);
    })();

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

    // O aparelho recebe a resposta SEMPRE, com ou sem conta. É esta linha que
    // garante que a pergunta não volta na próxima abertura.
    gravarResposta(usuarioId, { instrumento, adiado: instrumentoAdiado });

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
