import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Radius, Rules, Spacing } from '@/constants/theme';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';

export type OpcaoSeg<T extends string> = { valor: T; rotulo: string };

export type SegProps<T extends string> = {
  /** Rótulo do grupo para o leitor de tela — ele não vê o `label` acima. */
  legenda: string;
  opcoes: readonly OpcaoSeg<T>[];
  valor: T;
  onChange: (valor: T) => void;
};

/**
 * Controle segmentado: uma caixa de contorno único, opções divididas por fios
 * de 1px e a escolhida preenchida com o destaque. Sem raio, como tudo aqui.
 *
 * A escolha é anunciada por `accessibilityState.selected`, não só pelo
 * preenchimento — quem não distingue o vermelhão ainda sabe onde está.
 */
export function Seg<T extends string>({ legenda, opcoes, valor, onChange }: SegProps<T>) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={legenda}
      style={[styles.caixa, { borderColor: theme.border }]}>
      {opcoes.map((opcao, i) => (
        <Opcao
          key={opcao.valor}
          opcao={opcao}
          primeira={i === 0}
          ativa={opcao.valor === valor}
          onPress={() => onChange(opcao.valor)}
        />
      ))}
    </View>
  );
}

/*
 * Cada opção é um componente próprio porque o hover é estado, e estado não pode
 * morar dentro de um `map`.
 */
function Opcao({
  opcao,
  primeira,
  ativa,
  onPress,
}: {
  opcao: { valor: string; rotulo: string };
  primeira: boolean;
  ativa: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const ponteiro = useHover();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: ativa, selected: ativa }}
      onPress={onPress}
      {...ponteiro.props}
      style={({ pressed }) => [
        styles.opcao,
        !primeira && { borderLeftWidth: Rules.hair, borderLeftColor: theme.border },
        ativa && { backgroundColor: theme.accentStrong },
        ponteiro.hover && !ativa && { backgroundColor: theme.backgroundElement },
        ponteiro.hover && ativa && { backgroundColor: theme.accentHover },
        pressed && !ativa && { backgroundColor: theme.backgroundSelected },
      ]}>
      <ThemedText type="smallBold" style={{ color: ativa ? theme.accentOn : theme.textSecondary }}>
        {opcao.rotulo}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    borderWidth: Rules.hair,
    borderRadius: Radius,
    overflow: 'hidden',
  },
  opcao: {
    flex: 1,
    minHeight: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
});
