import type { PointerEvent } from 'react-native';
import { useReducedMotion, useSharedValue } from 'react-native-reanimated';

/**
 * A posição do ponteiro, para quem quer reagir a ela sem re-renderizar.
 *
 * O valor sai em `SharedValue` e não em estado: mover o mouse chega ao worklet
 * direto, sem passar pelo React. Sem isso, cada pixel percorrido re-renderizaria
 * a árvore inteira — e num formulário isso significa perder quadro justamente
 * enquanto alguém digita.
 *
 * `-1` em `x` é o combinado para "não há ponteiro": é o estado do celular, o do
 * primeiro quadro no desktop e o de quem tirou o mouse da janela. Quem consome
 * precisa tratar esse caso e ficar parado — um efeito preso na última posição
 * conhecida parece travado.
 *
 * Com **movimento reduzido** o hook simplesmente nunca atualiza: a posição fica
 * em `-1` e o efeito decorativo não acontece.
 *
 * No nativo a posição vem dos eventos de ponteiro do próprio React Native, então
 * o consumidor precisa espalhar `props` no nó que cobre a área de interesse.
 * Na web esses props não existem (ver `use-ponteiro.web.ts`).
 */
export function usePonteiro() {
  const reduzirMovimento = useReducedMotion();
  const x = useSharedValue(-1);
  const y = useSharedValue(-1);

  const largar = () => {
    x.value = -1;
    y.value = -1;
  };

  return {
    x,
    y,
    props: {
      onPointerMove: (e: PointerEvent) => {
        /*
         * Só o mouse. No celular o "ponteiro" é o dedo que está rolando a tela,
         * e fazer o fundo perseguir o dedo durante a rolagem é enjoativo — além
         * de gastar quadro onde ele é mais caro.
         */
        if (e.nativeEvent.pointerType !== 'mouse') return;
        if (reduzirMovimento) return;

        x.value = e.nativeEvent.x;
        y.value = e.nativeEvent.y;
      },
      onPointerLeave: largar,
      onPointerCancel: largar,
    },
  };
}
