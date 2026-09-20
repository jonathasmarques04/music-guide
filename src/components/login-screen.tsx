import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginFundo } from '@/components/login-fundo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Campo } from '@/components/ui/campo';
import { Entrada } from '@/components/ui/entrada';
import { Faixa } from '@/components/ui/faixa';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { flashcardsPorModulo } from '@/content/flashcards';
import { INSTRUMENTOS } from '@/content/instrumentos';
import { MODULOS } from '@/content/modulos';
import { PERCENTUAL_MINIMO } from '@/content/tipos';
import { MaxContentWidth, Radius, Rules, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { usePonteiro } from '@/hooks/use-ponteiro';
import { useTheme } from '@/hooks/use-theme';
import { MINIMO_SENHA, emailValido, faltamCaracteres } from '@/lib/credenciais';
import { doisDigitos } from '@/lib/formato';

/**
 * O Supabase recusa reenvios em sequência (um por minuto, por padrão). Melhor
 * segurar o botão do que deixar o aluno pedir de novo e levar erro de limite.
 */
const SEGUNDOS_ENTRE_REENVIOS = 60;

/**
 * A partir daqui a tela vira duas colunas: pôster à esquerda, formulário à
 * direita. Abaixo disso tudo empilha, porque duas colunas de 400pt não cabem
 * sem espremer a medida de leitura.
 */
const LARGURA_DUAS_COLUNAS = 900;

/** Abaixo disso é celular: o pôster encolhe para o formulário subir. */
const LARGURA_CELULAR = 600;

/**
 * O palco das duas colunas é mais largo que a coluna de leitura — mas cada
 * metade continua abaixo de {@link MaxContentWidth}, que é o que importa para
 * a medida do texto.
 */
const LARGURA_PALCO = 1160;

type Modo = 'boasVindas' | 'entrar' | 'cadastrar' | 'recuperar';

/** O que muda de um modo para o outro — o formulário em si é o mesmo. */
type TextosDoModo = {
  kicker: string;
  titulo: string;
  acao: string;
  dica: string;
  /** O rótulo do botão depois que a ação deu certo. */
  concluido: string;
};

const TEXTOS: Record<Exclude<Modo, 'boasVindas'>, TextosDoModo> = {
  entrar: {
    kicker: 'Área do aluno',
    titulo: 'Entrar',
    acao: 'Entrar',
    dica: 'Entra na sua conta e abre a trilha de onde você parou',
    concluido: 'Entrando',
  },
  cadastrar: {
    kicker: 'Nova conta',
    titulo: 'Criar conta',
    acao: 'Criar conta',
    dica: 'Cria sua conta e começa a trilha pelos fundamentos',
    concluido: 'Conta criada',
  },
  recuperar: {
    kicker: 'Recuperação',
    titulo: 'Esqueci a senha',
    acao: 'Enviar link de recuperação',
    dica: 'Envia para o seu e-mail um link de redefinição de senha',
    concluido: 'Link enviado',
  },
};

/** Os três módulos que resumem a trilha, para a tela de boas-vindas. */
const VITRINE = [1, 5, 12]
  .map((numero) => MODULOS.find((modulo) => modulo.numero === numero))
  .filter((modulo): modulo is (typeof MODULOS)[number] => !!modulo);

/** Contado do conteúdo, para a vitrine nunca prometer um número que mudou. */
const TOTAL_DE_CARDS = MODULOS.reduce(
  (soma, modulo) => soma + flashcardsPorModulo(modulo.id).length,
  0,
);

/**
 * O ciclo de um módulo, que é o produto inteiro em três passos.
 *
 * Estava dito numa frase só ("aula em passos, avaliação e baralho de revisão"),
 * onde o leitor passa batido. Separado em três, cada passo tem espaço para
 * dizer o que de fato acontece — e o mínimo de {@link PERCENTUAL_MINIMO}% sai
 * da mesma constante que a avaliação usa para aprovar.
 */
const CICLO = [
  {
    titulo: 'Aula em passos',
    detalhe: 'O módulo vem fatiado em seções curtas, com tabela e exemplo em cada uma.',
  },
  {
    titulo: 'Avaliação',
    detalhe: `Questões de múltipla escolha ao fim do módulo. ${PERCENTUAL_MINIMO}% libera o próximo.`,
  },
  {
    titulo: 'Baralho de revisão',
    detalhe: 'Repetição espaçada: errar traz o card de volta em minutos, acertar empurra para dias.',
  },
] as const;

/** Os três tamanhos de tela que mudam a composição desta tela. */
function useFormato() {
  const { width } = useWindowDimensions();

  return {
    duasColunas: width >= LARGURA_DUAS_COLUNAS,
    celular: width < LARGURA_CELULAR,
  };
}

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
  /**
   * Campos que já perderam o foco uma vez.
   *
   * A validação só fala depois disso. Acusar "e-mail inválido" na terceira
   * letra digitada é recusar um endereço que a pessoa ainda está escrevendo.
   */
  const [tocados, setTocados] = useState<Record<string, boolean>>({});

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
    setTocados({});
    limparErroLink();
    if (proximo !== 'cadastrar') setNome('');
    if (proximo === 'recuperar') setSenha('');
  };

  if (modo === 'boasVindas') {
    return (
      <Palco>
        <BoasVindas
          onEntrar={() => irPara('entrar')}
          onCadastrar={() => irPara('cadastrar')}
          onVisitante={signInAsGuest}
        />
      </Palco>
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
  /** A ação terminou bem e não há o que refazer: o botão vira confirmação. */
  const concluido = !!aviso && !erro;
  const tocar = (campo: string) => setTocados((atual) => ({ ...atual, [campo]: true }));

  /*
   * A dica do e-mail só vira recusa depois do primeiro `blur` E com algo
   * escrito: campo vazio que nunca foi tocado não errou nada ainda.
   */
  const emailSujo = !!tocados.email && email.trim().length > 0;
  const emailInvalido = emailSujo && !emailOk;

  const senhaSuja = !!tocados.senha && senha.length > 0;
  const senhaCurta = modo === 'cadastrar' && senhaSuja && !senhaValida;

  const nomeInvalido = !!tocados.nome && nome.trim().length > 0 && !nomeValido;

  return (
    <Palco>
      <Formulario
        modo={modo}
        textos={textos}
        nome={nome}
        email={email}
        senha={senha}
        enviando={enviando}
        concluido={concluido}
        podeEnviar={podeEnviar}
        erro={erro}
        erroLink={erroLink}
        aviso={aviso}
        emailPendente={emailPendente}
        esperaReenvio={esperaReenvio}
        emailInvalido={emailInvalido}
        emailSujo={emailSujo}
        emailOk={emailOk}
        senhaCurta={senhaCurta}
        nomeInvalido={nomeInvalido}
        onNome={setNome}
        onEmail={setEmail}
        onSenha={setSenha}
        onTocar={tocar}
        onEnviar={enviar}
        onReenviar={reenviar}
        onIrPara={irPara}
      />
    </Palco>
  );
}

/**
 * O palco de toda a tela de entrada: o fundo vivo, a área segura, a rolagem e
 * a medida do conteúdo.
 *
 * É aqui que mora o ponteiro. A posição é lida no nó de cima — que não
 * intercepta clique nenhum, só escuta — e desce por `SharedValue` até a grade
 * do fundo, sem passar por estado do React: mover o mouse não re-renderiza o
 * formulário, então digitar continua respondendo enquanto a luz corre.
 */
function Palco({ children }: { children: React.ReactNode }) {
  const ponteiro = usePonteiro();

  return (
    <ThemedView style={styles.raiz} {...ponteiro.props}>
      {/*
        O `pointerEvents="none"` vai no invólucro, e não só dentro do fundo: o
        `Entrada` que faz a camada aparecer é um nó de tela cheia como qualquer
        outro, e sem isto ele seria um vidro invisível por cima da tela toda.
      */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Entrada indice={0} deslocamento={0} style={StyleSheet.absoluteFill}>
          <LoginFundo x={ponteiro.x} y={ponteiro.y} />
        </Entrada>
      </View>

      <SafeAreaView style={styles.raiz} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.raiz}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.rolagem}
            keyboardShouldPersistTaps="handled"
            /* A rolagem segue natural; só o indicador some no iOS, que o desenha por cima do pôster. */
            showsVerticalScrollIndicator={Platform.OS !== 'ios'}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

/**
 * O pôster da marca — a metade esquerda no desktop, o cabeçalho no celular.
 *
 * A régua de destaque em cima é o `accentDisplay` no seu papel de origem:
 * régua de pôster, sem rótulo pequeno por cima (ver a tabela em `theme.ts`).
 */
function PainelMarca({ resumido = false }: { resumido?: boolean }) {
  const theme = useTheme();
  const { celular } = useFormato();

  return (
    <View style={styles.marca}>
      <Entrada indice={1} style={styles.blocoMarca}>
        <View style={[styles.reguaDestaque, { backgroundColor: theme.accentDisplay }]} />
        <ThemedText type="kicker">Music Guide</ThemedText>
        <ThemedText type={celular ? 'title' : 'display'} accessibilityRole="header">
          Teoria musical{'\n'}sem enrolação.
        </ThemedText>
      </Entrada>

      {!resumido && (
        <>
          <Entrada indice={2} style={styles.blocoMarca}>
            <Regua />
            <ThemedText type="default" themeColor="textSecondary">
              {MODULOS.length} módulos em ordem, do conceito de nota à construção de linhas de baixo.
              Cada um com aula em passos, avaliação e baralho de revisão.
            </ThemedText>
          </Entrada>

          {/*
            Os três números que respondem "quanto conteúdo tem aqui?" antes de
            pedir e-mail. São contados do conteúdo real, nunca escritos à mão:
            uma promessa de 18 módulos que virasse 17 seria mentira em letra
            grande.
          */}
          <Entrada indice={3}>
            <Faixa
              peso="forte"
              itens={[
                { rotulo: 'Módulos', valor: `${MODULOS.length}`, destaque: true },
                { rotulo: 'Cards', valor: `${TOTAL_DE_CARDS}` },
                { rotulo: 'Instrumentos', valor: `${INSTRUMENTOS.length}` },
              ]}
            />
          </Entrada>
        </>
      )}
    </View>
  );
}

/** A moldura das duas colunas, com a régua vertical que as separa. */
function DuasColunas({ marca, conteudo }: { marca: React.ReactNode; conteudo: React.ReactNode }) {
  const { duasColunas } = useFormato();

  if (!duasColunas) {
    return (
      <View style={styles.palcoEmpilhado}>
        {marca}
        {conteudo}
      </View>
    );
  }

  return (
    <View style={styles.palcoLado}>
      <View style={styles.colunaMarca}>{marca}</View>
      <Regua style={styles.reguaVertical} />
      <View style={styles.colunaConteudo}>{conteudo}</View>
    </View>
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
    <DuasColunas
      marca={<PainelMarca />}
      conteudo={
        <View style={styles.colunaEmpilhada}>
          {/*
            Rótulo e lista num bloco próprio, com folga menor que a da coluna: o
            versalete precisa grudar no que ele nomeia. Com o mesmo respiro dos
            vizinhos, ele flutuaria entre a faixa de cima e a vitrine de baixo
            sem pertencer a nenhuma das duas.
          */}
          <Entrada indice={4} style={styles.secao}>
            <ThemedText type="label">Alguns módulos</ThemedText>

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
          </Entrada>

          {/*
            O bloco de tinta: o mesmo recurso do placar de progresso e do cartão
            do flashcard. Aqui ele carrega o ciclo que o aluno vai repetir 18
            vezes — e é o peso visual que separa a vitrine dos botões.
          */}
          <Entrada indice={5}>
            <View style={[styles.ciclo, { backgroundColor: theme.inverse }]}>
              <ThemedText type="kicker" style={{ color: theme.inverseMuted }}>
                Como funciona
              </ThemedText>

              {CICLO.map((passo, i) => (
                <View
                  key={passo.titulo}
                  style={[
                    styles.cicloPasso,
                    i > 0 && { borderTopWidth: Rules.hair, borderTopColor: theme.inverseMuted },
                  ]}>
                  <ThemedText type="numero" style={[styles.cicloNumero, { color: theme.inverseMuted }]}>
                    {doisDigitos(i + 1)}
                  </ThemedText>
                  <View style={styles.cicloTexto}>
                    <ThemedText type="rowTitle" style={{ color: theme.inverseOn }}>
                      {passo.titulo}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: theme.inverseMuted }}>
                      {passo.detalhe}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </Entrada>

          <Entrada indice={6} style={styles.acoes}>
            <Button bloco size="lg" onPress={onCadastrar}>
              Criar conta grátis
            </Button>
            <Button bloco size="lg" variant="secondary" onPress={onEntrar}>
              Já tenho conta
            </Button>

            {/*
              Bypass de desenvolvimento: entra sem credencial e sem conta no
              Supabase. Fica atrás de `__DEV__`, então some do build de produção
              — com autenticação real no lugar, deixar isso em produção seria
              uma porta aberta.
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
          </Entrada>
        </View>
      }
    />
  );
}

type FormularioProps = {
  modo: Exclude<Modo, 'boasVindas'>;
  textos: TextosDoModo;
  nome: string;
  email: string;
  senha: string;
  enviando: boolean;
  concluido: boolean;
  podeEnviar: boolean;
  erro: string | null;
  erroLink: string | null;
  aviso: string | null;
  emailPendente: string | null;
  esperaReenvio: number;
  emailInvalido: boolean;
  emailSujo: boolean;
  emailOk: boolean;
  senhaCurta: boolean;
  nomeInvalido: boolean;
  onNome: (valor: string) => void;
  onEmail: (valor: string) => void;
  onSenha: (valor: string) => void;
  onTocar: (campo: string) => void;
  onEnviar: () => void;
  onReenviar: () => void;
  onIrPara: (modo: Modo) => void;
};

/**
 * O formulário, dentro do painel que o separa do pôster.
 *
 * O painel é o contorno de 2px na cor da tinta — o mesmo recurso da `Faixa`
 * forte — com a aresta de cima no vermelhão de pôster. É o que põe o
 * formulário num plano à frente do fundo sem usar sombra, que este sistema não
 * tem.
 */
function Formulario({
  modo,
  textos,
  nome,
  email,
  senha,
  enviando,
  concluido,
  podeEnviar,
  erro,
  erroLink,
  aviso,
  emailPendente,
  esperaReenvio,
  emailInvalido,
  emailSujo,
  emailOk,
  senhaCurta,
  nomeInvalido,
  onNome,
  onEmail,
  onSenha,
  onTocar,
  onEnviar,
  onReenviar,
  onIrPara,
}: FormularioProps) {
  const theme = useTheme();
  const { celular, duasColunas } = useFormato();

  return (
    <DuasColunas
      /*
       * Empilhado, o pôster vem resumido: a descrição e a faixa de números já
       * convenceram na tela anterior, e aqui elas só empurrariam os campos para
       * baixo da dobra. Em duas colunas isso não custa nada — o pôster está ao
       * LADO do formulário, não acima dele —, então ele volta inteiro.
       */
      marca={<PainelMarca resumido={!duasColunas} />}
      conteudo={
        <Entrada indice={2}>
          <View
            style={[
              styles.painel,
              celular ? styles.painelCelular : styles.painelAmplo,
              duasColunas && styles.painelEstreito,
              {
                borderColor: theme.text,
                borderTopColor: theme.accentDisplay,
                /*
                 * Opaco, e não só "a mesma cor do chão": sem preenchimento o
                 * painel é um retângulo vazado, e a grade do fundo passa por
                 * dentro dele — atravessando campo e botão como se fosse uma
                 * emenda na tela. O plano da frente tem de esconder o de trás,
                 * que é justamente o que faz dele um plano.
                 */
                backgroundColor: theme.background,
              },
            ]}>
            <Button variant="ghost" size="sm" onPress={() => onIrPara('boasVindas')}>
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
                onChangeText={onNome}
                onBlur={() => onTocar('nome')}
                invalido={nomeInvalido}
                reservarAjuda
                ajuda={nomeInvalido ? 'Use pelo menos duas letras.' : ''}
                placeholder="Como você quer ser chamado"
                autoComplete="name"
                autoCapitalize="words"
                textContentType="name"
              />
            )}

            <Campo
              label="E-mail"
              value={email}
              onChangeText={onEmail}
              onBlur={() => onTocar('email')}
              invalido={emailInvalido}
              valido={emailSujo && emailOk}
              reservarAjuda
              ajuda={
                emailInvalido
                  ? 'Falta o @ ou o domínio.'
                  : emailSujo && emailOk
                    ? 'E-mail válido.'
                    : ''
              }
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
                  onChangeText={onSenha}
                  onBlur={() => onTocar('senha')}
                  invalido={senhaCurta}
                  reservarAjuda={modo === 'entrar'}
                  ajuda={senhaCurta ? faltamCaracteres(MINIMO_SENHA - senha.length) : ''}
                  placeholder={modo === 'cadastrar' ? `Pelo menos ${MINIMO_SENHA} caracteres` : 'Sua senha'}
                  secureTextEntry
                  autoComplete={modo === 'cadastrar' ? 'new-password' : 'current-password'}
                  autoCapitalize="none"
                  textContentType={modo === 'cadastrar' ? 'newPassword' : 'password'}
                  onSubmitEditing={() => podeEnviar && !enviando && onEnviar()}
                />
                {/*
                  No cadastro o medidor está SEMPRE na tela, mesmo com o campo
                  vazio: assim ele diz as regras antes da primeira tentativa, e
                  a lista de exigências não empurra o botão para baixo no
                  instante em que a primeira tecla é digitada.
                */}
                {modo === 'cadastrar' && <ForcaDaSenha senha={senha} />}
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
              sucesso={concluido}
              onPress={onEnviar}
              accessibilityHint={textos.dica}>
              {concluido ? textos.concluido : textos.acao}
            </Button>

            {emailPendente && (
              <Button
                bloco
                variant="secondary"
                disabled={enviando || esperaReenvio > 0}
                onPress={onReenviar}
                accessibilityHint={`Envia de novo o e-mail de confirmação para ${emailPendente}`}>
                {esperaReenvio > 0 ? `Reenviar em ${esperaReenvio}s` : 'Não recebi o e-mail — reenviar'}
              </Button>
            )}

            <View style={styles.rodape}>
              <Regua peso="hair" />
              {modo === 'entrar' && (
                <>
                  <Button variant="ghost" size="sm" onPress={() => onIrPara('recuperar')}>
                    Esqueci a senha
                  </Button>
                  <Button variant="ghost" size="sm" onPress={() => onIrPara('cadastrar')}>
                    Ainda não tenho conta — cadastrar
                  </Button>
                </>
              )}
              {modo !== 'entrar' && (
                <Button variant="ghost" size="sm" onPress={() => onIrPara('entrar')}>
                  Já tenho conta — entrar
                </Button>
              )}
            </View>
          </View>
        </Entrada>
      }
    />
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
  rolagem: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
  },

  /* ---- palco ---- */
  palcoLado: {
    flexDirection: 'row',
    /*
     * As duas colunas raramente têm a mesma altura — o pôster é curto e o
     * conteúdo é longo. Centrado, o pôster fica na diagonal de leitura de quem
     * vai para o formulário; encostado no topo, ele deixaria embaixo um vão do
     * tamanho da diferença entre as duas.
     */
    alignItems: 'center',
    gap: Spacing.five,
    width: '100%',
    maxWidth: LARGURA_PALCO,
  },
  palcoEmpilhado: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  colunaMarca: { flex: 4 },
  colunaConteudo: { flex: 5 },
  /*
   * A régua que separa as colunas. `Regua` desenha uma linha horizontal; aqui
   * o `style`, que entra por último, a vira de pé — e `alignSelf: stretch` faz
   * ela acompanhar a altura da coluna mais alta.
   */
  reguaVertical: { width: Rules.thick, height: 'auto', alignSelf: 'stretch' },
  colunaEmpilhada: { gap: Spacing.four },

  /* ---- pôster ---- */
  marca: { gap: Spacing.four },
  blocoMarca: { gap: Spacing.one + Spacing.half },
  /* A régua curta de pôster, acima do versalete da marca. */
  reguaDestaque: { width: 56, height: Rules.thick, marginBottom: Spacing.two },

  /* ---- painel do formulário ---- */
  painel: {
    borderWidth: Rules.thick,
    borderRadius: Radius,
    gap: Spacing.three,
  },
  painelAmplo: { padding: Spacing.four + Spacing.two },
  painelCelular: { padding: Spacing.three + Spacing.one },
  /*
   * Em duas colunas o painel para de esticar. Um campo de e-mail de 600pt de
   * largura não fica mais fácil de preencher — só fica mais largo que a
   * informação que carrega, e o rótulo perde o vínculo com a caixa.
   */
  painelEstreito: { maxWidth: 520 },

  titulo: { gap: Spacing.one + Spacing.half },
  senha: { gap: Spacing.two },
  forca: { gap: Spacing.one },
  forcaBarras: { flexDirection: 'row', gap: Spacing.half },
  forcaBarra: { flex: 1, height: Spacing.one - 1 },

  /* ---- vitrine e ciclo ---- */
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
  secao: { gap: Spacing.two },
  ciclo: { padding: Spacing.three + Spacing.one, gap: Spacing.two + Spacing.one },
  cicloPasso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingTop: Spacing.two + Spacing.one,
  },
  /* Largura fixa para os três numerais alinharem a coluna de texto ao lado. */
  cicloNumero: { width: 32, fontSize: 18, lineHeight: 22 },
  cicloTexto: { flex: 1, gap: Spacing.half },
  acoes: { gap: Spacing.two },
  rodape: { paddingTop: Spacing.two, gap: Spacing.one },
});
