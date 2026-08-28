import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Regua } from '@/components/ui/regua';
import { Spacing } from '@/constants/theme';

export type CabecalhoProps = {
  titulo: string;
  /** Versalete de destaque acima do título: "Módulo 05", "Checkout", "Ajuda". */
  kicker?: string;
  /** Nome da tela anterior — vira o rótulo do voltar ("← Trilha"). */
  voltar?: string;
  /** Régua de 2px fechando o cabeçalho. */
  regua?: boolean;
  /** Ação à direita do título (um botão de texto, normalmente). */
  acao?: React.ReactNode;
};

/**
 * O cabeçalho de tela: voltar rente à esquerda, versalete, título em 800 e a
 * régua que separa o cabeçalho do conteúdo. Tudo alinhado no mesmo eixo — o
 * sistema não centraliza nada.
 */
export function Cabecalho({ titulo, kicker, voltar, regua = true, acao }: CabecalhoProps) {
  const router = useRouter();

  return (
    <View style={styles.bloco}>
      {voltar && (
        <Button
          variant="ghost"
          size="sm"
          accessibilityHint={`Volta para ${voltar}`}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
          {`← ${voltar}`}
        </Button>
      )}

      <View style={styles.linha}>
        <View style={styles.textos}>
          {kicker && <ThemedText type="kicker">{kicker}</ThemedText>}
          <ThemedText
            type={titulo.length > 22 ? 'subtitle' : 'title'}
            accessibilityRole="header">
            {titulo}
          </ThemedText>
        </View>
        {acao}
      </View>

      {regua && <Regua style={styles.regua} />}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: Spacing.two },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  textos: { flexShrink: 1, gap: Spacing.one + Spacing.half },
  regua: { marginTop: Spacing.one },
});
