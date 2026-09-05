import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Campo } from '@/components/ui/campo';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tela } from '@/components/ui/tela';
import { MODULOS } from '@/content/modulos';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';
import { MINIMO_SENHA, emailValido } from '@/lib/credenciais';
import { doisDigitos } from '@/lib/formato';

/**
 * O Supabase recusa reenvios em sequência (um por minuto, por padrão). Melhor
 * segurar o botão do que deixar o aluno pedir de novo e levar erro de limite.
 */
const SEGUNDOS_ENTRE_REENVIOS = 60;

type Modo = 'boasVindas' | 'entrar' | 'cadastrar' | 'recuperar';

/** O que muda de um modo para o outro — o formulário em si é o mesmo. */
type TextosDoModo = { kicker: string; titulo: string; acao: string; dica: string };

const TEXTOS: Record<Exclude<Modo, 'boasVindas'>, TextosDoModo> = {
  entrar: {
    kicker: 'Área do aluno',
    titulo: 'Entrar',
    acao: 'Entrar',
    dica: 'Entra na sua conta e abre a trilha de onde você parou',
  },
  cadastrar: {
    kicker: 'Nova conta',
    titulo: 'Criar conta',
    acao: 'Criar conta',
    dica: 'Cria sua conta e começa a trilha pelos fundamentos',
  },
  recuperar: {
    kicker: 'Recuperação',
    titulo: 'Esqueci a senha',
    acao: 'Enviar link de recuperação',
    dica: 'Envia para o seu e-mail um link de redefinição de senha',
  },
};

/** Os três módulos que resumem a trilha, para a tela de boas-vindas. */
const VITRINE = [1, 5, 12]
  .map((numero) => MODULOS.find((modulo) => modulo.numero === numero))
  .filter((modulo): modulo is (typeof MODULOS)[number] => !!modulo);

export function LoginScreen() {
  const {
    signIn,
    signUp,
    recuperarSenha,
    reenviarConfirmacao,
    signInAsGuest,
    erroLink,
    limparErroLink,
  } = useAuth();

  const [modo, setModo] = useState<Modo>('boasVindas');
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

  const emailOk = emailValido(email);
  const senhaValida = senha.length >= MINIMO_SENHA;
  const nomeValido = nome.trim().length >= 2;

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

  if (modo === 'boasVindas') {
    return (
      <BoasVindas
        onEntrar={() => irPara('entrar')}
        onCadastrar={() => irPara('cadastrar')}
        onVisitante={signInAsGuest}
      />
    );
  }

  const podeEnviar =
    modo === 'recuperar'
      ? emailOk
      : modo === 'entrar'
        ? emailOk && senha.length > 0
        : nomeValido && emailOk && senhaValida;

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
        // A resposta é a mesma, exista a conta ou não: não entregamos quem tem cadastro.
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

  const textos = TEXTOS[modo];

  return (
    <KeyboardAvoidingView
      style={styles.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela espaco={Spacing.two + Spacing.one}>
        <Button variant="ghost" size="sm" onPress={() => irPara('boasVindas')}>
          ← Início
        </Button>

        <View style={styles.titulo}>
          <ThemedText type="kicker">{textos.kicker}</ThemedText>
          <ThemedText type="title" accessibilityRole="header">
            {textos.titulo}
          </ThemedText>
        </View>

        <Regua />

        {modo === 'recuperar' && (
          <ThemedText type="default" themeColor="textSecondary">
            Informe seu e-mail e enviaremos um link para você definir uma nova senha.
          </ThemedText>
        )}

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
          <View style={styles.senha}>
            <Campo
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              placeholder={modo === 'cadastrar' ? `Pelo menos ${MINIMO_SENHA} caracteres` : 'Sua senha'}
              secureTextEntry
              autoComplete={modo === 'cadastrar' ? 'new-password' : 'current-password'}
              autoCapitalize="none"
              textContentType={modo === 'cadastrar' ? 'newPassword' : 'password'}
              onSubmitEditing={() => podeEnviar && !enviando && enviar()}
            />
            {modo === 'cadastrar' && senha.length > 0 && <ForcaDaSenha senha={senha} />}
          </View>
        )}

        {erroLink && <Nota tom="erro" rotulo="Link recusado" texto={erroLink} />}
        {erro && <Nota tom="erro" rotulo="Erro" texto={erro} />}
        {aviso && <Nota rotulo="✓ Tudo certo" texto={aviso} />}

        <Button
          bloco
          size="lg"
          disabled={!podeEnviar}
          loading={enviando}
          onPress={enviar}
          accessibilityHint={textos.dica}>
          {textos.acao}
        </Button>

        {emailPendente && (
          <Button
            bloco
            variant="secondary"
            disabled={enviando || esperaReenvio > 0}
            onPress={reenviar}
            accessibilityHint={`Envia de novo o e-mail de confirmação para ${emailPendente}`}>
            {esperaReenvio > 0 ? `Reenviar em ${esperaReenvio}s` : 'Não recebi o e-mail — reenviar'}
          </Button>
        )}

        <View style={styles.rodape}>
          <Regua peso="hair" />
          {modo === 'entrar' && (
            <>
              <Button variant="ghost" size="sm" onPress={() => irPara('recuperar')}>
                Esqueci a senha
              </Button>
              <Button variant="ghost" size="sm" onPress={() => irPara('cadastrar')}>
                Ainda não tenho conta — cadastrar
              </Button>
            </>
          )}
          {modo !== 'entrar' && (
            <Button variant="ghost" size="sm" onPress={() => irPara('entrar')}>
              Já tenho conta — entrar
            </Button>
          )}
        </View>
      </Tela>
    </KeyboardAvoidingView>
  );
}

