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
    {
      pergunta: 'No sentido anti-horário, o ciclo avança por qual intervalo?',
      alternativas: ['5ª justa', '4ª justa', '3ª maior', '2ª maior'],
      correta: 1,
      explicacao: 'Descer uma quinta equivale a subir uma quarta: C → F → B♭ → E♭ é o caminho dos bemóis.',
    },
    {
      pergunta: 'Quantos sustenidos tem a tonalidade de Ré maior?',
      alternativas: ['Um', 'Dois', 'Três', 'Quatro'],
      correta: 1,
      explicacao: 'Ré é o segundo passo horário a partir de Dó: G tem 1 sustenido, D tem 2 (Fá♯ e Dó♯).',
    },
    {
      pergunta: 'Para que serve, na prática, saber o ciclo das quintas?',
      alternativas: [
        'Para afinar o instrumento',
        'Para saber a armadura de cada tom e quais tonalidades são vizinhas',
        'Para calcular o andamento',
        'Para escolher a figura rítmica certa',
      ],
      correta: 1,
      explicacao: 'O ciclo é o mapa das tonalidades: diz quantos acidentes cada tom tem e quais tons estão perto uns dos outros.',
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
    {
      pergunta: 'O que é um acorde pivô?',
      alternativas: [
        'O acorde mais grave da progressão',
        'Um acorde que pertence ao campo harmônico das duas tonalidades',
        'O dominante da tonalidade de origem',
        'Um acorde sem terça',
      ],
      correta: 1,
      explicacao: 'Ele serve de ponte: chega-se nele pensando no tom antigo e sai-se dele pensando no novo. Am é vi de Dó e ii de Sol.',
    },
    {
      pergunta: 'Qual caminho de modulação produz o corte mais abrupto?',
      alternativas: ['Acorde pivô', 'Dominante secundário', 'Modulação cromática', 'Modulação direta'],
      correta: 3,
      explicacao: 'A modulação direta entra no tom novo sem preparo nenhum — é o recurso do refrão final que sobe de tom.',
    },
    {
      pergunta: 'Qual é a forma mais segura de transpor uma progressão?',
      alternativas: [
        'Decorar tabelas de equivalência de acordes',
        'Converter a progressão em graus, trocar de tom e converter de volta',
        'Subir todos os acordes um tom',
        'Trocar todos os sustenidos por bemóis',
      ],
      correta: 1,
      explicacao: 'Os graus preservam a função e não erram na escolha entre sustenido e bemol; contar semitons funciona, mas escorrega na grafia.',
    },
    {
      pergunta: 'A progressão I – vi – IV – V, aplicada em Mi maior, fica:',
      alternativas: ['E – C♯m – A – B', 'E – Am – A – B', 'E – C♯m – A♯ – B', 'E – D♯m – A – B'],
      correta: 0,
      explicacao: 'No campo harmônico de Mi maior: I = E, vi = C♯m, IV = A, V = B.',
    },
    {
      pergunta: 'Quando a modulação se confirma para o ouvido?',
      alternativas: [
        'No instante em que aparece um acorde de fora do campo',
        'Quando a nova tônica passa a ser ouvida como repouso',
        'Quando a melodia sobe de altura',
        'Quando muda a armadura de clave no papel',
      ],
      correta: 1,
      explicacao: 'Um acorde de fora sozinho é só empréstimo. Só há modulação quando o ouvido adota o novo centro como referência.',
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
    {
      pergunta: 'Numa música em Dó maior, de qual modo paralelo vem o acorde Fm?',
      alternativas: ['De Dó menor, o modo paralelo', 'De Sol maior', 'De Lá menor', 'De Fá maior'],
      correta: 0,
      explicacao: 'Fm é o iv menor, emprestado de Dó menor. É um dos empréstimos mais usados na música popular.',
    },
    {
      pergunta: 'O empréstimo modal muda a tonalidade da música?',
      alternativas: [
        'Sim, é sinônimo de modulação',
        'Não — a tônica continua a mesma, só o acorde vem de outro modo',
        'Sim, mas só temporariamente',
        'Depende do andamento',
      ],
      correta: 1,
      explicacao: 'Modular é trocar o centro tonal. No empréstimo, a tônica não se move: apenas um acorde vem emprestado de um modo paralelo.',
    },
  ],

  extensoes: [
    {
      pergunta: 'A nona de um acorde corresponde a qual grau da escala?',
      alternativas: ['Ao 2º grau, uma oitava acima', 'Ao 4º grau', 'Ao 6º grau', 'Ao 7º grau'],
      correta: 0,
      explicacao: 'A 9ª é o 2º grau deslocado uma oitava. O número maior indica que ela entra acima da sétima.',
    },
    {
      pergunta: 'Por que a 11ª justa é evitada sobre um acorde maior?',
      alternativas: [
        'Porque não pertence à escala',
        'Porque fica a um semitom da terça maior e turva o acorde',
        'Porque duplica a quinta',
        'Porque só existe em acordes menores',
      ],
      correta: 1,
      explicacao: 'Em Dó, o Fá da 11ª fica um semitom acima do Mi. O choque é áspero — daí a ♯11 nos acordes maiores.',
    },
    {
      pergunta: 'Na cifragem popular brasileira, o que "C9" costuma significar?',
      alternativas: [
        'Dó–Mi–Sol–Si♭–Ré, com sétima menor',
        'Dó–Ré–Mi–Sol, sem sétima',
        'Dó–Mi–Sol–Si, com sétima maior',
        'Dó–Ré–Sol, sem terça',
      ],
      correta: 1,
      explicacao: 'No uso popular PT-BR, "C9" quase sempre é o acorde sem sétima (equivalente a Cadd9). No jazz, a mesma cifra pressupõe a 7ª menor.',
    },
    {
      pergunta: 'Num acorde de cinco ou seis notas, qual nota é a primeira candidata a ser omitida?',
      alternativas: ['A terça', 'A sétima', 'A quinta justa', 'A nona'],
      correta: 2,
      explicacao: 'A quinta justa não define a qualidade nem a função do acorde. Terça e sétima são o par que não sai.',
    },
    {
      pergunta: 'Qual é a diferença prática entre Csus2 e Cadd9?',
      alternativas: [
        'Nenhuma, são a mesma coisa',
        'No sus2 a 2ª substitui a terça; no add9 a terça continua no acorde',
        'O add9 não tem quinta',
        'O sus2 tem sétima menor',
      ],
      correta: 1,
      explicacao: 'As notas podem coincidir, mas o papel muda: sem terça o sus2 não é maior nem menor; o add9 mantém a terça e continua maior.',
    },
    {
      pergunta: 'Em qual tipo de acorde a 13ª é mais natural?',
      alternativas: ['No acorde diminuto', 'No acorde meio-diminuto', 'No acorde dominante', 'No acorde menor com sétima maior'],
      correta: 2,
      explicacao: 'A 13ª não briga com nenhuma nota do acorde e acrescenta brilho — o dominante é seu habitat natural.',
    },
    {
      pergunta: 'Por que a pilha de terças para na 13ª?',
      alternativas: [
        'Porque a 15ª seria a fundamental duas oitavas acima',
        'Porque a 15ª não existe na escala',
        'Porque acima disso as notas ficam inaudíveis',
        'Porque a 13ª é a última nota consonante',
      ],
      correta: 0,
      explicacao: 'Com 1, 3, 5, 7, 9, 11 e 13 as sete notas da escala já foram usadas. A próxima terça volta à fundamental.',
    },
    {
      pergunta: 'Qual par de notas basta, junto com o baixo na fundamental, para dizer o acorde inteiro?',
      alternativas: ['Fundamental e quinta', 'Terça e sétima', 'Quinta e nona', 'Sétima e nona'],
      correta: 1,
      explicacao: 'A terça diz maior ou menor, a sétima diz a função. Com o baixo cobrindo a raiz, esse par já define o acorde.',
    },
  ],

  inversoes: [
    {
      pergunta: 'Um acorde está na 1ª inversão quando qual nota está no baixo?',
      alternativas: ['A fundamental', 'A terça', 'A quinta', 'A sétima'],
      correta: 1,
      explicacao: 'A 1ª inversão põe a terça no baixo: C/E. A 2ª põe a quinta (C/G) e a 3ª, só em tétrades, põe a sétima.',
    },
    {
      pergunta: 'A cifra C/D representa uma inversão?',
      alternativas: [
        'Sim, é a 2ª inversão',
        'Não, porque Ré não pertence ao acorde de Dó maior',
        'Sim, é a 3ª inversão',
        'Não, porque a barra indica troca de tom',
      ],
      correta: 1,
      explicacao: 'Só é inversão quando a nota do baixo pertence ao acorde. Ré é estranho a C, então o resultado é uma sobreposição.',
    },
    {
      pergunta: 'Quantos estados possíveis tem uma tétrade?',
      alternativas: ['Dois', 'Três', 'Quatro', 'Cinco'],
      correta: 2,
      explicacao: 'Fundamental e três inversões — uma para cada nota que pode ir ao baixo.',
    },
    {
      pergunta: 'Na progressão C – G/B – Am, qual é o desenho da linha do baixo?',
      alternativas: ['Dó – Sol – Lá', 'Dó – Si – Lá', 'Dó – Ré – Mi', 'Dó – Mi – Sol'],
      correta: 1,
      explicacao: 'A inversão G/B troca o salto Dó–Sol por Dó–Si–Lá: o baixo desce por graus conjuntos em vez de saltar.',
    },
    {
      pergunta: 'O que é um baixo pedal?',
      alternativas: [
        'Uma nota grave que se mantém enquanto a harmonia muda por cima',
        'Uma inversão da tétrade',
        'Uma nota tocada com o pé',
        'A fundamental do último acorde da música',
      ],
      correta: 0,
      explicacao: 'O pedal segura a nota grave — normalmente a tônica ou a dominante — enquanto os acordes se movem acima dela.',
    },
    {
      pergunta: 'Numa banda, quem determina o estado de inversão do acorde?',
      alternativas: ['O violão', 'O teclado', 'O baixo', 'A bateria'],
      correta: 2,
      explicacao: 'A inversão é definida pela nota mais grave que soa — e essa é a do baixo, não a do instrumento harmônico.',
    },
    {
      pergunta: 'Qual inversão soa mais instável e pede continuação?',
      alternativas: ['Estado fundamental', '1ª inversão', '2ª inversão', 'Nenhuma, todas soam iguais'],
      correta: 2,
      explicacao: 'A 2ª inversão, com a quinta no baixo, é a mais suspensa — por isso raramente encerra uma frase.',
    },
  ],

  'leitura-ritmica': [
    {
      pergunta: 'Em compasso 4/4, quantas colcheias cabem em um compasso?',
      alternativas: ['Quatro', 'Seis', 'Oito', 'Dezesseis'],
      correta: 2,
      explicacao: 'A colcheia vale meio tempo; com 4 tempos por compasso, cabem 8.',
    },
    {
      pergunta: 'Quanto vale uma semínima pontuada em 4/4?',
      alternativas: ['0,75 de tempo', '1 tempo', '1,5 tempo', '2 tempos'],
      correta: 2,
      explicacao: 'O ponto acrescenta metade do valor da figura: 1 + 0,5 = 1,5 tempo.',
    },
    {
      pergunta: 'O que a ligadura de valor faz?',
      alternativas: [
        'Une notas de alturas diferentes pedindo som conectado',
        'Une duas figuras de mesma altura somando as durações',
        'Encurta a nota pela metade',
        'Indica repetição do compasso',
      ],
      correta: 1,
      explicacao: 'A segunda figura não é tocada de novo: só prolonga a primeira. É assim que uma nota atravessa a barra de compasso.',
    },
    {
      pergunta: 'Qual é a diferença entre síncope e contratempo?',
      alternativas: [
        'Não há diferença',
        'Na síncope a nota começa no tempo fraco e se prolonga sobre o forte; no contratempo o tempo forte fica em silêncio',
        'A síncope só existe em compasso composto',
        'O contratempo só existe em 6/8',
      ],
      correta: 1,
      explicacao: 'Os dois tiram o acento do tempo forte, mas a síncope o atravessa com som e o contratempo o deixa vazio.',
    },
    {
      pergunta: 'O compasso 6/8 é classificado como:',
      alternativas: [
        'Simples, com 6 tempos',
        'Composto, com 2 tempos divididos em 3',
        'Composto, com 6 tempos divididos em 2',
        'Simples, com 3 tempos',
      ],
      correta: 1,
      explicacao: 'Em compasso composto o número de cima é múltiplo de 3 e cada tempo se divide em três: 6/8 são 2 tempos de três colcheias.',
    },
    {
      pergunta: 'O que é uma tercina?',
      alternativas: [
        'Três compassos seguidos iguais',
        'Três notas ocupando o espaço de duas',
        'Uma nota que vale três tempos',
        'O terceiro tempo do compasso',
      ],
      correta: 1,
      explicacao: 'A tercina é a quiáltera mais comum: empresta a divisão ternária dentro de um contexto binário.',
    },
    {
      pergunta: 'Em 4/4, qual é a contagem falada correta para semicolcheias?',
      alternativas: ['1 e 2 e 3 e 4 e', '1 e ê a 2 e ê a 3 e ê a 4 e ê a', '1 e a 2 e a', '1 — 2 — 3 — 4'],
      correta: 1,
      explicacao: '"1 e ê a" divide cada tempo em quatro. "1 e 2 e" é a contagem de colcheias e "1 e a" a de compasso composto.',
    },
    {
      pergunta: 'Por que a semínima vale 1 tempo em 4/4?',
      alternativas: [
        'Porque é sempre assim, em qualquer compasso',
        'Porque o denominador 4 indica que a semínima é a unidade de tempo',
        'Porque o numerador é 4',
        'Porque ela é a figura mais curta usada',
      ],
      correta: 1,
      explicacao: 'O número de baixo diz qual figura vale a batida. Em 4/2 quem vale a batida é a mínima — a proporção entre as figuras é que nunca muda.',
    },
  ],

  'braco-do-baixo': [
    {
      pergunta: 'Qual é a afinação padrão do baixo de quatro cordas, da mais grave para a mais aguda?',
      alternativas: ['Mi–Lá–Ré–Sol', 'Sol–Ré–Lá–Mi', 'Mi–Lá–Ré–Si', 'Lá–Ré–Sol–Dó'],
      correta: 0,
      explicacao: 'E–A–D–G: as mesmas quatro cordas graves do violão, uma oitava abaixo.',
    },
    {
      pergunta: 'Qual é o intervalo entre duas cordas vizinhas do baixo?',
      alternativas: ['Terça maior', '4ª justa', '5ª justa', 'Oitava'],
      correta: 1,
      explicacao: 'Cinco semitons entre cada par de cordas. É essa regularidade que faz um desenho de dedos valer no braço inteiro.',
    },
    {
      pergunta: 'Partindo de uma nota qualquer, onde está a oitava acima?',
      alternativas: [
        'Duas cordas adiante, 2 casas à frente',
        'Na corda seguinte, mesma casa',
        'Na mesma corda, 7 casas à frente',
        'Duas cordas adiante, mesma casa',
      ],
      correta: 0,
      explicacao: 'Duas cordas na direção aguda mais duas casas. Do Dó na corda Lá casa 3, a oitava é o Dó na corda Sol casa 5.',
    },
    {
      pergunta: 'Que nota soa na corda Lá, casa 3?',
      alternativas: ['Si', 'Dó', 'Ré', 'Dó♯'],
      correta: 1,
      explicacao: 'Lá → Lá♯ (1) → Si (2) → Dó (3). É uma das posições mais usadas do braço.',
    },
    {
      pergunta: 'Onde está a 5ª justa em relação a uma nota do braço?',
      alternativas: [
        'Mesma casa, corda seguinte',
        'Corda seguinte, 2 casas à frente',
        'Mesma corda, 5 casas à frente',
        'Duas cordas adiante, mesma casa',
      ],
      correta: 1,
      explicacao: 'A mesma casa na corda seguinte dá a 4ª justa; a 5ª justa está duas casas depois dela.',
    },
    {
      pergunta: 'O que acontece a partir da casa 12?',
      alternativas: [
        'As notas continuam subindo sem repetir',
        'O desenho de notas se repete uma oitava acima',
        'A afinação muda',
        'As cordas passam a soar em 5ªs',
      ],
      correta: 1,
      explicacao: 'Doze casas são doze semitons — uma oitava completa. Da casa 12 em diante tudo se repete.',
    },
    {
      pergunta: 'No baixo de cinco cordas, qual corda é acrescentada?',
      alternativas: ['Um Dó agudo acima do Sol', 'Um Si grave abaixo do Mi', 'Um Ré grave abaixo do Mi', 'Um Lá agudo acima do Sol'],
      correta: 1,
      explicacao: 'B–E–A–D–G: o Si grave mantém a mesma distância de 4ª justa entre cordas vizinhas.',
    },
  ],

  'linhas-de-baixo': [
    {
      pergunta: 'Quais são as duas funções simultâneas de uma linha de baixo?',
      alternativas: [
        'Melodia e improviso',
        'Declarar a fundamental e trancar o ritmo com a bateria',
        'Dobrar o vocal e marcar o refrão',
        'Fazer contraponto e sustentar a dinâmica',
      ],
      correta: 1,
      explicacao: 'Harmonia e ritmo ao mesmo tempo. Nota que não serve a uma das duas está sobrando.',
    },
    {
      pergunta: 'No walking bass, o que se toca no tempo 1 de cada compasso?',
      alternativas: ['A quinta do acorde', 'A fundamental do acorde', 'A sétima do acorde', 'Uma nota cromática'],
      correta: 1,
      explicacao: 'Tempo 1 = fundamental; tempo 4 = aproximação do próximo acorde. Os tempos 2 e 3 são o espaço de criação.',
    },
    {
      pergunta: 'O que é uma aproximação cromática?',
      alternativas: [
        'Chegar na fundamental seguinte por um semitom, acima ou abaixo',
        'Tocar a escala cromática inteira',
        'Repetir a fundamental em oitavas',
        'Saltar uma quinta antes da mudança de acorde',
      ],
      correta: 0,
      explicacao: 'Um semitom antes do alvo. Para chegar em Fá, toca-se Mi (por baixo) ou Fá♯ (por cima).',
    },
    {
      pergunta: 'Onde a nota de passagem costuma entrar no compasso?',
      alternativas: ['No tempo 1', 'No tempo 2', 'No último tempo, antes da troca de acorde', 'Em qualquer tempo, indiferente'],
      correta: 2,
      explicacao: 'Ali ela empurra para o acorde seguinte. Em outros lugares tende a soar como erro.',
    },
    {
      pergunta: 'Sobre o acorde de Fá maior, qual sequência corresponde ao nível "arpejo"?',
      alternativas: ['Fá – Fá – Fá – Fá', 'Fá – Dó – Fá – Dó', 'Fá – Lá – Dó', 'Fá – Sol – Lá – Si♭'],
      correta: 2,
      explicacao: 'Arpejo é tocar as notas do próprio acorde: fundamental, terça e quinta de F são Fá, Lá e Dó.',
    },
    {
      pergunta: 'O que caracteriza um groove bem construído?',
      alternativas: [
        'Uma frase nova a cada compasso',
        'Um desenho curto repetido, com espaço e encaixe no bumbo',
        'O maior número possível de notas por compasso',
        'Arpejos rápidos em toda a música',
      ],
      correta: 1,
      explicacao: 'Repetição cria identidade; o silêncio dá o balanço. A variação fica guardada para a virada.',
    },
    {
      pergunta: 'Qual é o erro mais comum de quem começa a construir linhas?',
      alternativas: [
        'Tocar a fundamental no tempo certo',
        'Preencher todos os espaços com notas',
        'Repetir o mesmo desenho por oito compassos',
        'Casar o ataque com o bumbo',
      ],
      correta: 1,
      explicacao: 'Encher tudo vem de tratar o baixo como solista. As outras três alternativas descrevem acertos, não erros.',
    },
  ],
};

export function quizPorModulo(id: string) {
  return QUIZZES[id] ?? [];
}
