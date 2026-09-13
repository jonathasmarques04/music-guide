import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { iniciais } from '@/lib/formato';

/** 40pt no cabeçalho das abas; 64pt no retrato do perfil. */
const TAMANHOS = {
  sm: { lado: 40, texto: 'rowTitle' },
  lg: { lado: 64, texto: 'subtitle' },
} as const;

export type AvatarProps = {
  nome: string;
  /** Endereço da foto no bucket, ou null para quem não subiu nenhuma. */
  avatarUrl: string | null;
  tamanho?: keyof typeof TAMANHOS;
  /** Estilo do quadrado — usado por quem o envolve num `Pressable`. */
  style?: StyleProp<ViewStyle>;
};

/**
 * O retrato do aluno: quadrado de contorno grosso, sem raio e sem máscara
 * redonda, porque o sistema não arredonda nada.
 *
 * As iniciais não são um "fallback" desenhado por cima na hora do erro — elas
 * são o CHÃO do quadrado, e a foto entra por cima. Isso resolve os três casos
 * com um só arranjo, sem spinner e sem quadrado vazio em nenhum instante:
 *
 * - sem foto cadastrada  -> nada entra por cima, ficam as iniciais;
 * - foto ainda chegando  -> as iniciais seguram o lugar até o `transition`;
 * - foto que falhou      -> `onError` tira a imagem e o chão reaparece.
 *
 * É decorativo para o leitor de tela: o nome de quem está logado sempre está
 * escrito ao lado, em texto, e quem envolve isto num botão põe o rótulo lá.
 */
export function Avatar({ nome, avatarUrl, tamanho = 'sm', style }: AvatarProps) {
  const theme = useTheme();
  const { lado, texto } = TAMANHOS[tamanho];

  /*
   * Uma URL que falhou não pode ser tentada de novo a cada repintura — e o
   * estado tem de zerar quando a URL muda, senão trocar a foto depois de um
   * erro mostraria as iniciais para sempre. Daí a chave junto do sinalizador.
   */
  const [falhou, setFalhou] = useState<string | null>(null);
  const mostrarFoto = !!avatarUrl && falhou !== avatarUrl;

  return (
    <View
      style={[
        styles.quadrado,
        { width: lado, height: lado, borderColor: theme.text },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <ThemedText type={texto}>{iniciais(nome)}</ThemedText>

      {mostrarFoto && (
        <Image
          source={{ uri: avatarUrl }}
          /*
           * Fundo próprio, e não transparente: uma foto com canal alfa (um PNG
           * recortado, por exemplo) deixaria as iniciais de baixo aparecerem
           * através dela. A camada de cima tem de ser opaca.
           */
          style={[styles.foto, { backgroundColor: theme.backgroundElement }]}
          contentFit="cover"
          transition={200}
          onError={() => setFalhou(avatarUrl)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  quadrado: {
    borderWidth: Rules.thick,
    borderRadius: Radius,
    alignItems: 'center',
    justifyContent: 'center',
    /* A foto é contida pelo quadrado — nada escapa do contorno. */
    overflow: 'hidden',
  },
  /* Por cima das iniciais, cobrindo o quadrado inteiro. */
  foto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

/**
 * O respiro entre o avatar e o texto do cabeçalho, para as telas de aba
 * montarem o mesmo topo sem recopiar a medida.
 */
export const EspacoAvatar = Spacing.three;
