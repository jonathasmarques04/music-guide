import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { MODULOS, moduloPorId } from '@/content/modulos';
import { quizPorModulo } from '@/content/quiz';
import { NOTA_MINIMA, type Questao } from '@/content/tipos';
import { MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

const PERCENTUAL_MINIMO = Math.round(NOTA_MINIMA * 100);

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { registrarNota } = useProgresso();

  const modulo = moduloPorId(id);
  const questoes = quizPorModulo(id);

  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [terminou, setTerminou] = useState(false);

  if (!modulo || questoes.length === 0) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={[styles.flex, styles.centro]}>
          <View style={styles.content}>
            <Cabecalho titulo="Avaliação indisponível" />
            <ThemedText type="default" themeColor="textSecondary">
              Este módulo ainda não tem avaliação.
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const questao = questoes[indice];

  function confirmar() {
    if (escolhida === null) return;
    setRespondida(true);
    if (escolhida === questao.correta) {
      setAcertos((n) => n + 1);
    }
  }

  function avancar() {
    const ultima = indice === questoes.length - 1;

    if (ultima) {
      const total = acertos / questoes.length;
      registrarNota(modulo!.id, total);
      setTerminou(true);
      return;
    }

    setIndice((n) => n + 1);
    setEscolhida(null);
    setRespondida(false);
  }

  function refazer() {
    setIndice(0);
    setEscolhida(null);
    setRespondida(false);
    setAcertos(0);
    setTerminou(false);
  }

  if (terminou) {
    return (
      <Resultado
        acertos={acertos}
        total={questoes.length}
        moduloId={modulo.id}
        onRefazer={refazer}
        onVoltar={() => router.replace('/')}
      />
    );
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <Cabecalho
              titulo={modulo.titulo}
              subtitulo={`AVALIAÇÃO · QUESTÃO ${indice + 1} DE ${questoes.length}`}
            />

            <BarraProgresso atual={indice} total={questoes.length} />

            <ThemedText type="default" accessibilityRole="header" style={styles.pergunta}>
              {questao.pergunta}
            </ThemedText>

            <View style={styles.alternativas}>
              {questao.alternativas.map((texto, i) => (
                <Alternativa
                  key={texto}
                  texto={texto}
                  letra={String.fromCharCode(65 + i)}
                  selecionada={escolhida === i}
                  respondida={respondida}
                  correta={i === questao.correta}
                  onPress={() => !respondida && setEscolhida(i)}
                />
              ))}
            </View>

            {respondida && <Explicacao questao={questao} acertou={escolhida === questao.correta} />}

            {respondida ? (
              <Button onPress={avancar}>
                {indice === questoes.length - 1 ? 'Ver resultado' : 'Próxima questão'}
              </Button>
            ) : (
              <Button disabled={escolhida === null} onPress={confirmar}>
                Confirmar resposta
              </Button>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function BarraProgresso({ atual, total }: { atual: number; total: number }) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Progresso na avaliação"
      accessibilityValue={{ min: 0, max: total, now: atual }}
      style={[styles.trilho, { backgroundColor: theme.backgroundSelected }]}>
      <View
        style={[
          styles.preenchimento,
          { backgroundColor: theme.accentStrong, width: `${(atual / total) * 100}%` },
        ]}
      />
    </View>
  );
}

function Alternativa({
  texto,
  letra,
  selecionada,
  respondida,
  correta,
  onPress,
}: {
  texto: string;
  letra: string;
  selecionada: boolean;
  respondida: boolean;
  correta: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  // Depois de responder, o feedback usa SÍMBOLO + COR + TEXTO — nunca só a cor.
  const acertou = respondida && correta;
  const errou = respondida && selecionada && !correta;
  const marca = acertou ? '✓' : errou ? '✕' : letra;

  const corBorda = acertou
    ? theme.success
    : errou
      ? theme.error
      : !respondida && selecionada
        ? theme.accent
        : theme.border;

  const corMarca = acertou ? theme.success : errou ? theme.error : theme.textSecondary;

  const fundoMarca = acertou
    ? theme.successSurface
    : errou
      ? theme.errorSurface
      : selecionada
        ? theme.accentSurface
        : theme.backgroundSelected;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selecionada, disabled: respondida }}
      accessibilityLabel={
        respondida
          ? `${texto}. ${correta ? 'Resposta correta' : selecionada ? 'Sua resposta, incorreta' : ''}`
          : texto
      }
      disabled={respondida}
      onPress={onPress}
      style={({ pressed }) => [
        styles.alternativa,
        { backgroundColor: theme.backgroundElement, borderColor: corBorda },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.marca, { backgroundColor: fundoMarca }]}>
        <ThemedText type="smallBold" style={{ color: corMarca }}>
          {marca}
        </ThemedText>
      </View>
      <ThemedText type="default" themeColor="textSecondary" style={styles.flex}>
        {texto}
      </ThemedText>
    </Pressable>
  );
}

