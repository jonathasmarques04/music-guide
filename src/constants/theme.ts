/**
 * Tema do app — sistema **Modernist**.
 *
 * Plano, arquitetônico e inteiro em Archivo: fundo claro, tinta quase preta,
 * um único vermelhão de destaque, grade visível, réguas fortes de 2px e
 * **raio zero em tudo**. Nada flutua e nada é decorado — o alinhamento e a
 * força dos divisores fazem toda a organização.
 *
 * O app segue o esquema do sistema (`userInterfaceStyle: "automatic"`):
 * `light` é a paleta do design; `dark` é a mesma linguagem com o chão
 * invertido — mesma tinta, mesmo vermelhão, mesmos papéis.
 *
 * ## Os três níveis do destaque
 *
 * O vermelhão #ec3013 sobre o fundo claro dá apenas **3,76:1**. Isso basta
 * para ícone, chrome e texto grande — **não** para texto de corpo nem para o
 * rótulo de um botão de 15px. Por isso o destaque se divide em três papéis
 * com contratos de contraste diferentes, e cada um só pode ser usado no seu:
 *
 * | token           | claro     | para que serve                                  |
 * |-----------------|-----------|-------------------------------------------------|
 * | `accent`        | `#ae1800` | TEXTO e ícone em destaque sobre o fundo (6,4:1) |
 * | `accentStrong`  | `#c62410` | PREENCHIMENTO de controle com rótulo pequeno    |
 * |                 |           | (botão, tag, aba ativa) — rótulo dá 5,1:1       |
 * | `accentDisplay` | `#ec3013` | o vermelhão de pôster: blocos de tipografia     |
 * |                 |           | grande e réguas de destaque. NUNCA com rótulo   |
 * |                 |           | pequeno por cima, e nunca como preenchimento    |
 * |                 |           | que precise se destacar de um trilho.           |
 *
 * ## Certo e errado sem verde e vermelho
 *
 * O sistema é monocromático: não existe verde. Acerto e erro se distinguem
 * por **croma contra neutro** (destaque vs. tinta), não por matiz — o que é
 * mais seguro para daltonismo do que o par verde/vermelho. Ainda assim, cor
 * nunca vem sozinha: todo estado carrega também símbolo (✓ / ✕) e rótulo em
 * texto.
 *
 * Contrastes verificados nos DOIS temas contra WCAG 2.1 AA (4,5:1 para texto
 * normal, 3:1 para texto grande e componentes de interface).
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * Chão claro — a paleta do design.
 *
 * As cinzas derivadas (`textSecondary`, `border`, `divider`, `hairline`) são
 * a tinta #201e1d achatada sobre o fundo em 72%, 52%, 40% e 18%. Ficam aqui
 * já resolvidas, e não como translucidez, porque React Native não compõe cor
 * com alfa contra o que estiver atrás — o mesmo `rgba` sobre uma superfície
 * diferente muda de contraste sem avisar.
 */
const claro = {
  /** Chão do app — o "bone" do sistema. */
  background: '#f3f2f2',
  /** Superfície preenchida: campo de formulário, bloco de nota, célula de tabela. */
  backgroundElement: '#eae9e9',
  /** Estado pressionado / linha selecionada. */
  backgroundSelected: '#dedcdc',

  /** Tinta. Texto principal e as réguas mais fortes. */
  text: '#201e1d',
  /** Texto de apoio: descrições, legendas, corpo secundário. */
  textSecondary: '#5b5959',
  /** Texto terciário: rótulos versaletes, metadados. Nunca informação essencial. */
  textMuted: '#6b6969',

  /** Destaque para TEXTO e ícone (ver tabela acima). */
  accent: '#ae1800',
  /** Destaque de PREENCHIMENTO de controle com rótulo pequeno. */
  accentStrong: '#c62410',
  /** Um passo da rampa adiante de `accentStrong`: o preenchimento sob o ponteiro. */
  accentHover: '#ba1e08',
  /** Vermelhão de pôster: só tipografia grande e réguas de destaque. */
  accentDisplay: '#ec3013',
  /** Conteúdo por cima de `accentStrong` e `accentDisplay`. */
  accentOn: '#f3f2f2',
  /** Superfície tingida de destaque (tag, aviso). Use `accent` como texto nela. */
  accentSurface: '#fff2ef',

  /** Acerto — o destaque. Sempre acompanhado de ✓ e de rótulo em texto. */
  success: '#ae1800',
  successSurface: '#fff2ef',
  /** Erro — a tinta neutra, com régua de destaque à esquerda. Sempre com ✕. */
  error: '#201e1d',
  errorSurface: '#eae9e9',

  /** Contorno de controle (campo, botão secundário). Cumpre 3:1. */
  border: '#7d7b7b',
  /** Régua estrutural de 2px entre seções. Decorativa. */
  divider: '#9f9d9d',
  /** Fio de 1px entre linhas de uma lista. Decorativo. */
  hairline: '#cdcccc',

  /** Bloco invertido — o mais alto do sistema (placar, fórmula, cabeçalho de grade). */
  inverse: '#201e1d',
  /** Texto sobre `inverse`. */
  inverseOn: '#f3f2f2',
  /** Texto de apoio sobre `inverse` (o kicker dentro do bloco). */
  inverseMuted: '#b8b7b6',
} as const;

