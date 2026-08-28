import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Estatistica = {
  rotulo: string;
  valor: string;
  /** Põe o número em destaque. Reserve para um por faixa — senão nada destaca. */
  destaque?: boolean;
};

export type FaixaProps = {
  itens: readonly Estatistica[];
  /**
   * `forte` usa contorno de 2px na cor da tinta; `leve` usa o fio de 1px. A
   * faixa forte é para o número que resume a tela; a leve, para o rodapé.
   */
  peso?: 'forte' | 'leve';
};

/**
 * A faixa de células iguais — o retrato da grade modular do sistema. Células
 * de mesma largura, divididas por fios, dentro de um contorno único.
 */
export function Faixa({ itens, peso = 'leve' }: FaixaProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.faixa,
        {
          borderWidth: peso === 'forte' ? Rules.thick : Rules.hair,
          borderColor: peso === 'forte' ? theme.text : theme.border,
        },
      ]}>
      {itens.map((item, i) => (
        <View
          key={item.rotulo}
          // Rótulo e valor viram uma frase só: o leitor não lê duas colunas soltas.
          accessibilityLabel={`${item.rotulo}: ${item.valor}`}
          style={[
            styles.celula,
            i > 0 && { borderLeftWidth: Rules.hair, borderLeftColor: theme.border },
          ]}>
          <ThemedText
            type="numero"
            themeColor={item.destaque ? 'accent' : 'text'}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {item.valor}
          </ThemedText>
          <ThemedText type="label">{item.rotulo}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: {
    flexDirection: 'row',
    borderRadius: Radius,
  },
  celula: {
    flex: 1,
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.two + Spacing.one,
    gap: Spacing.one,
  },
});
