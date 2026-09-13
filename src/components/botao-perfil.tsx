import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';

/**
 * O retrato do aluno no topo das abas, que leva ao Perfil.
 *
 * Lê o nome e a foto do contexto de auth — a mesma sessão que já está montada
 * para o app inteiro. Nenhuma tela busca o perfil de novo para desenhar isto:
 * quem carrega `nome` e `avatar_url` é o `AuthProvider`, uma vez por login.
 *
 * Fica em `components/` e não em `components/ui/` porque conhece o contexto e
 * o roteador. O `Avatar` que ele desenha continua sendo peça de kit, sem saber
 * de onde vem a foto.
 */
export function BotaoPerfil() {
  const router = useRouter();
  const theme = useTheme();
  const ponteiro = useHover();
  const { session } = useAuth();

  const nome = session?.nome?.trim() || 'estudante';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Perfil de ${nome}`}
      accessibilityHint="Abre a aba de perfil"
      onPress={() => router.push('/perfil')}
      {...ponteiro.props}
      style={({ pressed }) => [
        styles.alvo,
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      <Avatar
        nome={nome}
        avatarUrl={session?.avatarUrl ?? null}
        style={ponteiro.hover ? { borderColor: theme.accent } : undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /*
   * O quadrado tem 40pt, abaixo dos 44 exigidos para alvo de toque. Crescer o
   * desenho estragaria a proporção com o título ao lado, então quem cresce é o
   * alvo: o `Pressable` ganha os 4pt que faltam em volta.
   */
  alvo: { padding: 2, alignSelf: 'flex-start' },
});
