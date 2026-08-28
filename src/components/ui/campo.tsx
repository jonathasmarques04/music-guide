import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, MinTouchTarget, Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CampoProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  /** Texto de apoio abaixo do campo — dica de formato ou motivo da recusa. */
  ajuda?: string;
  /**
   * Marca o campo como inválido. Muda o contorno para o destaque **e** faz a
   * ajuda virar mensagem de erro com ✕ — nunca só a cor.
   */
  invalido?: boolean;
};

/**
 * Campo de texto do Modernist: superfície preenchida, contorno de 1px, canto
 * reto e rótulo em cima. O foco troca o contorno pelo destaque, que é o único
 * anel de foco do sistema.
 */
export function Campo({ label, ajuda, invalido = false, style, ...rest }: CampoProps) {
  const theme = useTheme();
  const [focado, setFocado] = useState(false);

  const contorno = invalido || focado ? theme.accent : theme.border;

  return (
    <View style={styles.campo}>
      <ThemedText type="label">{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={ajuda}
        aria-invalid={invalido}
        placeholderTextColor={theme.textMuted}
        selectionColor={theme.accentStrong}
        onFocus={(e) => {
          setFocado(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          rest.onBlur?.(e);
        }}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: contorno,
            // O foco engrossa a borda: quem não distingue a cor ainda vê onde está.
            borderWidth: focado || invalido ? Rules.thick : Rules.hair,
          },
          style,
        ]}
        {...rest}
      />
      {ajuda && (
        <ThemedText
          type="small"
          themeColor={invalido ? 'accent' : 'textMuted'}
          accessibilityLiveRegion={invalido ? 'polite' : 'none'}>
          {invalido ? `✕ ${ajuda}` : ajuda}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { gap: Spacing.one + Spacing.half },
  input: {
    minHeight: MinTouchTarget,
    borderRadius: Radius,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two,
    fontFamily: Fonts.regular,
    fontSize: 15,
  },
});
