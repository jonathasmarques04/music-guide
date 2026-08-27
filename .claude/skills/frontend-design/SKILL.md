---
name: frontend-design
description: Use ao criar ou revisar qualquer UI deste app — componentes, telas, tokens de tema, modo escuro ou acessibilidade. Garante design distintivo, tokens em vez de valores fixos, variantes bem tipadas e conformidade WCAG AA adaptada a React Native/Expo.
---

# Frontend Design — musica (React Native / Expo)

Você é um especialista em frontend de produto: interfaces distintivas, acessíveis
e prontas para produção. Este app é **React Native + Expo (SDK 57)** rodando em
iOS, Android e web via `react-native-web`.

> **Não existe DOM aqui.** Nada de `<div>`, `<button>`, CSS custom properties,
> `outline`, `:hover` ou `prefers-color-scheme` no código nativo. O equivalente
> de cada um está mapeado abaixo. CSS só entra em arquivos `.web.tsx` /
> `global.css`.

## Antes de começar

Se o pedido for ambíguo, confirme apenas o que muda o resultado:

1. É componente novo, tela nova ou ajuste em algo existente?
2. Precisa de variante web (`.web.tsx`) ou só nativo?
3. Envolve áudio/notação musical? (muda os requisitos de acessibilidade)

Não pergunte o framework nem o alvo WCAG: é sempre React Native/Expo e o alvo
padrão deste projeto é **WCAG 2.1 AA**.

## 1. Tokens — use os que já existem

O projeto já tem um sistema de tokens em `src/constants/theme.ts`.
**Nunca escreva valor fixo** de cor ou espaçamento; importe o token.

| Token | Onde | Valores |
|---|---|---|
| `Colors.light` / `Colors.dark` | `theme.ts` | `text`, `textSecondary`, `background`, `backgroundElement`, `backgroundSelected` |
| `Spacing` | `theme.ts` | `half:2`, `one:4`, `two:8`, `three:16`, `four:24`, `five:32`, `six:64` |
| `Fonts` | `theme.ts` | `sans`, `serif`, `rounded`, `mono` (via `Platform.select`) |
| `MaxContentWidth`, `BottomTabInset` | `theme.ts` | layout |

Cor sempre pelo hook, nunca lendo `Colors` direto no componente:

```tsx
import { useTheme } from '@/hooks/use-theme';

const theme = useTheme();          // já resolve claro/escuro
<View style={{ backgroundColor: theme.backgroundElement }} />
```

**Ao precisar de uma cor nova**: adicione a chave nos **dois** temas de `Colors`
(o tipo `ThemeColor` é a interseção de `light` e `dark` — esquecer um lado quebra
o type-check). Nomeie por propósito (`backgroundDanger`), não por aparência
(`vermelho`). Só suba para um terceiro nível de token (por componente) se a cor
tiver comportamento próprio; caso contrário vira indireção à toa.

Há um valor fixo herdado do template em `themed-text.tsx` (`linkPrimary: '#3c87f7'`).
Se mexer nele, promova para `Colors` nos dois temas.

## 2. Componentes — variantes, não explosão de props

Siga o padrão já estabelecido em `src/components/themed-text.tsx`: uma prop
`type`/`variant` com união de strings.

```tsx
// BOM
type ButtonProps = { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg' };

// EVITE
type ButtonProps = { isPrimary?: boolean; isGhost?: boolean; isSmall?: boolean };
```

Regras do projeto:

- Estilos em `StyleSheet.create` fora do componente; só o que depende do tema
  fica inline no array de `style`.
- `style` do consumidor vem **por último** no array, para permitir override.
- Interação com `Pressable` (não `TouchableOpacity`), usando o callback
  `style={({ pressed }) => ...}` para o estado pressionado.
- **reactCompiler está ligado**: não adicione `useMemo`/`useCallback` por
  performance.
- Se o componente tem par `.web.tsx`, altere os dois arquivos juntos.

## 3. Acessibilidade — o mapa RN (WCAG AA)

Não existe ARIA nativo. Traduções obrigatórias:

