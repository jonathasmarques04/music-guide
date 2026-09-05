import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BracoCompacto, type CasaBraco } from '@/components/ui/braco';
import { Button } from '@/components/ui/button';
import { Campo } from '@/components/ui/campo';
import { Faixa } from '@/components/ui/faixa';
import { LinhaLista } from '@/components/ui/linha-lista';
import { Nota } from '@/components/ui/nota';
import { Regua } from '@/components/ui/regua';
import { Tag } from '@/components/ui/tag';
import { Tela } from '@/components/ui/tela';
import { flashcardsPorModulo } from '@/content/flashcards';
import { MODULOS } from '@/content/modulos';
import { Radius, Rules, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useProgresso } from '@/contexts/progresso';
import { useHover } from '@/hooks/use-hover';
import { useTheme } from '@/hooks/use-theme';
import { MINIMO_SENHA, emailValido, faltamCaracteres } from '@/lib/credenciais';
import { iniciais } from '@/lib/formato';

const TOTAL_CARDS = MODULOS.reduce((soma, m) => soma + flashcardsPorModulo(m.id).length, 0);

/** O que os três formulários da seção "Conta" recebem do contexto de auth. */
type Gravar = (valor: string) => Promise<{ erro: string | null }>;

export default function PerfilScreen() {
  const {
    session,
    atualizarNome,
    atualizarAvatar,
    removerAvatar,
    atualizarEmail,
    atualizarSenha,
    signOut,
  } = useAuth();
  const { concluidos, totalAulas, statusDe, reiniciar } = useProgresso();

  const nomeAtual = session?.nome?.trim() || 'estudante';

  /* Uma casa por módulo, na ordem da trilha. */
  const casas: CasaBraco[] = MODULOS.map((modulo) => ({
    numero: modulo.numero,
    status: statusDe(modulo.id),
  }));

  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);

  /* Só uma seção da conta aberta por vez: o perfil é tela de consulta, e três
     formulários abertos ao mesmo tempo viram um painel de configuração. */
  const [editando, setEditando] = useState<'nome' | 'email' | 'senha' | null>(null);
  const [trocandoFoto, setTrocandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState<string | null>(null);

  const visitante = !!session?.isGuest;

  /*
   * O seletor devolve um arquivo local; quem sobe para o bucket é o contexto.
   * `allowsEditing` com proporção 1:1 evita subir um retrato inteiro para caber
   * num quadrado de 64pt.
   */
  const escolherFoto = async () => {
    setErroFoto(null);

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErroFoto('Precisamos do acesso às suas fotos para trocar o avatar.');
      return;
    }

    const escolha = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (escolha.canceled) return;

    setTrocandoFoto(true);
    const { erro: falha } = await atualizarAvatar(escolha.assets[0].uri);
    setErroFoto(falha);
    setTrocandoFoto(false);
  };

  const apagarFoto = async () => {
    setErroFoto(null);
    setTrocandoFoto(true);
    const { erro: falha } = await removerAvatar();
    setErroFoto(falha);
    setTrocandoFoto(false);
  };

  return (
    <Tela>
      <View style={styles.identidade}>
        <FotoDePerfil
          nome={nomeAtual}
          avatarUrl={session?.avatarUrl ?? null}
          ocupado={trocandoFoto}
          podeTrocar={!visitante}
          onTrocar={escolherFoto}
        />
        <View style={styles.identidadeTexto}>
          <ThemedText type="subtitle" accessibilityRole="header">
            {nomeAtual}
          </ThemedText>
          <ThemedText type="small">{session?.email ?? 'Sessão sem e-mail'}</ThemedText>
          <Tag variant={session?.isGuest ? 'outline' : 'accent'}>
            {session?.isGuest ? 'Modo visitante' : 'Conta ativa'}
          </Tag>
        </View>
      </View>

      {erroFoto && <Nota tom="erro" rotulo="Foto" texto={erroFoto} />}

      {!visitante && session?.avatarUrl && (
        <Button
          variant="ghost"
          size="sm"
          disabled={trocandoFoto}
          onPress={apagarFoto}
          accessibilityHint="Remove a foto e volta às iniciais">
          Remover foto
        </Button>
      )}

      <Regua />

      <Faixa
        itens={[
          { rotulo: 'Aprovados', valor: `${concluidos}/${totalAulas}` },
          { rotulo: 'Cards', valor: `${TOTAL_CARDS}` },
          { rotulo: 'Módulos', valor: `${MODULOS.length}`, destaque: true },
        ]}
      />

      <ThemedText type="label">Conta</ThemedText>

      <View>
        <LinhaLista
          rotulo="Nome"
          valor={nomeAtual}
          onPress={visitante ? undefined : () => setEditando(editando === 'nome' ? null : 'nome')}
          accessibilityHint="Abre o formulário de troca de nome"
        />
        {editando === 'nome' && <TrocarNome nomeAtual={nomeAtual} onTrocar={atualizarNome} />}

        <LinhaLista
          rotulo="E-mail"
          valor={session?.email ?? '—'}
          onPress={visitante ? undefined : () => setEditando(editando === 'email' ? null : 'email')}
          accessibilityHint="Abre o formulário de troca de e-mail"
        />
        {editando === 'email' && (
          <TrocarEmail emailAtual={session?.email ?? ''} onTrocar={atualizarEmail} />
        )}

        <LinhaLista
          rotulo="Senha"
          valor="••••••••"
          onPress={visitante ? undefined : () => setEditando(editando === 'senha' ? null : 'senha')}
          accessibilityHint="Abre o formulário de troca de senha"
        />
        {editando === 'senha' && <TrocarSenha onTrocar={atualizarSenha} />}

        <LinhaLista rotulo="Idioma" valor="Português" />
        <LinhaLista rotulo="Nomes das notas" valor="Dó Ré Mi (com cifra)" />
        <LinhaLista rotulo="Progresso" valor={`${concluidos} de ${totalAulas} aprovados`} />
        <View style={styles.braco}>
          <BracoCompacto casas={casas} />
        </View>
      </View>

      {visitante && (
        <Nota
          tom="aviso"
          rotulo="Modo visitante"
          texto="Nome, foto, e-mail e senha só existem em conta de verdade. Crie uma para poder mudá-los."
        />
      )}

      <View style={styles.zonaDeRisco}>
        {confirmandoReinicio ? (
          <>
            <Nota
              tom="aviso"
              rotulo="Apagar o progresso"
              texto="Isto zera todas as notas e tranca a trilha de volta no módulo 01. Não dá para desfazer."
            />
            <View style={styles.confirmacao}>
              <Button
                variant="secondary"
                onPress={() => {
                  reiniciar();
                  setConfirmandoReinicio(false);
                }}
                accessibilityHint="Apaga todas as notas e volta a trilha ao começo">
                Sim, apagar tudo
              </Button>
              <Button variant="ghost" onPress={() => setConfirmandoReinicio(false)}>
                Cancelar
              </Button>
            </View>
          </>
        ) : (
          <Button
            bloco
            variant="secondary"
            onPress={() => setConfirmandoReinicio(true)}
            accessibilityHint="Pede confirmação antes de zerar suas notas">
            Reiniciar meu progresso
          </Button>
        )}

        <Button
          bloco
          variant="ghost"
          onPress={signOut}
          accessibilityHint="Encerra a sessão e volta para a tela de entrada">
          Sair da conta
        </Button>
      </View>
    </Tela>
  );
}


