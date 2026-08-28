import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso, Campo } from '@/components/login-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';

/** Mesmo mínimo que o Supabase aplica no servidor. */
const MINIMO_SENHA = 6;

/**
 * Tela do link de recuperação de senha.
 *
 * Quando o aluno abre o link do e-mail, o SDK troca o código por uma sessão e
 * emite `PASSWORD_RECOVERY` — é esse evento (e não uma rota) que traz o aluno
 * até aqui, pelo `AuthGate`. Nesse ponto ele já está tecnicamente autenticado,
 * então a tela existe para não deixá-lo entrar no app sem trocar a senha.
 */
export function RedefinirSenhaScreen() {
  const theme = useTheme();
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
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.header}>
                <ThemedView type="accentSurface" style={styles.mark}>
                  <ThemedText style={[styles.markGlyph, { color: theme.accent }]}>♪</ThemedText>
                </ThemedView>

                <ThemedText type="subtitle" accessibilityRole="header" style={styles.centered}>
                  Nova senha
                </ThemedText>
                <ThemedText type="default" themeColor="textSecondary" style={styles.centered}>
                  {session?.email
                    ? `Defina a nova senha da conta ${session.email}.`
                    : 'Defina a nova senha da sua conta.'}
                </ThemedText>
              </View>

              <View style={styles.form}>
                <Campo
                  label="Nova senha"
                  value={senha}
                  onChangeText={setSenha}
                  placeholder={`Pelo menos ${MINIMO_SENHA} caracteres`}
                  ajuda={curta ? `Faltam ${MINIMO_SENHA - senha.length} caractere(s).` : undefined}
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
                  ajuda={diferem ? 'As duas senhas precisam ser iguais.' : undefined}
                  secureTextEntry
                  autoComplete="new-password"
                  autoCapitalize="none"
                  textContentType="newPassword"
                  onSubmitEditing={() => podeEnviar && !enviando && enviar()}
                />

                {erro && <Aviso tipo="erro" texto={erro} />}

                <Button
                  disabled={!podeEnviar}
                  loading={enviando}
                  onPress={enviar}
                  accessibilityHint="Salva a nova senha e abre o app">
                  Salvar nova senha
                </Button>

                <Button
                  variant="ghost"
                  disabled={enviando}
                  onPress={signOut}
                  accessibilityHint="Descarta a recuperação e volta para a tela de login">
                  Cancelar
                </Button>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  markGlyph: {
    fontSize: 34,
    lineHeight: 42,
  },
  centered: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
});
