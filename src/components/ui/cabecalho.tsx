import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Cabecalho({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        hitSlop={8}
        style={({ pressed }) => [
          styles.voltar,
          { borderColor: theme.border, backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="default" themeColor="accent">
          ←
        </ThemedText>
      </Pressable>

      <View style={styles.textos}>
        {subtitulo && (
          <ThemedText type="small" themeColor="accent">
            {subtitulo}
          </ThemedText>
        )}
        <ThemedText type="default" accessibilityRole="header" style={styles.titulo}>
          {titulo}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  voltar: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: Spacing.half },
  titulo: { fontWeight: '600' },
  pressed: { opacity: 0.7 },
});
