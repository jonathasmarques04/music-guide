import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { MODULOS } from '@/content/modulos';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

export default function ProgressoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { concluidos, totalAulas, progressoDe, statusDe } = useProgresso();
  const percentual = totalAulas === 0 ? 0 : Math.round((concluidos / totalAulas) * 100);
  const proximo = MODULOS.find((modulo) => statusDe(modulo.id) === 'atual') ?? MODULOS[MODULOS.length - 1];
  const desktop = width >= 760;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <Cabecalho titulo="Seu progresso" subtitulo="PAINEL DO ALUNO" />

            <View style={[styles.topGrid, desktop && styles.topGridDesktop]}>
              <ThemedView type="backgroundElement" style={styles.overview}>
                <View style={styles.overviewHeading}>
                  <View>
                    <ThemedText type="small" themeColor="textSecondary">CURSO COMPLETO</ThemedText>
                    <ThemedText type="title" themeColor="accent" style={styles.percentual}>{percentual}%</ThemedText>
                  </View>
                  <ThemedText type="smallBold" themeColor="accent">concluído</ThemedText>
                </View>
                <View accessibilityRole="progressbar" accessibilityLabel="Progresso geral do curso" accessibilityValue={{ min: 0, max: 100, now: percentual }} style={[styles.trilho, { backgroundColor: theme.backgroundSelected }]}>
                  <View style={[styles.preenchimento, { width: `${percentual}%`, backgroundColor: theme.accentStrong }]} />
                </View>
                <View style={styles.overviewFooter}>
                  <ThemedText type="smallBold">{concluidos} de {totalAulas} aulas concluídas</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{Math.max(0, totalAulas - concluidos)} restantes</ThemedText>
                </View>
              </ThemedView>

              {proximo && (
                <ThemedView type="accentSurface" style={styles.continuar}>
                  <ThemedText type="smallBold" themeColor="accent">CONTINUE DE ONDE PAROU</ThemedText>
                  <ThemedText type="default" style={styles.continuarTitulo}>{proximo.titulo}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">Aula {proximo.numero} · Módulo {proximo.numero}</ThemedText>
                  <View style={styles.meta}>
                    <ThemedText type="small" themeColor="textSecondary">{Math.max(8, proximo.secoes.length * 4)} min de leitura</ThemedText>
                    <ThemedText type="small" themeColor="accent">PRÓXIMA RECOMENDADA</ThemedText>
                  </View>
                  <Button onPress={() => router.push({ pathname: '/licao/[id]', params: { id: proximo.id } })}>
                    Continuar aula
                  </Button>
                </ThemedView>
              )}
            </View>

            <View style={styles.modulesHeader}>
              <View>
                <ThemedText type="default" style={styles.sectionTitle}>Módulos do curso</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Acompanhe sua evolução em cada etapa.</ThemedText>
              </View>
              <ThemedText type="smallBold" themeColor="accent">{MODULOS.length} etapas</ThemedText>
            </View>

            <View style={[styles.modules, desktop && styles.modulesDesktop]}>
              {MODULOS.map((modulo) => (
                <ModuloCard key={modulo.id} modulo={modulo} progresso={progressoDe(modulo.id)} status={statusDe(modulo.id)} onPress={() => router.push({ pathname: '/licao/[id]', params: { id: modulo.id } })} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function ModuloCard({ modulo, progresso, status, onPress }: { modulo: (typeof MODULOS)[number]; progresso: number; status: string; onPress: () => void }) {
  const theme = useTheme();
  const percentual = Math.round(progresso * 100);
  const bloqueado = status === 'bloqueado';
  const concluido = status === 'concluido';

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Módulo ${modulo.numero}: ${modulo.titulo}. ${percentual}% concluído.`} accessibilityState={{ disabled: bloqueado }} disabled={bloqueado} onPress={onPress} style={({ pressed }) => [styles.modulo, { backgroundColor: theme.backgroundElement, borderColor: concluido ? theme.success : theme.border }, pressed && styles.pressed, bloqueado && styles.bloqueado]}>
      <View style={styles.moduloTop}>
        <View style={[styles.numero, { backgroundColor: concluido ? theme.successSurface : theme.backgroundSelected }]}>
          <ThemedText type="smallBold" themeColor={concluido ? 'success' : 'accent'}>{modulo.numero}</ThemedText>
        </View>
        <ThemedText type="smallBold" themeColor={concluido ? 'success' : bloqueado ? 'textMuted' : 'accent'}>{bloqueado ? 'Bloqueado' : concluido ? 'Concluído' : 'Em andamento'}</ThemedText>
      </View>
      <ThemedText type="default" style={styles.moduloTitulo}>{modulo.titulo}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>{modulo.resumo}</ThemedText>
      <View style={styles.moduloProgress}>
        <View style={[styles.trilhoSmall, { backgroundColor: theme.backgroundSelected }]}><View style={[styles.preenchimento, { width: `${percentual}%`, backgroundColor: concluido ? theme.success : theme.accentStrong }]} /></View>
        <ThemedText type="smallBold" themeColor={concluido ? 'success' : 'textSecondary'}>{percentual}%</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', padding: Spacing.four, paddingBottom: BottomTabInset + Spacing.six },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four },
  topGrid: { gap: Spacing.three },
  topGridDesktop: { flexDirection: 'row', alignItems: 'stretch' },
  overview: { flex: 1.1, borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.four, justifyContent: 'space-between' },
  overviewHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  percentual: { fontSize: 52, lineHeight: 58, fontWeight: '700' },
  trilho: { height: 12, borderRadius: 6, overflow: 'hidden' },
  trilhoSmall: { flex: 1, height: 7, borderRadius: 4, overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: 6 },
  overviewFooter: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.two },
  continuar: { flex: 1, borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.two, borderWidth: 1, borderColor: '#43236B' },
  continuarTitulo: { fontSize: 23, lineHeight: 30, fontWeight: '700' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.one },
  modulesHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: Spacing.two, marginTop: Spacing.two },
  sectionTitle: { fontSize: 21, fontWeight: '700' },
  modules: { gap: Spacing.two },
  modulesDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  modulo: { flexGrow: 1, flexBasis: 260, minWidth: 0, borderWidth: 1, borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  moduloTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  numero: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  moduloTitulo: { fontWeight: '700' },
  moduloProgress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.one },
  pressed: { opacity: 0.7 },
  bloqueado: { opacity: 0.5 },
});
