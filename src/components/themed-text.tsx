import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * A escala tipográfica do Modernist, inteira em Archivo e em três pesos:
 * 400 para corpo, 600 para rótulo, 800 para título. Nada no meio.
 *
 * | tipo        | peso | tamanho | onde                                      |
 * |-------------|------|---------|-------------------------------------------|
 * | `display`   | 800  | 34      | a frase de abertura de uma tela           |
 * | `title`     | 800  | 26      | título de tela                            |
 * | `subtitle`  | 800  | 22      | título de tela quando o texto é longo     |
 * | `heading`   | 800  | 19      | título de seção dentro da tela            |
 * | `numero`    | 800  | 22      | placar e estatística (aumente o tamanho)  |
 * | `default`   | 400  | 15      | corpo                                     |
 * | `rowTitle`  | 600  | 14      | título de linha de lista                  |
 * | `small`     | 400  | 13      | corpo secundário, legenda                 |
 * | `smallBold` | 600  | 13      | ênfase dentro do corpo secundário         |
 * | `kicker`    | 600  | 10      | versalete de destaque, acima do título    |
 * | `label`     | 600  | 11      | versalete neutro, rotulando um bloco      |
 * | `code`      | 400  | 14      | cifra, fórmula e grade de notas           |
 * | `link`      | 600  | 14      | rótulo de ação em texto                   |
 *
 * `kicker` e `label` já vêm coloridos (destaque e neutro) porque é assim que
 * eles existem no sistema; qualquer outro tipo herda `text` e aceita
 * `themeColor` para mudar.
 */
export type TipoTexto =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'heading'
  | 'numero'
  | 'default'
  | 'rowTitle'
  | 'small'
  | 'smallBold'
  | 'kicker'
  | 'label'
  | 'code'
  | 'link';

export type ThemedTextProps = TextProps & {
  type?: TipoTexto;
  themeColor?: ThemeColor;
};

/** Cor própria de cada tipo, quando ele tem uma. O resto herda `text`. */
const CorDoTipo: Partial<Record<TipoTexto, ThemeColor>> = {
  kicker: 'accent',
  label: 'textMuted',
  small: 'textSecondary',
  link: 'accent',
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const cor = theme[themeColor ?? CorDoTipo[type] ?? 'text'];

  return <Text style={[{ color: cor }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Fonts.extrabold,
    fontWeight: '800',
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: -0.7,
  },
  title: {
    fontFamily: Fonts.extrabold,
    fontWeight: '800',
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.extrabold,
    fontWeight: '800',
    fontSize: 22,
    lineHeight: 25,
    letterSpacing: -0.4,
  },
  heading: {
    fontFamily: Fonts.extrabold,
    fontWeight: '800',
    fontSize: 19,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  numero: {
    fontFamily: Fonts.extrabold,
    fontWeight: '800',
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  default: {
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
  },
  rowTitle: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
  },
  small: {
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 19,
  },
  smallBold: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 19,
  },
  /*
   * `letterSpacing` em React Native é em pontos, não em em: os 0.12em do
   * design viram 1.2pt sobre os 10px do versalete.
   */
  kicker: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
  },
  link: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
  },
});
