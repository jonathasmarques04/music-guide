import { useRouter, type Href } from 'expo-router';
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
  /**
   * Para onde o voltar leva — o destino que `voltar` nomeia.
   *
   * O rótulo promete um lugar, então a ação vai a esse lugar em vez de
   * desempilhar o histórico. Sem isso o voltar mente: quem chega ao módulo
   * saindo da aula tem a aula no topo da pilha, e um `back()` cego reabriria
   * justamente a aula. `dismissTo` volta ao destino quando ele já está na
   * pilha e o substitui quando não está — nos dois casos sem empilhar mais
   * uma tela.
   */
  destino?: Href;
  /** Régua de 2px fechando o cabeçalho. */
  regua?: boolean;
};

/**
 * O cabeçalho de tela: voltar rente à esquerda, versalete, título em 800 e a
 * régua que separa o cabeçalho do conteúdo. Tudo alinhado no mesmo eixo — o
 * sistema não centraliza nada.
 */
export function Cabecalho({ titulo, kicker, voltar, destino, regua = true }: CabecalhoProps) {
  const router = useRouter();

  return (
    <View style={styles.bloco}>
      {voltar && (
        <Button
          variant="ghost"
          size="sm"
          accessibilityHint={`Volta para ${voltar}`}
          onPress={() =>
            destino
              ? router.dismissTo(destino)
              : router.canGoBack()
                ? router.back()
                : router.replace('/')
          }>
          {`← ${voltar}`}
        </Button>
      )}

      <View style={styles.textos}>
        {kicker && <ThemedText type="kicker">{kicker}</ThemedText>}
        {/* Título longo cai um degrau na escala em vez de quebrar em três linhas. */}
        <ThemedText type={titulo.length > 22 ? 'subtitle' : 'title'} accessibilityRole="header">
          {titulo}
        </ThemedText>
      </View>

      {regua && <Regua style={styles.regua} />}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: Spacing.two },
  textos: { flexShrink: 1, gap: Spacing.one + Spacing.half },
  regua: { marginTop: Spacing.one },
});
