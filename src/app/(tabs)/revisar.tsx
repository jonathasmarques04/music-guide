import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Faixa } from '@/components/ui/faixa';
import { Regua } from '@/components/ui/regua';
import { Tag } from '@/components/ui/tag';
import { Tela } from '@/components/ui/tela';
import { flashcardsPorModulo } from '@/content/flashcards';
import { MODULOS } from '@/content/modulos';
import { tempoAte } from '@/content/repeticao';
import { MinTouchTarget, Rules, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useRevisao } from '@/contexts/revisao';
import { useTheme } from '@/hooks/use-theme';

/**
 * O hub de revisão: um baralho por módulo, com quantos cards estão esperando.
 *
 * Módulo trancado não aparece com baralho aberto — revisar cards de um assunto
 * que o aluno ainda não estudou não é revisão, é adivinhação.
 */
export default function RevisarScreen() {
  const { statusDe } = useProgresso();
  const { resumoDoModulo } = useRevisao();

  const baralhos = MODULOS.map((modulo) => ({
    modulo,
    resumo: resumoDoModulo(modulo.id),
    bloqueado: statusDe(modulo.id) === 'bloqueado',
  })).filter(({ modulo }) => flashcardsPorModulo(modulo.id).length > 0);

  const abertos = baralhos.filter((b) => !b.bloqueado);
  const naFila = abertos.reduce((soma, b) => soma + b.resumo.vencidos + b.resumo.novos, 0);
  const total = abertos.reduce((soma, b) => soma + b.resumo.total, 0);

  return (
    <Tela semMargem espaco={0}>
      <View style={styles.topo}>
        <ThemedText type="kicker">Repetição espaçada</ThemedText>
        <ThemedText type="title" accessibilityRole="header">
          Revisar
        </ThemedText>
        <ThemedText type="small">
          Cada card volta no prazo que você deu a ele. Errar traz de volta em minutos; acertar com
          folga empurra para dias.
        </ThemedText>

        <Faixa
          itens={[
            { rotulo: 'Na fila', valor: `${naFila}`, destaque: true },
            { rotulo: 'Cards abertos', valor: `${total}` },
            { rotulo: 'Baralhos', valor: `${abertos.length}` },
          ]}
        />
      </View>

      <Regua />

      {baralhos.map(({ modulo, resumo, bloqueado }) => (
        <LinhaBaralho
          key={modulo.id}
          id={modulo.id}
          numero={modulo.numero}
          titulo={modulo.titulo}
          total={resumo.total}
          pendentes={resumo.vencidos + resumo.novos}
          proxima={resumo.proximaRevisao}
          bloqueado={bloqueado}
        />
      ))}
    </Tela>
  );
}

function LinhaBaralho({
  id,
  numero,
  titulo,
  total,
  pendentes,
  proxima,
  bloqueado,
}: {
  id: string;
  numero: number;
  titulo: string;
  total: number;
  pendentes: number;
  proxima?: number;
  bloqueado: boolean;
}) {
  const theme = useTheme();
  const router = useRouter();

  const detalhe = bloqueado
    ? 'Conclua o módulo anterior para liberar'
    : pendentes > 0
      ? `${pendentes} de ${total} ${pendentes === 1 ? 'card espera' : 'cards esperam'}`
      : proxima
        ? `Em dia — o próximo volta em ${tempoAte(proxima)}`
        : `${total} cards, todos em dia`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Baralho do módulo ${numero}: ${titulo}. ${detalhe}.`}
      accessibilityState={{ disabled: bloqueado }}
      disabled={bloqueado}
      onPress={() => router.push({ pathname: '/flashcards/[id]', params: { id } })}
      style={({ pressed }) => [
        styles.linha,
        { borderBottomColor: theme.hairline },
        bloqueado && styles.bloqueada,
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      <View style={[styles.numero, { borderRightColor: theme.hairline }]}>
        <ThemedText type="rowTitle" style={styles.numeroTexto}>
          {String(numero).padStart(2, '0')}
        </ThemedText>
      </View>

      <View style={styles.corpo}>
        <ThemedText type="rowTitle">{titulo}</ThemedText>
        <ThemedText type="small">{detalhe}</ThemedText>
      </View>

      <View style={styles.estado}>
        {bloqueado ? (
          <ThemedText type="small">Bloqueado</ThemedText>
        ) : pendentes > 0 ? (
          <Tag variant="accent">{`${pendentes}`}</Tag>
        ) : (
          <ThemedText type="rowTitle" themeColor="textMuted">
            ›
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topo: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: MinTouchTarget + Spacing.two,
    borderBottomWidth: Rules.hair,
  },
  numero: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: Rules.hair,
  },
  numeroTexto: { fontSize: 15 },
  corpo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.two + Spacing.one,
  },
  estado: {
    justifyContent: 'center',
    paddingRight: Spacing.two + Spacing.one,
  },
  bloqueada: { opacity: 0.5 },
});
