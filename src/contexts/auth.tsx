import { createContext, useContext, useState, type ReactNode } from 'react';

type Session = {
  /** E-mail da conta, ou null quando a sessão veio do bypass. */
  email: string | null;
  /** true quando a sessão foi criada pelo bypass de desenvolvimento. */
  isGuest: boolean;
};

type AuthValue = {
  session: Session | null;
  isAuthenticated: boolean;
  /** Autenticação real ainda não implementada — hoje só cria a sessão local. */
  signIn: (email: string) => void;
  /** Bypass de desenvolvimento: entra sem credencial. */
  signInAsGuest: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const value: AuthValue = {
    session,
    isAuthenticated: session !== null,
    signIn: (email) => setSession({ email, isGuest: false }),
    signInAsGuest: () => setSession({ email: null, isGuest: true }),
    signOut: () => setSession(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  }

  return context;
}
