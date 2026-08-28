import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LoginScreen } from '@/components/login-screen';
import { RedefinirSenhaScreen } from '@/components/redefinir-senha-screen';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/auth';
import { ProgressoProvider } from '@/contexts/progresso';

SplashScreen.preventAutoHideAsync();

/**
 * O app é sempre escuro — não seguimos o esquema do sistema. Partimos do
 * DarkTheme da navegação e sobrescrevemos as cores com a paleta do app, para
 * não sobrar o cinza padrão do React Navigation atrás das telas.
 */
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.backgroundElement,
    text: Colors.dark.text,
    border: Colors.dark.border,
    primary: Colors.dark.accent,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navigationTheme}>
      <AuthProvider>
        <ProgressoProvider>
          <StatusBar style="light" />
          <AnimatedSplashOverlay />
          <AuthGate />
        </ProgressoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

/** Enquanto não há sessão, o app inteiro fica atrás da tela de login. */
function AuthGate() {
  const { isAuthenticated, carregando, recuperandoSenha } = useAuth();

  /**
   * Restaurar a sessão salva é assíncrono. Sem esta espera, quem já está logado
   * vê a tela de login piscar por um instante a cada abertura do app. O splash
   * animado continua por cima, então a tela vazia não aparece.
   */
  if (carregando) {
    return <ThemedView style={{ flex: 1 }} />;
  }

  /** Veio de um link de recuperação: trocar a senha vem antes de tudo. */
  if (recuperandoSenha) {
    return <RedefinirSenhaScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
      }}
    />
  );
}
