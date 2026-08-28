import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CasaBraco = {
  numero: number;
  status: 'concluido' | 'atual' | 'bloqueado';
};

export type BracoCompactoProps = {
  casas: readonly CasaBraco[];
};

/**
 * Marcações do braço — as casas 3, 5, 7, 9 e 12, como em qualquer violão.
 *
 * Só que aqui elas são QUADRADAS. O sistema não tem raio, e um ponto redondo
 * seria o único círculo do app inteiro.
 */
const MARCACOES = new Set([3, 5, 7, 9, 12]);

/**
 * A trilha como uma faixa de braço de violão.
 *
 * Cada módulo é uma casa; aprovar acende a casa. Numa olhada o aluno vê quanto
 * do braço já domina e quanto ainda está apagado — a mesma leitura que faria
 * olhando para o instrumento.
 *
 * É um DESENHO, não um controle: a linha "Progresso" logo acima já diz
 * "N de 13 aprovados" em texto, então a faixa fica escondida do leitor de tela
 * em vez de repetir a mesma informação em 13 pedaços.
 */
export function BracoCompacto({ casas }: BracoCompactoProps) {
  const theme = useTheme();

  return (
    <View
      style={styles.bloco}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View style={[styles.braco, { borderColor: theme.text }]}>
        {casas.map((casa, i) => {
          const aceso = casa.status === 'concluido';

          return (
            <View
              key={casa.numero}
              style={[
                styles.casa,
                i > 0 && { borderLeftWidth: Rules.hair, borderLeftColor: theme.hairline },
                aceso && { backgroundColor: theme.accentStrong },
              ]}>
              {/* Onde o aluno está agora: régua de destaque no topo da casa. */}
              {casa.status === 'atual' && (
                <View style={[styles.agora, { backgroundColor: theme.accentDisplay }]} />
              )}

              {/* A marcação some na casa acesa — ali ela viraria ruído sobre o cheio. */}
              {MARCACOES.has(casa.numero) && !aceso && (
                <View style={[styles.marcacao, { backgroundColor: theme.divider }]} />
              )}
            </View>
          );
        })}
      </View>

      {/* As pontas do braço, para a faixa não ficar um gráfico sem escala. */}
      <View style={styles.pontas}>
        <ThemedText type="small" themeColor="textMuted" style={styles.ponta}>
          01
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted" style={styles.ponta}>
          {String(casas.length).padStart(2, '0')}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: Spacing.one },
  braco: {
    flexDirection: 'row',
    height: Spacing.four,
    borderWidth: Rules.thick,
    borderRadius: Radius,
    overflow: 'hidden',
  },
  /* `flex: 1` em todas: as treze casas dividem a largura, seja qual for a tela. */
  casa: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  agora: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Rules.thick,
  },
  marcacao: { width: Spacing.one, height: Spacing.one },
  pontas: { flexDirection: 'row', justifyContent: 'space-between' },
  ponta: { fontSize: 10, lineHeight: 13 },
});