/**
 * A foto de perfil.
 *
 * O quadrado de contorno grosso é o mesmo elemento que já existia — a foto
 * entra DENTRO dele, sem raio e sem máscara redonda, porque o sistema não
 * arredonda nada. Sem foto, valem as iniciais.
 */
function FotoDePerfil({
  nome,
  avatarUrl,
  ocupado,
  podeTrocar,
  onTrocar,
}: {
  nome: string;
  avatarUrl: string | null;
  ocupado: boolean;
  podeTrocar: boolean;
  onTrocar: () => void;
}) {
  const theme = useTheme();
  const ponteiro = useHover();

  const conteudo = avatarUrl ? (
    <Image
      source={{ uri: avatarUrl }}
      style={styles.foto}
      contentFit="cover"
      transition={200}
      /* A foto é decorativa: o nome já está escrito ao lado, em texto. */
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  ) : (
    <ThemedText type="subtitle">{iniciais(nome)}</ThemedText>
  );

  if (!podeTrocar) {
    return <View style={[styles.avatar, { borderColor: theme.text }]}>{conteudo}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={avatarUrl ? 'Trocar a foto de perfil' : 'Escolher uma foto de perfil'}
      accessibilityState={{ busy: ocupado }}
      disabled={ocupado}
      onPress={onTrocar}
      {...ponteiro.props}
      style={({ pressed }) => [
        styles.avatar,
        { borderColor: theme.text },
        ponteiro.hover && { borderColor: theme.accent },
        pressed && { backgroundColor: theme.backgroundSelected },
        ocupado && styles.avatarOcupado,
      ]}>
      {conteudo}

      {/*
        A faixa so aparece com ponteiro ou durante o envio: no celular ela
        taparia metade de um alvo de 64pt o tempo todo.
      */}
      {(ponteiro.hover || ocupado) && (
        <View style={[styles.faixaFoto, { backgroundColor: theme.inverse }]}>
          <ThemedText type="small" style={[styles.faixaFotoTexto, { color: theme.inverseOn }]}>
            {ocupado ? 'enviando' : 'trocar'}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

/** Troca do nome de exibição — o que aparece no "Olá, ..." da trilha. */
function TrocarNome({
  nomeAtual,
  onTrocar,
}: {
  nomeAtual: string;
  onTrocar: Gravar;
}) {
  const [nome, setNome] = useState(nomeAtual);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  const valido = nome.trim().length >= 2;
  const mudou = nome.trim() !== nomeAtual;

  const salvar = async () => {
    setSalvando(true);
    setErro(null);
    setSalvo(false);

    const { erro: falha } = await onTrocar(nome.trim());

    setErro(falha);
    setSalvo(!falha);
    setSalvando(false);
  };

  return (
    <View style={styles.formulario}>
      <Campo
        label="Como você quer ser chamado"
        value={nome}
        onChangeText={(texto) => {
          setNome(texto);
          setSalvo(false);
        }}
        placeholder="Seu nome"
        autoComplete="name"
        autoCapitalize="words"
        textContentType="name"
        invalido={nome.length > 0 && !valido}
        ajuda={nome.length > 0 && !valido ? 'Use pelo menos duas letras.' : undefined}
        onSubmitEditing={() => valido && mudou && !salvando && salvar()}
      />

      {erro && <Nota tom="erro" rotulo="Não deu para salvar" texto={erro} />}
      {salvo && !mudou && <Nota rotulo="✓ Salvo" texto="Seu nome já aparece na trilha." />}

      <Button
        bloco
        disabled={!valido || !mudou}
        loading={salvando}
        onPress={salvar}
        accessibilityHint="Grava o novo nome na sua conta">
        Salvar nome
      </Button>
    </View>
  );
}

/**
 * Troca de e-mail — duas etapas, e a tela diz isso.
 *
 * O Supabase não muda o endereço na hora: manda um link de confirmação. Sem
 * avisar, o aluno salva, vê o e-mail antigo na tela e acha que falhou.
 */
function TrocarEmail({
  emailAtual,
  onTrocar,
}: {
  emailAtual: string;
  onTrocar: Gravar;
}) {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const valido = emailValido(email) && email.trim() !== emailAtual;

  const enviar = async () => {
    setEnviando(true);
    setErro(null);

    const { erro: falha } = await onTrocar(email);

    setErro(falha);
    setEnviado(!falha);
    setEnviando(false);
  };

  return (
    <View style={styles.formulario}>
      <Campo
        label="Novo e-mail"
        value={email}
        onChangeText={(texto) => {
          setEmail(texto);
          setEnviado(false);
        }}
        placeholder="voce@exemplo.com"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />

      {erro && <Nota tom="erro" rotulo="Não deu para trocar" texto={erro} />}
      {enviado ? (
        <Nota
          rotulo="✓ Confirme no seu e-mail"
          texto={`Mandamos um link para ${email.trim()}. O endereço da conta só muda depois que você clicar nele.`}
        />
      ) : (
        <Nota
          rotulo="Como funciona"
          texto="Você recebe um link no endereço novo. A conta só passa a usá-lo depois da confirmação."
        />
      )}

      <Button
        bloco
        disabled={!valido}
        loading={enviando}
        onPress={enviar}
        accessibilityHint="Envia o link de confirmação para o novo endereço">
        Enviar confirmação
      </Button>
    </View>
  );
}

/** Troca de senha na sessão já aberta. */
function TrocarSenha({ onTrocar }: { onTrocar: Gravar }) {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [trocada, setTrocada] = useState(false);

  const curta = senha.length > 0 && senha.length < MINIMO_SENHA;
  const diferem = confirmacao.length > 0 && senha !== confirmacao;
  const pode = senha.length >= MINIMO_SENHA && senha === confirmacao;

  const enviar = async () => {
    setEnviando(true);
    setErro(null);

    const { erro: falha } = await onTrocar(senha);

    setErro(falha);
    setTrocada(!falha);
    setEnviando(false);

    if (!falha) {
      setSenha('');
      setConfirmacao('');
    }
  };

  return (
    <View style={styles.formulario}>
      <Campo
        label="Nova senha"
        value={senha}
        onChangeText={(texto) => {
          setSenha(texto);
          setTrocada(false);
        }}
        placeholder={`Pelo menos ${MINIMO_SENHA} caracteres`}
        invalido={curta}
        ajuda={curta ? faltamCaracteres(MINIMO_SENHA - senha.length) : undefined}
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
        invalido={diferem}
        ajuda={diferem ? 'As duas senhas precisam ser iguais.' : undefined}
        secureTextEntry
        autoComplete="new-password"
        autoCapitalize="none"
        textContentType="newPassword"
        onSubmitEditing={() => pode && !enviando && enviar()}
      />

      {erro && <Nota tom="erro" rotulo="Não deu para trocar" texto={erro} />}
      {trocada && <Nota rotulo="✓ Senha trocada" texto="Use a nova da próxima vez que entrar." />}

      <Button
        bloco
        disabled={!pode}
        loading={enviando}
        onPress={enviar}
        accessibilityHint="Grava a nova senha na sua conta">
        Trocar senha
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
  },
  avatar: {
    width: 64,
    height: 64,
    borderWidth: Rules.thick,
    borderRadius: Radius,
    alignItems: 'center',
    justifyContent: 'center',
    /* A foto e a faixa "trocar" ficam contidas pelo quadrado. */
    overflow: 'hidden',
  },
  avatarOcupado: { opacity: 0.6 },
  foto: { width: '100%', height: '100%' },
  /* Faixa chapada rente ao rodapé do quadrado — o sistema não usa véu. */
  faixaFoto: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: Spacing.half,
    alignItems: 'center',
  },
  faixaFotoTexto: { fontSize: 10, lineHeight: 13 },
  formulario: {
    gap: Spacing.two,
    paddingTop: Spacing.two + Spacing.one,
    paddingBottom: Spacing.three,
  },
  identidadeTexto: { flex: 1, gap: Spacing.one },
  /* A faixa respira dentro da lista, sem virar mais uma linha da tabela. */
  braco: { paddingTop: Spacing.two + Spacing.one, paddingBottom: Spacing.two },
  zonaDeRisco: { marginTop: 'auto', paddingTop: Spacing.four, gap: Spacing.two },
  confirmacao: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
