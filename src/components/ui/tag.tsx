import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TagProps = {
  children: string;
  /**
   * `accent` é o tingido de destaque, `neutral` o cinza de superfície,
   * `outline` só o contorno e `solid` o preenchimento cheio — usado quando a
   * tag é o próprio estado (a opção escolhida, o item ativo).
   */
  variant?: 'accent' | 'neutral' | 'outline' | 'solid';
};

export function Tag({ children, variant = 'neutral' }: TagProps) {
  const theme = useTheme();

  const fundo =
    variant === 'accent'
      ? theme.accentSurface
      : variant === 'neutral'
        ? theme.backgroundElement
        : variant === 'solid'
          ? theme.accentStrong
          : 'transparent';

  const cor =
    variant === 'solid' ? theme.accentOn : variant === 'neutral' ? theme.textSecondary : theme.accent;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: fundo },
        variant === 'outline' && { borderWidth: Rules.hair, borderColor: theme.accent },
      ]}>
      <ThemedText type="smallBold" style={[styles.texto, { color: cor }]}>
        {children}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two + Spacing.half,
    borderRadius: Radius,
  },
  texto: {
    fontSize: 11,
    lineHeight: 15,
  },
});