function Explicacao({ questao, acertou }: { questao: Questao; acertou: boolean }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.explicacao,
        {
          backgroundColor: acertou ? theme.successSurface : theme.errorSurface,
          borderColor: acertou ? theme.success : theme.error,
        },
      ]}>
      <ThemedText type="smallBold" style={{ color: acertou ? theme.success : theme.error }}>
        {acertou ? '✓ Correto' : `✕ Resposta correta: ${questao.alternativas[questao.correta]}`}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {questao.explicacao}
      </ThemedText>
    </View>
  );
}

function Resultado({
  acertos,
  total,
  moduloId,
  onRefazer,
  onVoltar,
}: {
  acertos: number;
  total: number;
  moduloId: string;
  onRefazer: () => void;
  onVoltar: () => void;
}) {
  const theme = useTheme();
  const percentual = Math.round((acertos / total) * 100);
  const aprovado = acertos / total >= NOTA_MINIMA;

  const indice = MODULOS.findIndex((m) => m.id === moduloId);
  const proximo = MODULOS[indice + 1];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            <Cabecalho titulo="Resultado" subtitulo="AVALIAÇÃO CONCLUÍDA" />

            <View
              style={[
                styles.placar,
                {
                  backgroundColor: aprovado ? theme.successSurface : theme.errorSurface,
                  borderColor: aprovado ? theme.success : theme.error,
                },
              ]}>
              <ThemedText
                type="title"
                style={[styles.percentual, { color: aprovado ? theme.success : theme.error }]}>
                {percentual}%
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                {acertos} de {total} questões corretas
              </ThemedText>
              {/* Aprovação por símbolo + cor + texto, nunca só pela cor. */}
              <ThemedText
                type="smallBold"
                style={{ color: aprovado ? theme.success : theme.error }}>
                {aprovado ? '✓ Aprovado' : `✕ Não atingiu os ${PERCENTUAL_MINIMO}% necessários`}
              </ThemedText>
            </View>

            <ThemedText type="default" themeColor="textSecondary">
              {aprovado
                ? proximo
                  ? `Módulo concluído. O módulo ${proximo.numero} — ${proximo.titulo} foi liberado.`
                  : 'Você concluiu o último módulo da trilha. Parabéns!'
                : `É preciso ${PERCENTUAL_MINIMO}% de acerto para liberar o próximo módulo. Revise a aula e os flashcards, e tente de novo — sua melhor nota é sempre a que vale.`}
            </ThemedText>

            <View style={styles.acoes}>
              <Button variant={aprovado ? 'secondary' : 'primary'} onPress={onRefazer}>
                Refazer avaliação
              </Button>
              <Button variant={aprovado ? 'primary' : 'secondary'} onPress={onVoltar}>
                Voltar para a trilha
              </Button>
            </View>
          </View>
        </ScrollView>
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
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four },
  trilho: { height: Spacing.two, borderRadius: Spacing.one, overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: Spacing.one },
  pergunta: { fontWeight: '600', fontSize: 20, lineHeight: 28 },
  alternativas: { gap: Spacing.two },
  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchTarget,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  marca: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explicacao: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  placar: {
    borderWidth: 1,
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  percentual: { fontSize: 56, lineHeight: 62 },
  acoes: { gap: Spacing.two },
  pressed: { opacity: 0.7 },
});
