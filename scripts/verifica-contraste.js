/**
 * Verificador de contraste do tema.
 *
 * Lê os hex REAIS de `src/constants/theme.ts` e refaz a matriz dos pares que o
 * app de fato desenha, nos DOIS esquemas. Existe porque o Modernist anda no
 * limite: o vermelhão #ec3013 sobre o fundo bone dá 3,76:1, então trocar um
 * token por "um vermelho um pouco mais claro" quebra o AA sem que nada na tela
 * pareça errado.
 *
 * Ao criar um par novo de cores na interface, acrescente-o em `pares` — a lista
 * é o contrato, e o que não está nela não está verificado.
 *
 *   npm run contraste
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'constants', 'theme.ts'), 'utf8');

/** Extrai `const <nome> = { chave: '#hex', ... }` do arquivo de tema. */
function paleta(nome) {
  const bloco = src.split(`const ${nome} = {`)[1].split('} as const;')[0];
  const cores = {};
  for (const m of bloco.matchAll(/^\s*([A-Za-z]\w*): '(#[0-9a-f]{6})',/gm)) cores[m[1]] = m[2];
  return cores;
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const linear = (c) => ((c /= 255), c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminancia = (h) => {
  const [r, g, b] = hex(h);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};

/** Razão de contraste da WCAG 2.1 entre duas cores opacas. */
function razao(a, b) {
  const x = luminancia(a);
  const y = luminancia(b);
  const [alta, baixa] = x > y ? [x, y] : [y, x];
  return (alta + 0.05) / (baixa + 0.05);
}

/**
 * Cada par é [mínimo, o que é, frente, fundo].
 *
 * 4,5:1 para texto normal (WCAG 1.4.3); 3:1 para texto grande e para
 * componentes de interface e seus estados (1.4.11).
 */
const pares = (p) => [
  [4.5, 'text / background', p.text, p.background],
  [4.5, 'text / backgroundElement', p.text, p.backgroundElement],
  [4.5, 'text / backgroundSelected', p.text, p.backgroundSelected],
  [4.5, 'textSecondary / background', p.textSecondary, p.background],
  [4.5, 'textSecondary / backgroundElement', p.textSecondary, p.backgroundElement],
  [4.5, 'textSecondary / backgroundSelected', p.textSecondary, p.backgroundSelected],
  [4.5, 'textMuted / background', p.textMuted, p.background],
  [4.5, 'textMuted / backgroundElement', p.textMuted, p.backgroundElement],
  [4.5, 'accent (kicker, link) / background', p.accent, p.background],
  [4.5, 'accent / backgroundElement', p.accent, p.backgroundElement],
  [4.5, 'accent / accentSurface (tag)', p.accent, p.accentSurface],
  [4.5, 'accentOn / accentStrong (rótulo de botão, linha da trilha)', p.accentOn, p.accentStrong],
  [4.5, 'accentOn / accentHover (rótulo de botão sob o ponteiro)', p.accentOn, p.accentHover],
  [3.0, 'accentHover / background (botão sob o ponteiro)', p.accentHover, p.background],
  [4.5, 'accentStrong / accentOn (botão inverso, sobre o cartão)', p.accentStrong, p.accentOn],
  [3.0, 'accentStrong / background (contorno de controle)', p.accentStrong, p.background],
  [3.0, 'accentStrong / backgroundSelected (barra de progresso)', p.accentStrong, p.backgroundSelected],
  [3.0, 'accentOn / accent (barra dentro do cartão de destaque)', p.accentOn, p.accent],
  [3.0, 'accentDisplay / background (régua de destaque)', p.accentDisplay, p.background],
  [3.0, 'accentDisplay / backgroundElement (régua da nota, marcador de aba)', p.accentDisplay, p.backgroundElement],
  [3.0, 'border / background (contorno de campo)', p.border, p.background],
  [3.0, 'border / backgroundElement', p.border, p.backgroundElement],
  [4.5, 'inverseOn / inverse (bloco invertido)', p.inverseOn, p.inverse],
  [4.5, 'inverseMuted / inverse (kicker dentro do bloco)', p.inverseMuted, p.inverse],
];

let falhas = 0;

for (const [rotulo, chave] of [
  ['CLARO', 'claro'],
  ['ESCURO', 'escuro'],
]) {
  const p = paleta(chave);
  console.log(`\n===== ${rotulo} =====`);

  for (const [minimo, nome, frente, fundo] of pares(p)) {
    if (!frente || !fundo) {
      console.log(`  ????  token ausente em ${nome}`);
      falhas++;
      continue;
    }

    const r = razao(frente, fundo);
    const ok = r >= minimo;
    if (!ok) falhas++;

    console.log(`  ${ok ? 'ok   ' : 'FALHA'} ${r.toFixed(2).padStart(6)}:1 (min ${minimo})  ${nome}`);
  }
}

console.log(falhas ? `\n${falhas} par(es) fora do AA.` : '\nTodos os pares passam em WCAG 2.1 AA.');
process.exit(falhas ? 1 : 0);
