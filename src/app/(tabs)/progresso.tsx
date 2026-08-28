import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BarraProgresso } from '@/components/ui/barra';
import { Button } from '@/components/ui/button';
import { Faixa } from '@/components/ui/faixa';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tag } from '@/components/ui/tag';
import { Tela } from '@/components/ui/tela';
import { MODULOS } from '@/content/modulos';
import { NOTA_MINIMA } from '@/content/tipos';
import { MinTouchTarget, Rules, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

const PERCENTUAL_MINIMO = Math.round(NOTA_MINIMA * 100);

export default function ProgressoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { concluidos, totalAulas, statusDe, notaDe } = useProgresso();

  const percentual = totalAulas === 0 ? 0 : Math.round((concluidos / totalAulas) * 100);
  const avaliados = MODULOS.filter((modulo) => notaDe(modulo.id) !== undefined);

  const media =
    avaliados.length === 0
      ? undefined
      : avaliados.reduce((soma, modulo) => soma + (notaDe(modulo.id) ?? 0), 0) / avaliados.length;

  /** O módulo com a pior nota entre os já avaliados — o que merece revisão. */
  const pontoFraco = avaliados.reduce<(typeof MODULOS)[number] | undefined>((pior, modulo) => {
    if (!pior) return modulo;
    return (notaDe(modulo.id) ?? 1) < (notaDe(pior.id) ?? 1) ? modulo : pior;
  }, undefined);

  return (
    <Tela>
      <View style={styles.topo}>
        <ThemedText type="kicker">Seu histórico</ThemedText>
        <ThemedText type="title" accessibilityRole="header">
          Progresso
        </ThemedText>
      </View>

      <Regua />

      <View style={[styles.placar, { backgroundColor: theme.inverse }]}>
        <ThemedText type="kicker" style={{ color: theme.inverseMuted }}>
          Trilha completa
        </ThemedText>
        <ThemedText type="display" style={[styles.placarNumero, { color: theme.inverseOn }]}>
          {percentual}%
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.inverseMuted }}>
          {concluidos} de {totalAulas} módulos aprovados · mínimo de {PERCENTUAL_MINIMO}% em cada.
        </ThemedText>
      </View>

      <Faixa
        peso="forte"
        itens={[
          { rotulo: 'Aprovados', valor: `${concluidos}` },
          { rotulo: 'Restantes', valor: `${Math.max(0, totalAulas - concluidos)}` },
          {
            rotulo: 'Média',
            valor: media === undefined ? '—' : `${Math.round(media * 100)}%`,
            destaque: true,
          },
        ]}
      />

      <ThemedText type="label">Aproveitamento por módulo</ThemedText>

      <View style={[styles.tabela, { borderTopColor: theme.divider }]}>
        <View style={[styles.cabecalho, { borderBottomColor: theme.divider }]}>
          <ThemedText type="label" style={styles.colModulo}>
            Módulo
          </ThemedText>
          <ThemedText type="label">Nota</ThemedText>
        </View>

        {MODULOS.map((modulo) => {
          const nota = notaDe(modulo.id);
          const status = statusDe(modulo.id);

          return (
            <Pressable
              key={modulo.id}
              accessibilityRole="button"
              accessibilityLabel={`Módulo ${modulo.numero}, ${modulo.titulo}. ${
                nota === undefined
                  ? status === 'bloqueado'
                    ? 'Bloqueado'
                    : 'Ainda sem nota'
                  : `${Math.round(nota * 100)} por cento`
              }.`}
              accessibilityState={{ disabled: status === 'bloqueado' }}
              disabled={status === 'bloqueado'}
              onPress={() => router.push({ pathname: '/modulo/[id]', params: { id: modulo.id } })}
              style={({ pressed }) => [
                styles.linha,
                { borderBottomColor: theme.hairline },
                status === 'bloqueado' && styles.bloqueada,
                pressed && { backgroundColor: theme.backgroundSelected },
              ]}>
              <ThemedText type="small" themeColor="text" style={styles.colModulo}>
                {String(modulo.numero).padStart(2, '0')} {modulo.titulo}
              </ThemedText>

              {nota === undefined ? (
                <Tag variant="outline">
                  {status === 'bloqueado' ? 'trancado' : 'a fazer'}
                </Tag>
              ) : (
                <Tag variant={status === 'concluido' ? 'accent' : 'neutral'}>
                  {`${status === 'concluido' ? '✓ ' : ''}${Math.round(nota * 100)}%`}
                </Tag>
              )}
            </Pressable>
          );
        })}
      </View>

      {pontoFraco && (notaDe(pontoFraco.id) ?? 1) < 1 ? (
        <View style={styles.fraco}>
          <Nota
            rotulo="Ponto fraco"
            texto={`${pontoFraco.titulo} é sua menor nota (${Math.round(
              (notaDe(pontoFraco.id) ?? 0) * 100
            )}%). Uma passada pelo baralho antes de refazer costuma resolver.`}
          />
          <Button
            bloco
            variant="secondary"
            onPress={() =>
              router.push({ pathname: '/flashcards/[id]', params: { id: pontoFraco.id } })
            }
            accessibilityHint={`Abre o baralho de ${pontoFraco.titulo}`}>
            {`Revisar ${pontoFraco.titulo}`}
          </Button>
        </View>
      ) : (
        <View style={styles.fraco}>
          <ThemedText type="label">Progresso da trilha</ThemedText>
          <BarraProgresso
            valor={totalAulas === 0 ? 0 : concluidos / totalAulas}
            rotulo="Progresso geral da trilha"
            altura={Spacing.two}
          />
        </View>
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: { gap: Spacing.one + Spacing.half },
  placar: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  placarNumero: { fontSize: 60, lineHeight: 62 },
  tabela: { borderTopWidth: Rules.thick },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: Rules.thick,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: MinTouchTarget,
    paddingVertical: Spacing.two,
    borderBottomWidth: Rules.hair,
  },
  colModulo: { flex: 1 },
  bloqueada: { opacity: 0.5 },
  fraco: { marginTop: 'auto', paddingTop: Spacing.three, gap: Spacing.two },
});
