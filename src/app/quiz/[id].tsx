import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BarraPassos } from '@/components/ui/barra';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { Faixa } from '@/components/ui/faixa';
import { Regua } from '@/components/ui/regua';
import { Tela } from '@/components/ui/tela';
import { MODULOS, moduloPorId } from '@/content/modulos';
import { quizPorModulo } from '@/content/quiz';
import { NOTA_MINIMA, type Questao } from '@/content/tipos';
import { MinTouchTarget, Radius, Rules, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

const PERCENTUAL_MINIMO = Math.round(NOTA_MINIMA * 100);

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { registrarNota, notaDe } = useProgresso();

  const modulo = moduloPorId(id);
  const questoes = quizPorModulo(id);

  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [erradas, setErradas] = useState<number[]>([]);
  const [terminou, setTerminou] = useState(false);
  const [inicio, setInicio] = useState(() => Date.now());
  const [duracao, setDuracao] = useState(0);

  if (!modulo || questoes.length === 0) {
    return (
      <Tela>
        <Cabecalho voltar="a trilha" titulo="Avaliação indisponível" />
        <ThemedText type="small">Este módulo ainda não tem avaliação.</ThemedText>
      </Tela>
    );
  }

  const questao = questoes[indice];
  const acertos = questoes.length - erradas.length;

  function confirmar() {
    if (escolhida === null) return;
    setRespondida(true);
    if (escolhida !== questao.correta) {
      setErradas((atual) => [...atual, indice]);
    }
  }

  function avancar() {
    if (indice < questoes.length - 1) {
      setIndice(indice + 1);
      setEscolhida(null);
      setRespondida(false);
      return;
    }

    setDuracao(Date.now() - inicio);
    registrarNota(modulo!.id, (questoes.length - erradas.length) / questoes.length);
    setTerminou(true);
  }

  function refazer() {
    setIndice(0);
    setEscolhida(null);
    setRespondida(false);
    setErradas([]);
    setTerminou(false);
    setInicio(Date.now());
  }

  if (terminou) {
    return (
      <Resultado
        acertos={acertos}
        total={questoes.length}
        duracao={duracao}
        melhorNota={notaDe(modulo.id)}
        erradas={erradas.map((i) => questoes[i])}
        moduloId={modulo.id}
        onRefazer={refazer}
      />
    );
  }

  const acertou = escolhida === questao.correta;

  return (
    <View style={styles.raiz}>
      <BarraPassos
        atual={indice + 1}
        total={questoes.length}
        rotulo={`Progresso na avaliação de ${modulo.titulo}`}
        rotuloSair="Sair da avaliação"
        onSair={() => router.push({ pathname: '/modulo/[id]', params: { id: modulo.id } })}
      />

      <Tela espaco={Spacing.two + Spacing.one}>
        <ThemedText type="kicker">Avaliação · {modulo.titulo}</ThemedText>
        <ThemedText type="heading" accessibilityRole="header">
          {questao.pergunta}
        </ThemedText>

        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Alternativas"
          style={styles.alternativas}>
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

        {respondida && <Veredito questao={questao} acertou={acertou} />}

        <View style={styles.acao}>
          {respondida ? (
            <Button bloco size="lg" onPress={avancar}>
              {indice === questoes.length - 1 ? 'Ver resultado' : 'Próxima questão'}
            </Button>
          ) : (
            <Button bloco size="lg" disabled={escolhida === null} onPress={confirmar}>
              Confirmar
            </Button>
          )}
        </View>
      </Tela>
    </View>
  );
}

/**
 * A alternativa depois de respondida.
 *
 * A correta é a única preenchida; a escolha errada fica contornada em tinta; o
 * resto apaga para o cinza de apoio. Nenhum verde e nenhum vermelho — é croma
 * contra neutro, e cada estado ainda carrega ✓, ✕ ou a própria letra.
 */
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

  const acertou = respondida && correta;
  const errou = respondida && selecionada && !correta;
  const apagada = respondida && !correta && !selecionada;
  const marca = acertou ? '✓' : errou ? '✕' : letra;

  const cor = acertou ? theme.accentOn : apagada ? theme.textMuted : theme.text;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selecionada, disabled: respondida }}
      accessibilityLabel={
        respondida
          ? `${texto}. ${correta ? 'Resposta correta' : selecionada ? 'Sua resposta, incorreta' : 'Não escolhida'}`
          : `${letra}. ${texto}`
      }
      disabled={respondida}
      onPress={onPress}
      style={({ pressed }) => [
        styles.alternativa,
        {
          borderWidth: selecionada || acertou ? Rules.thick : Rules.hair,
          borderColor: acertou
            ? theme.accentStrong
            : errou || selecionada
              ? theme.text
              : apagada
                ? theme.hairline
                : theme.border,
        },
        acertou && { backgroundColor: theme.accentStrong },
        errou && { backgroundColor: theme.backgroundElement },
        pressed && !respondida && { backgroundColor: theme.backgroundSelected },
      ]}>
      <ThemedText type="smallBold" style={[styles.marca, { color: cor }]}>
        {marca}
      </ThemedText>
      <ThemedText type="rowTitle" style={[styles.alternativaTexto, { color: cor }]}>
        {texto}
      </ThemedText>
    </Pressable>
  );
}

