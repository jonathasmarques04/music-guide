import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type LinhaListaProps = {
  rotulo: string;
  /** Valor à direita, antes da seta: "Português", "19:30", "3 abertos". */
  valor?: string;
  onPress?: () => void;
  accessibilityHint?: string;
};

/**
 * A linha de menu do sistema: rótulo à esquerda, valor e seta à direita, fio
 * de 1px embaixo. Sem cartão, sem sombra, sem raio — só a régua separando.
 *
 * Sem `onPress` vira uma linha de leitura, e some do foco do leitor de tela
 * como botão.
 */
export function LinhaLista({ rotulo, valor, onPress, accessibilityHint }: LinhaListaProps) {
  const theme = useTheme();

  const conteudo = (
    <>
      <ThemedText type="rowTitle" style={styles.rotulo}>
        {rotulo}
      </ThemedText>
      {valor && (
        <ThemedText type="small" numberOfLines={1}>
          {valor}
        </ThemedText>
      )}
      {onPress && (
        <ThemedText type="rowTitle" themeColor="textMuted">
          ›
        </ThemedText>
      )}
    </>
  );

  if (!onPress) {
    return <View style={[styles.linha, { borderBottomColor: theme.hairline }]}>{conteudo}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={valor ? `${rotulo}: ${valor}` : rotulo}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.linha,
        { borderBottomColor: theme.hairline },
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchTarget,
    paddingVertical: Spacing.two + Spacing.one,
    borderBottomWidth: Rules.hair,
  },
  rotulo: { flex: 1 },
});
