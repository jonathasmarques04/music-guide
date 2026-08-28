import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Campo } from '@/components/ui/campo';
import { Faixa } from '@/components/ui/faixa';
import { LinhaLista } from '@/components/ui/linha-lista';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tag } from '@/components/ui/tag';
import { Tela } from '@/components/ui/tela';
import { flashcardsPorModulo } from '@/content/flashcards';
import { MODULOS } from '@/content/modulos';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useProgresso } from '@/contexts/progresso';
import { useTheme } from '@/hooks/use-theme';

const TOTAL_CARDS = MODULOS.reduce((soma, m) => soma + flashcardsPorModulo(m.id).length, 0);

export default function PerfilScreen() {
  const theme = useTheme();
  const { session, atualizarNome, signOut } = useAuth();
  const { concluidos, totalAulas, reiniciar } = useProgresso();

  const nomeAtual = session?.nome?.trim() || 'estudante';

  const [nome, setNome] = useState(nomeAtual);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);

  const nomeValido = nome.trim().length >= 2;
  const mudou = nome.trim() !== nomeAtual;

  const salvar = async () => {
    setSalvando(true);
    setErro(null);
    setSalvo(false);

    const { erro: falha } = await atualizarNome(nome.trim());

    setErro(falha);
    setSalvo(!falha);
    setSalvando(false);
  };

  return (
    <Tela>
      <View style={styles.identidade}>
        <View style={[styles.avatar, { borderColor: theme.text }]}>
          <ThemedText type="subtitle">{iniciais(nomeAtual)}</ThemedText>
        </View>
        <View style={styles.identidadeTexto}>
          <ThemedText type="subtitle" accessibilityRole="header">
            {nomeAtual}
          </ThemedText>
          <ThemedText type="small">{session?.email ?? 'Sessão sem e-mail'}</ThemedText>
          <Tag variant={session?.isGuest ? 'outline' : 'accent'}>
            {session?.isGuest ? 'Modo visitante' : 'Conta ativa'}
          </Tag>
        </View>
      </View>

      <Regua />

      <Faixa
        itens={[
          { rotulo: 'Aprovados', valor: `${concluidos}/${totalAulas}` },
          { rotulo: 'Cards', valor: `${TOTAL_CARDS}` },
          { rotulo: 'Módulos', valor: `${MODULOS.length}`, destaque: true },
        ]}
      />

      <ThemedText type="label">Como você é chamado</ThemedText>

      <Campo
        label="Nome"
        value={nome}
        onChangeText={(texto) => {
          setNome(texto);
          setSalvo(false);
        }}
        placeholder="Como você quer ser chamado"
        autoComplete="name"
        autoCapitalize="words"
        textContentType="name"
        invalido={nome.length > 0 && !nomeValido}
        ajuda={nome.length > 0 && !nomeValido ? 'Use pelo menos duas letras.' : undefined}
      />

      {erro && <Nota tom="erro" rotulo="Não deu para salvar" texto={erro} />}
      {salvo && !mudou && <Nota rotulo="✓ Salvo" texto="Seu nome já aparece na trilha." />}

      {mudou && (
        <Button
          bloco
          disabled={!nomeValido}
          loading={salvando}
          onPress={salvar}
          accessibilityHint="Grava o novo nome na sua conta">
          Salvar nome
        </Button>
      )}

      <ThemedText type="label">Conta</ThemedText>

      <View>
        <LinhaLista rotulo="E-mail" valor={session?.email ?? '—'} />
        <LinhaLista rotulo="Idioma" valor="Português" />
        <LinhaLista rotulo="Nomes das notas" valor="Dó Ré Mi (com cifra)" />
        <LinhaLista
          rotulo="Progresso"
          valor={`${concluidos} de ${totalAulas} aprovados`}
        />
      </View>

      <View style={styles.zonaDeRisco}>
        {confirmandoReinicio ? (
          <>
            <Nota
              tom="aviso"
              rotulo="Apagar o progresso"
              texto="Isto zera todas as notas e tranca a trilha de volta no módulo 01. Não dá para desfazer."
            />
            <View style={styles.confirmacao}>
              <Button
                variant="secondary"
                onPress={() => {
                  reiniciar();
                  setConfirmandoReinicio(false);
                }}
                accessibilityHint="Apaga todas as notas e volta a trilha ao começo">
                Sim, apagar tudo
              </Button>
              <Button variant="ghost" onPress={() => setConfirmandoReinicio(false)}>
                Cancelar
              </Button>
            </View>
          </>
        ) : (
          <Button
            bloco
            variant="secondary"
            onPress={() => setConfirmandoReinicio(true)}
            accessibilityHint="Pede confirmação antes de zerar suas notas">
            Reiniciar meu progresso
          </Button>
        )}

        <Button
          bloco
          variant="ghost"
          onPress={signOut}
          accessibilityHint="Encerra a sessão e volta para a tela de entrada">
          Sair da conta
        </Button>
      </View>
    </Tela>
  );
}

/** "Ana Souza" → "AS". Uma letra quando o nome é só um. */
function iniciais(nome: string) {
  const partes = nome.split(/\s+/).filter(Boolean);
  return [partes[0], partes.length > 1 ? partes[partes.length - 1] : undefined]
    .filter((parte): parte is string => !!parte)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
  },
  avatar: {
    width: 64,
    height: 64,
    borderWidth: Rules.thick,
    borderRadius: Radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identidadeTexto: { flex: 1, gap: Spacing.one },
  zonaDeRisco: { marginTop: 'auto', paddingTop: Spacing.four, gap: Spacing.two },
  confirmacao: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