function Veredito({ questao, acertou }: { questao: Questao; acertou: boolean }) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.veredito,
        { backgroundColor: theme.backgroundElement, borderLeftColor: theme.accentDisplay },
      ]}>
      <ThemedText type="label" themeColor="text">
        {acertou ? '✓ Correto' : `✕ Não é essa — era: ${questao.alternativas[questao.correta]}`}
      </ThemedText>
      <ThemedText type="small">{questao.explicacao}</ThemedText>
    </View>
  );
}

function Resultado({
  acertos,
  total,
  duracao,
  melhorNota,
  erradas,
  moduloId,
  onRefazer,
}: {
  acertos: number;
  total: number;
  duracao: number;
  melhorNota: number | undefined;
  erradas: Questao[];
  moduloId: string;
  onRefazer: () => void;
}) {
  const router = useRouter();
  const theme = useTheme();

  const percentual = Math.round((acertos / total) * 100);
  const aprovado = acertos / total >= NOTA_MINIMA;
  const proximo = MODULOS[MODULOS.findIndex((m) => m.id === moduloId) + 1];

  return (
    <Tela>
      <View style={[styles.placar, { backgroundColor: theme.inverse }]}>
        <ThemedText type="kicker" style={{ color: theme.inverseMuted }}>
          Avaliação concluída
        </ThemedText>
        <ThemedText
          type="display"
          accessibilityRole="header"
          style={[styles.placarNumero, { color: theme.inverseOn }]}>
          {percentual}%
        </ThemedText>
        {/* Aprovação por símbolo + texto, nunca só pela cor. */}
        <ThemedText type="rowTitle" style={{ color: theme.inverseOn }}>
          {aprovado ? `✓ Aprovado` : `✕ Abaixo dos ${PERCENTUAL_MINIMO}% necessários`}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.inverseMuted }}>
          {acertos} de {total} corretas.{' '}
          {aprovado
            ? proximo
              ? `Módulo ${String(proximo.numero).padStart(2, '0')} liberado.`
              : 'Você chegou ao fim da trilha.'
            : 'Sua melhor nota continua valendo — refaça quando quiser.'}
        </ThemedText>
      </View>

      <Faixa
        itens={[
          { rotulo: 'Tempo', valor: formatarDuracao(duracao) },
          { rotulo: 'Acertos', valor: `${acertos}/${total}` },
          {
            rotulo: 'Melhor nota',
            valor: `${Math.round(Math.max(melhorNota ?? 0, acertos / total) * 100)}%`,
            destaque: true,
          },
        ]}
      />

      {erradas.length > 0 && (
        <>
          <Regua />
          <ThemedText type="label">
            {erradas.length === 1 ? 'A questão que escapou' : `As ${erradas.length} que escaparam`}
          </ThemedText>
          {erradas.map((questao) => (
            <View
              key={questao.pergunta}
              style={[styles.erro, { borderColor: theme.border }]}>
              <ThemedText type="rowTitle">{questao.pergunta}</ThemedText>
              <ThemedText type="small">
                Resposta: {questao.alternativas[questao.correta]}
              </ThemedText>
            </View>
          ))}
        </>
      )}

      <View style={styles.acoes}>
        {aprovado && proximo ? (
          <Button
            bloco
            size="lg"
            onPress={() =>
              router.replace({ pathname: '/modulo/[id]', params: { id: proximo.id } })
            }>
            {`Ir para o módulo ${String(proximo.numero).padStart(2, '0')}`}
          </Button>
        ) : (
          <Button bloco size="lg" onPress={onRefazer}>
            Refazer a avaliação
          </Button>
        )}

        <Button
          bloco
          variant="secondary"
          onPress={() => router.replace({ pathname: '/flashcards/[id]', params: { id: moduloId } })}
          accessibilityHint="Abre o baralho deste módulo para revisar">
          Revisar com os cards
        </Button>

        <Button bloco variant="ghost" onPress={() => router.replace('/trilha')}>
          Voltar para a trilha
        </Button>
      </View>
    </Tela>
  );
}

/** "4:12" — minutos e segundos, que é a escala de uma avaliação de 10 questões. */
function formatarDuracao(ms: number) {
  const segundos = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  alternativas: { gap: Spacing.two },
  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    minHeight: MinTouchTarget,
    borderRadius: Radius,
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.two + Spacing.one,
  },
  marca: { width: 16 },
  alternativaTexto: { flex: 1 },
  veredito: {
    borderLeftWidth: Rules.thick,
    padding: Spacing.two + Spacing.one,
    gap: Spacing.one,
  },
  acao: { marginTop: 'auto', paddingTop: Spacing.three },
  placar: {
    padding: Spacing.four,
    gap: Spacing.two,
    borderRadius: Radius,
  },
  placarNumero: { fontSize: 60, lineHeight: 62 },
  erro: {
    borderWidth: Rules.hair,
    borderRadius: Radius,
    padding: Spacing.two + Spacing.one,
    gap: Spacing.half,
  },
  acoes: { marginTop: 'auto', paddingTop: Spacing.three, gap: Spacing.two },
});
