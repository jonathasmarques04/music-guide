/**
 * A paleta do esquema em vigor.
 *
 * O app segue o sistema (`userInterfaceStyle: "automatic"` no `app.json`):
 * `Colors.light` é o chão claro do Modernist e `Colors.dark` é a mesma
 * linguagem com o chão invertido. Componente nenhum deve ler `Colors` direto
 * — sempre por aqui, senão o modo escuro passa batido.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  // `useColorScheme` também devolve null e 'unspecified'; só 'dark' vira escuro.
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}
