import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TagProps = {
  children: string;
  /**
   * `accent` é o tingido de destaque, `neutral` o cinza de superfície e
   * `outline` só o contorno.
   */
  variant?: 'accent' | 'neutral' | 'outline';
};

export function Tag({ children, variant = 'neutral' }: TagProps) {
  const theme = useTheme();

  const fundo =
    variant === 'accent'
      ? theme.accentSurface
      : variant === 'neutral'
        ? theme.backgroundElement
        : 'transparent';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: fundo },
        variant === 'outline' && { borderWidth: Rules.hair, borderColor: theme.accent },
      ]}>
      <ThemedText
        type="smallBold"
        style={[styles.texto, { color: variant === 'neutral' ? theme.textSecondary : theme.accent }]}>
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
