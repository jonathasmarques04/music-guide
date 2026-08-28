import { useState } from 'react';

/**
 * Estado de ponteiro sobre um `Pressable`.
 *
 * `onHoverIn` / `onHoverOut` são API do RN core, não da web: numa tela de toque
 * eles simplesmente nunca disparam. Por isso o mesmo componente serve às três
 * plataformas sem precisar de variante `.web.tsx`.
 *
 * Hover é sempre REFORÇO. O estado que carrega informação — selecionado, ativo,
 * bloqueado, correto — precisa continuar legível sem ponteiro nenhum, porque no
 * celular não existe ponteiro (e no leitor de tela também não).
 *
 * ```tsx
 * const ponteiro = useHover();
 * <Pressable {...ponteiro.props} style={[base, ponteiro.hover && realce]} />
 * ```
 */
export function useHover() {
  const [hover, setHover] = useState(false);

  return {
    hover,
    props: {
      onHoverIn: () => setHover(true),
      onHoverOut: () => setHover(false),
    },
  };
}
