import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BarraPassos } from '@/components/ui/barra';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { Nota } from '@/components/ui/nota';
import { Tela } from '@/components/ui/tela';
import { moduloPorId } from '@/content/modulos';
import { quizPorModulo } from '@/content/quiz';
import type { Bloco } from '@/content/tipos';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

/**
 * A aula em passos: uma seção por tela, com a barra de progresso no topo.
 *
 * Ler tudo de uma vez cansa e apaga a estrutura da apostila. Em passos, cada
 * conceito ganha uma tela inteira e o aluno vê quanto falta.
 */
export default function LicaoScreen() {
  const { id, passo } = useLocalSearchParams<{ id: string; passo?: string }>();
  const router = useRouter();
  const { statusDe } = useProgresso();

  const modulo = moduloPorId(id);
  const inicial = Math.max(0, Number.parseInt(passo ?? '0', 10) || 0);
  const [indice, setIndice] = useState(inicial);

  if (!modulo || modulo.secoes.length === 0) {
    return (
      <Tela>
        <Cabecalho voltar="a trilha" titulo="Aula indisponível" />
        <ThemedText type="small">Este módulo ainda não tem conteúdo publicado.</ThemedText>
      </Tela>
    );
  }

  if (statusDe(modulo.id) === 'bloqueado') {
    return (
      <Tela>
        <Cabecalho voltar="a trilha" kicker="Bloqueado" titulo={modulo.titulo} />
        <Nota
          tom="aviso"
          rotulo="Ainda trancado"
          texto="Conclua a avaliação do módulo anterior para abrir esta aula."
        />
      </Tela>
    );
  }

  const atual = Math.min(indice, modulo.secoes.length - 1);
  const secao = modulo.secoes[atual];
  const ultima = atual === modulo.secoes.length - 1;
  const temAvaliacao = quizPorModulo(modulo.id).length > 0;

  const sair = () => router.push({ pathname: '/modulo/[id]', params: { id: modulo.id } });

  const avancar = () => {
    if (!ultima) {
      setIndice(atual + 1);
      return;
    }

    if (temAvaliacao) {
      router.replace({ pathname: '/quiz/[id]', params: { id: modulo.id } });
    } else {
      sair();
    }
  };

  return (
    <View style={styles.raiz}>
      <BarraPassos
        atual={atual + 1}
        total={modulo.secoes.length}
        rotulo={`Progresso na aula de ${modulo.titulo}`}
        rotuloSair="Sair da aula"
        onSair={sair}
      />

      <Tela espaco={Spacing.two + Spacing.one}>
        <ThemedText type="kicker">
          Módulo {String(modulo.numero).padStart(2, '0')} · Passo {atual + 1}
        </ThemedText>
        <ThemedText type="heading" accessibilityRole="header">
          {secao.titulo}
        </ThemedText>

        {secao.blocos.map((bloco, i) => (
          <BlocoConteudo key={i} bloco={bloco} />
        ))}

        <View style={styles.acoes}>
          <Button
            variant="secondary"
            size="lg"
            disabled={atual === 0}
            onPress={() => setIndice(atual - 1)}
            accessibilityLabel="Passo anterior">
            ←
          </Button>
          <View style={styles.avancar}>
            <Button bloco size="lg" onPress={avancar}>
              {!ultima
                ? 'Próximo passo'
                : temAvaliacao
                  ? 'Ir para a avaliação'
                  : 'Concluir a aula'}
            </Button>
          </View>
        </View>
      </Tela>
    </View>
  );
}

function BlocoConteudo({ bloco }: { bloco: Bloco }) {
  const theme = useTheme();

  switch (bloco.tipo) {
    case 'paragrafo':
      return <ThemedText type="default" themeColor="textSecondary">{bloco.texto}</ThemedText>;

    case 'lista':
      return (
        <View>
          {bloco.itens.map((item) => (
            <View key={item} style={[styles.item, { borderBottomColor: theme.hairline }]}>
              <ThemedText type="rowTitle" themeColor="accent">
                —
              </ThemedText>
              <ThemedText type="small" style={styles.itemTexto}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      );

    case 'formula':
      /*
       * O bloco invertido é o mais alto do sistema — é onde a fórmula, a cifra
       * e o grau ficam, em monoespaçada, sem competir com o corpo do texto.
       */
      return (
        <View style={[styles.formula, { backgroundColor: theme.inverse }]}>
          {bloco.rotulo && (
            <ThemedText type="label" style={{ color: theme.inverseMuted }}>
              {bloco.rotulo}
            </ThemedText>
          )}
          <ThemedText type="code" style={{ color: theme.inverseOn }}>
            {bloco.texto}
          </ThemedText>
        </View>
      );

    case 'destaque':
      return <Nota rotulo={bloco.titulo} texto={bloco.texto} />;

    case 'tabela':
      return (
        // Tabelas largas rolam dentro do próprio bloco, sem empurrar a página.
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.tabela, { borderColor: theme.text }]}>
            <View style={{ flexDirection: 'row', backgroundColor: theme.inverse }}>
              {bloco.cabecalho.map((celula) => (
                <View key={celula} style={styles.celula}>
                  <ThemedText type="label" style={{ color: theme.inverseOn }}>
                    {celula}
                  </ThemedText>
                </View>
              ))}
            </View>

            {bloco.linhas.map((linha, i) => (
              <View key={i} style={[styles.linha, { borderTopColor: theme.hairline }]}>
                {linha.map((celula, j) => (
                  <View
                    key={j}
                    style={[
                      styles.celula,
                      j > 0 && { borderLeftWidth: Rules.hair, borderLeftColor: theme.hairline },
                    ]}>
                    <ThemedText type={j === 0 ? 'smallBold' : 'small'} themeColor="text">
                      {celula}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  item: {
    flexDirection: 'row',
    gap: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two,
    borderBottomWidth: Rules.hair,
  },
  itemTexto: { flex: 1 },
  formula: {
    padding: Spacing.two + Spacing.one,
    gap: Spacing.one,
    borderRadius: Radius,
  },
  tabela: {
    borderWidth: Rules.thick,
    borderRadius: Radius,
    minWidth: 300,
  },
  linha: { flexDirection: 'row', borderTopWidth: Rules.hair },
  celula: {
    width: 148,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
  },
  acoes: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
    marginTop: 'auto',
    paddingTop: Spacing.three,
  },
  avancar: { flex: 1 },
});
