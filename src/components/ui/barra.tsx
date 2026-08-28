import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Rules, Spacing } from '@/constants/theme';
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
      <View
        style={{
          width: `${percentual}%`,
          height: '100%',
          backgroundColor: sobreDestaque ? theme.accentOn : theme.accentStrong,
        }}
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

  return (
    <View style={[styles.passos, { borderBottomColor: theme.divider }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={rotuloSair}
        onPress={onSair}
        hitSlop={Spacing.two}
        style={({ pressed }) => [styles.sair, pressed && styles.pressionado]}>
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
  pressionado: { opacity: 0.6 },
});
