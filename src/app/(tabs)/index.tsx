import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { MODULOS } from '@/content/modulos';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { concluidos, totalAulas } = useProgresso();
  const percentual = totalAulas === 0 ? 0 : Math.round((concluidos / totalAulas) * 100);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="smallBold" themeColor="accent">MUSICA / ÁREA DO ALUNO</ThemedText>
              <ThemedText type="subtitle" accessibilityRole="header">Olá, {session?.isGuest ? 'estudante' : session?.email?.split('@')[0] ?? 'estudante'}</ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                Seu próximo passo na teoria musical está pronto.
              </ThemedText>
            </View>

            <ThemedView type="backgroundElement" style={styles.hero}>
              <View style={styles.heroCopy}>
                <ThemedText type="small" themeColor="accent">TRILHA DE TEORIA MUSICAL</ThemedText>
                <ThemedText type="default" style={styles.heroTitle}>Aprenda no seu ritmo.</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {concluidos === 0 ? 'Comece pelos fundamentos e construa uma base sólida.' : `Você já concluiu ${concluidos} ${concluidos === 1 ? 'aula' : 'aulas'} da trilha.`}
                </ThemedText>
              </View>
              <View style={styles.percentBox}>
                <ThemedText type="title" themeColor="accent">{percentual}%</ThemedText>
                <ThemedText type="small" themeColor="textMuted">concluído</ThemedText>
              </View>
              <Button onPress={() => router.push('/progresso')}>
                Ver meu progresso
              </Button>
            </ThemedView>

            <View style={styles.stats}>
              <Stat label="Aulas concluídas" value={`${concluidos}`} />
              <Stat label="Aulas restantes" value={`${Math.max(0, totalAulas - concluidos)}`} />
              <Stat label="Módulos" value={`${MODULOS.length}`} />
            </View>

            {session?.isGuest && (
              <ThemedText type="small" themeColor="textMuted">
                Modo visitante: seu progresso fica disponível enquanto esta sessão estiver aberta.
              </ThemedText>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, { borderLeftColor: theme.accent }]}>
      <ThemedText type="subtitle" style={styles.statValue}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', padding: Spacing.four, paddingBottom: BottomTabInset + Spacing.six },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.five },
  header: { gap: Spacing.one },
  hero: { borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.four },
  heroCopy: { gap: Spacing.one, maxWidth: 520 },
  heroTitle: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  percentBox: { alignItems: 'flex-start', gap: 0 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.four },
  stat: { flexGrow: 1, minWidth: 130, borderLeftWidth: 2, paddingLeft: Spacing.two, gap: Spacing.half },
  statValue: { fontSize: 28, lineHeight: 34 },
});
