import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, MinTouchTarget, Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children: string;
  /**
   * `primary` preenche com o destaque, `secondary` é contorno de 1px e
   * `ghost` é só o rótulo em destaque.
   *
   * `inverso` é o par de `primary` para usar **por cima de um bloco de
   * destaque**: lá o preenchimento vermelho sumiria e o rótulo em destaque
   * ficaria ilegível, então as duas cores trocam de lado.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverso';
  size?: 'sm' | 'md' | 'lg';
  /**
   * Ocupa a largura toda. No Modernist o rótulo de um botão largo fica
   * **rente à esquerda** — nunca centralizado. É a regra do sistema, e é o que
   * dá à pilha de botões o mesmo eixo do texto ao lado.
   */
  bloco?: boolean;
  loading?: boolean;
};

const TAMANHOS = {
  sm: { fontSize: 12, py: Spacing.two, px: Spacing.two + Spacing.one },
  md: { fontSize: 14, py: Spacing.two + Spacing.one, px: Spacing.three - Spacing.half },
  lg: { fontSize: 15, py: Spacing.three - Spacing.one, px: Spacing.three },
} as const;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  bloco = false,
  loading = false,
  disabled,
  accessibilityHint,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const metrica = TAMANHOS[size];

  const rotulo =
    variant === 'primary' ? theme.accentOn : variant === 'inverso' ? theme.accentStrong : theme.accent;

  return (
    <Pressable
      accessibilityRole="button"
      // O rótulo vem do texto visível; o hint é opcional e complementa.
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      // Alvo de 44pt sem inchar o botão pequeno, que é visualmente menor.
      hitSlop={size === 'sm' ? Spacing.two : undefined}
      style={({ pressed }) => [
        styles.base,
        { paddingVertical: metrica.py, paddingHorizontal: metrica.px },
        size !== 'sm' && styles.alvoMinimo,
        bloco ? styles.bloco : styles.hug,
        variant === 'primary' && { backgroundColor: theme.accentStrong },
        variant === 'inverso' && { backgroundColor: theme.accentOn },
        variant === 'secondary' && { borderWidth: Rules.hair, borderColor: theme.border },
        /*
         * Estado pressionado vindo da rampa do destaque — um passo além da
         * base, como manda o sistema. `accent` é o passo mais escuro no tema
         * claro e o mais claro no escuro, então o mesmo token serve aos dois.
         */
        pressed && variant === 'primary' && { backgroundColor: theme.accent },
        pressed && variant === 'inverso' && { backgroundColor: theme.accentSurface },
        pressed && variant === 'secondary' && { backgroundColor: theme.backgroundSelected },
        pressed && variant === 'ghost' && { backgroundColor: theme.accentSurface },
        isDisabled && styles.desabilitado,
      ]}
      {...rest}>
      {/*
        O indicador ocupa o lugar do rótulo sem mudar a altura do botão: sem
        isso a pilha de botões pula quando um deles entra em carregamento.
      */}
      {loading && (
        <View style={styles.carregando}>
          <ActivityIndicator color={rotulo} size="small" />
        </View>
      )}
      <ThemedText
        style={[
          styles.rotulo,
          { color: rotulo, fontSize: metrica.fontSize },
          loading && styles.invisivel,
        ]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius,
  },
  alvoMinimo: {
    minHeight: MinTouchTarget,
  },
  /** Largura total, rótulo rente à esquerda — a assinatura do sistema. */
  bloco: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  hug: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  rotulo: {
    /*
     * O peso vai na FAMÍLIA, não só em `fontWeight`: no nativo cada peso do
     * Archivo é uma família própria, e `fontWeight` sozinho não a escolhe.
     */
    fontFamily: Fonts.extrabold,
    fontWeight: '800',
    textAlign: 'left',
  },
  invisivel: { opacity: 0 },
  carregando: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desabilitado: { opacity: 0.45 },
});
