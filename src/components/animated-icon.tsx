import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useTheme } from '@/hooks/use-theme';

const DURATION = 600;

/**
 * O splash animado que cobre o app enquanto a sessão salva é restaurada.
 *
 * A marca é o bloco invertido do Modernist: um quadrado de tinta, sem raio,
 * com a nota em cima. Nada de gradiente nem de brilho — o sistema não decora,
 * e esta é a primeira tela que o aluno vê.
 *
 * Na web não há splash nativo para esconder: veja `animated-icon.web.tsx`.
 */
export function AnimatedSplashOverlay() {
  const cores = useTheme();
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const saida = new Keyframe({
    0: { transform: [{ scale: 1 }], opacity: 1 },
    20: { opacity: 1 },
    70: { opacity: 0, easing: Easing.elastic(0.7) },
    100: { opacity: 0, transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
  });

  const marca = (
    <View style={[styles.marca, { backgroundColor: cores.inverse }]}>
      <Text style={[styles.nota, { color: cores.inverseOn }]}>♪</Text>
    </View>
  );

  return animate ? (
    <Animated.View
      entering={saida.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={[styles.splashOverlay, { backgroundColor: cores.background }]}>
      {marca}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => setAnimate(true));
      }}
      style={[styles.splashOverlay, { backgroundColor: cores.background }]}>
      {marca}
    </View>
  );
}

const styles = StyleSheet.create({
  marca: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nota: {
    fontSize: 48,
    lineHeight: 58,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