/**
 * Chão escuro — a mesma linguagem com o fundo invertido.
 *
 * O destaque sobe na rampa (o #ec3013 fica escuro demais para servir de texto
 * sobre a tinta): `accent` vira o passo 400 e `accentStrong` o 500, que aceita
 * a tinta como rótulo. `accentDisplay` continua o mesmo vermelhão — ele é o
 * pôster, e um pôster não muda de cor com a luz da sala.
 */
const escuro = {
  background: '#201e1d',
  backgroundElement: '#2d2b2b',
  backgroundSelected: '#444141',

  text: '#f3f2f2',
  textSecondary: '#b8b7b6',
  textMuted: '#949392',

  accent: '#ff9783',
  accentStrong: '#ff563c',
  /** No escuro a rampa sobe em vez de descer — o hover CLAREIA. */
  accentHover: '#ff7663',
  accentDisplay: '#ec3013',
  /** No escuro o rótulo por cima do preenchimento é a TINTA, não o bone. */
  accentOn: '#201e1d',
  accentSurface: '#4d170e',

  success: '#ff9783',
  successSurface: '#4d170e',
  error: '#f3f2f2',
  errorSurface: '#2d2b2b',

  border: '#7d7979',
  divider: '#747372',
  hairline: '#464443',

  inverse: '#f3f2f2',
  inverseOn: '#201e1d',
  inverseMuted: '#5b5959',
} as const;

export const Colors = {
  light: claro,
  dark: escuro,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Archivo em três pesos — 400 corpo, 600 rótulo, 800 título.
 *
 * No nativo `fontWeight` não escolhe entre famílias carregadas separadamente:
 * cada peso é uma família própria e precisa ir em `fontFamily`. Quem resolve
 * essa escolha é `ThemedText`; nenhum outro componente deve montar isso na mão.
 *
 * As fontes são carregadas em `app/_layout.tsx`. Antes disso o texto sai na
 * fonte do sistema — por isso `fontWeight` continua acompanhando cada estilo,
 * como reserva para o primeiro quadro e para a web antes da hidratação.
 */
export const Fonts = {
  regular: 'Archivo_400Regular',
  semibold: 'Archivo_600SemiBold',
  extrabold: 'Archivo_800ExtraBold',
  mono:
    Platform.select({
      ios: 'ui-monospace',
      android: 'monospace',
      web: 'var(--font-mono)',
      default: 'monospace',
    }) ?? 'monospace',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/**
 * Raio zero em tudo — é a regra número um do sistema. Existe como token, e não
 * como `0` solto, para que trocar de sistema de design seja um lugar só.
 */
export const Radius = 0;

/**
 * As duas espessuras de régua do Modernist. A grossa separa seções; o fio
 * separa linhas de uma mesma lista. O sistema não admite uma terceira.
 */
export const Rules = {
  /** Régua estrutural entre seções. Cor: `divider`. */
  thick: 2,
  /** Fio entre itens de lista. Cor: `hairline`. */
  hair: 1,
} as const;

/**
 * Movimento.
 *
 * O Modernist não decora — e isso vale para a animação. Nada aqui existe por
 * capricho: o movimento tem função. O toque afunda para dizer que foi
 * registrado; a barra corre até o novo valor em vez de já aparecer nele; o
 * card gira com o peso de uma carta virando de verdade.
 *
 * Tudo curto e sem quique decorativo. Uma interface que faz o aluno esperar a
 * animação acabar é mais lenta que uma sem animação nenhuma.
 *
 * Todo consumidor destes tokens precisa checar `useReducedMotion()` e cair
 * para a troca instantânea — movimento é reforço, nunca o único sinal.
 */
export const Motion = {
  /** Reação ao toque: rígida e quase sem oscilação, para parecer instantânea. */
  toque: { damping: 20, stiffness: 400, mass: 0.5 },
  /** Quanto o alvo encolhe enquanto está pressionado. */
  escalaToque: 0.97,
  /** Valor mudando na tela: barra de progresso, contador de placar. */
  valor: { duration: 520 },
  /** O giro do flashcard — o gesto mais marcante do app, e o único com peso. */
  giro: { damping: 14, stiffness: 100, mass: 0.9 },
} as const;

/** Altura mínima de alvo de toque (WCAG 2.5.5 / iOS HIG). */
export const MinTouchTarget = 44;

/**
 * Largura máxima da coluna de leitura. No celular a tela é mais estreita que
 * isso; no tablet e na web é ela que impede a linha de texto de esticar.
 *
 * Não existe um `BottomTabInset`: a barra de abas do Modernist é uma faixa
 * chapada **no fluxo** (`app-tabs.tsx`), não uma ilha flutuante, então o
 * conteúdo não precisa reservar espaço no fim da rolagem.
 */
export const MaxContentWidth = 800;
