import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type NotaProps = {
  /** Versalete no alto do bloco: "Guarde isto", "Ponto fraco", "Erro". */
  rotulo: string;
  texto: string;
  /**
   * `aviso` alerta e `erro` recusa. Os dois desenham igual — o que muda é o
   * papel do bloco no leitor de tela. A distinção visual fica por conta do
   * símbolo e do rótulo, nunca da cor.
   */
  tom?: 'dica' | 'aviso' | 'erro';
};

/**
 * O bloco de nota do Modernist: superfície preenchida com uma régua de
 * destaque de 2px rente à esquerda. É o único destaque "macio" do sistema —
 * tudo o mais é grade e régua.
 */
export function Nota({ rotulo, texto, tom = 'dica' }: NotaProps) {
  const theme = useTheme();
  const marca = tom === 'erro' ? '✕' : tom === 'aviso' ? '!' : null;

  return (
    <View
      accessibilityRole={tom === 'dica' ? 'summary' : 'alert'}
      accessibilityLiveRegion={tom === 'dica' ? 'none' : 'polite'}
      style={[
        styles.bloco,
        { backgroundColor: theme.backgroundElement, borderLeftColor: theme.accentDisplay },
      ]}>
      <ThemedText type="label">
        {marca ? `${marca} ${rotulo}` : rotulo}
      </ThemedText>
      <ThemedText type="small">{texto}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    borderLeftWidth: Rules.thick,
    padding: Spacing.two + Spacing.one,
    gap: Spacing.one,
  },
});
