import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type TelaProps = {
  children: ReactNode;
  /**
   * Deixe `false` quando a tela já controla a própria altura — o baralho de
   * flashcards, por exemplo, ocupa a tela inteira e não rola.
   */
  rolar?: boolean;
  /**
   * Tira o respiro lateral: usado pelas telas cujas listas sangram até a
   * borda, com as réguas atravessando a tela de ponta a ponta.
   */
  semMargem?: boolean;
  espaco?: number;
  style?: ViewStyle;
};

/**
 * O andaime de toda tela: fundo do tema, área segura, largura máxima de
 * leitura e o respiro lateral padrão.
 *
 * Existe para que nenhuma tela precise repetir esse arranjo — e para que a
 * medida da coluna de texto seja a mesma em todas.
 */
export function Tela({
  children,
  rolar = true,
  semMargem = false,
  espaco = Spacing.three,
  style,
}: TelaProps) {
  const corpo = (
    <View
      style={[
        styles.coluna,
        { gap: espaco },
        !semMargem && styles.comMargem,
        style,
      ]}>
      {children}
    </View>
  );

  return (
    <ThemedView style={styles.raiz}>
      <SafeAreaView style={styles.raiz} edges={['top', 'left', 'right']}>
        {rolar ? (
          <ScrollView
            contentContainerStyle={styles.rolagem}
            keyboardShouldPersistTaps="handled">
            {corpo}
          </ScrollView>
        ) : (
          <View style={[styles.rolagem, styles.raiz]}>{corpo}</View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  rolagem: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  coluna: {
    width: '100%',
    maxWidth: MaxContentWidth,
    /*
     * `flexGrow` e não `flex`: a coluna precisa esticar até o fim da tela para
     * que um `marginTop: 'auto'` empurre a ação principal para baixo — mas
     * `flex: 1` também zeraria a base e espremeria o conteúdo alto.
     */
    flexGrow: 1,
  },
  comMargem: { paddingHorizontal: Spacing.three },
});
