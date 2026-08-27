import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { flashcardsPorModulo } from '@/content/flashcards';
import { moduloPorId } from '@/content/modulos';
import { quizPorModulo } from '@/content/quiz';
import type { Bloco } from '@/content/tipos';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

export default function LicaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { statusDe, notaDe } = useProgresso();

  const modulo = moduloPorId(id);

  if (!modulo) {
    return <Aviso texto="Módulo não encontrado." />;
  }

  if (statusDe(modulo.id) === 'bloqueado') {
    return <Aviso texto="Este módulo ainda está bloqueado. Conclua a avaliação do módulo anterior." />;
  }

  const nota = notaDe(modulo.id);
  const totalCards = flashcardsPorModulo(modulo.id).length;
  const totalQuestoes = quizPorModulo(modulo.id).length;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <Cabecalho titulo={modulo.titulo} subtitulo={`MÓDULO ${modulo.numero}`} />

            <ThemedText type="default" themeColor="textSecondary">
              {modulo.resumo}
            </ThemedText>

            {modulo.secoes.map((secao) => (
              <View key={secao.titulo} style={styles.secao}>
                <ThemedText type="default" accessibilityRole="header" style={styles.secaoTitulo}>
                  {secao.titulo}
                </ThemedText>
                {secao.blocos.map((bloco, indice) => (
                  <BlocoConteudo key={indice} bloco={bloco} />
                ))}
              </View>
            ))}

            <View style={styles.acoes}>
              {totalCards > 0 && (
                <Button
                  variant="secondary"
                  accessibilityHint={`Abre ${totalCards} flashcards deste módulo`}
                  onPress={() =>
                    router.push({ pathname: '/flashcards/[id]', params: { id: modulo.id } })
                  }>
                  {`Revisar com flashcards (${totalCards})`}
                </Button>
              )}

              {totalQuestoes > 0 && (
                <Button
                  accessibilityHint={`Inicia a avaliação com ${totalQuestoes} questões`}
                  onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: modulo.id } })}>
                  {nota === undefined
                    ? `Fazer avaliação (${totalQuestoes} questões)`
                    : `Refazer avaliação · melhor nota ${Math.round(nota * 100)}%`}
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function BlocoConteudo({ bloco }: { bloco: Bloco }) {
  const theme = useTheme();

  switch (bloco.tipo) {
    case 'paragrafo':
      return (
        <ThemedText type="default" themeColor="textSecondary">
          {bloco.texto}
        </ThemedText>
      );

    case 'lista':
      return (
        <View style={styles.lista}>
          {bloco.itens.map((item) => (
            <View key={item} style={styles.itemLista}>
              <ThemedText type="default" themeColor="accent">
                •
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.flex}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      );

    case 'formula':
      return (
        <ThemedView type="accentSurface" style={[styles.formula, { borderColor: theme.accent }]}>
          {bloco.rotulo && (
            <ThemedText type="small" themeColor="accent">
              {bloco.rotulo.toUpperCase()}
            </ThemedText>
          )}
          <ThemedText type="code" style={styles.formulaTexto}>
            {bloco.texto}
          </ThemedText>
        </ThemedView>
      );

    case 'destaque':
      return (
        <ThemedView type="backgroundElement" style={styles.destaque}>
          <ThemedText type="smallBold" themeColor="accent">
            {bloco.titulo}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {bloco.texto}
          </ThemedText>
        </ThemedView>
      );

    case 'tabela':
      return (
        // Tabelas largas rolam dentro do próprio container, sem empurrar a página.
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.tabela, { borderColor: theme.border }]}>
            <View style={[styles.linha, { backgroundColor: theme.backgroundSelected }]}>
              {bloco.cabecalho.map((celula) => (
                <View key={celula} style={styles.celula}>
                  <ThemedText type="smallBold" themeColor="accent">
                    {celula}
                  </ThemedText>
                </View>
              ))}
            </View>
            {bloco.linhas.map((linha, indice) => (
              <View
                key={indice}
                style={[
                  styles.linha,
                  { borderTopColor: theme.border, borderTopWidth: 1 },
                ]}>
                {linha.map((celula, i) => (
                  <View key={i} style={styles.celula}>
                    <ThemedText type="small" themeColor={i === 0 ? 'text' : 'textSecondary'}>
                      {celula}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
  }
}

function Aviso({ texto }: { texto: string }) {
  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={[styles.flex, styles.centro]}>
        <View style={styles.content}>
          <Cabecalho titulo="Ops" />
          <ThemedText type="default" themeColor="textSecondary">
            {texto}
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

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
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  secao: { gap: Spacing.three },
  secaoTitulo: { fontWeight: '700' },
  lista: { gap: Spacing.two },
  itemLista: { flexDirection: 'row', gap: Spacing.two },
  formula: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  formulaTexto: { fontSize: 15, lineHeight: 24 },
  destaque: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  tabela: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    minWidth: 320,
  },
  linha: { flexDirection: 'row' },
  celula: {
    width: 150,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
  },
  acoes: { gap: Spacing.two, paddingTop: Spacing.two },
});
