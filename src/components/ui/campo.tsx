import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, MinTouchTarget, Radius, Rules, Spacing } from '@/constants/theme';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';

export type CampoProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  /** Texto de apoio abaixo do campo — dica de formato ou motivo da recusa. */
  ajuda?: string;
  /**
   * Marca o campo como inválido. Muda o contorno para o destaque **e** faz a
   * ajuda virar mensagem de erro com ✕ — nunca só a cor.
   */
  invalido?: boolean;
  /**
   * O botão de revelar o que está mascarado. Liga sozinho junto com
   * `secureTextEntry`, porque a pergunta "foi isso mesmo que eu digitei?" vale
   * para todo campo mascarado — e deixar isso a cargo de quem chama garantiria
   * que um dia um campo de senha nasceria sem saída.
   *
   * Passe `false` para o caso raro em que revelar não pode acontecer.
   */
  revelavel?: boolean;
};

/**
 * Campo de texto do Modernist: superfície preenchida, contorno de 1px, canto
 * reto e rótulo em cima. O foco troca o contorno pelo destaque, que é o único
 * anel de foco do sistema.
 */
export function Campo({
  label,
  ajuda,
  invalido = false,
  style,
  secureTextEntry,
  revelavel,
  ...rest
}: CampoProps) {
  const theme = useTheme();
  const [focado, setFocado] = useState(false);
  const [revelada, setRevelada] = useState(false);

  const contorno = invalido || focado ? theme.accent : theme.border;
  const temBotao = (revelavel ?? !!secureTextEntry) && !!secureTextEntry;

  /*
   * A largura do botão é MEDIDA, não estimada: "Mostrar" e "Ocultar" não têm o
   * mesmo tamanho, e o aluno que aumenta a fonte do sistema estica os dois.
   * Com um respiro fixo, o texto da senha correria por baixo do rótulo em
   * algum desses casos.
   */
  const [larguraBotao, setLarguraBotao] = useState(0);

  return (
    <View style={styles.campo}>
      <ThemedText type="label">{label}</ThemedText>

      <View>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={ajuda}
          aria-invalid={invalido}
          placeholderTextColor={theme.textMuted}
          selectionColor={theme.accentStrong}
          secureTextEntry={secureTextEntry && !revelada}
          onFocus={(e) => {
            setFocado(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundElement,
              color: theme.text,
              borderColor: contorno,
              // O foco engrossa a borda: quem não distingue a cor ainda vê onde está.
              borderWidth: focado || invalido ? Rules.thick : Rules.hair,
            },
            temBotao && larguraBotao > 0 && { paddingRight: larguraBotao + Spacing.two },
            style,
          ]}
          {...rest}
        />

        {temBotao && (
          <BotaoRevelar
            revelada={revelada}
            onToggle={() => setRevelada((atual) => !atual)}
            onLayout={setLarguraBotao}
          />
        )}
      </View>

      {ajuda && (
        <ThemedText
          type="small"
          themeColor={invalido ? 'accent' : 'textMuted'}
          accessibilityLiveRegion={invalido ? 'polite' : 'none'}>
          {invalido ? `✕ ${ajuda}` : ajuda}
        </ThemedText>
      )}
    </View>
  );
}

/**
 * O rótulo que troca a máscara por texto legível.
 *
 * É PALAVRA, não um olho: o sistema não tem ícones, e um desenho de olho é
 * justamente o caso em que ninguém concorda se o risco em cima significa
 * "está escondido" ou "clique para esconder". "Mostrar" e "Ocultar" dizem o
 * que o toque vai fazer, e é isso que o leitor de tela também anuncia.
 */
function BotaoRevelar({
  revelada,
  onToggle,
  onLayout,
}: {
  revelada: boolean;
  onToggle: () => void;
  onLayout: (largura: number) => void;
}) {
  const theme = useTheme();
  const ponteiro = useHover();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={revelada ? 'Ocultar a senha' : 'Mostrar a senha'}
      accessibilityHint={
        revelada ? 'Volta a mascarar o que você digitou' : 'Exibe em texto o que você digitou'
      }
      accessibilityState={{ selected: revelada }}
      onPress={onToggle}
      // O alvo visual é do tamanho do rótulo; o de toque chega aos 44pt por aqui.
      hitSlop={Spacing.two + Spacing.one}
      onLayout={(e) => onLayout(e.nativeEvent.layout.width)}
      {...ponteiro.props}
      style={[styles.revelar, ponteiro.hover && { opacity: 0.7 }]}>
      <ThemedText type="smallBold" themeColor="accent">
        {revelada ? 'Ocultar' : 'Mostrar'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  campo: { gap: Spacing.one + Spacing.half },
  /*
   * Colado à direita e centrado na altura do campo. `position: absolute` e não
   * uma linha em `flexDirection: row` para o botão não empurrar a caixa: o
   * contorno do campo tem de continuar sendo um retângulo inteiro.
   */
  revelar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: Spacing.two + Spacing.one,
  },
  input: {
    minHeight: MinTouchTarget,
    borderRadius: Radius,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two,
    fontFamily: Fonts.regular,
    fontSize: 15,
  },
});
