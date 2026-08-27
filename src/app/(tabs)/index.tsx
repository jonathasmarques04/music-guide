import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { MODULOS } from '@/content/modulos';
import { NOTA_MINIMA } from '@/content/tipos';
import { BottomTabInset, MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useProgresso, type StatusModulo } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

/**
 * Rótulos e símbolos por status.
 *
 * O status NUNCA é comunicado só pela cor: cada módulo mostra também um símbolo
 * e o rótulo em texto, para não depender de percepção de cor.
 */
const STATUS: Record<StatusModulo, { rotulo: string; simbolo: string }> = {
  concluido: { rotulo: 'Concluído', simbolo: '✓' },
  atual: { rotulo: 'Disponível', simbolo: '▶' },
  bloqueado: { rotulo: 'Bloqueado', simbolo: '🔒' },
};

export default function TrilhaScreen() {
  const { session, signOut } = useAuth();
  const { concluidos, statusDe } = useProgresso();

  const proximo = MODULOS.find((m) => statusDe(m.id) === 'atual');

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            {session?.isGuest && <AvisoVisitante />}

            <View style={styles.header}>
              <ThemedText type="small" themeColor="textSecondary">
                {session?.isGuest ? 'Bem-vindo' : `Bem-vindo, ${session?.email ?? ''}`}
              </ThemedText>
              <ThemedText type="subtitle" accessibilityRole="header">
                Teoria musical
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                {MODULOS.length} módulos, do primeiro semitom ao empréstimo modal.
              </ThemedText>
            </View>

            <Progresso concluidos={concluidos} total={MODULOS.length} />

            {proximo && <CardContinuar modulo={proximo} />}

            <View style={styles.lista}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                TRILHA COMPLETA
              </ThemedText>
              {MODULOS.map((modulo) => (
                <CartaoModulo key={modulo.id} modulo={modulo} status={statusDe(modulo.id)} />
              ))}
            </View>

            <Button
              variant="ghost"
              onPress={signOut}
              accessibilityHint="Encerra a sessão e volta para a tela de login">
              Sair
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function AvisoVisitante() {
  const theme = useTheme();

  return (
    <ThemedView type="accentSurface" style={[styles.aviso, { borderColor: theme.accent }]}>
      <ThemedText type="smallBold" themeColor="accent">
        Modo visitante (bypass)
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Você entrou sem conta. Seu progresso não será salvo ao fechar o app.
      </ThemedText>
    </ThemedView>
  );
}

function Progresso({ concluidos, total }: { concluidos: number; total: number }) {
  const theme = useTheme();
  const razao = total === 0 ? 0 : concluidos / total;

  return (
    <View style={styles.progresso}>
      <View style={styles.progressoTopo}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Seu progresso
        </ThemedText>
        <ThemedText type="smallBold" themeColor="accent">
          {concluidos} de {total}
        </ThemedText>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Módulos concluídos na trilha"
        accessibilityValue={{ min: 0, max: total, now: concluidos }}
        style={[styles.trilho, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[
            styles.preenchimento,
            { backgroundColor: theme.accentStrong, width: `${razao * 100}%` },
          ]}
        />
      </View>
      <ThemedText type="small" themeColor="textMuted">
        É preciso {Math.round(NOTA_MINIMA * 100)}% de acerto na avaliação para liberar o próximo
        módulo.
      </ThemedText>
    </View>
  );
}

function CardContinuar({ modulo }: { modulo: (typeof MODULOS)[number] }) {
  const router = useRouter();

  return (
    <ThemedView type="backgroundElement" style={styles.destaque}>
      <ThemedText type="small" themeColor="accent">
        CONTINUE DE ONDE PAROU
      </ThemedText>
      <ThemedText type="default" style={styles.destaqueTitulo}>
        Módulo {modulo.numero} — {modulo.titulo}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {modulo.resumo}
      </ThemedText>
      <Button
        accessibilityHint={`Abre a aula do módulo ${modulo.titulo}`}
        onPress={() => router.push({ pathname: '/licao/[id]', params: { id: modulo.id } })}>
        Estudar agora
      </Button>
    </ThemedView>
  );
}

function CartaoModulo({
  modulo,
  status,
}: {
  modulo: (typeof MODULOS)[number];
  status: StatusModulo;
}) {
  const theme = useTheme();
  const router = useRouter();
  const { notaDe } = useProgresso();

  const { rotulo, simbolo } = STATUS[status];
  const bloqueado = status === 'bloqueado';
  const disponivel = status === 'atual';
  const nota = notaDe(modulo.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Módulo ${modulo.numero}: ${modulo.titulo}. ${rotulo}.`}
      accessibilityHint={
        bloqueado
          ? 'Conclua a avaliação do módulo anterior para desbloquear'
          : `Abre a aula. ${modulo.resumo}`
      }
      accessibilityState={{ disabled: bloqueado }}
      disabled={bloqueado}
      onPress={() => router.push({ pathname: '/licao/[id]', params: { id: modulo.id } })}
      style={({ pressed }) => [
        styles.cartao,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: disponivel ? theme.accent : theme.border,
        },
        pressed && styles.pressed,
        bloqueado && styles.bloqueado,
      ]}>
      <ThemedView
        type={disponivel ? 'accentSurface' : 'backgroundSelected'}
        style={styles.numero}>
        <ThemedText type="smallBold" themeColor={disponivel ? 'accent' : 'textSecondary'}>
          {modulo.numero}
        </ThemedText>
      </ThemedView>

      <View style={styles.cartaoTexto}>
        <ThemedText type="default">{modulo.titulo}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {modulo.resumo}
        </ThemedText>
        {/* Símbolo + texto: o status não depende de cor. */}
        <ThemedText type="small" themeColor={disponivel ? 'accent' : 'textMuted'}>
          {simbolo} {rotulo}
          {nota !== undefined && ` · melhor nota ${Math.round(nota * 100)}%`}
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
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.five,
  },
  aviso: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  header: { gap: Spacing.one },
  progresso: { gap: Spacing.two },
  progressoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trilho: {
    height: Spacing.two,
    borderRadius: Spacing.one,
    overflow: 'hidden',
  },
  preenchimento: {
    height: '100%',
    borderRadius: Spacing.one,
  },
  destaque: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  destaqueTitulo: { fontWeight: '600' },
  lista: { gap: Spacing.two },
  cartao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    minHeight: MinTouchTarget,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  cartaoTexto: { flex: 1, gap: Spacing.half },
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
