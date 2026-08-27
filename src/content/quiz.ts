import type { Questao } from './tipos';

/** Questões de avaliação por módulo (chave = id do módulo). */
export const QUIZZES: Record<string, Questao[]> = {
  'conceitos-basicos': [
    {
      pergunta: 'Qual é a menor distância entre duas notas na música ocidental?',
      alternativas: ['O tom', 'O semitom', 'A oitava', 'A terça'],
      correta: 1,
      explicacao: 'O semitom é a menor distância: uma tecla vizinha no piano, uma casa no violão.',
    },
    {
      pergunta: 'De Mi para Fá, qual é a distância?',
      alternativas: ['1 tom', '1 semitom', '1,5 tom', '2 semitons'],
      correta: 1,
      explicacao:
        'É 1 semitom, mesmo não havendo tecla preta entre elas. O mesmo vale para Si → Dó.',
    },
    {
      pergunta: 'Quantas notas simultâneas são necessárias para formar um acorde?',
      alternativas: ['Duas ou mais', 'Três ou mais', 'Exatamente quatro', 'Cinco ou mais'],
      correta: 1,
      explicacao: 'Acorde é o som de três ou mais notas tocadas ao mesmo tempo.',
    },
    {
      pergunta: 'O que a harmonia faz numa música?',
      alternativas: [
        'Organiza o som no tempo',
        'É a linha principal que se canta',
        'Sustenta a melodia com acordes e define o clima emocional',
        'Define o andamento em BPM',
      ],
      correta: 2,
      explicacao:
        'A harmonia é o conjunto de acordes que acompanha — o "fundo emocional" que colore a melodia.',
    },
    {
      pergunta: 'Num compasso 3/4, o número 4 (de baixo) indica o quê?',
      alternativas: [
        'Quantas batidas há no compasso',
        'Qual figura vale uma batida',
        'A velocidade da música',
        'Quantos compassos há na frase',
      ],
      correta: 1,
      explicacao:
        'O número de cima diz quantas batidas; o de baixo diz qual figura vale uma batida (4 = semínima).',
    },
    {
      pergunta: 'Qual é a diferença entre pulsação e ritmo?',
      alternativas: [
        'São sinônimos',
        'Pulsação é o batimento regular; ritmo é como as notas se distribuem sobre ele',
        'Pulsação é rápida; ritmo é lento',
        'Ritmo é o batimento regular; pulsação é a melodia',
      ],
      correta: 1,
      explicacao:
        'Se a pulsação é o relógio, o ritmo são os passos da dança dentro daquele tempo.',
    },
    {
      pergunta: 'O intervalo de Dó a Sol é chamado de:',
      alternativas: ['Quarta justa', 'Quinta justa', 'Sexta maior', 'Quinta diminuta'],
      correta: 1,
      explicacao: 'Dó → Sol são 7 semitons (3,5 tons): quinta justa.',
    },
    {
      pergunta: 'Dó♯ e Ré♭ são:',
      alternativas: [
        'Notas diferentes com sons diferentes',
        'A mesma nota com nomes diferentes (enarmônicas)',
        'Separadas por um tom inteiro',
        'A mesma nota em oitavas diferentes',
      ],
      correta: 1,
      explicacao:
        'São enarmônicas: mesmo som, nomes diferentes. Qual usar depende da tonalidade.',
    },
  ],

  escalas: [
    {
      pergunta: 'Qual é a fórmula da escala maior natural?',
      alternativas: [
        'T – st – T – T – st – T – T',
        'T – T – st – T – T – T – st',
        'T – T – T – st – T – T – st',
        'st – T – T – T – st – T – T',
      ],
      correta: 1,
      explicacao:
        'T–T–st–T–T–T–st. Os semitons caem entre o 3º–4º grau e entre o 7º–8º.',
    },
    {
      pergunta: 'Qual é a relativa menor de Dó maior?',
      alternativas: ['Mi menor', 'Ré menor', 'Lá menor', 'Sol menor'],
      correta: 2,
      explicacao:
        'Lá menor — fica um tom e meio (3 semitons) abaixo da tônica e tem exatamente as mesmas notas.',
    },
    {
      pergunta: 'Quantos semitons tem um trítono?',
      alternativas: ['4', '5', '6', '7'],
      correta: 2,
      explicacao:
        'Seis semitons (três tons), exatamente metade da oitava — por isso soa tão instável.',
    },
    {
      pergunta: 'Por que a pentatônica soa tão "segura"?',
      alternativas: [
        'Porque tem mais notas que a escala maior',
        'Porque removeu as notas que formavam o trítono',
        'Porque só é usada em tons maiores',
        'Porque não tem tônica definida',
      ],
      correta: 1,
      explicacao:
        'Ela elimina o trítono. Na pentatônica de Dó maior saem justamente Fá e Si.',
    },
    {
      pergunta: 'A pentatônica maior de Dó é formada por quais notas?',
      alternativas: [
        'Dó – Ré – Mi – Fá – Sol',
        'Dó – Ré – Mi – Sol – Lá',
        'Dó – Mi – Fá – Sol – Si',
        'Dó – Ré – Fá – Sol – Lá',
      ],
      correta: 1,
      explicacao: 'Graus 1 – 2 – 3 – 5 – 6: Dó, Ré, Mi, Sol, Lá.',
    },
    {
      pergunta: 'A escala menor natural de Lá tem qual fórmula?',
      alternativas: [
        'T – T – st – T – T – T – st',
        'T – st – T – T – st – T – T',
        'st – T – T – T – st – T – T',
        'T – T – T – st – T – T – st',
      ],
      correta: 1,
      explicacao: 'T–st–T–T–st–T–T, gerando Lá – Si – Dó – Ré – Mi – Fá – Sol.',
    },
    {
      pergunta: 'O que define o tipo de uma escala?',
      alternativas: [
        'A quantidade de notas apenas',
        'A ordem dos intervalos de tons e semitons',
        'A nota mais aguda',
        'O instrumento em que é tocada',
      ],
      correta: 1,
      explicacao:
        'É o padrão de tons e semitons que dá identidade à escala — a mesma fórmula em qualquer tônica gera o mesmo tipo.',
    },
  ],

  triades: [
    {
      pergunta: 'Qual nota do acorde define se ele é maior ou menor?',
      alternativas: ['A fundamental', 'A terça', 'A quinta', 'A sétima'],
      correta: 1,
      explicacao: 'A terça dá a emoção: maior = brilhante, menor = triste.',
    },
    {
      pergunta: 'A tríade maior é formada por:',
      alternativas: [
        'Fundamental + terça menor + quinta justa',
        'Fundamental + terça maior + quinta justa',
        'Fundamental + terça maior + quinta aumentada',
        'Fundamental + terça menor + quinta diminuta',
      ],
      correta: 1,
      explicacao: 'Terça maior (2 tons) + quinta justa (3,5 tons). Em Dó: Dó – Mi – Sol.',
    },
    {
      pergunta: 'Qual é a tríade diminuta de Si?',
      alternativas: ['Si – Ré – Fá', 'Si – Ré♯ – Fá♯', 'Si – Ré – Fá♯', 'Si – Ré♯ – Fá'],
      correta: 0,
      explicacao: 'Terça menor (Ré) + quinta diminuta (Fá): Si – Ré – Fá.',
    },
    {
      pergunta: 'A tríade aumentada tem qual quinta?',
      alternativas: ['Justa (3,5 tons)', 'Diminuta (3 tons)', 'Aumentada (4 tons)', 'Não tem quinta'],
      correta: 2,
      explicacao:
        'Quinta aumentada, 4 tons acima da fundamental. Em Dó: Dó – Mi – Sol♯.',
    },
    {
      pergunta: 'Quantos tons há entre a fundamental e a terça menor?',
      alternativas: ['1 tom', '1,5 tom', '2 tons', '2,5 tons'],
      correta: 1,
      explicacao: 'Terça menor = 1,5 tom (3 semitons). Terça maior = 2 tons.',
    },
    {
      pergunta: 'A combinação "terça menor + quinta justa" gera qual acorde?',
      alternativas: ['Maior', 'Menor', 'Diminuto', 'Aumentado'],
      correta: 1,
      explicacao: 'Terça menor com quinta justa = tríade menor: tristeza estável.',
    },
  ],

  tetrades: [
    {
      pergunta: 'O que diferencia o acorde X7 (dominante) do X7M?',
      alternativas: [
        'A terça: maior no X7, menor no X7M',
        'A sétima: menor no X7, maior no X7M',
        'A quinta: diminuta no X7',
        'Nada, são sinônimos',
      ],
      correta: 1,
      explicacao:
        'O dominante tem sétima MENOR (C7 = Dó–Mi–Sol–Si♭); o X7M tem sétima MAIOR (C7M = Dó–Mi–Sol–Si).',
    },
    {
      pergunta: 'Am7 é formado por quais notas?',
      alternativas: [
        'Lá – Dó – Mi – Sol',
        'Lá – Dó♯ – Mi – Sol',
        'Lá – Dó – Mi – Sol♯',
        'Lá – Dó – Mi♭ – Sol',
      ],
      correta: 0,
      explicacao: 'Terça menor (Dó), quinta justa (Mi) e sétima menor (Sol).',
    },
    {
      pergunta: 'O acorde meio diminuto (m7♭5) tem qual estrutura?',
      alternativas: [
        'Terça menor + quinta justa + sétima menor',
        'Terça menor + quinta diminuta + sétima menor',
        'Terça menor + quinta diminuta + sétima diminuta',
        'Terça maior + quinta diminuta + sétima menor',
      ],
      correta: 1,
      explicacao:
        'Terça menor, quinta diminuta e sétima menor. Bm7♭5 = Si – Ré – Fá – Lá.',
    },
    {
      pergunta: 'Por que a tétrade soa mais rica que a tríade?',
      alternativas: [
        'Porque é sempre mais aguda',
        'Porque contém duas tríades sobrepostas soando juntas',
        'Porque elimina o trítono',
        'Porque tem duas fundamentais',
      ],
      correta: 1,
      explicacao:
        'C7M contém Dó–Mi–Sol (maior) e Mi–Sol–Si (menor) ao mesmo tempo. É essa fusão que dá a "cor".',
    },
    {
      pergunta: 'O que caracteriza um acorde suspenso?',
      alternativas: [
        'Não tem quinta',
        'Não tem terça — ela foi substituída pela segunda ou pela quarta',
        'Tem duas sétimas',
        'Tem sempre cinco notas',
      ],
      correta: 1,
      explicacao:
        'Sem terça, ele não é maior nem menor: soa neutro e flutuante. Csus4 = Dó – Fá – Sol.',
    },
    {
      pergunta: 'Csus4 tende a resolver em qual acorde?',
      alternativas: ['G7', 'C', 'Am', 'F'],
      correta: 1,
      explicacao:
        'Csus4 → C, com o Fá (quarta) descendo para o Mi (terça) e devolvendo a identidade ao acorde.',
    },
  ],

  'campo-harmonico': [
    {
      pergunta: 'Qual é a fórmula do campo harmônico maior com tríades?',
      alternativas: [
        'I – ii – iii – IV – V – vi – vii°',
        'i – ii° – III – iv – v – VI – VII',
        'I – II – III – IV – V – VI – VII',
        'i – ii – III+ – IV – V – vi° – vii°',
      ],
      correta: 0,
      explicacao:
        'Maior, menor, menor, maior, maior, menor, diminuto — válido para qualquer tom maior.',
    },
    {
      pergunta: 'No campo harmônico de Dó maior, qual é o acorde do VI grau?',
      alternativas: ['Fá maior', 'Lá menor', 'Sol maior', 'Si diminuto'],
      correta: 1,
      explicacao: 'VI grau = Lá – Dó – Mi = Am (menor).',
    },
    {
      pergunta: 'Qual grau do campo harmônico maior gera o acorde diminuto?',
      alternativas: ['II', 'IV', 'VI', 'VII'],
      correta: 3,
      explicacao: 'O VII grau. Em Dó maior: Si – Ré – Fá = B°.',
    },
    {
      pergunta: 'No campo harmônico maior com tétrades, qual grau vira dominante (X7)?',
      alternativas: ['I', 'IV', 'V', 'VI'],
      correta: 2,
      explicacao:
        'Só o V grau. Em Dó maior é G7 — o único que contém o trítono e por isso pede resolução.',
    },
    {
      pergunta: 'Como se constrói o campo harmônico?',
      alternativas: [
        'Empilhando quartas sobre cada grau',
        'Empilhando terças diatônicas sobre cada grau da escala',
        'Transpondo a tônica sete vezes',
        'Somando os acidentes da armadura',
      ],
      correta: 1,
      explicacao:
        'Empilham-se terças usando apenas as notas da própria escala — duas terças para tríades, três para tétrades.',
    },
    {
      pergunta: 'Por que o campo harmônico menor natural tem uma dominante fraca?',
      alternativas: [
        'Porque não tem VII grau',
        'Porque o V grau é menor, e não maior',
        'Porque a tônica é diminuta',
        'Porque tem oito graus',
      ],
      correta: 1,
      explicacao:
        'Em Lá menor o V é Em (menor), sem trítono. É essa fraqueza que a menor harmônica resolve.',
    },
  ],

  'funcoes-harmonicas': [
    {
      pergunta: 'Quais são as três funções harmônicas?',
      alternativas: [
        'Melodia, harmonia e ritmo',
        'Tônica, subdominante e dominante',
        'Maior, menor e diminuta',
        'Início, meio e fim',
      ],
      correta: 1,
      explicacao:
        'Tônica (repouso), subdominante (movimento) e dominante (tensão).',
    },
    {
      pergunta: 'Quais graus exercem função de tônica no campo harmônico maior?',
      alternativas: ['I, IV e V', 'I, vi e iii', 'ii e IV', 'V e vii°'],
      correta: 1,
      explicacao: 'I (o mais estável), vi (relativo menor) e iii (mais leve, mas sem tensão).',
    },
    {
      pergunta: 'Qual função representa movimento e preparação?',
      alternativas: ['Tônica', 'Subdominante', 'Dominante', 'Mediante'],
      correta: 1,
      explicacao:
        'A subdominante (IV e ii) já saiu do repouso, mas ainda não chegou à tensão máxima.',
    },
    {
      pergunta: 'De onde vem a tensão característica da função dominante?',
      alternativas: [
        'Da quinta justa',
        'Do trítono presente no V7 e no vii°',
        'Da oitava dobrada',
        'Da ausência de terça',
      ],
      correta: 1,
      explicacao:
        'O trítono entre a terça e a sétima do acorde é o que empurra a harmonia de volta à tônica.',
    },
    {
      pergunta: 'Em Dó maior, o acorde Dm exerce qual função?',
      alternativas: ['Tônica', 'Subdominante', 'Dominante', 'Nenhuma'],
      correta: 1,
      explicacao: 'Dm é o ii grau — função subdominante, mais suave que o IV (F).',
    },
    {
      pergunta: 'Qual é a sensação típica da função tônica?',
      alternativas: [
        'Urgência de resolver',
        'Expectativa suave de que algo virá',
        'Conclusão, repouso, "cheguei"',
        'Instabilidade e dissonância',
      ],
      correta: 2,
      explicacao: 'É o chão da música: o lugar para onde a harmonia volta.',
    },
  ],

  'menores-harmonica-melodica': [
    {
      pergunta: 'O que a escala menor harmônica altera em relação à menor natural?',
      alternativas: [
        'Eleva o 6º grau',
        'Eleva o 7º grau',
        'Eleva o 6º e o 7º graus',
        'Abaixa o 2º grau',
      ],
      correta: 1,
      explicacao:
        'Só o 7º grau. Em Lá menor, o Sol vira Sol♯ — criando o trítono que permite o E7.',
    },
    {
      pergunta: 'Qual é o objetivo principal da menor harmônica?',
      alternativas: [
        'Deixar a melodia mais suave',
        'Criar um acorde dominante forte (V7) no tom menor',
        'Eliminar o trítono da escala',
        'Reduzir a escala a cinco notas',
      ],
      correta: 1,
      explicacao:
        'Sem a alteração, o V grau seria menor e não geraria a tensão necessária para resolver.',
    },
    {
      pergunta: 'A escala menor melódica eleva quais graus?',
      alternativas: ['Só o 7º', 'Só o 6º', 'O 6º e o 7º', 'O 3º e o 7º'],
      correta: 2,
      explicacao:
        'Ambos. Em Lá: Lá – Si – Dó – Ré – Mi – Fá♯ – Sol♯, suavizando o salto da menor harmônica.',
    },
    {
      pergunta: 'Em Lá menor harmônica, qual acorde aparece no V grau?',
      alternativas: ['Em', 'E7', 'Em7', 'E°'],
      correta: 1,
      explicacao:
        'Com o Sol♯, o V grau vira E maior (Mi – Sol♯ – Si) e, como tétrade, E7 — o dominante que faltava.',
    },
    {
      pergunta: 'Qual escala é mais associada ao jazz por sua fluidez ascendente?',
      alternativas: ['Menor natural', 'Menor harmônica', 'Menor melódica', 'Pentatônica menor'],
      correta: 2,
      explicacao:
        'A menor melódica, por elevar também a sexta, cria uma linha ascendente elegante e sem o salto brusco.',
    },
  ],

  cadencias: [
    {
      pergunta: 'Qual movimento define a cadência perfeita?',
      alternativas: ['IV → I', 'V → I', 'V → vi', 'I → V'],
      correta: 1,
      explicacao:
        'V (ou V7) → I, com a tônica na fundamental e no baixo. É o encerramento mais conclusivo.',
    },
    {
      pergunta: 'A cadência plagal é conhecida como "cadência do amém". Qual é o movimento?',
      alternativas: ['V → I', 'IV → I', 'ii → V', 'V → vi'],
      correta: 1,
      explicacao:
        'IV → I, subdominante para tônica. Como não tem trítono, resolve com suavidade.',
    },
    {
      pergunta: 'Numa cadência deceptiva em Dó maior, G7 resolve em qual acorde?',
      alternativas: ['C', 'Am', 'F', 'Em'],
      correta: 1,
      explicacao:
        'V → vi. O ouvido espera o C e recebe Am: a expectativa é quebrada de propósito.',
    },
    {
      pergunta: 'O que caracteriza uma meia cadência?',
      alternativas: [
        'Terminar no acorde I',
        'Terminar no acorde V',
        'Terminar no acorde IV',
        'Não usar dominante',
      ],
      correta: 1,
      explicacao:
        'Qualquer progressão que TERMINA no V. Cria suspense — é a vírgula da música.',
    },
    {
      pergunta: 'O que torna uma cadência V → I "imperfeita"?',
      alternativas: [
        'Usar V7 em vez de V',
        'A tônica não estar na fundamental, ou a melodia não terminar na tônica',
        'Vir depois de um acorde menor',
        'Estar em tom menor',
      ],
      correta: 1,
      explicacao:
        'O caminho harmônico é o mesmo, mas algum detalhe enfraquece a sensação de conclusão.',
    },
    {
      pergunta: 'Qual cadência é ideal para encerrar uma frase sem encerrar a música?',
      alternativas: ['Perfeita', 'Plagal', 'Meia cadência', 'Nenhuma'],
      correta: 2,
      explicacao:
        'A meia cadência prepara o caminho para a próxima progressão em vez de finalizar.',
    },
  ],

  dominantes: [
    {
      pergunta: 'Qual é a estrutura do acorde dominante (V7)?',
      alternativas: [
        'Fundamental + 3ª maior + 5ª justa + 7ª maior',
        'Fundamental + 3ª maior + 5ª justa + 7ª menor',
        'Fundamental + 3ª menor + 5ª justa + 7ª menor',
        'Fundamental + 3ª menor + 5ª diminuta + 7ª menor',
      ],
      correta: 1,
      explicacao: 'Acorde maior com sétima menor. G7 = Sol – Si – Ré – Fá.',
    },
    {
      pergunta: 'Em G7 → C, como o trítono resolve?',
      alternativas: [
        'Si sobe para Dó e Fá desce para Mi',
        'Si desce para Lá e Fá sobe para Sol',
        'Ambas as notas sobem um tom',
        'O trítono se mantém',
      ],
      correta: 0,
      explicacao:
        'Cada nota do trítono se move meio tom, em direções opostas, encaixando na tríade de Dó.',
    },
    {
      pergunta: 'O que é um dominante secundário?',
      alternativas: [
        'O segundo acorde do campo harmônico',
        'Um V7 que resolve em outro grau, tratado como tônica provisória',
        'Um acorde com duas sétimas',
        'O acorde do II grau',
      ],
      correta: 1,
      explicacao:
        'E7 → Am em Dó maior é V7/vi: E7 não pertence ao campo, mas aparece para preparar o Am.',
    },
    {
      pergunta: 'Em Dó maior, qual é o dominante secundário de Dm?',
      alternativas: ['E7', 'A7', 'D7', 'B7'],
      correta: 1,
      explicacao: 'A é a quinta de D, então A7 → Dm. Notação: V7/ii.',
    },
    {
      pergunta: 'Qual é o substituto tritonal de G7?',
      alternativas: ['C7', 'D♭7', 'F7', 'B7'],
      correta: 1,
      explicacao:
        'D♭7 está a um trítono de G7 e compartilha o mesmo trítono interno (Si/Dó♭ e Fá), resolvendo também em C.',
    },
    {
      pergunta: 'O que é uma sequência de dominantes estendidos?',
      alternativas: [
        'Um acorde dominante tocado por muitos compassos',
        'Vários dominantes encadeados, cada um sendo o V7 do próximo',
        'Um dominante com nona e décima terceira',
        'Dois dominantes tocados juntos',
      ],
      correta: 1,
      explicacao: 'Como A7 → D7 → G7 → C: uma escada de tensão até o alvo.',
    },
  ],

  'ciclo-das-quintas': [
    {
      pergunta: 'No sentido horário, o ciclo das quintas avança por qual intervalo?',
      alternativas: ['Quarta justa', 'Quinta justa', 'Terça maior', 'Segunda maior'],
      correta: 1,
      explicacao: 'Cada nota está uma quinta justa acima da anterior: C → G → D → A…',
    },
    {
      pergunta: 'Quantos sustenidos tem a tonalidade de Lá maior?',
      alternativas: ['2', '3', '4', '5'],
      correta: 1,
      explicacao: 'Lá está 3 passos no sentido horário a partir de Dó: 3 sustenidos (F♯, C♯, G♯).',
    },
    {
      pergunta: 'Qual tonalidade tem exatamente 1 bemol?',
      alternativas: ['Sol maior', 'Fá maior', 'Si♭ maior', 'Ré maior'],
      correta: 1,
      explicacao: 'Fá maior, com Si♭ — o primeiro passo no sentido anti-horário.',
    },
    {
      pergunta: 'No ciclo, onde ficam as tonalidades relativas?',
      alternativas: [
        'Compartilhando a mesma armadura',
        'Em pontos opostos do círculo',
        'Sempre a um semitom de distância',
        'Não aparecem no ciclo',
      ],
      correta: 0,
      explicacao:
        'A relativa menor compartilha a armadura da maior: Dó maior e Lá menor, ambas sem acidentes.',
    },
    {
      pergunta: 'Por que tons vizinhos no ciclo modulam com facilidade?',
      alternativas: [
        'Porque têm o mesmo nome',
        'Porque compartilham quase todas as notas',
        'Porque não têm dominante',
        'Porque são sempre menores',
      ],
      correta: 1,
      explicacao:
        'Dó e Sol diferem por uma única nota (Fá / Fá♯), o que torna a passagem quase imperceptível.',
    },
  ],

  'modulacao-transposicao': [
    {
      pergunta: 'Qual é o objetivo da modulação?',
      alternativas: [
        'Adaptar a música à voz do cantor',
        'Mudar o centro tonal da música durante a execução',
        'Repetir a mesma melodia mais aguda',
        'Trocar o andamento',
      ],
      correta: 1,
      explicacao:
        'Modular é sair de uma tonalidade e entrar em outra, mudando o centro de gravidade sonoro.',
    },
    {
      pergunta: 'Qual é o objetivo da transposição?',
      alternativas: [
        'Criar tensão e drama',
        'Levar a música inteira para outra altura, preservando a estrutura',
        'Mudar a função dos acordes',
        'Inserir acordes de fora do campo',
      ],
      correta: 1,
      explicacao:
        'A lógica musical é preservada; só a altura geral muda. É o que se faz para encaixar na tessitura de quem canta.',
    },
    {
      pergunta: 'Qual destes é um recurso comum para modular?',
      alternativas: [
        'Acordes pivôs e dominantes secundários',
        'Aumentar o volume',
        'Trocar o compasso',
        'Dobrar o andamento',
      ],
      correta: 0,
      explicacao:
        'Acordes pivôs (comuns às duas tonalidades) e dominantes secundários abrem caminho para o novo centro tonal.',
    },
    {
      pergunta: 'Ao transpor uma música de Dó maior para Ré maior, o que acontece com as funções dos acordes?',
      alternativas: [
        'Elas mudam completamente',
        'Elas permanecem as mesmas',
        'A tônica vira dominante',
        'Todos os acordes viram menores',
      ],
      correta: 1,
      explicacao:
        'O I continua sendo I, o V continua sendo V. Só muda qual nota ocupa cada função.',
    },
  ],

  'modos-gregos': [
    {
      pergunta: 'Como se obtêm os modos gregos?',
      alternativas: [
        'Alterando os acidentes da escala maior',
        'Mudando o ponto de partida (tônica) dentro da mesma escala maior',
        'Removendo duas notas da escala',
        'Empilhando quartas em vez de terças',
      ],
      correta: 1,
      explicacao:
        'As notas são as mesmas; muda a tônica — e com ela, todos os intervalos em relação a ela.',
    },
    {
      pergunta: 'Qual modo é idêntico à escala maior?',
      alternativas: ['Jônio', 'Lídio', 'Mixolídio', 'Eólio'],
      correta: 0,
      explicacao: 'O Jônio, construído a partir do 1º grau, é a própria escala maior natural.',
    },
    {
      pergunta: 'Qual modo é idêntico à escala menor natural?',
      alternativas: ['Dórico', 'Frígio', 'Eólio', 'Lócrio'],
      correta: 2,
      explicacao: 'O Eólio, construído a partir do 6º grau da escala maior.',
    },
    {
      pergunta: 'O que diferencia o modo Dórico do menor natural?',
      alternativas: [
        'A segunda menor',
        'A sexta maior',
        'A quarta aumentada',
        'A sétima maior',
      ],
      correta: 1,
      explicacao:
        'O Dórico tem sexta MAIOR, o que dá aquele brilho característico a um modo menor.',
    },
    {
      pergunta: 'Qual intervalo caracteriza o modo Lídio?',
      alternativas: ['Sétima menor', 'Segunda menor', 'Quarta aumentada', 'Quinta diminuta'],
      correta: 2,
      explicacao: 'A ♯4 é o coração do Lídio — é ela que dá o brilho etéreo e flutuante.',
    },
    {
      pergunta: 'Qual modo é usado sobre acordes dominantes por ter sétima menor?',
      alternativas: ['Jônio', 'Mixolídio', 'Frígio', 'Lócrio'],
      correta: 1,
      explicacao:
        'O Mixolídio é maior com ♭7 — exatamente a estrutura do acorde dominante.',
    },
    {
      pergunta: 'Por que o modo Lócrio é instável como centro tonal?',
      alternativas: [
        'Porque tem sétima maior',
        'Porque tem quinta diminuta, gerando um acorde meio diminuto na tônica',
        'Porque tem só cinco notas',
        'Porque não tem terça',
      ],
      correta: 1,
      explicacao:
        'Sem quinta justa, a tríade da tônica é diminuta — não há onde repousar.',
    },
  ],

  'emprestimo-modal': [
    {
      pergunta: 'O que é empréstimo modal?',
      alternativas: [
        'Usar acordes de um modo com a mesma tônica da música',
        'Mudar a tonalidade da música',
        'Usar a escala relativa menor',
        'Tocar em outro instrumento',
      ],
      correta: 0,
      explicacao:
        'Pega-se um acorde de um modo PARALELO — mesma tônica, notas diferentes — sem sair da tonalidade.',
    },
    {
      pergunta: 'Qual é a diferença entre modo paralelo e modo relativo?',
      alternativas: [
        'São a mesma coisa',
        'Paralelo mantém a tônica e muda as notas; relativo mantém as notas e muda a tônica',
        'Paralelo é sempre maior',
        'Relativo só existe em tom menor',
      ],
      correta: 1,
      explicacao:
        'Dó maior / Dó menor são paralelos. Dó maior / Lá menor são relativos. O empréstimo usa o paralelo.',
    },
    {
      pergunta: 'Numa música em Dó maior, de onde vem o acorde A♭ na progressão C – A♭ – F – G?',
      alternativas: ['De Lá menor', 'De Dó menor (ou Dó Frígio)', 'De Sol maior', 'De Fá maior'],
      correta: 1,
      explicacao:
        'A♭ é o ♭VI de Dó — vem do modo paralelo menor e cria uma virada emocional inesperada.',
    },
    {
      pergunta: 'Qual é o uso mais comum do empréstimo modal?',
      alternativas: [
        'Pegar acordes do modo menor numa música maior',
        'Pegar acordes do Lócrio',
        'Trocar todos os acordes da música',
        'Transpor a música',
      ],
      correta: 0,
      explicacao:
        'Usar A♭, E♭ ou B♭ numa música em Dó maior é o caso mais frequente — e o mais fácil de ouvir.',
    },
    {
      pergunta: 'Como o empréstimo modal deve ser aplicado?',
      alternativas: [
        'Substituindo todo o campo harmônico',
        'Pontualmente, voltando depois ao campo harmônico original',
        'Somente no final da música',
        'Somente em tons menores',
      ],
      correta: 1,
      explicacao:
        'O efeito vem do contraste. Usado o tempo todo, deixa de ser surpresa e vira a nova tonalidade.',
    },
  ],
};

export function quizPorModulo(id: string) {
  return QUIZZES[id] ?? [];
}
