import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LoginScreen } from '@/components/login-screen';
import { RedefinirSenhaScreen } from '@/components/redefinir-senha-screen';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/auth';
import { ProgressoProvider } from '@/contexts/progresso';
import { RevisaoProvider } from '@/contexts/revisao';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Só 'dark' vira escuro: `useColorScheme` também devolve null e 'unspecified'.
  const esquema = useColorScheme() === 'dark' ? 'dark' : 'light';
  const cores = Colors[esquema];

  /*
   * Archivo em três pesos — no nativo cada peso é uma família própria, então
   * os três precisam ser carregados por nome (ver `Fonts` em theme.ts).
   */
  const [fontesProntas] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });

  useEffect(() => {
    // Segurar o splash até as fontes chegarem evita o "flash" de texto na fonte
    // do sistema, que no Modernist muda o tamanho de tudo por um quadro.
    if (fontesProntas) SplashScreen.hideAsync();
  }, [fontesProntas]);

  const base = esquema === 'dark' ? DarkTheme : DefaultTheme;
  const temaNavegacao = {
    ...base,
    colors: {
      ...base.colors,
      background: cores.background,
      card: cores.backgroundElement,
      text: cores.text,
      border: cores.divider,
      primary: cores.accent,
    },
  };

  return (
    <ThemeProvider value={temaNavegacao}>
      <AuthProvider>
        <ProgressoProvider>
          <RevisaoProvider>
            <StatusBar style={esquema === 'dark' ? 'light' : 'dark'} />
            <AnimatedSplashOverlay />
            <AuthGate fundo={cores.background} />
          </RevisaoProvider>
        </ProgressoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

/** Enquanto não há sessão, o app inteiro fica atrás da tela de entrada. */
function AuthGate({ fundo }: { fundo: string }) {
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
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: fundo } }} />
  );
}
