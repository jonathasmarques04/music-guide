import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Cabecalho } from '@/components/ui/cabecalho';
import { Cordas } from '@/components/ui/cordas';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Seg } from '@/components/ui/seg';
import { Tag } from '@/components/ui/tag';
import { Tela } from '@/components/ui/tela';
import { Spacing } from '@/constants/theme';
import { INSTRUMENTOS, afinacaoDe } from '@/content/instrumentos';
import type { Instrumento } from '@/content/tipos';
import { useInstrumento } from '@/contexts/instrumento';

type Filtro = 'todos' | 'contrabaixo' | 'violao' | 'guitarra';

const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'contrabaixo', rotulo: 'Baixo' },
  { valor: 'violao', rotulo: 'Violão' },
  { valor: 'guitarra', rotulo: 'Guitarra' },
] as const satisfies readonly { valor: Filtro; rotulo: string }[];

/**
 * Página de consulta dos três instrumentos de corda da apostila.
 *
 * É a irmã da `trilha`: mesma armação de tela sem margem, mesmo filtro
 * segmentado no topo, mesmas réguas sangrando de ponta a ponta. A diferença é
 * que aqui nada tem estado de progresso — ninguém conclui um instrumento.
 */
export default function InstrumentosScreen() {
  const { instrumento: meu, escolher } = useInstrumento();

  /*
   * Abre já filtrada no instrumento do aluno — quem escolheu contrabaixo veio
   * aqui ver o contrabaixo. O estado inicial é lido uma vez: trocar de
   * instrumento nesta mesma tela não deve fazer a lista saltar debaixo do dedo
   * que acabou de tocar o botão.
   */
  const [filtro, setFiltro] = useState<Filtro>(() => (meu ? (meu.id as Filtro) : 'todos'));

  const visiveis = INSTRUMENTOS.filter(
    (instrumento) => filtro === 'todos' || instrumento.id === filtro,
  );

  return (
    <Tela semMargem espaco={0}>
      <View style={styles.topo}>
        <Cabecalho
          voltar="o perfil"
          destino="/perfil"
          kicker="Três instrumentos de corda"
          titulo="Instrumentos"
          regua={false}
        />
        <Seg legenda="Filtrar instrumentos" opcoes={FILTROS} valor={filtro} onChange={setFiltro} />
      </View>

      <Regua />

      {visiveis.map((instrumento) => (
        <BlocoInstrumento
          key={instrumento.id}
          instrumento={instrumento}
          ehMeu={meu?.id === instrumento.id}
          onEscolher={() => escolher(instrumento.id)}
        />
      ))}

      {/*
        O fecho só aparece com os três à vista. Filtrado num instrumento só, a
        comparação não teria com o que comparar — e uma nota falando de "os
        três" embaixo de um seria conversa fora de hora.
      */}
      {filtro === 'todos' && (
        <View style={styles.bloco}>
          <Nota
            rotulo="Guarde isto"
            texto="As quatro cordas do contrabaixo (Mi, Lá, Ré, Sol) são as mesmas quatro mais graves do violão e da guitarra, uma oitava abaixo. É por isso que quem aprende o braço de um se acha rápido no outro: o desenho dos intervalos é idêntico, só muda a altura."
          />
        </View>
      )}
    </Tela>
  );
}

function BlocoInstrumento({
  instrumento,
  ehMeu,
  onEscolher,
}: {
  instrumento: Instrumento;
  ehMeu: boolean;
  onEscolher: () => void;
}) {
  return (
    <>
      <View style={styles.bloco}>
        <View style={styles.cabeca}>
          <ThemedText type="heading" accessibilityRole="header">
            {instrumento.nome}
          </ThemedText>
          <Tag variant="outline">{`${instrumento.cordas.length} cordas`}</Tag>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          {afinacaoDe(instrumento)}
        </ThemedText>

        <ThemedText>{instrumento.resumo}</ThemedText>

        <Cordas cordas={instrumento.cordas} />

        <View style={styles.ficha}>
          <Dado rotulo="Entre as cordas" texto={instrumento.intervalos} />
          <Dado rotulo="Na partitura" texto={instrumento.clave} />
        </View>

        {instrumento.papel.map((paragrafo, i) => (
          <ThemedText key={i}>{paragrafo}</ThemedText>
        ))}

        {/*
          O instrumento do aluno se anuncia por PALAVRA, não por cor: o "✓ É o
          seu instrumento" continua legível para quem não distingue o vermelhão,
          e ocupa o lugar exato onde estaria o botão — assim a diferença entre
          "é o meu" e "posso escolher" é de forma, não de tom.
        */}
        {ehMeu ? (
          <ThemedText type="smallBold" themeColor="accent">
            ✓ É o seu instrumento
          </ThemedText>
        ) : (
          <Button
            variant="secondary"
            onPress={onEscolher}
            accessibilityHint={`Passa a usar ${instrumento.nome} como o seu instrumento`}>
            Escolher este
          </Button>
        )}
      </View>

      <Regua />
    </>
  );
}

/** Rótulo em versalete e a linha que ele nomeia — o par de ficha técnica. */
function Dado({ rotulo, texto }: { rotulo: string; texto: string }) {
  return (
    <View style={styles.dado}>
      <ThemedText type="label">{rotulo}</ThemedText>
      <ThemedText type="small">{texto}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two + Spacing.one,
    gap: Spacing.two + Spacing.one,
  },
  bloco: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  cabeca: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  ficha: { gap: Spacing.two + Spacing.one },
  dado: { gap: Spacing.half },
});
