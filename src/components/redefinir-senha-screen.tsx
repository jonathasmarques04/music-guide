import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Campo } from '@/components/ui/campo';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tela } from '@/components/ui/tela';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';
import { MINIMO_SENHA, faltamCaracteres } from '@/lib/credenciais';

/**
 * Tela do link de recuperação de senha.
 *
 * Quando o aluno abre o link do e-mail, o SDK troca o código por uma sessão e
 * emite `PASSWORD_RECOVERY` — é esse evento (e não uma rota) que traz o aluno
 * até aqui, pelo `AuthGate`. Nesse ponto ele já está tecnicamente autenticado,
 * então a tela existe para não deixá-lo entrar no app sem trocar a senha.
 */
export function RedefinirSenhaScreen() {
  const { session, definirNovaSenha, signOut } = useAuth();

  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const curta = senha.length > 0 && senha.length < MINIMO_SENHA;
  const diferem = confirmacao.length > 0 && senha !== confirmacao;
  const podeEnviar = senha.length >= MINIMO_SENHA && senha === confirmacao;

  const enviar = async () => {
    setEnviando(true);
    setErro(null);

    const { erro: falha } = await definirNovaSenha(senha);
    setErro(falha);

    setEnviando(false);
    // Sem falha, `definirNovaSenha` desliga `recuperandoSenha` e o AuthGate já
    // solta o aluno direto no app, com a sessão nova em mãos.
  };

  return (
    <KeyboardAvoidingView
      style={styles.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela espaco={Spacing.two + Spacing.one}>
        <View style={styles.titulo}>
          <ThemedText type="kicker">Recuperação</ThemedText>
          <ThemedText type="title" accessibilityRole="header">
            Nova senha
          </ThemedText>
        </View>

        <Regua />

        <ThemedText type="default" themeColor="textSecondary">
          {session?.email
            ? `Escolha uma senha nova para ${session.email}.`
            : 'Escolha uma senha nova para a sua conta.'}
        </ThemedText>

        <Campo
          label="Nova senha"
          value={senha}
          onChangeText={setSenha}
          placeholder={`Pelo menos ${MINIMO_SENHA} caracteres`}
          invalido={curta}
          ajuda={curta ? faltamCaracteres(MINIMO_SENHA - senha.length) : undefined}
          secureTextEntry
          autoComplete="new-password"
          autoCapitalize="none"
          textContentType="newPassword"
        />

        <Campo
          label="Repita a nova senha"
          value={confirmacao}
          onChangeText={setConfirmacao}
          placeholder="A mesma senha de novo"
          invalido={diferem}
          ajuda={diferem ? 'As duas senhas precisam ser iguais.' : undefined}
          secureTextEntry
          autoComplete="new-password"
          autoCapitalize="none"
          textContentType="newPassword"
          onSubmitEditing={() => podeEnviar && !enviando && enviar()}
        />

        <Requisitos senha={senha} confirmacao={confirmacao} />

        {erro && <Nota tom="erro" rotulo="Não deu para trocar" texto={erro} />}

        <View style={styles.acoes}>
          <Button
            bloco
            size="lg"
            disabled={!podeEnviar}
            loading={enviando}
            onPress={enviar}
            accessibilityHint="Salva a nova senha e abre o app">
            Salvar e entrar
          </Button>

          <Button
            bloco
            variant="ghost"
            disabled={enviando}
            onPress={signOut}
            accessibilityHint="Descarta a recuperação e volta para a tela de entrada">
            Cancelar
          </Button>
        </View>
      </Tela>
    </KeyboardAvoidingView>
  );
}

/** Cada exigência com o próprio ✓ ou —, para o aluno ver o que ainda falta. */
function Requisitos({ senha, confirmacao }: { senha: string; confirmacao: string }) {
  const theme = useTheme();

  const itens = [
    { rotulo: `Pelo menos ${MINIMO_SENHA} caracteres`, ok: senha.length >= MINIMO_SENHA },
    { rotulo: 'Uma letra e um número', ok: /[a-zA-Z]/.test(senha) && /\d/.test(senha) },
    { rotulo: 'As duas senhas coincidem', ok: senha.length > 0 && senha === confirmacao },
  ];

  return (
    <View style={[styles.requisitos, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="label">Requisitos</ThemedText>
      {itens.map((item) => (
        <ThemedText
          key={item.rotulo}
          type="small"
          themeColor={item.ok ? 'accent' : 'textMuted'}>
          {item.ok ? '✓' : '—'} {item.rotulo}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  titulo: { gap: Spacing.one + Spacing.half },
  requisitos: {
    padding: Spacing.two + Spacing.one,
    gap: Spacing.one,
  },
  acoes: { marginTop: 'auto', paddingTop: Spacing.three, gap: Spacing.two },
});
