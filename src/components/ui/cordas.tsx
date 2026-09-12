import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Rules, Spacing } from '@/constants/theme';
import type { Corda } from '@/content/tipos';
import { useTheme } from '@/hooks/use-theme';

export type CordasProps = {
  /** Da mais grave para a mais aguda — a ordem em que serão desenhadas. */
  cordas: readonly Corda[];
};

/**
 * A afinação como a fileira de cordas que ela é: uma célula por corda, da
 * grave à aguda, dentro de um contorno único e divididas por fios.
 *
 * Poderia ser uma `Faixa`, mas cada célula aqui carrega TRÊS informações
 * (o número da corda, a nota em português e a cifra) contra as duas que a
 * faixa comporta — e a do meio é a que precisa do peso tipográfico.
 *
 * Não é um `Braco`: aquele desenha casas ao longo de UMA corda e é decoração
 * escondida do leitor de tela. Este é a informação, então cada célula se
 * anuncia como frase inteira ("6ª corda: Mi 2, cifra E") em vez de despejar
 * três textos soltos em sequência.
 */
export function Cordas({ cordas }: CordasProps) {
  const theme = useTheme();

  return (
    <View style={[styles.fileira, { borderColor: theme.text }]}>
      {cordas.map((corda, i) => (
        <View
          key={corda.ordem}
          accessibilityLabel={`${corda.ordem}ª corda: ${corda.nota} ${corda.oitava}, cifra ${corda.cifra}`}
          style={[
            styles.celula,
            i > 0 && { borderLeftWidth: Rules.hair, borderLeftColor: theme.hairline },
          ]}>
          <ThemedText type="label">{`${corda.ordem}ª`}</ThemedText>

          {/*
           * Nota e oitava juntas num `Text` só: quebradas em dois elementos, o
           * `adjustsFontSizeToFit` encolheria cada uma por conta própria e as
           * células sairiam com tamanhos diferentes na mesma fileira.
           */}
          <ThemedText type="numero" numberOfLines={1} adjustsFontSizeToFit style={styles.nota}>
            {corda.nota}
            <ThemedText type="small" themeColor="textMuted">
              {corda.oitava}
            </ThemedText>
          </ThemedText>

          <ThemedText type="smallBold" themeColor="textSecondary">
            {corda.cifra}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fileira: {
    flexDirection: 'row',
    borderWidth: Rules.thick,
    borderRadius: Radius,
  },
  /*
   * `flex: 1` e `minWidth: 0`: com seis cordas num celular estreito, sem o
   * mínimo zerado a célula se recusa a encolher abaixo do texto e a fileira
   * estoura a largura da tela.
   */
  celula: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  nota: { textAlign: 'center' },
});
