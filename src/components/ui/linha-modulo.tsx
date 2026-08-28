import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Tag } from '@/components/ui/tag';
import { MinTouchTarget, Rules, Spacing } from '@/constants/theme';
import type { StatusModulo } from '@/contexts/progresso';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';

export type LinhaModuloProps = {
  numero: number;
  titulo: string;
  /** Uma linha de contexto: o resumo do módulo, ou onde o aluno parou. */
  detalhe: string;
  status: StatusModulo;
  /** Melhor aproveitamento, de 0 a 1. Só aparece em módulo concluído. */
  nota?: number;
  onPress: () => void;
};

/**
 * A linha da trilha: célula do número, corpo e estado — o mesmo desenho da
 * grade modular do sistema, repetido treze vezes.
 *
 * O módulo em curso é a única linha preenchida da lista. Ela usa
 * `accentStrong`, e não o vermelhão de pôster: o rótulo por cima é pequeno e
 * precisa dos 4,5:1.
 */
export function LinhaModulo({ numero, titulo, detalhe, status, nota, onPress }: LinhaModuloProps) {
  const theme = useTheme();

  const ponteiro = useHover();
  const bloqueado = status === 'bloqueado';
  const atual = status === 'atual';
  /* Linha trancada não acende: o hover não pode prometer o que o toque nega. */
  const realce = ponteiro.hover && !bloqueado;
  const cor = atual ? theme.accentOn : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Módulo ${numero}: ${titulo}. ${detalhe}.`}
      accessibilityHint={
        bloqueado ? 'Bloqueado. Conclua a avaliação do módulo anterior para liberar.' : undefined
      }
      accessibilityState={{ disabled: bloqueado, selected: atual }}
      disabled={bloqueado}
      onPress={onPress}
      {...ponteiro.props}
      style={({ pressed }) => [
        styles.linha,
        { borderBottomColor: theme.hairline },
        status === 'concluido' && { backgroundColor: theme.backgroundElement },
        atual && { backgroundColor: theme.accentStrong },
        bloqueado && styles.bloqueada,
        realce && !atual && { backgroundColor: theme.backgroundElement },
        realce && atual && { backgroundColor: theme.accentHover },
        pressed && !atual && { backgroundColor: theme.backgroundSelected },
      ]}>
      <View style={[styles.numero, { borderRightColor: atual ? theme.accentOn : theme.hairline }]}>
        <ThemedText type="rowTitle" style={[styles.numeroTexto, { color: cor }]}>
          {String(numero).padStart(2, '0')}
        </ThemedText>
      </View>

      <View style={styles.corpo}>
        <ThemedText type="rowTitle" style={{ color: cor }}>
          {titulo}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: atual ? theme.accentOn : theme.textSecondary }}
          numberOfLines={2}>
          {detalhe}
        </ThemedText>
      </View>

      <View style={styles.estado}>
        {/*
          O estado nunca é só a cor da linha: concluído traz a nota, em curso
          traz a seta e bloqueado traz a palavra.
        */}
        {status === 'concluido' && nota !== undefined && <Tag>{`${Math.round(nota * 100)}%`}</Tag>}
        {atual && (
          <ThemedText type="rowTitle" style={{ color: theme.accentOn }}>
            →
          </ThemedText>
        )}
        {bloqueado && <ThemedText type="small">Bloqueado</ThemedText>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
