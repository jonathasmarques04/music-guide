# musica

## Sobre o produto

App do nicho de **música**, voltado ao **ensino de teoria musical**.

Todo trabalho neste repositório deve ser avaliado sob essa ótica: as telas,
componentes e o vocabulário do código existem para ensinar teoria musical
(notas, intervalos, escalas, acordes, campo harmônico, leitura rítmica etc.)
a quem está aprendendo.

Implicações práticas ao escrever código aqui:

- Prefira nomes de domínio musical corretos e em termos consagrados
  (`interval`, `scale`, `chordQuality`, `keySignature`) em vez de nomes
  genéricos (`item`, `data`, `type`).
- Cuidado com a terminologia PT-BR vs. EN: o sistema de nomes de notas usado
  na UI (dó/ré/mi ou C/D/E) é uma decisão de produto — confirme antes de
  assumir um dos dois em texto visível ao usuário.
- Conteúdo didático precisa estar correto do ponto de vista teórico. Se uma
  regra musical estiver ambígua no pedido, pergunte em vez de inventar.

## Stack

- **Expo SDK 57** (`expo ~57.0.16`), React Native `0.86.2`, React `19.2.3`.
- **expo-router** com roteamento por arquivos; as rotas ficam em `src/app/`
  (entry point é `expo-router/entry`, definido no `package.json`).
- **TypeScript** em modo `strict`.
- Suporte a **iOS, Android e web** (`react-native-web`, `web.output: "static"`).

## Convenções

- Alias de import: `@/*` → `./src/*` e `@/assets/*` → `./assets/*`.
  Use `@/components/...`, não caminhos relativos longos.
- Arquivos são nomeados em **kebab-case** (`themed-text.tsx`,
  `use-color-scheme.ts`).
- Variantes por plataforma usam o sufixo do Metro: `app-tabs.tsx` +
  `app-tabs.web.tsx`. Ao mudar o comportamento de um componente que tem
  variante `.web.tsx`, atualize as duas.
- Estilo/tema centralizados em `src/constants/theme.ts` e
  `src/hooks/use-theme.ts`; siga o esquema claro/escuro
  (`userInterfaceStyle: "automatic"`).
- `experiments` ligados no `app.json`: **typedRoutes** (rotas tipadas — links
  inválidos viram erro de tipo) e **reactCompiler** (não adicione `useMemo` /
  `useCallback` só por performance; o compilador cuida disso).

## Comandos

```bash
npm start          # expo start
npm run ios        # expo start --ios
npm run android    # expo start --android
npm run web        # expo start --web
npx tsc --noEmit   # type-check
npx expo-doctor    # diagnóstico do projeto
```

## Notas de ambiente

- `expo-env.d.ts` é **gerado** (e está no `.gitignore`). Ele traz
  `/// <reference types="expo/types" />`, que declara os imports de CSS
  (`global.css`, `*.module.css`). Sem esse arquivo o `tsc` acusa
  "Cannot find module ... .css" — recrie-o em vez de mexer nos imports.
- `npm run lint` (`expo lint`) ainda **não está configurado**: não há `eslint`
  instalado nem `eslint.config.js`. A primeira execução de `npx expo lint`
  instala e configura.
- Ao adicionar dependências, use `npx expo install <pkg>` (não `npm install`)
  para respeitar as versões compatíveis com o SDK 57.
