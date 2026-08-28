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
- Variantes por plataforma usam o sufixo do Metro (`animated-icon.tsx` +
  `animated-icon.web.tsx`). Ao mudar o comportamento de um componente que tem
  variante `.web.tsx`, atualize as duas.
- O visual segue o sistema **Modernist** (importado do Claude Design): fundo
  bone, tinta #201e1d, um único vermelhão, Archivo em 400/600/800, grade
  visível, réguas de 2px e **raio zero em tudo**. Os tokens ficam em
  `src/constants/theme.ts` e chegam ao componente por `useTheme()`, nunca por
  `Colors` direto; claro e escuro são os dois chãos do mesmo sistema
  (`userInterfaceStyle: "automatic"`).
- O destaque tem TRÊS tokens com contratos de contraste distintos: `accent`
  (texto), `accentStrong` (preenchimento de controle com rótulo pequeno) e
  `accentDisplay` (pôster e réguas). Trocar um pelo outro quebra o WCAG AA sem
  parecer errado na tela — a tabela no topo de `theme.ts` diz qual vai onde.
- Ao mexer em cor, rode `npm run contraste`: ele lê os hex de `theme.ts` e
  confere todos os pares nos dois esquemas. Par novo na interface, linha nova
  na lista de `scripts/verifica-contraste.js`.
- Os componentes do sistema ficam em `src/components/ui/` (`Tela`, `Cabecalho`,
  `Button`, `Campo`, `Seg`, `Tag`, `Regua`, `Nota`, `Faixa`, `Barra*`,
  `LinhaModulo`, `LinhaLista`). Monte tela com eles em vez de repetir
  `StyleSheet` equivalente.
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
npm run contraste  # confere o contraste do tema nos dois esquemas
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
