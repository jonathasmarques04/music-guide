import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children: string;
  /** primary = roxo preenchido | secondary = contorno roxo | ghost = só texto */
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  accessibilityHint,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const background =
    variant === 'primary' ? theme.accentStrong : variant === 'secondary' ? 'transparent' : 'transparent';
  const label = variant === 'primary' ? theme.accentOn : theme.accent;

  return (
    <Pressable
      accessibilityRole="button"
      // Rótulo vem do texto visível; o hint é opcional e complementa.
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: background },
        variant === 'secondary' && { borderWidth: 1, borderColor: theme.accent },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={label} />
      ) : (
        <ThemedText type="default" style={[styles.label, { color: label }]}>
          {children}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MinTouchTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
