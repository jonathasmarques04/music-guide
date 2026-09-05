/**
 * Variante web de `animated-icon.tsx`.
 *
 * Na web não existe splash nativo para segurar nem para esconder — o navegador
 * já pinta o fundo do `body` (ver `global.css`) antes da hidratação. Cobrir a
 * página com um overlay só adicionaria um piscar que o nativo tem por
 * necessidade e a web não.
 */
export function AnimatedSplashOverlay() {
  return null;
}
