import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * Entrada escalonada de um bloco da tela.
 *
 * O Modernist não decora, e isso vale aqui: o que este componente faz é dar
 * ORDEM DE LEITURA ao primeiro quadro. Os blocos chegam na sequência em que o
 * olho deve percorrê-los — marca, frase, formulário, ação — e o atraso entre um
 * e outro é curto o bastante para ninguém esperar.
 *
 * Regras que o componente garante sozinho:
 *
 * - **Nunca bloqueia a interação.** O bloco já está no layout e já é clicável
 *   no quadro zero; o que anima é opacidade e um deslocamento de poucos pontos.
 *   Quem chegar com o teclado ou com pressa não precisa esperar nada acabar.
 * - **Respeita `useReducedMotion()`.** Com movimento reduzido o bloco nasce
 *   pronto, sem percurso — o conteúdo é o mesmo, só não anda.
 * - **Anima uma vez.** É entrada de tela, não reação a estado; reanimar a cada
 *   re-render faria o formulário piscar a cada tecla digitada.
 *
 * ```tsx
 * <Entrada indice={0}><Marca /></Entrada>
 * <Entrada indice={1}><Formulario /></Entrada>
 * ```
 */
export type EntradaProps = {
  children: ReactNode;
  /**
   * Posição na fila. O atraso é `indice × PASSO` — blocos com o mesmo índice
   * entram juntos, que é como se agrupa o que deve ser lido de uma vez.
   */
  indice?: number;
  /** Quanto o bloco sobe até assentar. Em pontos. */
  deslocamento?: number;
  style?: StyleProp<ViewStyle>;
};

/** Atraso entre um bloco e o seguinte. É o que dá o ritmo da apresentação. */
const PASSO = 70;

/** Duração de cada bloco. Curta: a tela precisa estar pronta, não em exibição. */
const DURACAO = 440;

/** Deslocamento padrão — poucos pontos, senão vira carrossel. */
const DESLOCAMENTO = 12;

export function Entrada({
  children,
  indice = 0,
  deslocamento = DESLOCAMENTO,
  style,
}: EntradaProps) {
  const reduzirMovimento = useReducedMotion();

  /*
   * Nasce em 1 quando o movimento está reduzido: assim o primeiro quadro já sai
   * no lugar definitivo, sem depender do efeito rodar para o conteúdo aparecer.
   */
  const progresso = useSharedValue(reduzirMovimento ? 1 : 0);

  useEffect(() => {
    if (reduzirMovimento) {
      progresso.value = 1;
      return;
    }

    progresso.value = withDelay(
      indice * PASSO,
      withTiming(1, { duration: DURACAO, easing: Easing.out(Easing.cubic) }),
    );
    // Só na montagem: ver "anima uma vez" no TSDoc acima.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animado = useAnimatedStyle(() => ({
    opacity: progresso.value,
    transform: [{ translateY: (1 - progresso.value) * deslocamento }],
  }));

  return <Animated.View style={[style, animado]}>{children}</Animated.View>;
}
