import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';

import { MinTouchTarget, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * A navegação inferior do Modernist: uma faixa chapada, presa ao fim da
 * coluna, fechada por uma régua de 2px e dividida em quatro células iguais.
 *
 * Nada flutua e nada é arredondado — por isso não há mais variante `.web.tsx`:
 * a mesma faixa serve às três plataformas, e o `expo-router/ui` roda em todas.
 * Como a barra está no fluxo, o conteúdo não precisa reservar espaço para ela.
 */
export default function AppTabs() {
  return (
    <Tabs style={styles.raiz}>
      <TabSlot style={styles.conteudo} />
      <TabList asChild>
        <Faixa>
          <TabTrigger name="index" href="/" asChild>
            <Aba>Trilha</Aba>
          </TabTrigger>
          <TabTrigger name="revisar" href="/revisar" asChild>
            <Aba>Revisar</Aba>
          </TabTrigger>
          <TabTrigger name="progresso" href="/progresso" asChild>
            <Aba>Progresso</Aba>
          </TabTrigger>
          <TabTrigger name="perfil" href="/perfil" asChild>
            <Aba>Perfil</Aba>
          </TabTrigger>
        </Faixa>
      </TabList>
    </Tabs>
  );
}

function Faixa({ children, ...props }: React.ComponentProps<typeof View>) {
  const theme = useTheme();
  const inset = useSafeAreaInsets();

  return (
    <View
      {...props}
      accessibilityRole="tablist"
      style={[
        styles.faixa,
        {
          backgroundColor: theme.backgroundElement,
          borderTopColor: theme.divider,
          paddingBottom: inset.bottom,
        },
      ]}>
      {children}
    </View>
  );
}

function Aba({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      // A aba ativa se anuncia pelo estado, não pela cor. O `aria-selected` é
      // o que de fato chega ao DOM: o react-native-web 0.21 não converte mais
      // `accessibilityState.selected` sozinho.
      accessibilityState={{ selected: isFocused }}
      aria-selected={isFocused}
      style={({ pressed }) => [
        styles.aba,
        { borderRightColor: theme.hairline },
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      {/*
        A régua de 2px no topo da célula é o que marca a aba ativa. É uma
        diferença de FORMA, não só de cor: quem não distingue o vermelhão
        continua vendo qual célula está marcada.
      */}
      <View
        style={[
          styles.marcador,
          { backgroundColor: isFocused ? theme.accentDisplay : 'transparent' },
        ]}
      />
      <ThemedText
        type="label"
        style={{ color: isFocused ? theme.accent : theme.textMuted }}
        numberOfLines={1}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  conteudo: { flex: 1 },
  faixa: {
    flexDirection: 'row',
    borderTopWidth: Rules.thick,
  },
  aba: {
    flex: 1,
    minHeight: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.two + Spacing.half,
    paddingBottom: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.half,
    borderRightWidth: Rules.hair,
  },
  marcador: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Rules.thick,
  },
});
