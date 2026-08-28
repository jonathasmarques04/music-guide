/**
 * Cliente único do Supabase (auth + banco).
 *
 * Configuração: copie `.env.example` para `.env.local` e preencha as duas
 * variáveis. Elas usam o prefixo `EXPO_PUBLIC_` porque precisam ir para o
 * bundle do app — o que é seguro para a chave *anon*: ela é pública por
 * definição, e quem protege os dados é a RLS declarada em `supabase/schema.sql`.
 * NUNCA coloque aqui a `service_role`.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Database } from '@/lib/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase não configurado. Copie `.env.example` para `.env.local`, preencha ' +
      'EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY (Dashboard > Project Settings > API) ' +
      'e reinicie o servidor com `npx expo start --clear`.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    /**
     * No nativo a sessão mora no AsyncStorage — sem isso o login se perde a
     * cada abertura do app.
     *
     * Na web, deixamos o SDK escolher: no navegador ele usa o localStorage e,
     * no prerender do `expo export` (que roda em Node, sem `window`), ele cai
     * sozinho para memória. Passar o AsyncStorage também na web quebra esse
     * prerender, porque o adaptador web dele acessa `window` direto.
     */
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    /**
     * PKCE: os links de e-mail (confirmação e recuperação de senha) voltam com
     * `?code=`, que trocamos por sessão. Na web o próprio SDK lê a URL; no
     * nativo isso é feito no contexto de auth, a partir do deep link.
     */
    flowType: 'pkce',
    detectSessionInUrl: Platform.OS === 'web',
  },
});

/**
 * O token de acesso expira em ~1h. Enquanto o app está em primeiro plano o SDK
 * renova sozinho; em segundo plano o timer é suspenso pelo SO, então paramos e
 * retomamos junto com o ciclo de vida do app. Na web isso não se aplica.
 */
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (estado) => {
    if (estado === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
