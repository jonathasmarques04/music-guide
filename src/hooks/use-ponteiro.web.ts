import { useEffect } from 'react';
import { useReducedMotion, useSharedValue } from 'react-native-reanimated';

/**
 * Variante web de `use-ponteiro.ts`.
 *
 * `react-native-web` não repassa `onPointerMove` das props de `View` para o
 * DOM — o evento chega ao documento, mas morre antes do componente. Então aqui
 * a escuta é feita na `window`, que é o único lugar onde ela é confiável e, de
 * quebra, continua valendo quando o ponteiro passa por cima de um filho que
 * pare a propagação.
 *
 * O contrato é o mesmo do nativo: `x` e `y` em `SharedValue`, `-1` para "sem
 * ponteiro", nada acontece com movimento reduzido. O que muda é que `props` vem
 * vazio — não há nada para espalhar, porque quem escuta é a janela.
 *
 * As coordenadas são as do **viewport** (`clientX`/`clientY`), não as da
 * página: quem consome isto é uma camada de fundo em `position: absolute` sobre
 * a tela, e a rolagem acontece dentro dela, não sob ela.
 */
export function usePonteiro() {
  const reduzirMovimento = useReducedMotion();
  const x = useSharedValue(-1);
  const y = useSharedValue(-1);

  useEffect(() => {
    if (reduzirMovimento) return;

    const mover = (e: globalThis.PointerEvent) => {
      // Só o mouse acende: no toque o "ponteiro" é o dedo que está rolando.
      if (e.pointerType !== 'mouse') return;
      x.value = e.clientX;
      y.value = e.clientY;
    };

    const largar = () => {
      x.value = -1;
      y.value = -1;
    };

    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('pointerleave', largar);
    // O ponteiro que sai pela borda da janela dispara `mouseout` com `relatedTarget` nulo.
    document.addEventListener('mouseleave', largar);

    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerleave', largar);
      document.removeEventListener('mouseleave', largar);
    };
  }, [reduzirMovimento, x, y]);

  return { x, y, props: {} };
}
