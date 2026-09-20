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
   * Marca o campo como aceito. Põe ✓ na linha de ajuda e **não** mexe no
   * contorno: acerto é o estado esperado, não um alarme. Ignorado quando
   * `invalido` está ligado — a recusa fala mais alto.
   */
  valido?: boolean;
  /**
   * Reserva a linha de ajuda mesmo quando não há mensagem.
   *
   * Sem isso, a validação que aparece depois do primeiro `blur` empurra tudo
   * o que vem abaixo — num formulário, empurra justamente o botão para onde o
   * dedo já estava indo. Ligue em formulário; deixe desligado onde o campo é
   * avulso e a reserva só abriria um vão.
   */
  reservarAjuda?: boolean;
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
 *
 * Os estados visíveis, e o que separa cada um:
 *
 * | estado       | contorno              | rótulo   | linha de ajuda |
 * |--------------|-----------------------|----------|----------------|
 * | repouso      | 1px `border`          | neutro   | a dica         |
 * | foco         | 2px `accent`          | destaque | a dica         |
 * | inválido     | 2px `accent`          | neutro   | ✕ o motivo     |
 * | aceito       | 1px `border`          | neutro   | ✓ a dica       |
 * | desabilitado | 1px `border`, apagado | neutro   | a dica         |
 *
 * **Não há estado de ponteiro.** `onHoverIn`/`onHoverOut` são props de
 * `Pressable`, e o que envolve o `TextInput` é uma `View` — num `View` eles
 * são ignorados em silêncio, nas três plataformas. Um realce de hover aqui
 * também não carregaria informação nenhuma: o foco é que diz onde o texto vai
 * cair, e ele já se anuncia por cor, espessura e rótulo. Quem tem hover de
 * verdade é o botão "Mostrar", que é um `Pressable`.
 */
export function Campo({
  label,
  ajuda,
  invalido = false,
  valido = false,
  reservarAjuda = false,
  style,
  secureTextEntry,
  revelavel,
  ...rest
}: CampoProps) {
  const theme = useTheme();
  const [focado, setFocado] = useState(false);
  const [revelada, setRevelada] = useState(false);

  const desabilitado = rest.editable === false;
  const contorno = invalido || focado ? theme.accent : theme.border;
  const temBotao = (revelavel ?? !!secureTextEntry) && !!secureTextEntry;

  /*
   * A largura do botão é MEDIDA, não estimada: "Mostrar" e "Ocultar" não têm o
   * mesmo tamanho, e o aluno que aumenta a fonte do sistema estica os dois.
   * Com um respiro fixo, o texto da senha correria por baixo do rótulo em
   * algum desses casos.
   */
  const [larguraBotao, setLarguraBotao] = useState(0);

  /* ✕ recusa, ✓ aceita. O símbolo vem antes da cor — ver `theme.ts`. */
  const marca = invalido ? '✕ ' : valido && ajuda ? '✓ ' : '';
  const mostrarAjuda = !!ajuda || reservarAjuda;

  return (
    <View style={styles.campo}>
      {/*
        O rótulo acende junto com o contorno. É a única peça que reage ao foco
        além do próprio campo, e serve a quem usa lupa: com a tela ampliada, o
        contorno pode estar fora da vista e o rótulo não.
      */}
      <ThemedText type="label" themeColor={focado ? 'accent' : 'textMuted'}>
        {label}
      </ThemedText>

      <View>
        <TextInput
          /*
           * `rest` vem PRIMEIRO, ao contrário de `style`.
           *
           * `onFocus` e `onBlur` são de quem chama E do componente: o
           * consumidor quer saber que o campo foi visitado, e o campo precisa
           * saber que está aceso. Espalhando `rest` por último, o handler de
           * fora silenciava o de dentro e o contorno de foco ficava preso —
           * um campo que nunca apaga.
           */
          {...rest}
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
            desabilitado && styles.desabilitado,
            temBotao && larguraBotao > 0 && { paddingRight: larguraBotao + Spacing.two },
            style,
          ]}
        />

        {temBotao && (
          <BotaoRevelar
            revelada={revelada}
            onToggle={() => setRevelada((atual) => !atual)}
            onLayout={setLarguraBotao}
          />
        )}
      </View>

      {mostrarAjuda && (
        <ThemedText
          type="small"
          themeColor={invalido ? 'accent' : 'textMuted'}
          /*
           * A linha existe mesmo vazia quando `reservarAjuda` está ligado: é o
           * que impede o botão de baixo de pular no instante da validação.
           */
          style={reservarAjuda ? styles.linhaReservada : undefined}
          accessibilityLiveRegion={invalido ? 'polite' : 'none'}>
          {ajuda ? `${marca}${ajuda}` : ' '}
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
      style={({ pressed }) => [
        styles.revelar,
        ponteiro.hover && { backgroundColor: theme.backgroundSelected },
        pressed && { backgroundColor: theme.accentSurface },
      ]}>
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
   *
   * O recuo de 2px em cada lado é a espessura da borda no foco: sem ele, o
   * realce do botão cobriria o próprio contorno do campo.
   */
  revelar: {
    position: 'absolute',
    right: Rules.thick,
    top: Rules.thick,
    bottom: Rules.thick,
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
  desabilitado: { opacity: 0.45 },
  /* A altura de uma linha de `small` (lineHeight 19) — ver `themed-text.tsx`. */
  linhaReservada: { minHeight: 19 },
});
