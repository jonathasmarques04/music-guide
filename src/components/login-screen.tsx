import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';

/** Mesmo mínimo que o Supabase aplica no servidor. */
const MINIMO_SENHA = 6;

/**
 * O Supabase recusa reenvios em sequência (um por minuto, por padrão). Melhor
 * segurar o botão do que deixar o aluno pedir de novo e levar erro de limite.
 */
const SEGUNDOS_ENTRE_REENVIOS = 60;

type Modo = 'entrar' | 'cadastrar' | 'recuperar';

const TEXTOS: Record<Modo, { acao: string; chamada: string; dica: string }> = {
  entrar: {
    acao: 'Entrar',
    chamada: 'Teoria musical, do primeiro intervalo ao campo harmônico.',
    dica: 'Entra na sua conta e abre a trilha de onde você parou',
  },
  cadastrar: {
    acao: 'Criar conta',
    chamada: 'Crie sua conta para salvar seu progresso na trilha.',
    dica: 'Cria sua conta e começa a trilha pelos fundamentos',
  },
  recuperar: {
    acao: 'Enviar link de recuperação',
    chamada: 'Informe seu e-mail e enviamos um link para você definir uma nova senha.',
    dica: 'Envia para o seu e-mail um link de redefinição de senha',
  },
};

export function LoginScreen() {
  const theme = useTheme();
  const { signIn, signUp, recuperarSenha, reenviarConfirmacao, signInAsGuest, erroLink, limparErroLink } =
    useAuth();

  const [modo, setModo] = useState<Modo>('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  /** Conta que existe mas ainda não teve o e-mail confirmado: dá direito ao reenvio. */
  const [emailPendente, setEmailPendente] = useState<string | null>(null);
  /** Segundos restantes até o próximo reenvio ser aceito pelo servidor. */
  const [esperaReenvio, setEsperaReenvio] = useState(0);

  useEffect(() => {
    if (esperaReenvio <= 0) return;

    const id = setTimeout(() => setEsperaReenvio((restante) => restante - 1), 1000);
    return () => clearTimeout(id);
  }, [esperaReenvio]);

  const emailValido = /^\S+@\S+\.\S+$/.test(email.trim());
  const senhaValida = senha.length >= MINIMO_SENHA;
  const nomeValido = nome.trim().length >= 2;

  const podeEnviar =
    modo === 'recuperar'
      ? emailValido
      : modo === 'entrar'
        ? emailValido && senha.length > 0
        : nomeValido && emailValido && senhaValida;

  /** Trocar de modo zera o que era resposta da tentativa anterior. */
  const irPara = (proximo: Modo) => {
    setModo(proximo);
    setErro(null);
    setAviso(null);
    setEmailPendente(null);
    limparErroLink();
    if (proximo !== 'cadastrar') setNome('');
    if (proximo === 'recuperar') setSenha('');
  };

  const enviar = async () => {
    setEnviando(true);
    setErro(null);
    setAviso(null);
    setEmailPendente(null);
    limparErroLink();

    if (modo === 'entrar') {
      const { erro: falha, precisaConfirmarEmail } = await signIn(email, senha);
      if (falha) setErro(falha);

      // A conta existe, a senha até pode estar certa, mas o e-mail nunca foi
      // confirmado. Em vez de deixar o aluno preso no erro, abrimos o reenvio
      // aqui mesmo — é o caso de quem se cadastrou ontem e voltou hoje.
      if (precisaConfirmarEmail) setEmailPendente(email.trim());
    } else if (modo === 'cadastrar') {
      const { erro: falha, precisaConfirmarEmail } = await signUp(nome, email, senha);
      if (falha) {
        setErro(falha);
      } else if (precisaConfirmarEmail) {
        // Sem sessão: a conta existe, mas só abre depois do clique no e-mail.
        setAviso(`Conta criada. Confirme o e-mail que enviamos para ${email.trim()} e volte para entrar.`);
        setEmailPendente(email.trim());
        setEsperaReenvio(SEGUNDOS_ENTRE_REENVIOS);
        setSenha('');
      }
      // Com confirmação desligada no projeto, a sessão já vem pronta e o
      // AuthGate troca de tela sozinho — não há nada a fazer aqui.
    } else {
      const { erro: falha } = await recuperarSenha(email);
      if (falha) {
        setErro(falha);
      } else {
        // Resposta igual existindo a conta ou não: não entregamos quem tem cadastro.
        setAviso(`Se existir uma conta para ${email.trim()}, o link de recuperação já está a caminho.`);
      }
    }

    setEnviando(false);
  };

  const reenviar = async () => {
    if (!emailPendente) return;

    setEnviando(true);
    setErro(null);
    limparErroLink();

    const { erro: falha } = await reenviarConfirmacao(emailPendente);
    setErro(falha);

    if (!falha) {
      setAviso(`Reenviamos a confirmação para ${emailPendente}. Confira também a caixa de spam.`);
      setEsperaReenvio(SEGUNDOS_ENTRE_REENVIOS);
    }

    setEnviando(false);
  };

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
                  {TEXTOS[modo].chamada}
                </ThemedText>
              </View>

              <View style={styles.form}>
                {modo === 'cadastrar' && (
                  <Campo
                    label="Nome"
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Como você quer ser chamado"
                    autoComplete="name"
                    autoCapitalize="words"
                    textContentType="name"
                  />
                )}

                <Campo
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="voce@exemplo.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />

                {modo !== 'recuperar' && (
                  <Campo
                    label="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    placeholder={modo === 'cadastrar' ? `Pelo menos ${MINIMO_SENHA} caracteres` : 'Sua senha'}
                    ajuda={
                      modo === 'cadastrar'
                        ? `Use ${MINIMO_SENHA} caracteres ou mais.`
                        : undefined
                    }
                    secureTextEntry
                    autoComplete={modo === 'cadastrar' ? 'new-password' : 'current-password'}
                    autoCapitalize="none"
                    textContentType={modo === 'cadastrar' ? 'newPassword' : 'password'}
                    onSubmitEditing={() => podeEnviar && !enviando && enviar()}
                  />
                )}

                {erroLink && <Aviso tipo="erro" texto={erroLink} />}
                {erro && <Aviso tipo="erro" texto={erro} />}
                {aviso && <Aviso tipo="info" texto={aviso} />}

                <Button
                  disabled={!podeEnviar}
                  loading={enviando}
                  onPress={enviar}
                  accessibilityHint={TEXTOS[modo].dica}>
                  {TEXTOS[modo].acao}
                </Button>

                {emailPendente && (
                  <Button
                    variant="ghost"
                    disabled={enviando || esperaReenvio > 0}
                    onPress={reenviar}
                    accessibilityHint={`Envia de novo o e-mail de confirmação para ${emailPendente}`}>
                    {esperaReenvio > 0
                      ? `Reenviar em ${esperaReenvio}s`
                      : 'Não recebi o e-mail — reenviar'}
                  </Button>
                )}

                {modo === 'entrar' && (
                  <Link
                    texto="Esqueci minha senha"
                    hint="Abre o formulário para receber um link de redefinição de senha"
                    onPress={() => irPara('recuperar')}
                  />
                )}
              </View>

              <View style={styles.divisor}>
                <View style={[styles.linha, { backgroundColor: theme.border }]} />
                <ThemedText type="small" themeColor="textMuted">
                  ou
                </ThemedText>
                <View style={[styles.linha, { backgroundColor: theme.border }]} />
              </View>

              <View style={styles.alternativas}>
                {modo === 'entrar' ? (
                  <Link
                    texto="Ainda não tenho conta — criar agora"
                    hint="Abre o formulário de cadastro"
                    onPress={() => irPara('cadastrar')}
                  />
                ) : (
                  <Link
                    texto="Já tenho conta — entrar"
                    hint="Volta para o formulário de login"
                    onPress={() => irPara('entrar')}
                  />
                )}

                {/*
                  Bypass de desenvolvimento: entra sem credencial e sem conta no
                  Supabase. Fica atrás de `__DEV__`, então some do build de
                  produção — com autenticação real no lugar, deixar isso em
                  produção seria uma porta aberta.
                */}
                {__DEV__ && (
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
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

/**
 * Erro e informação nunca dependem só da cor (vermelho/verde exclui quem tem
 * daltonismo): cada aviso carrega também um símbolo e um rótulo em texto.
 */
export function Aviso({ tipo, texto }: { tipo: 'erro' | 'info'; texto: string }) {
  const theme = useTheme();
  const erro = tipo === 'erro';

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.aviso,
        {
          backgroundColor: erro ? theme.errorSurface : theme.accentSurface,
          borderColor: erro ? theme.error : theme.accent,
        },
      ]}>
      <ThemedText type="smallBold" themeColor={erro ? 'error' : 'accent'}>
        {erro ? '✕' : '✓'}
      </ThemedText>
      <ThemedText type="small" style={styles.avisoTexto}>
        <ThemedText type="smallBold" themeColor={erro ? 'error' : 'accent'}>
          {erro ? 'Erro: ' : 'Tudo certo: '}
        </ThemedText>
        {texto}
      </ThemedText>
    </View>
  );
}

function Link({ texto, hint, onPress }: { texto: string; hint: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
      <ThemedText type="smallBold" themeColor="accent" style={styles.centered}>
        {texto}
      </ThemedText>
    </Pressable>
  );
}

type CampoProps = React.ComponentProps<typeof TextInput> & { label: string; ajuda?: string };

export function Campo({ label, ajuda, ...rest }: CampoProps) {
  const theme = useTheme();

  return (
    <View style={styles.campo}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={ajuda}
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
      {ajuda && (
        <ThemedText type="small" themeColor="textMuted">
          {ajuda}
        </ThemedText>
      )}
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
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  avisoTexto: {
    flex: 1,
  },
  link: {
    minHeight: MinTouchTarget,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
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
  alternativas: {
    gap: Spacing.three,
  },
  bypass: {
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
});
