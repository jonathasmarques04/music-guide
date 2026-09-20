import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Fonts, Rules } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * O fundo vivo da tela de entrada.
 *
 * O sistema pede profundidade e luz, mas **não** por sombra, brilho ou
 * gradiente — o Modernist é plano por definição (ver `theme.ts` e o comentário
 * do splash em `animated-icon.tsx`). Aqui os dois efeitos saem do vocabulário
 * que o sistema já tem:
 *
 * - **Luz** é a grade acendendo. As colunas são fios de 1px na cor `hairline`;
 *   a que está sob o ponteiro sobe até o vermelhão de pôster e as vizinhas
 *   acompanham por proximidade. É uma luz que passa por cima da grade, não um
 *   borrão colado no fundo.
 * - **Profundidade** é paralaxe diferencial. A grade anda pouco, a nota de
 *   marca-d'água anda quase o triplo: dois planos a distâncias diferentes,
 *   que é como o olho lê profundidade sem precisar de sombra.
 *
 * A camada inteira é decorativa e `pointerEvents="none"`: ela nunca intercepta
 * clique, seleção de texto nem foco de teclado.
 */
export type LoginFundoProps = {
  /**
   * Posição do ponteiro em pontos, dentro da tela. `-1` significa "não há
   * ponteiro" — é o estado no celular e no primeiro quadro do desktop, e nele
   * a grade fica apagada e parada.
   */
  x: SharedValue<number>;
  y: SharedValue<number>;
};

/**
 * As colunas da grade, em fração da largura — os quartos da tela.
 *
 * Eram cinco, nos sextos, e de perto viravam papel milimetrado: fio demais
 * para um fundo, e denso o bastante para competir com as réguas que de fato
 * organizam a tela. Três sugerem a grade sem desenhá-la inteira.
 */
const COLUNAS = [1 / 4, 2 / 4, 3 / 4];

/** Até onde a luz do ponteiro alcança, em pontos. */
const RAIO_LUZ = 260;

/** Quanto cada plano desloca, em fração da distância do ponteiro ao centro. */
const PARALAXE_GRADE = 0.014;
const PARALAXE_MARCA = 0.04;

export function LoginFundo({ x, y }: LoginFundoProps) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  /*
   * A nota acompanha a tela em vez de ter um corpo fixo: num tamanho só, ela
   * some no desktop e engole o formulário no celular. Os limites impedem os
   * dois extremos.
   */
  const tamanhoDaNota = Math.max(170, Math.min(340, width * 0.26));

  /*
   * A grade inteira desliza junto — é o plano de trás. O deslocamento é
   * proporcional à distância do ponteiro até o centro, e o sinal é invertido:
   * o fundo se afasta do ponteiro, que é o que dá a sensação de plano distante.
   */
  const planoDaGrade = useAnimatedStyle(() => {
    if (x.value < 0) return { transform: [{ translateX: 0 }, { translateY: 0 }] };

    return {
      transform: [
        { translateX: -(x.value - width / 2) * PARALAXE_GRADE },
        { translateY: -(y.value - height / 2) * PARALAXE_GRADE },
      ],
    };
  });

  const planoDaMarca = useAnimatedStyle(() => {
    if (x.value < 0) return { transform: [{ translateX: 0 }, { translateY: 0 }] };

    return {
      transform: [
        { translateX: -(x.value - width / 2) * PARALAXE_MARCA },
        { translateY: -(y.value - height / 2) * PARALAXE_MARCA },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.camada}>
      <Animated.View style={[styles.camada, planoDaGrade]}>
        {COLUNAS.map((fracao) => (
          <Coluna key={fracao} alvo={width * fracao} x={x} base={theme.hairline} luz={theme.accentDisplay} />
        ))}
      </Animated.View>

      <Animated.View
        style={[styles.marca, { right: -tamanhoDaNota * 0.12, bottom: -tamanhoDaNota * 0.3 }, planoDaMarca]}>
        <Animated.Text
          style={[
            styles.nota,
            { color: theme.hairline, fontSize: tamanhoDaNota, lineHeight: tamanhoDaNota * 1.1 },
          ]}>
          ♪
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Uma coluna da grade.
 *
 * Fica num componente próprio porque cada fio precisa do seu próprio
 * `useAnimatedStyle` — um hook por coluna, que não pode sair de dentro de um
 * `map` no componente de cima.
 */
function Coluna({
  alvo,
  x,
  base,
  luz,
}: {
  alvo: number;
  x: SharedValue<number>;
  base: string;
  luz: string;
}) {
  const animado = useAnimatedStyle(() => {
    const proximidade =
      x.value < 0 ? 0 : 1 - Math.min(Math.abs(x.value - alvo) / RAIO_LUZ, 1);

    return {
      backgroundColor: interpolateColor(proximidade, [0, 1], [base, luz]),
      /*
       * A opacidade acompanha a cor. Sem isso o fio aceso viraria um traço
       * vermelho cheio atravessando a tela, e a grade passaria de fundo a
       * elemento — o oposto do que ela é.
       *
       * Em repouso o fio fica quase no limiar do visível: é textura, e só. O
       * percurso até 0,6 é o que sobrou de contraste para a luz do ponteiro
       * ainda ter o que acender.
       */
      opacity: 0.2 + proximidade * 0.4,
    };
  });

  return <Animated.View style={[styles.coluna, { left: alvo }, animado]} />;
}

const styles = StyleSheet.create({
  camada: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  coluna: { position: 'absolute', top: 0, bottom: 0, width: Rules.hair },
  /*
   * A nota sangra pelo canto inferior direito em vez de ficar inteira na tela:
   * marca-d'água cortada pela borda lê como plano de fundo; centralizada e
   * inteira, leria como ilustração.
   */
  marca: { position: 'absolute' },
  nota: {
    fontFamily: Fonts.regular,
    opacity: 0.5,
  },
});
