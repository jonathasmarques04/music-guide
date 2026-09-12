import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Cordas } from '@/components/ui/cordas';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tela } from '@/components/ui/tela';
import { Rules, Spacing } from '@/constants/theme';
import { INSTRUMENTOS, afinacaoDe } from '@/content/instrumentos';
import type { Instrumento } from '@/content/tipos';
import { useInstrumento } from '@/contexts/instrumento';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';

/**
 * A escolha do instrumento, logo depois de entrar.
 *
 * Fica atrás do mesmo portão que a tela de login (`AuthGate` em `_layout`), e
 * não é uma rota: quem ainda não respondeu vê isto no lugar da trilha, e nunca
 * mais depois de responder.
 *
 * "Decidir depois" é uma resposta de verdade, guardada como tal — sem isso a
 * tela voltaria a cada abertura para quem só quer estudar teoria e não toca
 * nada. A escolha não tranca conteúdo nenhum: os 18 módulos são os mesmos para
 * os três, porque intervalo e campo harmônico não mudam de instrumento.
 */
export function EscolherInstrumentoScreen() {
  const { escolher, adiar } = useInstrumento();

  return (
    <Tela>
      <View style={styles.textos}>
        <ThemedText type="kicker">Antes de começar</ThemedText>
        <ThemedText type="title" accessibilityRole="header">
          O que você toca?
        </ThemedText>
        <ThemedText>
          A trilha de teoria é a mesma para os três. Saber seu instrumento serve para o app falar a
          sua língua — e você troca quando quiser, no Perfil.
        </ThemedText>
      </View>

      <Regua />

      <View style={styles.opcoes}>
        {INSTRUMENTOS.map((instrumento) => (
          <Opcao
            key={instrumento.id}
            instrumento={instrumento}
            onPress={() => escolher(instrumento.id)}
          />
        ))}
      </View>

      <View style={styles.rodape}>
        <Button bloco size="lg" variant="ghost" onPress={adiar}>
          Decidir depois
        </Button>

        <Nota
          rotulo="Nada fica trancado"
          texto="Escolher um instrumento não muda quais módulos você pode fazer. Quem não toca nada ainda pode seguir a trilha inteira."
        />
      </View>
    </Tela>
  );
}

/**
 * Um instrumento como alvo de toque: nome, número de cordas e a afinação
 * inteira desenhada. A fileira de cordas está aqui de propósito — escolher
 * "contrabaixo" olhando para Mi-Lá-Ré-Sol é mais concreto do que escolher um
 * nome numa lista.
 */
function Opcao({ instrumento, onPress }: { instrumento: Instrumento; onPress: () => void }) {
  const theme = useTheme();
  const ponteiro = useHover();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${instrumento.nome}, ${instrumento.cordas.length} cordas, afinação ${afinacaoDe(instrumento)}`}
      accessibilityHint="Escolhe este instrumento e abre a trilha"
      onPress={onPress}
      {...ponteiro.props}
      style={({ pressed }) => [
        styles.opcao,
        { borderColor: theme.border },
        ponteiro.hover && { backgroundColor: theme.backgroundElement, borderColor: theme.text },
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      <View style={styles.cabeca}>
        <ThemedText type="heading">{instrumento.nome}</ThemedText>
        <ThemedText type="small" themeColor="textMuted">
          {`${instrumento.cordas.length} cordas`}
        </ThemedText>
      </View>

      <Cordas cordas={instrumento.cordas} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textos: { gap: Spacing.two },
  opcoes: { gap: Spacing.three },
  opcao: {
    borderWidth: Rules.thick,
    padding: Spacing.two + Spacing.one,
    gap: Spacing.two + Spacing.one,
  },
  cabeca: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  /* `marginTop: 'auto'` empurra o rodapé para o fim — a coluna da `Tela` cresce. */
  rodape: { marginTop: 'auto', gap: Spacing.three },
});
