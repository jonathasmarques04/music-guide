import { View, type ViewProps } from 'react-native';

import { Rules } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * As réguas do Modernist. São elas que organizam a tela — o sistema proíbe
 * trocá-las por espaço em branco ou afiná-las até sumir.
 *
 * - `thick` (2px): separa seções. É a régua que se enxerga de longe.
 * - `hair` (1px): separa itens de uma mesma lista.
 *
 * Ambas são decorativas: escondidas do leitor de tela, que já recebe a
 * estrutura pelos cabeçalhos.
 */
export function Regua({ peso = 'thick', style, ...rest }: ViewProps & { peso?: 'thick' | 'hair' }) {
  const theme = useTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          height: peso === 'thick' ? Rules.thick : Rules.hair,
          backgroundColor: peso === 'thick' ? theme.divider : theme.hairline,
        },
        style,
      ]}
      {...rest}
    />
  );
}
