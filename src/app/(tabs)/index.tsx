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
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useProgresso } from '@/contexts/progresso';
import { useRevisao } from '@/contexts/revisao';
import { useTheme } from '@/hooks/use-theme';
import { doisDigitos, iniciais, percentual } from '@/lib/formato';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { session } = useAuth();
  const { concluidos, totalAulas, statusDe, notaDe, erroSincronizacao } = useProgresso();
  const { resumoDoModulo } = useRevisao();

  const nome = session?.nome?.trim() || 'estudante';
  const restantes = Math.max(0, totalAulas - concluidos);
  const daTrilha = totalAulas === 0 ? 0 : percentual(concluidos / totalAulas);

  /** O módulo em curso é sempre o primeiro que ainda não foi aprovado. */
  const atual = MODULOS.find((modulo) => statusDe(modulo.id) === 'atual');

  /**
   * A revisão de hoje só conta os módulos já liberados: oferecer cards de um
   * módulo trancado entregaria conteúdo que o aluno ainda não estudou.
   */
  const pendentes = MODULOS.filter((modulo) => statusDe(modulo.id) !== 'bloqueado').reduce(
    (soma, modulo) => soma + resumoDoModulo(modulo.id).pendentes,
    0
  );

  return (
    <Tela>
      <View style={styles.topo}>
        <View style={styles.saudacao}>
          <ThemedText type="kicker">Área do aluno</ThemedText>
          <ThemedText type="title" accessibilityRole="header">
            Olá, {nome}
          </ThemedText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Perfil de ${nome}`}
          accessibilityHint="Abre a aba de perfil"
          onPress={() => router.push('/perfil')}
          style={({ pressed }) => [
            styles.avatar,
            { borderColor: theme.text },
            pressed && { backgroundColor: theme.backgroundSelected },
          ]}>
          <ThemedText type="rowTitle">{iniciais(nome)}</ThemedText>
        </Pressable>
      </View>

      {atual ? (
        <View style={[styles.retomar, { backgroundColor: theme.accentStrong }]}>
          <ThemedText type="kicker" style={{ color: theme.accentOn }}>
            Continuar de onde parou
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={{ color: theme.accentOn }}
            accessibilityRole="header">
            {doisDigitos(atual.numero)} · {atual.titulo}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.accentOn }}>
            {atual.secoes.length} {atual.secoes.length === 1 ? 'seção' : 'seções'} ·{' '}
            {notaDe(atual.id) === undefined
              ? 'avaliação ainda não feita'
              : `melhor nota ${percentual(notaDe(atual.id) ?? 0)}%`}
          </ThemedText>

          <BarraProgresso
            sobreDestaque
            valor={notaDe(atual.id) ?? 0}
            rotulo={`Aproveitamento em ${atual.titulo}`}
          />

          <Button
            variant="inverso"
            onPress={() => router.push({ pathname: '/modulo/[id]', params: { id: atual.id } })}
            accessibilityHint={`Abre o módulo ${atual.numero}`}>
            Retomar aula →
          </Button>
        </View>
      ) : (
        <Nota
          rotulo="Trilha completa"
          texto="Você aprovou os treze módulos. Continue revisando os baralhos para não perder o que construiu."
        />
      )}

      <Faixa
        itens={[
          { rotulo: 'Concluídos', valor: `${concluidos}` },
          { rotulo: 'Restantes', valor: `${restantes}` },
          { rotulo: 'Da trilha', valor: `${daTrilha}%`, destaque: true },
        ]}
      />

      <Button
        bloco
        variant="secondary"
        onPress={() => router.push('/trilha')}
        accessibilityHint="Abre a lista dos treze módulos">
        Ver a trilha inteira
      </Button>

      <Regua />

      <View style={styles.tituloRevisao}>
        <ThemedText type="label">Revisão de hoje</ThemedText>
        {pendentes > 0 && <Tag variant="accent">{`${pendentes} cards na fila`}</Tag>}
      </View>

      <View style={[styles.baralho, { borderColor: theme.text }]}>
        <View style={styles.baralhoTexto}>
          <ThemedText type="rowTitle">
            {atual ? `Baralho · ${atual.titulo}` : 'Baralhos da trilha'}
          </ThemedText>
          <ThemedText type="small">
            {pendentes > 0
              ? `${pendentes} ${pendentes === 1 ? 'card espera' : 'cards esperam'} por você agora.`
              : 'Nada vencido no momento. Volte mais tarde.'}
          </ThemedText>
        </View>
        <Button
          onPress={() => router.push('/revisar')}
          accessibilityHint="Abre a aba de revisão com os baralhos de cada módulo">
          Revisar
        </Button>
      </View>

      {session?.isGuest && (
        <Nota
          tom="aviso"
          rotulo="Modo visitante"
          texto="Seu progresso vale só enquanto esta sessão estiver aberta. Crie uma conta para guardá-lo."
        />
      )}

      {erroSincronizacao && (
        <Nota
          tom="erro"
          rotulo="Sincronização"
          texto={`${erroSincronizacao} Seu progresso continua salvo neste aparelho.`}
        />
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  saudacao: { flexShrink: 1, gap: Spacing.one + Spacing.half },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: Rules.thick,
    borderRadius: Radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retomar: {
    padding: Spacing.three,
    gap: Spacing.two,
    borderRadius: Radius,
  },
  tituloRevisao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  baralho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    borderWidth: Rules.thick,
    borderRadius: Radius,
    padding: Spacing.two + Spacing.one,
  },
  baralhoTexto: { flex: 1, gap: Spacing.half },
});
