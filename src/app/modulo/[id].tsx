import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BarraProgresso } from '@/components/ui/barra';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tag } from '@/components/ui/tag';
import { Tela } from '@/components/ui/tela';
import { flashcardsPorModulo } from '@/content/flashcards';
import { moduloPorId } from '@/content/modulos';
import { quizPorModulo } from '@/content/quiz';
import { NOTA_MINIMA } from '@/content/tipos';
import { MinTouchTarget, Radius, Rules, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useRevisao } from '@/contexts/revisao';
import { useTheme } from '@/hooks/use-theme';

const PERCENTUAL_MINIMO = Math.round(NOTA_MINIMA * 100);

export default function ModuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { statusDe, notaDe } = useProgresso();
  const { resumoDoModulo } = useRevisao();

  const modulo = moduloPorId(id);

  if (!modulo) {
    return (
      <Tela>
        <Cabecalho voltar="a trilha" titulo="Módulo não encontrado" />
        <ThemedText type="small">Esse endereço não corresponde a nenhum módulo da trilha.</ThemedText>
      </Tela>
    );
  }

  const status = statusDe(modulo.id);

  if (status === 'bloqueado') {
    return (
      <Tela>
        <Cabecalho voltar="a trilha" kicker="Bloqueado" titulo={modulo.titulo} />
        <Nota
          tom="aviso"
          rotulo="Ainda trancado"
          texto={`A trilha é sequencial: para abrir este módulo é preciso ${PERCENTUAL_MINIMO}% na avaliação do módulo anterior.`}
        />
        <Button bloco onPress={() => router.replace('/trilha')}>
          Voltar para a trilha
        </Button>
      </Tela>
    );
  }

  const nota = notaDe(modulo.id);
  const questoes = quizPorModulo(modulo.id).length;
  const cards = flashcardsPorModulo(modulo.id).length;
  const resumo = resumoDoModulo(modulo.id);
  const naFila = resumo.vencidos + resumo.novos;

  return (
    <Tela>
      <Cabecalho
        voltar="a trilha"
        kicker={`Módulo ${String(modulo.numero).padStart(2, '0')}`}
        titulo={modulo.titulo}
        regua={false}
      />

      <ThemedText type="default" themeColor="textSecondary">
        {modulo.resumo}
      </ThemedText>

      <Regua />

      <View style={styles.progresso}>
        <View style={styles.progressoTopo}>
          <ThemedText type="label">Aproveitamento na avaliação</ThemedText>
          <ThemedText type="smallBold">
            {nota === undefined ? '—' : `${Math.round(nota * 100)}%`}
          </ThemedText>
        </View>
        <BarraProgresso
          valor={nota ?? 0}
          rotulo={`Aproveitamento em ${modulo.titulo}`}
          altura={Spacing.two - Spacing.half}
        />
      </View>

      <ThemedText type="label">A aula, em {modulo.secoes.length} passos</ThemedText>

      <View>
        {modulo.secoes.map((secao, indice) => (
          <Pressable
            key={secao.titulo}
            accessibilityRole="button"
            accessibilityLabel={`Passo ${indice + 1}: ${secao.titulo}`}
            accessibilityHint="Abre a aula neste passo"
            onPress={() =>
              router.push({
                pathname: '/licao/[id]',
                params: { id: modulo.id, passo: String(indice) },
              })
            }
            style={({ pressed }) => [
              styles.secao,
              { borderBottomColor: theme.hairline },
              pressed && { backgroundColor: theme.backgroundSelected },
            ]}>
            <ThemedText type="rowTitle" themeColor="accent" style={styles.secaoNumero}>
              {String(indice + 1).padStart(2, '0')}
            </ThemedText>
            <ThemedText type="rowTitle" style={styles.secaoTitulo}>
              {secao.titulo}
            </ThemedText>
            <ThemedText type="rowTitle" themeColor="textMuted">
              ›
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {questoes > 0 && (
        <View style={[styles.caixa, styles.caixaForte, { borderColor: theme.text }]}>
          <View style={styles.caixaTexto}>
            <ThemedText type="rowTitle">Avaliação do módulo</ThemedText>
            <ThemedText type="small">
              {questoes} {questoes === 1 ? 'questão' : 'questões'} · mínimo {PERCENTUAL_MINIMO}%
            </ThemedText>
          </View>
          {status === 'concluido' ? (
            <Tag variant="accent">{`✓ ${Math.round((nota ?? 0) * 100)}%`}</Tag>
          ) : (
            <Tag variant="outline">Pendente</Tag>
          )}
        </View>
      )}

      {cards > 0 && (
        <View style={[styles.caixa, { borderColor: theme.border }]}>
          <View style={styles.caixaTexto}>
            <ThemedText type="rowTitle">Baralho do módulo</ThemedText>
            <ThemedText type="small">
              {cards} cards · {naFila === 0 ? 'nenhum na fila' : `${naFila} na fila`}
            </ThemedText>
          </View>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => router.push({ pathname: '/flashcards/[id]', params: { id: modulo.id } })}
            accessibilityHint={`Abre o baralho de ${modulo.titulo}`}>
            Abrir
          </Button>
        </View>
      )}

      <View style={styles.acoes}>
        <Button
          bloco
          size="lg"
          onPress={() =>
            router.push({ pathname: '/licao/[id]', params: { id: modulo.id, passo: '0' } })
          }
          accessibilityHint={`Abre a aula de ${modulo.titulo} no primeiro passo`}>
          {nota === undefined ? 'Começar a aula' : 'Reler a aula'}
        </Button>

        {questoes > 0 && (
          <Button
            bloco
            variant="secondary"
            onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: modulo.id } })}
            accessibilityHint={`Inicia a avaliação com ${questoes} questões`}>
            {nota === undefined
              ? 'Fazer a avaliação'
              : `Refazer · melhor nota ${Math.round(nota * 100)}%`}
          </Button>
        )}
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  progresso: { gap: Spacing.two },
  progressoTopo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  secao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    minHeight: MinTouchTarget,
    paddingVertical: Spacing.two + Spacing.one,
    borderBottomWidth: Rules.hair,
  },
  secaoNumero: { width: 24 },
  secaoTitulo: { flex: 1 },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    borderWidth: Rules.hair,
    borderRadius: Radius,
    padding: Spacing.two + Spacing.one,
  },
  caixaForte: { borderWidth: Rules.thick },
  caixaTexto: { flex: 1, gap: Spacing.half },
  acoes: { marginTop: 'auto', paddingTop: Spacing.two, gap: Spacing.two },
});
