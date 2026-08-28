import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Cabecalho } from '@/components/ui/cabecalho';
import { LinhaModulo } from '@/components/ui/linha-modulo';
import { Regua } from '@/components/ui/regua';
import { Seg } from '@/components/ui/seg';
import { Tela } from '@/components/ui/tela';
import { MODULOS } from '@/content/modulos';
import { Spacing } from '@/constants/theme';
import { useProgresso } from '@/contexts/progresso';

type Filtro = 'todos' | 'emCurso' | 'concluidos';

const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'emCurso', rotulo: 'Em curso' },
  { valor: 'concluidos', rotulo: 'Concluídos' },
] as const satisfies readonly { valor: Filtro; rotulo: string }[];

export default function TrilhaScreen() {
  const router = useRouter();
  const { statusDe, notaDe } = useProgresso();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const visiveis = MODULOS.filter((modulo) => {
    const status = statusDe(modulo.id);
    if (filtro === 'concluidos') return status === 'concluido';
    if (filtro === 'emCurso') return status === 'atual';
    return true;
  });

  return (
    <Tela semMargem espaco={0}>
      <View style={styles.topo}>
        <Cabecalho
          voltar="o painel"
          destino="/"
          kicker={`${MODULOS.length} módulos em ordem`}
          titulo="Trilha"
          regua={false}
        />
        <Seg legenda="Filtrar módulos" opcoes={FILTROS} valor={filtro} onChange={setFiltro} />
      </View>

      <Regua />

      {visiveis.length === 0 ? (
        <View style={styles.vazio}>
          <ThemedText type="small">
            {filtro === 'concluidos'
              ? 'Nenhum módulo aprovado ainda. Faça a avaliação de um módulo para ele aparecer aqui.'
              : 'Nenhum módulo em curso — você está em dia com a trilha.'}
          </ThemedText>
        </View>
      ) : (
        visiveis.map((modulo) => {
          const status = statusDe(modulo.id);

          return (
            <LinhaModulo
              key={modulo.id}
              numero={modulo.numero}
              titulo={modulo.titulo}
              detalhe={status === 'atual' ? `Em curso — ${modulo.resumo}` : modulo.resumo}
              status={status}
              nota={notaDe(modulo.id)}
              onPress={() => router.push({ pathname: '/modulo/[id]', params: { id: modulo.id } })}
            />
          );
        })
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two + Spacing.one,
    gap: Spacing.two + Spacing.one,
  },
  vazio: { padding: Spacing.three },
});
