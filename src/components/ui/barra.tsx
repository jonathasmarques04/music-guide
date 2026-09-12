import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Motion, Rules, Spacing } from '@/constants/theme';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';

export type BarraProgressoProps = {
  /** Fração de 0 a 1. */
  valor: number;
  rotulo: string;
  altura?: number;
  /**
   * Desenha sobre um fundo de destaque (o cartão "continuar de onde parou"),
   * onde trilho e preenchimento invertem para não sumir.
   */
  sobreDestaque?: boolean;
};

/** A barra de progresso: um retângulo dentro de outro, sem raio nem gradiente. */
export function BarraProgresso({
  valor,
  rotulo,
  altura = Spacing.one + Spacing.half,
  sobreDestaque = false,
}: BarraProgressoProps) {
  const theme = useTheme();
  const fracao = Math.min(1, Math.max(0, valor));
  const percentual = Math.round(fracao * 100);

  /*
   * A barra corre até o valor novo. Quem lê o número (o leitor de tela, pelo
   * `accessibilityValue` abaixo) recebe o destino de imediato — o percurso é
   * só para os olhos, e nunca atrasa a informação.
   *
   * Ela parte do trilho vazio também na primeira pintura: abrir a aula no
   * passo 1 desenha a corrida de 0 até 1/6, em vez de a barra já nascer
   * preenchida. Sem isso o movimento só existia ao trocar de passo, e quem
   * entrava na tela nunca via de onde o progresso veio.
   *
   * Esta é a ÚNICA exceção à regra de `Motion` em `theme.ts`: aqui não se
   * checa `useReducedMotion()`. O que se move é a própria grandeza que a
   * barra existe para mostrar — a largura *é* o valor, e vê-la percorrer o
   * trilho é ler de quanto para quanto o progresso foi. Não é decoração
   * sobreposta a um dado, como o giro do flashcard ou o recuo do toque, que
   * continuam obedecendo à preferência. É transição de estado, curta (520ms),
   * num retângulo fino, sem deslocamento de página nem escala — fora do que
   * dispara desconforto vestibular.
   *
   * `ReduceMotion.Never` é o que de fato destrava: além do hook, o Reanimated
   * consulta a preferência do sistema por dentro de `withTiming` e corta a
   * curva para um salto. Sem este campo, tirar o `useReducedMotion()` daqui
   * não muda nada — a barra continua pulando de um valor ao outro.
   */
  const preenchido = useSharedValue(0);

  useEffect(() => {
    preenchido.value = withTiming(fracao, { ...Motion.valor, reduceMotion: ReduceMotion.Never });
  }, [fracao, preenchido]);

  const preenchimentoStyle = useAnimatedStyle(() => ({
    width: `${preenchido.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityValue={{ min: 0, max: 100, now: percentual, text: `${percentual}%` }}
      style={[
        styles.trilho,
        {
          height: altura,
          /*
           * Trilho sólido, nunca translúcido: o Modernist não tem véus, e uma
           * cor com alfa mudaria de contraste conforme o que estivesse atrás —
           * que é justamente como se perde o 3:1 entre a parte cheia e a vazia.
           */
          backgroundColor: sobreDestaque ? theme.accent : theme.backgroundSelected,
        },
      ]}>
      <Animated.View
        style={[
          styles.preenchimento,
          { backgroundColor: sobreDestaque ? theme.accentOn : theme.accentStrong },
          preenchimentoStyle,
        ]}
      />
    </View>
  );
}

export type BarraPassosProps = {
  atual: number;
  total: number;
  rotulo: string;
  onSair: () => void;
  /** Rótulo do botão de saída, para o leitor de tela. */
  rotuloSair: string;
};

/**
 * A barra de topo das telas de sessão — aula, avaliação e baralho.
 *
 * Sair, progresso e contagem em uma linha, fechada por uma régua de 2px. Ela
 * substitui o cabeçalho normal: numa sessão a única saída é o ✕.
 */
export function BarraPassos({ atual, total, rotulo, onSair, rotuloSair }: BarraPassosProps) {
  const theme = useTheme();
  const ponteiro = useHover();

  return (
    <View style={[styles.passos, { borderBottomColor: theme.divider }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={rotuloSair}
        onPress={onSair}
        hitSlop={Spacing.two}
        {...ponteiro.props}
        style={({ pressed }) => [
          styles.sair,
          ponteiro.hover && styles.sobPonteiro,
          pressed && styles.pressionado,
        ]}>
        <ThemedText type="heading">✕</ThemedText>
      </Pressable>

      <View style={styles.trilhoPassos}>
        <BarraProgresso valor={total === 0 ? 0 : atual / total} rotulo={rotulo} />
      </View>

      <ThemedText type="label" numberOfLines={1}>
        {atual}/{total}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: { width: '100%', overflow: 'hidden' },
  preenchimento: { height: '100%' },
  passos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: Rules.thick,
  },
  sair: {
    minWidth: MinTouchTarget,
    minHeight: MinTouchTarget,
    marginLeft: -Spacing.two,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  trilhoPassos: { flex: 1 },
  sobPonteiro: { opacity: 0.8 },
  pressionado: { opacity: 0.6 },
});