/**
 * A porta de entrada: o que a trilha é, três módulos de amostra e os três
 * caminhos possíveis. Tudo rente à esquerda, como manda o sistema.
 */
function BoasVindas({
  onEntrar,
  onCadastrar,
  onVisitante,
}: {
  onEntrar: () => void;
  onCadastrar: () => void;
  onVisitante: () => void;
}) {
  const theme = useTheme();

  return (
    <Tela espaco={Spacing.three}>
      <View style={styles.titulo}>
        <ThemedText type="kicker">Music Guide</ThemedText>
        <ThemedText type="display" accessibilityRole="header">
          Teoria musical{'\n'}sem enrolação.
        </ThemedText>
      </View>

      <ThemedText type="default" themeColor="textSecondary">
        {MODULOS.length} módulos em ordem, do conceito de nota à construção de linhas de baixo. Cada um com
        aula em passos, avaliação e baralho de revisão.
      </ThemedText>

      <View style={[styles.vitrine, { borderColor: theme.divider }]}>
        {VITRINE.map((modulo, i) => (
          <View
            key={modulo.id}
            style={[
              styles.vitrineLinha,
              i > 0 && { borderTopWidth: Rules.hair, borderTopColor: theme.hairline },
            ]}>
            <View style={[styles.vitrineNumero, { borderRightColor: theme.hairline }]}>
              <ThemedText type="rowTitle" themeColor="accent" style={styles.vitrineNumeroTexto}>
                {doisDigitos(modulo.numero)}
              </ThemedText>
            </View>
            <View style={styles.vitrineTexto}>
              <ThemedText type="rowTitle">{modulo.titulo}</ThemedText>
              <ThemedText type="small" numberOfLines={2}>
                {modulo.resumo}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.acoes}>
        <Button bloco size="lg" onPress={onCadastrar}>
          Criar conta grátis
        </Button>
        <Button bloco size="lg" variant="secondary" onPress={onEntrar}>
          Já tenho conta
        </Button>

        {/*
          Bypass de desenvolvimento: entra sem credencial e sem conta no
          Supabase. Fica atrás de `__DEV__`, então some do build de produção —
          com autenticação real no lugar, deixar isso em produção seria uma
          porta aberta.
        */}
        {__DEV__ && (
          <>
            <Button
              variant="ghost"
              onPress={onVisitante}
              accessibilityHint="Pula o login e entra em modo visitante, sem conta">
              Entrar como visitante
            </Button>
            <ThemedText type="small" themeColor="textMuted">
              Atalho de desenvolvimento. Seu progresso não será salvo.
            </ThemedText>
          </>
        )}
      </View>
    </Tela>
  );
}

/**
 * Medidor de força da senha.
 *
 * São quatro exigências independentes, e o medidor diz **quais** faltam — uma
 * barra que só muda de cor não ensina ninguém a escolher uma senha melhor.
 */
function ForcaDaSenha({ senha }: { senha: string }) {
  const theme = useTheme();

  const criterios = [
    { rotulo: `${MINIMO_SENHA} caracteres`, ok: senha.length >= MINIMO_SENHA },
    { rotulo: '8 ou mais', ok: senha.length >= 8 },
    { rotulo: 'um número', ok: /\d/.test(senha) },
    { rotulo: 'um símbolo', ok: /[^\w\s]/.test(senha) },
  ];

  const atendidos = criterios.filter((criterio) => criterio.ok).length;
  const faltando = criterios.filter((criterio) => !criterio.ok).map((criterio) => criterio.rotulo);

  return (
    <View
      style={styles.forca}
      accessibilityRole="progressbar"
      accessibilityLabel="Força da senha"
      accessibilityValue={{ min: 0, max: criterios.length, now: atendidos }}>
      <View style={styles.forcaBarras}>
        {criterios.map((criterio, i) => (
          <View
            key={criterio.rotulo}
            style={[
              styles.forcaBarra,
              { backgroundColor: i < atendidos ? theme.accentStrong : theme.backgroundSelected },
            ]}
          />
        ))}
      </View>
      <ThemedText type="small" themeColor="textMuted">
        {faltando.length === 0 ? '✓ Senha forte.' : `Falta: ${faltando.join(', ')}.`}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  titulo: { gap: Spacing.one + Spacing.half },
  senha: { gap: Spacing.two },
  forca: { gap: Spacing.one },
  forcaBarras: { flexDirection: 'row', gap: Spacing.half },
  forcaBarra: { flex: 1, height: Spacing.one - 1 },
  vitrine: {
    borderTopWidth: Rules.thick,
    borderBottomWidth: Rules.thick,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: Radius,
  },
  vitrineLinha: { flexDirection: 'row', alignItems: 'stretch' },
  vitrineNumero: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: Rules.hair,
  },
  vitrineNumeroTexto: { fontSize: 15 },
  vitrineTexto: {
    flex: 1,
    gap: Spacing.half,
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.two + Spacing.one,
  },
  acoes: { marginTop: 'auto', paddingTop: Spacing.three, gap: Spacing.two },
  rodape: { marginTop: 'auto', paddingTop: Spacing.three, gap: Spacing.one },
});
