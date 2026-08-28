import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BarraPassos } from '@/components/ui/barra';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { Faixa } from '@/components/ui/faixa';
import { Tela } from '@/components/ui/tela';
import { flashcardsPorModulo } from '@/content/flashcards';
import { moduloPorId } from '@/content/modulos';
import {
  ORDEM_AVALIACOES,
  ROTULOS,
  formatarIntervalo,
  previsao,
  type Avaliacao,
} from '@/content/repeticao';
import type { Flashcard } from '@/content/tipos';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { chaveCard, useRevisao } from '@/contexts/revisao';
import { useTheme } from '@/hooks/use-theme';

/**
 * A sessão de revisão: um card por vez, e as quatro respostas da repetição
 * espaçada quando ele vira.
 *
 * A fila é congelada na abertura da tela. Recalculá-la a cada avaliação faria
 * o card recém-respondido sumir do meio da sessão — e a contagem "6/18" mudar
 * debaixo do aluno.
 */
export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { filaDoModulo, registrar, estadoDe } = useRevisao();

  const modulo = moduloPorId(id);
  const cards = flashcardsPorModulo(id);

  const [fila] = useState(() => {
    const pendentes = filaDoModulo(id);
    // Baralho todo em dia: ainda assim vale reler, então a sessão vira o baralho inteiro.
    return pendentes.length > 0 ? pendentes : cards.map((_, i) => i);
  });

  const [posicao, setPosicao] = useState(0);
  const [virado, setVirado] = useState(false);

  if (!modulo || cards.length === 0) {
    return (
      <Tela>
        <Cabecalho voltar="a revisão" titulo="Sem baralho" />
        <ThemedText type="small">Este módulo ainda não tem cards de revisão.</ThemedText>
      </Tela>
    );
  }

  const sair = () => router.push({ pathname: '/modulo/[id]', params: { id: modulo.id } });

  if (posicao >= fila.length) {
    return (
      <Tela>
        <Cabecalho
          voltar="o módulo"
          kicker="Sessão concluída"
          titulo={modulo.titulo}
        />
        <Faixa
          itens={[
            { rotulo: 'Revisados', valor: `${fila.length}` },
            { rotulo: 'No baralho', valor: `${cards.length}` },
          ]}
        />
        <ThemedText type="default" themeColor="textSecondary">
          Cada card guarda o próprio prazo. Os que você marcou como &ldquo;Errei&rdquo; voltam
          ainda hoje; os demais esperam o tempo que ganharam.
        </ThemedText>
        <View style={styles.acoes}>
          <Button bloco size="lg" onPress={sair}>
            Voltar ao módulo
          </Button>
          <Button bloco variant="secondary" onPress={() => router.replace('/revisar')}>
            Escolher outro baralho
          </Button>
        </View>
      </Tela>
    );
  }

  const card = cards[fila[posicao]];
  const chave = chaveCard(modulo.id, card.frente);
  const estado = estadoDe(chave);

  const responder = (avaliacao: Avaliacao) => {
    registrar(chave, avaliacao);
    setVirado(false);
    setPosicao(posicao + 1);
  };

  return (
    <View style={styles.raiz}>
      <BarraPassos
        atual={posicao + 1}
        total={fila.length}
        rotulo={`Progresso na revisão de ${modulo.titulo}`}
        rotuloSair="Sair da revisão"
        onSair={sair}
      />

      <Tela rolar={false} espaco={Spacing.two + Spacing.one}>
        <Cartao card={card} virado={virado} onVirar={() => setVirado(!virado)} />

        {virado ? (
          <View style={styles.avaliacoes}>
            <ThemedText type="label">Como foi?</ThemedText>
            <View style={styles.botoes}>
              {ORDEM_AVALIACOES.map((avaliacao) => (
                <Pressable
                  key={avaliacao}
                  accessibilityRole="button"
                  accessibilityLabel={ROTULOS[avaliacao]}
                  accessibilityHint={`Este card volta em ${formatarIntervalo(previsao(estado, avaliacao))}`}
                  onPress={() => responder(avaliacao)}
                  style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}>
                  <BotaoAvaliacao
                    avaliacao={avaliacao}
                    prazo={formatarIntervalo(previsao(estado, avaliacao))}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Button bloco size="lg" onPress={() => setVirado(true)}>
            Mostrar resposta
          </Button>
        )}
      </Tela>
    </View>
  );
}

/**
 * "Bom" é a resposta esperada e vem preenchida; as outras são contorno. A
 * diferença é de PESO, não só de cor — e cada botão diz o prazo que gera, para
 * a escolha não ser às cegas.
 */
function BotaoAvaliacao({ avaliacao, prazo }: { avaliacao: Avaliacao; prazo: string }) {
  const theme = useTheme();
  const principal = avaliacao === 'bom';

  return (
    <View
      style={[
        styles.rotuloBotao,
        {
          borderWidth: principal ? Rules.thick : Rules.hair,
          borderColor: principal ? theme.accentStrong : theme.border,
          backgroundColor: principal ? theme.accentStrong : 'transparent',
        },
      ]}>
      <ThemedText
        type="smallBold"
        style={{ color: principal ? theme.accentOn : theme.text }}
        numberOfLines={1}>
        {ROTULOS[avaliacao]}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.prazo, { color: principal ? theme.accentOn : theme.textSecondary }]}
        numberOfLines={1}>
        {prazo}
      </ThemedText>
    </View>
  );
}

/**
 * Card com giro em torno do eixo Y.
 *
 * As duas faces ficam empilhadas; `backfaceVisibility: 'hidden'` esconde a que
 * está de costas. O verso já nasce girado 180°, então na metade do giro ele
 * aparece na posição correta. O verso é o bloco invertido do sistema — virar
 * o card literalmente vira o chão.
 */
function Cartao({
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
      accessibilityLabel={virado ? `Resposta: ${card.verso}` : `Pergunta: ${card.frente}`}
      accessibilityHint={virado ? 'Toque para ver a pergunta' : 'Toque para ver a resposta'}
      accessibilityState={{ expanded: virado }}
      onPress={onVirar}
      style={styles.area}>
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: theme.background, borderColor: theme.text },
          frenteStyle,
        ]}>
        <ThemedText type="label">Frente</ThemedText>
        <ThemedText type="title">{card.frente}</ThemedText>
        <ThemedText type="small" style={styles.dica}>
          Toque no card para ver a resposta
        </ThemedText>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          { backgroundColor: theme.inverse, borderColor: theme.inverse },
          versoStyle,
        ]}>
        <ThemedText type="label" style={{ color: theme.inverseMuted }}>
          Verso
        </ThemedText>
        <ThemedText type="title" style={{ color: theme.inverseOn }}>
          {card.verso}
        </ThemedText>
        <ThemedText type="small" style={[styles.dica, { color: theme.inverseMuted }]}>
          {card.frente}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  area: { flex: 1, minHeight: 220 },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: Rules.thick,
    borderRadius: Radius,
    padding: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.two + Spacing.one,
    backfaceVisibility: 'hidden',
  },
  dica: { marginTop: Spacing.one },
  avaliacoes: { gap: Spacing.two },
  botoes: { flexDirection: 'row', gap: Spacing.one + Spacing.half },
  botao: { flex: 1 },
  rotuloBotao: {
    borderRadius: Radius,
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.one,
    alignItems: 'center',
    gap: Spacing.half,
    minHeight: 56,
    justifyContent: 'center',
  },
  prazo: { fontSize: 10, lineHeight: 13 },
  pressionado: { opacity: 0.7 },
  acoes: { marginTop: 'auto', paddingTop: Spacing.three, gap: Spacing.two },
});
