/**
 * O app é totalmente escuro e NÃO segue o esquema do sistema.
 *
 * Este hook sempre devolve a paleta escura. `Colors.light` e `Colors.dark`
 * apontam para a mesma paleta (ver `constants/theme.ts`), então nenhum caminho
 * de código consegue renderizar um tema claro.
 */

import { Colors } from '@/constants/theme';

export function useTheme() {
  return Colors.dark;
}
