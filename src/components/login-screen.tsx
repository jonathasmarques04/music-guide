import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';

export function LoginScreen() {
  const theme = useTheme();
  const { signIn, signInAsGuest } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const podeEntrar = email.trim().length > 0 && senha.length > 0;

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.header}>
                <ThemedView type="accentSurface" style={styles.mark}>
                  <ThemedText style={[styles.markGlyph, { color: theme.accent }]}>
                    ♪
                  </ThemedText>
                </ThemedView>

                <ThemedText
                  type="subtitle"
                  accessibilityRole="header"
                  style={styles.centered}>
                  musica
                </ThemedText>
                <ThemedText
                  type="default"
                  themeColor="textSecondary"
                  style={styles.centered}>
                  Teoria musical, do primeiro intervalo ao campo harmônico.
                </ThemedText>
              </View>

              <View style={styles.form}>
                <Campo
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="voce@exemplo.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                />

                <Campo
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Sua senha"
                  secureTextEntry
                  autoComplete="current-password"
                  autoCapitalize="none"
                  textContentType="password"
                />

                <Button
                  disabled={!podeEntrar}
                  onPress={() => signIn(email.trim())}
                  accessibilityHint="Entra na sua conta e abre os primeiros passos">
                  Entrar
                </Button>
              </View>

              <View style={styles.divisor}>
                <View style={[styles.linha, { backgroundColor: theme.border }]} />
                <ThemedText type="small" themeColor="textMuted">
                  ou
                </ThemedText>
                <View style={[styles.linha, { backgroundColor: theme.border }]} />
              </View>

              {/*
                Bypass de desenvolvimento: entra sem credencial.
                ATENÇÃO: remova ou proteja com `__DEV__` antes de publicar.
              */}
              <View style={styles.bypass}>
                <Button
                  variant="secondary"
                  onPress={signInAsGuest}
                  accessibilityHint="Pula o login e entra em modo visitante, sem conta">
                  Entrar sem conta (bypass)
                </Button>
                <ThemedText
                  type="small"
                  themeColor="textMuted"
                  style={styles.centered}>
                  Atalho de desenvolvimento. Seu progresso não será salvo.
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

type CampoProps = React.ComponentProps<typeof TextInput> & { label: string };

function Campo({ label, ...rest }: CampoProps) {
  const theme = useTheme();

  return (
    <View style={styles.campo}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
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
  campo: {
    gap: Spacing.one,
  },
  input: {
    minHeight: MinTouchTarget,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  linha: {
    flex: 1,
    height: 1,
  },
  bypass: {
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
});
