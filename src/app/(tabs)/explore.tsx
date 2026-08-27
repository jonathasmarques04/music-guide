import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { flashcardsPorModulo } from '@/content/flashcards';
import { MODULOS } from '@/content/modulos';
import { BottomTabInset, MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

export default function FlashcardsHubScreen() {
  const { statusDe } = useProgresso();

  const total = MODULOS.reduce((soma, m) => soma + flashcardsPorModulo(m.id).length, 0);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="subtitle" accessibilityRole="header">
                Flashcards
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                {total} cards de revisão. Toque no card para virar e ver a resposta.
              </ThemedText>
            </View>

            <View style={styles.lista}>
              {MODULOS.map((modulo) => (
                <CartaoBaralho
                  key={modulo.id}
                  modulo={modulo}
                  quantidade={flashcardsPorModulo(modulo.id).length}
                  bloqueado={statusDe(modulo.id) === 'bloqueado'}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function CartaoBaralho({
  modulo,
  quantidade,
  bloqueado,
}: {
  modulo: (typeof MODULOS)[number];
  quantidade: number;
  bloqueado: boolean;
}) {
  const theme = useTheme();
  const router = useRouter();

  const indisponivel = bloqueado || quantidade === 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Baralho do módulo ${modulo.numero}: ${modulo.titulo}. ${quantidade} cards.${
        bloqueado ? ' Bloqueado.' : ''
      }`}
      accessibilityHint={bloqueado ? 'Conclua os módulos anteriores para desbloquear' : undefined}
      accessibilityState={{ disabled: indisponivel }}
      disabled={indisponivel}
      onPress={() => router.push({ pathname: '/flashcards/[id]', params: { id: modulo.id } })}
      style={({ pressed }) => [
        styles.cartao,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
        indisponivel && styles.bloqueado,
      ]}>
      <ThemedView type="backgroundSelected" style={styles.numero}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          {modulo.numero}
        </ThemedText>
      </ThemedView>

      <View style={styles.texto}>
        <ThemedText type="default">{modulo.titulo}</ThemedText>
        <ThemedText type="small" themeColor={bloqueado ? 'textMuted' : 'accent'}>
          {bloqueado ? '🔒 Bloqueado' : `${quantidade} cards`}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four },
  header: { gap: Spacing.one },
  lista: { gap: Spacing.two },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchTarget,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  texto: { flex: 1, gap: Spacing.half },
  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  bloqueado: { opacity: 0.55 },
});
