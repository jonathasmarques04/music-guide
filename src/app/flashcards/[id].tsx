import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { flashcardsPorModulo } from '@/content/flashcards';
import { moduloPorId } from '@/content/modulos';
import type { Flashcard } from '@/content/tipos';
import { MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const modulo = moduloPorId(id);
  const cards = flashcardsPorModulo(id);

  const [indice, setIndice] = useState(0);
  const [virado, setVirado] = useState(false);

  if (!modulo || cards.length === 0) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={[styles.flex, styles.centro]}>
          <View style={styles.content}>
            <Cabecalho titulo="Sem flashcards" />
            <ThemedText type="default" themeColor="textSecondary">
              Este módulo ainda não tem baralho de revisão.
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  function irPara(proximo: number) {
    setVirado(false);
    setIndice(proximo);
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <Cabecalho
              titulo={modulo.titulo}
              subtitulo={`FLASHCARDS · ${indice + 1} DE ${cards.length}`}
            />

            <CartaoVirador
              card={cards[indice]}
              virado={virado}
              onVirar={() => setVirado((v) => !v)}
            />

            <ThemedText type="small" themeColor="textMuted" style={styles.dica}>
              Toque no card para {virado ? 'ver a pergunta' : 'revelar a resposta'}.
            </ThemedText>

            <View style={styles.navegacao}>
              <View style={styles.flex}>
                <Button
                  variant="secondary"
                  disabled={indice === 0}
                  onPress={() => irPara(indice - 1)}
                  accessibilityHint="Volta para o card anterior">
                  Anterior
                </Button>
              </View>
              <View style={styles.flex}>
                <Button
                  disabled={indice === cards.length - 1}
                  onPress={() => irPara(indice + 1)}
                  accessibilityHint="Avança para o próximo card">
                  Próximo
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

/**
 * Card com giro em torno do eixo Y.
 *
 * As duas faces ficam empilhadas; `backfaceVisibility: 'hidden'` esconde a que
 * está de costas. O verso já nasce girado 180°, então na metade do giro ele
 * aparece na posição correta.
 */
function CartaoVirador({
  card,
  virado,
  onVirar,
}: {
  card: Flashcard;
  virado: boolean;
  onVirar: () => void;
}) {
  const theme = useTheme();
  const reduzirMovimento = useReducedMotion();
  const giro = useSharedValue(0);

  useEffect(() => {
    const destino = virado ? 1 : 0;
    // Respeita "reduzir movimento": troca instantânea em vez de animação.
    giro.value = reduzirMovimento ? destino : withTiming(destino, { duration: 400 });
  }, [virado, reduzirMovimento, giro]);

  const frenteStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(giro.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const versoStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(giro.value, [0, 1], [180, 360])}deg` },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      // O leitor de tela anuncia o conteúdo da face visível, não o giro em si.
      accessibilityLabel={
        virado ? `Resposta: ${card.verso}` : `Pergunta: ${card.frente}`
      }
      accessibilityHint={virado ? 'Toque para ver a pergunta' : 'Toque para ver a resposta'}
      accessibilityState={{ expanded: virado }}
      onPress={onVirar}
      style={styles.areaCard}>
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          frenteStyle,
        ]}>
        <ThemedText type="small" themeColor="accent">
          PERGUNTA
        </ThemedText>
        <ThemedText type="default" style={styles.textoCard}>
          {card.frente}
        </ThemedText>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          { backgroundColor: theme.accentSurface, borderColor: theme.accent },
          versoStyle,
        ]}>
        <ThemedText type="small" themeColor="accent">
          RESPOSTA
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.textoCard}>
          {card.verso}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const ALTURA_CARD = 260;

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  centro: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.four },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four },
  areaCard: {
    height: ALTURA_CARD,
    minHeight: MinTouchTarget,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ALTURA_CARD,
    borderWidth: 1,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    backfaceVisibility: 'hidden',
  },
  textoCard: {
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 28,
  },
  dica: { textAlign: 'center' },
  navegacao: { flexDirection: 'row', gap: Spacing.two },
});