| Web | React Native |
|---|---|
| `<button>` | `<Pressable accessibilityRole="button">` |
| `aria-label` | `accessibilityLabel` |
| `aria-describedby` | `accessibilityHint` |
| `aria-disabled` / `aria-busy` / `aria-expanded` / `aria-checked` | `accessibilityState={{ disabled, busy, expanded, checked }}` |
| `aria-live` | `accessibilityLiveRegion` (Android) + `AccessibilityInfo.announceForAccessibility` |
| `alt=""` (decorativo) | `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"` |
| `:focus-visible` | não existe no nativo — **só no `.web.tsx`** |

Checklist para todo elemento interativo:

- [ ] `accessibilityRole` correto (`button`, `link`, `header`, `image`, `adjustable`).
- [ ] Rótulo acessível: texto visível ou `accessibilityLabel`. Ícone sozinho
      **sempre** precisa de `accessibilityLabel`.
- [ ] Alvo de toque **mínimo 44×44pt**. Se o visual for menor, use `hitSlop` —
      não aumente o padding só por isso.
- [ ] Estado dinâmico refletido em `accessibilityState`, não só na cor.
- [ ] Contraste **4.5:1** para texto normal e **3:1** para texto grande
      (≥18pt bold / ≥24pt) e para elementos de UI — verificado **nos dois temas**.
- [ ] Não desative `allowFontScaling`. Se o layout quebrar com fonte grande,
      conserte o layout; no máximo limite com `maxFontSizeMultiplier`.
- [ ] Animações (Reanimated) respeitam `AccessibilityInfo.isReduceMotionEnabled()`.

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Tocar intervalo novamente"
  accessibilityState={{ disabled: isLoading, busy: isLoading }}
  hitSlop={8}
  disabled={isLoading}
  onPress={play}
/>
```

## 4. Acessibilidade específica de teoria musical

Este app ensina teoria musical (ver `CLAUDE.md`), o que cria requisitos que um
app comum não tem:

- **Nunca use só cor** para marcar nota certa/errada, graus do campo harmônico ou
  notas ativas no teclado/braço. Some ícone, texto, forma ou posição — daltonismo
  é comum e vermelho/verde é justamente o par pior.
- **Todo exercício de ouvido precisa de alternativa não-auditiva** (partitura,
  cifra ou nome da nota), senão fica inacessível para surdos e para quem está sem
  fone. Áudio nunca é o único canal de informação.
- **Notação não é lida por leitor de tela.** Pentagrama, cifra e teclado
  renderizados como desenho precisam de `accessibilityLabel` com o nome por
  extenso: `"dó sustenido, terceira oitava"` — não `"C#3"`, que o leitor
  soletra errado.
- **Áudio nunca começa sozinho.** Reprodução só por ação do usuário.

## 5. Modo escuro

Já resolvido: `useColorScheme()` → `useTheme()` → `Colors[scheme]`, com
`userInterfaceStyle: "automatic"` no `app.json`. Para uma UI nova, basta usar
`useTheme()`. Valide contraste **nos dois temas** — o par que passa no claro
frequentemente falha no escuro.

## 6. Design distintivo (evite o visual "genérico de IA")

Qualidade AA é o piso, não o objetivo. Um app de teoria musical deve parecer um
instrumento, não um dashboard:

- Faça uma escolha tipográfica deliberada. `Fonts.rounded` e `Fonts.serif` já
  estão disponíveis e quase nunca são usados — hierarquia forte entre título e
  corpo vale mais que mil sombras.
- Use a escala `Spacing` inteira. Layout genérico é aquele com espaçamento todo
  igual; ritmo vem do contraste entre `two` e `five`.
- Prefira um gesto marcante e bem-feito (o feedback ao acertar um intervalo) a
  cinco animações decorativas.
- Cor de destaque com intenção. O tema atual é quase monocromático — isso é uma
  força; introduza cor onde ela **significa** algo.

## 7. Antes de entregar

```bash
npx tsc --noEmit    # obrigatório
```

Confira ainda: testado nos dois temas; nenhum valor fixo de cor/espaçamento;
alvos de toque ≥44pt; e o par `.web.tsx` atualizado, se existir.

> **Storybook não está instalado** neste projeto. Não gere `*.stories.tsx`
> presumindo que ele existe — se quiser documentação de componente, use
> comentários TSDoc com exemplos de uso, ou proponha instalar o Storybook antes.
