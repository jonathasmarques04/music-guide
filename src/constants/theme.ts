/**
 * Tema do app: totalmente escuro (fundo preto, texto branco, detalhes em roxo).
 *
 * O app não oferece modo claro. Para garantir isso em todas as plataformas —
 * inclusive na web, onde o sistema do usuário poderia forçar o esquema claro —
 * `light` e `dark` apontam para a MESMA paleta. Assim nenhum caminho de código
 * consegue "vazar" um tema claro.
 *
 * Contraste verificado sobre o fundo preto (#000000), alvo WCAG 2.1 AA:
 *   text          #FFFFFF  21.0:1  (AAA)
 *   textSecondary #B0AABF   9.4:1  (AAA)
 *   textMuted     #7E7690   4.9:1  (AA — use só em texto de apoio)
 *   accent        #A78BFA   7.7:1  (AAA — roxo para texto e ícones)
 *   accentStrong  #7C3AED   3.7:1  (AA para componentes de UI; NÃO use como texto
 *                                   sobre preto — use como preenchimento com
 *                                   accentOn por cima, que dá 5.7:1)
 *   success       #4ADE80  11.9:1  (AAA)
 *   error         #F87171   7.6:1  (AAA)
 *
 * Verde e vermelho NUNCA aparecem sozinhos: acerto e erro sempre carregam
 * também um símbolo (✓ / ✕) e um rótulo em texto, porque cor sozinha exclui
 * quem tem daltonismo — e vermelho/verde é justamente o par pior.
 */

import '@/global.css';

import { Platform } from 'react-native';

const palette = {
  /** Fundo principal — preto puro, conforme o design do app. */
  background: '#000000',
  /** Superfície elevada (cards, campos de formulário). Preto com leve tom roxo. */
  backgroundElement: '#121016',
  /** Estado selecionado / ativo. */
  backgroundSelected: '#1E1826',

  /** Texto principal. */
  text: '#FFFFFF',
  /** Texto de apoio (descrições, legendas). */
  textSecondary: '#B0AABF',
  /** Texto terciário (placeholders). Não use para informação essencial. */
  textMuted: '#7E7690',

  /** Roxo para TEXTO e ÍCONES sobre o fundo escuro. */
  accent: '#A78BFA',
  /** Roxo de PREENCHIMENTO (botão primário, barra de progresso). */
  accentStrong: '#7C3AED',
  /** Cor do conteúdo por cima de `accentStrong`. */
  accentOn: '#FFFFFF',
  /** Superfície roxa discreta (badges, destaques sutis). */
  accentSurface: '#1A1024',

  /** Verde de acerto — texto, ícone e borda. */
  success: '#4ADE80',
  /** Superfície verde discreta, para o fundo do feedback de acerto. */
  successSurface: '#0B1F14',
  /** Vermelho de erro — texto, ícone e borda. */
  error: '#F87171',
  /** Superfície vermelha discreta, para o fundo do feedback de erro. */
  errorSurface: '#241315',

  /** Borda decorativa. Baixo contraste por design — nunca use sozinha para
   *  comunicar estado; para foco/seleção use `accent`. */
  border: '#2A2233',
} as const;

export const Colors = {
  light: palette,
  dark: palette,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Altura mínima de alvo de toque (WCAG 2.5.5 / iOS HIG). */
export const MinTouchTarget = 44;

/**
 * Espaço que a navegação inferior ocupa e o conteúdo precisa reservar no fim
 * das rolagens. Na web a barra é uma ilha flutuante (`app-tabs.web.tsx`):
 * 62px de altura mais os 24px que ela sobe do rodapé. Sem reservar isso, o
 * último item da lista fica atrás dela.
 */
export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 88 }) ?? 0;
export const MaxContentWidth = 800;
