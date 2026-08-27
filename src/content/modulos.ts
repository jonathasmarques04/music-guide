import type { Modulo } from './tipos';

/**
 * Aulas da trilha, seguindo a ordem dos módulos da apostila.
 *
 * O conteúdo teórico (fórmulas, intervalos, campos harmônicos) é padrão da
 * teoria musical; a redação das explicações é própria do app.
 */
export const MODULOS: Modulo[] = [
  {
    id: 'conceitos-basicos',
    numero: 1,
    titulo: 'Conceitos básicos',
    resumo: 'Nota, acorde, os três pilares da música, pulsação, compasso, tom e semitom.',
    secoes: [
      {
        titulo: 'Nota x acorde',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Uma nota musical é um som isolado — uma única frequência. Quando você toca a corda solta mais fina do violão, ouve uma nota só.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'As sete notas são Dó, Ré, Mi, Fá, Sol, Lá e Si (em cifra: C, D, E, F, G, A, B). Elas se repetem em oitavas — mais graves ou mais agudas — mas continuam sendo as mesmas notas.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Um acorde é o som de três ou mais notas tocadas ao mesmo tempo. Dó maior, por exemplo, é Dó + Mi + Sol soando juntos.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['', 'Nota', 'Acorde'],
            linhas: [
              ['O que é', 'Som único e isolado', '3 ou mais notas simultâneas'],
              ['Representa', 'Uma frequência', 'Uma combinação harmônica'],
              ['Exemplo', 'Dó', 'Dó maior (Dó + Mi + Sol)'],
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Analogia',
            texto:
              'A nota é uma letra; o acorde é uma palavra. Sozinha, a letra tem som. Juntando as letras certas, nasce sentido.',
          },
        ],
      },
      {
        titulo: 'Melodia, harmonia e ritmo',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Quase tudo que você escuta pode ser analisado a partir de três pilares.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Elemento', 'O que é', 'Exemplo prático'],
            linhas: [
              ['Melodia', 'Notas em sequência', 'A linha vocal da música'],
              ['Harmonia', 'Acordes que sustentam', 'A base do violão ou teclado'],
              ['Ritmo', 'Organização do som no tempo', 'A batida da bateria, a levada'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'A melodia é o fio condutor — o que você assobia depois. A harmonia é o fundo emocional: define se a música soa alegre, triste ou tensa. O ritmo é o esqueleto, o que dá estrutura e movimento.',
          },
        ],
      },
      {
        titulo: 'Pulsação e compasso',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A pulsação é o batimento constante da música — o tic-tac regular que faz você bater o pé sem perceber. Ela continua ali mesmo quando as notas mudam.',
          },
          {
            tipo: 'destaque',
            titulo: 'Pulsação não é ritmo',
            texto:
              'A pulsação é o batimento regular. O ritmo é como as notas se distribuem sobre essa pulsação. Se a pulsação é o relógio, o ritmo são os passos da dança dentro daquele tempo.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'O compasso organiza a pulsação em blocos regulares. Ele é escrito com dois números: o de cima diz quantas batidas cabem no compasso; o de baixo diz qual figura vale uma batida.',
          },
          {
            tipo: 'lista',
            itens: [
              '4/4 — 4 batidas por compasso, cada batida é uma semínima',
              '3/4 — 3 batidas por compasso (a valsa)',
              '6/8 — 6 batidas por compasso, cada batida é uma colcheia',
            ],
          },
        ],
      },
      {
        titulo: 'Tom e semitom',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O semitom é a menor distância entre duas notas na música ocidental. No piano, é de uma tecla para a vizinha (branca ou preta). No violão, é de uma casa para a seguinte.',
          },
          {
            tipo: 'lista',
            itens: [
              'Dó → Dó♯ = 1 semitom',
              'Mi → Fá = 1 semitom (mesmo sem tecla preta entre elas!)',
              'Si → Dó = 1 semitom',
            ],
          },
          { tipo: 'formula', rotulo: 'Regra', texto: '1 tom = 2 semitons' },
          {
            tipo: 'paragrafo',
            texto:
              'Ou seja: Dó → Ré é um tom (passando por Dó♯). No violão, um tom é pular uma casa: da casa 1 para a casa 3.',
          },
          {
            tipo: 'destaque',
            titulo: 'Por que isso importa',
            texto:
              'Tom e semitom são as peças com que se montam escalas, intervalos e acordes. Sem eles, o resto vira decoreba.',
          },
        ],
      },
      {
        titulo: 'Sustenido, bemol e enarmonia',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O sustenido (♯) aumenta a nota em um semitom. O bemol (♭) diminui a nota em um semitom. Sustenido sobe, bemol desce.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Algumas notas têm dois nomes para o mesmo som — são as enarmônicas. Dó♯ e Ré♭ soam igual; Fá♯ e Sol♭ também. O nome usado depende da tonalidade.',
          },
        ],
      },
      {
        titulo: 'Intervalos',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Intervalo é a distância entre duas notas. O número (segunda, terça, quarta…) vem da contagem de graus; o adjetivo (maior, menor, justa, aumentada, diminuta) vem da distância real em tons e semitons.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Intervalo', 'Semitons', 'Tons', 'A partir de Dó'],
            linhas: [
              ['Uníssono', '0', '0', 'Dó → Dó'],
              ['Segunda menor', '1', '0,5', 'Dó → Ré♭'],
              ['Segunda maior', '2', '1', 'Dó → Ré'],
              ['Terça menor', '3', '1,5', 'Dó → Mi♭'],
              ['Terça maior', '4', '2', 'Dó → Mi'],
              ['Quarta justa', '5', '2,5', 'Dó → Fá'],
              ['Quarta aum. / Quinta dim.', '6', '3', 'Dó → Fá♯'],
              ['Quinta justa', '7', '3,5', 'Dó → Sol'],
              ['Sexta menor', '8', '4', 'Dó → Lá♭'],
              ['Sexta maior', '9', '4,5', 'Dó → Lá'],
              ['Sétima menor', '10', '5', 'Dó → Si♭'],
              ['Sétima maior', '11', '5,5', 'Dó → Si'],
              ['Oitava justa', '12', '6', 'Dó → Dó'],
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Tudo é intervalo',
            texto:
              'A escala maior é uma sequência de intervalos. O acorde maior é terça maior + terça menor empilhadas. Tocar de ouvido é reconhecer intervalos.',
          },
        ],
      },
    ],
  },

  {
    id: 'escalas',
    numero: 2,
    titulo: 'Escalas',
    resumo: 'Graus, escala maior, menor natural, relativas, trítono e pentatônica.',
    secoes: [
      {
        titulo: 'Escalas e graus',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Uma escala é uma sequência organizada de notas seguindo um padrão específico de tons e semitons. É uma escada musical: cada degrau é uma nota, e a ordem dos degraus define o tipo da escala.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Cada nota da escala ocupa uma posição numerada, chamada grau, contada a partir da nota principal — a tônica.',
          },
          {
            tipo: 'lista',
            itens: [
              'Dó = 1º grau (tônica)',
              'Ré = 2º grau',
              'Mi = 3º grau',
              'Fá = 4º grau',
              'Sol = 5º grau',
              'Lá = 6º grau',
              'Si = 7º grau',
            ],
          },
        ],
      },
      {
        titulo: 'Escala maior natural',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A escala maior é a espinha dorsal da música tonal e a base de comparação para todas as outras escalas. Soa clara, estável e aberta.',
          },
          {
            tipo: 'formula',
            rotulo: 'Fórmula da escala maior',
            texto: 'T – T – st – T – T – T – st',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Aplicando em Dó: Dó – Ré – Mi – Fá – Sol – Lá – Si – Dó. Repare que os semitons caem sempre entre o 3º e o 4º grau (Mi → Fá) e entre o 7º e o 8º (Si → Dó).',
          },
          {
            tipo: 'destaque',
            titulo: 'Vale para qualquer tom',
            texto:
              'Decorar a fórmula T–T–st–T–T–T–st permite montar a escala maior em qualquer tonalidade, sem decorar as sete escalas separadamente.',
          },
        ],
      },
      {
        titulo: 'Escala menor natural',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A menor natural é o espelho emocional da maior: mais introspectiva e melancólica. Chama-se "natural" por não ter alterações artificiais.',
          },
          {
            tipo: 'formula',
            rotulo: 'Fórmula da menor natural',
            texto: 'T – st – T – T – st – T – T',
          },
          {
            tipo: 'paragrafo',
            texto: 'Em Lá: Lá – Si – Dó – Ré – Mi – Fá – Sol – Lá.',
          },
        ],
      },
      {
        titulo: 'Escalas relativas',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Duas escalas são relativas quando têm exatamente as mesmas notas, mas começam em graus diferentes. Lá menor tem as mesmas notas de Dó maior — muda a tônica, muda a sensação.',
          },
          {
            tipo: 'formula',
            rotulo: 'Como achar a relativa',
            texto: 'Relativa menor = 1 tom e meio (3 semitons) ABAIXO da tônica maior',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Dó maior → Lá menor. E no caminho inverso, a relativa maior fica um tom e meio acima: Lá menor → Dó maior.',
          },
        ],
      },
      {
        titulo: 'Trítono',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O trítono é o intervalo de três tons inteiros (6 semitons) — o mais tenso e instável da música tonal. Pode se chamar quarta aumentada (Dó → Fá♯) ou quinta diminuta (Si → Fá): mesmo som, nomes diferentes conforme o contexto.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Ele soa tenso porque divide a oitava exatamente ao meio (12 ÷ 2 = 6 semitons). Não pende para o lado maior nem para o menor, e fica suspenso, pedindo resolução.',
          },
        ],
      },
      {
        titulo: 'Escala pentatônica',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Penta = cinco. A pentatônica é uma escala de cinco notas, derivada da maior ou da menor, com as notas de maior tensão removidas. Como ela não tem trítono, quase tudo que você tocar soa bem.',
          },
          {
            tipo: 'formula',
            rotulo: 'Pentatônica maior',
            texto: '1 – 2 – 3 – 5 – 6   (em Dó: Dó – Ré – Mi – Sol – Lá)',
          },
          {
            tipo: 'formula',
            rotulo: 'Pentatônica menor',
            texto: '1 – ♭3 – 4 – 5 – ♭7   (em Lá: Lá – Dó – Ré – Mi – Sol)',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Na pentatônica maior de Dó saíram justamente Fá e Si — as duas notas que formavam o trítono entre si.',
          },
        ],
      },
    ],
  },

  {
    id: 'triades',
    numero: 3,
    titulo: 'Tríades',
    resumo: 'Terça e quinta, e os quatro tipos de acorde de três notas.',
    secoes: [
      {
        titulo: 'A terça e a quinta',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Toda tríade tem três notas: a fundamental (a base), a terça (define se o acorde é maior ou menor) e a quinta (define se ele é estável ou tenso).',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Terça', 'Distância', 'Exemplo', 'Sonoridade'],
            linhas: [
              ['Maior', '2 tons', 'Dó → Mi', 'Brilhante'],
              ['Menor', '1,5 tom', 'Dó → Mi♭', 'Séria, triste'],
            ],
          },
          {
            tipo: 'tabela',
            cabecalho: ['Quinta', 'Distância', 'Exemplo', 'Sonoridade'],
            linhas: [
              ['Justa', '3,5 tons', 'Dó → Sol', 'Estável, aberta'],
              ['Diminuta', '3 tons', 'Dó → Sol♭', 'Tensa, instável'],
              ['Aumentada', '4 tons', 'Dó → Sol♯', 'Excêntrica'],
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'A regra que resume tudo',
            texto: 'A terça dá a emoção do acorde. A quinta dá a estrutura.',
          },
        ],
      },
      {
        titulo: 'Os quatro tipos de tríade',
        blocos: [
          {
            tipo: 'tabela',
            cabecalho: ['Tríade', 'Fórmula', 'Em Dó', 'Sonoridade'],
            linhas: [
              ['Maior', 'Fund. + 3ª maior + 5ª justa', 'Dó – Mi – Sol', 'Estável, brilhante'],
              ['Menor', 'Fund. + 3ª menor + 5ª justa', 'Dó – Mi♭ – Sol', 'Melancólica'],
              ['Aumentada', 'Fund. + 3ª maior + 5ª aum.', 'Dó – Mi – Sol♯', 'Tensa, misteriosa'],
              ['Diminuta', 'Fund. + 3ª menor + 5ª dim.', 'Dó – Mi♭ – Sol♭', 'Instável, sombria'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'A tríade aumentada foi feita para não resolver sozinha: fica flutuando, sem apoio. A diminuta soa em conflito constante e pede resolução com urgência.',
          },
        ],
      },
    ],
  },

  {
    id: 'tetrades',
    numero: 4,
    titulo: 'Tétrades',
    resumo: 'Acordes de quatro notas, a sétima e os acordes suspensos.',
    secoes: [
      {
        titulo: 'O que muda com a sétima',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Tétrades são acordes de quatro notas. Se a tríade é o esqueleto, a tétrade é a alma: ela revela a intenção do acorde e traz cor, profundidade e modernidade.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Acorde', 'Fórmula', 'Exemplo'],
            linhas: [
              ['X7M', 'Fund. + 3ªM + 5ªJ + 7ªM', 'C7M → Dó–Mi–Sol–Si'],
              ['X7 (dominante)', 'Fund. + 3ªM + 5ªJ + 7ªm', 'C7 → Dó–Mi–Sol–Si♭'],
              ['Xm7', 'Fund. + 3ªm + 5ªJ + 7ªm', 'Am7 → Lá–Dó–Mi–Sol'],
              ['Xm7(♭5)', 'Fund. + 3ªm + 5ªdim + 7ªm', 'Bm7♭5 → Si–Ré–Fá–Lá'],
              ['Xm7M', 'Fund. + 3ªm + 5ªJ + 7ªM', 'Am7M → Lá–Dó–Mi–Sol♯'],
              ['X°', 'Fund. + 3ªm + 5ªdim + 7ªdim', 'C° → Dó–Mi♭–Sol♭–Si♭♭'],
            ],
          },
        ],
      },
      {
        titulo: 'O segredo das tétrades',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O que dá riqueza à tétrade não é só a nota a mais: é que ela contém duas tríades soando ao mesmo tempo.',
          },
          {
            tipo: 'lista',
            itens: [
              'C7M (Dó–Mi–Sol–Si): Dó–Mi–Sol é tríade maior, e Mi–Sol–Si é tríade menor',
              'Am7 (Lá–Dó–Mi–Sol): Lá–Dó–Mi é tríade menor, e Dó–Mi–Sol é tríade maior',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Toda tétrade é uma fusão de duas tríades sobrepostas. É daí que vem a "cor" desses acordes.',
          },
        ],
      },
      {
        titulo: 'Acordes suspensos',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O acorde suspenso substitui a terça por outra nota — e, sem terça, ele não é maior nem menor. Soa neutro, aberto, esperando algo.',
          },
          {
            tipo: 'lista',
            itens: [
              'sus2 — fundamental + 2ª maior + 5ª justa (Csus2 = Dó–Ré–Sol). Leve e contemplativo.',
              'sus4 — fundamental + 4ª justa + 5ª justa (Csus4 = Dó–Fá–Sol). Mais tenso, quer resolver.',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'O nome vem de a terça estar "suspensa", substituída. O acorde pede para cair numa tríade depois: Csus4 → C, com o Fá resolvendo no Mi.',
          },
        ],
      },
    ],
  },

  {
    id: 'campo-harmonico',
    numero: 5,
    titulo: 'Campo harmônico',
    resumo: 'Os acordes que nascem de uma escala, com tríades e com tétrades.',
    secoes: [
      {
        titulo: 'Como se forma',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O campo harmônico é o conjunto de acordes que nasce naturalmente de uma escala, usando apenas as notas dela. Monta-se empilhando terças sobre cada grau.',
          },
        ],
      },
      {
        titulo: 'Campo harmônico maior (tríades)',
        blocos: [
          {
            tipo: 'tabela',
            cabecalho: ['Grau', 'Notas', 'Acorde', 'Tipo'],
            linhas: [
              ['I', 'Dó – Mi – Sol', 'C', 'Maior'],
              ['ii', 'Ré – Fá – Lá', 'Dm', 'Menor'],
              ['iii', 'Mi – Sol – Si', 'Em', 'Menor'],
              ['IV', 'Fá – Lá – Dó', 'F', 'Maior'],
              ['V', 'Sol – Si – Ré', 'G', 'Maior'],
              ['vi', 'Lá – Dó – Mi', 'Am', 'Menor'],
              ['vii°', 'Si – Ré – Fá', 'B°', 'Diminuto'],
            ],
          },
          {
            tipo: 'formula',
            rotulo: 'Fórmula (vale para qualquer tom maior)',
            texto: 'I – ii – iii – IV – V – vi – vii°',
          },
        ],
      },
      {
        titulo: 'Campo harmônico maior (tétrades)',
        blocos: [
          {
            tipo: 'formula',
            rotulo: 'Fórmula com tétrades',
            texto: 'I7M – ii m7 – iii m7 – IV7M – V7 – vi m7 – vii m7♭5',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Em Dó maior: C7M – Dm7 – Em7 – F7M – G7 – Am7 – Bm7♭5. Note que só o V grau vira dominante (G7) — é ele que carrega o trítono.',
          },
        ],
      },
      {
        titulo: 'Campo harmônico menor natural',
        blocos: [
          {
            tipo: 'formula',
            rotulo: 'Com tríades',
            texto: 'i – ii° – III – iv – v – VI – VII',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Em Lá menor: Am – B° – C – Dm – Em – F – G. Repare que o V grau é MENOR (Em), o que enfraquece a função dominante — e é exatamente por isso que existem a menor harmônica e a menor melódica.',
          },
        ],
      },
    ],
  },

  {
    id: 'funcoes-harmonicas',
    numero: 6,
    titulo: 'Funções harmônicas',
    resumo: 'Tônica, subdominante e dominante: o papel de cada acorde.',
    secoes: [
      {
        titulo: 'As três funções',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'As funções harmônicas revelam o papel de cada acorde dentro da tonalidade — para onde ele quer ir. É o que transforma uma sequência de acordes em narrativa.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Função', 'Sensação', 'Graus (campo maior)'],
            linhas: [
              ['Tônica', 'Repouso, chegada, casa', 'I, vi, iii'],
              ['Subdominante', 'Movimento, preparação', 'IV, ii'],
              ['Dominante', 'Tensão, urgência de resolver', 'V, vii°'],
            ],
          },
        ],
      },
      {
        titulo: 'Tônica',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É o ponto de repouso, o centro tonal. Ao ouvir um acorde de função tônica você sente que a frase chegou onde precisava chegar. Em Dó maior: C (mais estável), Am (relativo menor) e Em (mais leve, mas ainda sem tensão).',
          },
        ],
      },
      {
        titulo: 'Subdominante',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É o meio do caminho: já saiu do repouso, mas ainda não chegou à tensão máxima. Funciona como um portal entre a tônica e a dominante. Em Dó maior: F (IV) e Dm (ii).',
          },
        ],
      },
      {
        titulo: 'Dominante',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É a tensão máxima da harmonia tonal — existe para criar a necessidade quase irresistível de voltar para a tônica. Em Dó maior: G (V), G7 (ainda mais tenso) e B° (vii°).',
          },
          {
            tipo: 'destaque',
            titulo: 'De onde vem a tensão',
            texto:
              'A força da dominante vem do trítono presente no V7 e no vii°. É ele que empurra a harmonia de volta para casa.',
          },
        ],
      },
    ],
  },

  {
    id: 'menores-harmonica-melodica',
    numero: 7,
    titulo: 'Menor harmônica e melódica',
    resumo: 'As duas variações que resolvem a fraqueza da dominante no tom menor.',
    secoes: [
      {
        titulo: 'Por que elas existem',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A escala menor natural tem uma limitação harmônica: seu V grau é menor, o que enfraquece a função dominante e dificulta a sensação de resolução clara. Para resolver isso, altera-se a escala.',
          },
        ],
      },
      {
        titulo: 'Menor harmônica',
        blocos: [
          {
            tipo: 'formula',
            rotulo: 'Alteração',
            texto: '7º grau elevado   →   T – st – T – T – st – T½ – st',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Em Lá: Lá – Si – Dó – Ré – Mi – Fá – Sol♯. O Sol♯ cria o trítono com o Mi, o que permite o acorde dominante E7 no campo harmônico de Lá menor — resolvendo o problema.',
          },
          {
            tipo: 'formula',
            rotulo: 'Campo harmônico (tríades)',
            texto: 'i – ii° – III+ – iv – V – VI – vii°',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Sonoridade dramática e tensa, com forte senso de resolução. Muito usada em flamenco, música erudita, rock neoclássico e metal.',
          },
        ],
      },
      {
        titulo: 'Menor melódica',
        blocos: [
          {
            tipo: 'formula',
            rotulo: 'Alteração',
            texto: '6º e 7º graus elevados   →   T – st – T – T – T – T – st',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Em Lá: Lá – Si – Dó – Ré – Mi – Fá♯ – Sol♯. Elevar também a sexta suaviza o salto criado pela menor harmônica, gerando uma escala ascendente fluida e elegante — muito usada no jazz.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Escala', 'Alteração', 'Uso principal'],
            linhas: [
              ['Menor natural', 'Nenhuma', 'Base melódica e harmônica'],
              ['Menor harmônica', '7º grau elevado', 'Criar dominante forte (V7)'],
              ['Menor melódica', '6º e 7º elevados', 'Suavizar melodias, enriquecer acordes'],
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'cadencias',
    numero: 8,
    titulo: 'Cadências',
    resumo: 'Os sinais de pontuação da música: como as frases terminam.',
    secoes: [
      {
        titulo: 'O que é uma cadência',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Cadência é o encerramento de uma ideia musical — o ponto final da frase, ou às vezes uma vírgula, uma reticência. São sequências de acordes que criam sensação de finalização, suspensão ou quebra de expectativa.',
          },
        ],
      },
      {
        titulo: 'Os cinco tipos',
        blocos: [
          {
            tipo: 'tabela',
            cabecalho: ['Cadência', 'Movimento', 'Em Dó maior', 'Sensação'],
            linhas: [
              ['Perfeita', 'V → I', 'G7 → C', 'Conclusão total'],
              ['Imperfeita', 'V → I (enfraquecido)', 'G → C/E', 'Chegou, mas sem certeza'],
              ['Plagal', 'IV → I', 'F → C', 'Suave, o "amém"'],
              ['Deceptiva', 'V → vi', 'G7 → Am', 'Surpresa, a música segue'],
              ['Meia cadência', '? → V', 'Dm → G', 'Suspense, pausa'],
            ],
          },
        ],
      },
      {
        titulo: 'Detalhes que importam',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A cadência perfeita exige V (ou V7) → I com a tônica na fundamental e no baixo. Se a tônica estiver invertida, se a dominante não tiver sétima ou se a melodia não terminar na tônica, ela vira imperfeita.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'A plagal não tem trítono — por isso soa calma, sem o drama da dominante. A deceptiva quebra a expectativa de propósito: o ouvido espera o I e recebe o vi.',
          },
        ],
      },
    ],
  },

  {
    id: 'dominantes',
    numero: 9,
    titulo: 'Acordes dominantes',
    resumo: 'Dominante principal, secundários, estendidos e substitutos tritonais.',
    secoes: [
      {
        titulo: 'Dominante principal',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O dominante principal é o V grau do campo harmônico, na forma de acorde maior com sétima menor (V7). Em Dó maior, é G7 = Sol – Si – Ré – Fá.',
          },
          {
            tipo: 'destaque',
            titulo: 'Por que ele resolve tão bem',
            texto:
              'O trítono entre a terça (Si) e a sétima (Fá) empurra para as notas da tônica: Si sobe meio tom para Dó, e Fá desce meio tom para Mi. O ouvido espera por essa resolução.',
          },
        ],
      },
      {
        titulo: 'Dominantes secundários',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'São acordes dominantes que resolvem temporariamente em outro grau da escala, como se aquele grau fosse uma tônica provisória. Eles não pertencem ao campo harmônico, mas aparecem de passagem.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Dominante', 'Resolve em', 'Notação'],
            linhas: [
              ['A7', 'Dm', 'V7/ii'],
              ['B7', 'Em', 'V7/iii'],
              ['E7', 'Am', 'V7/vi'],
              ['D7', 'G', 'V7/V'],
            ],
          },
        ],
      },
      {
        titulo: 'Dominantes estendidos',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É uma fila de dominantes encadeados, cada um sendo o V7 do próximo, criando tensão crescente até o alvo.',
          },
          {
            tipo: 'formula',
            rotulo: 'Exemplo chegando em Dó',
            texto: 'A7 → D7 → G7 → C',
          },
        ],
      },
      {
        titulo: 'Dominantes substitutos (substituição tritonal)',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Dois acordes dominantes cujas fundamentais estão a um trítono de distância compartilham o mesmo trítono interno — e por isso resolvem para o mesmo lugar.',
          },
          {
            tipo: 'paragrafo',
            texto:
              'G7 (Sol–Si–Ré–Fá) e D♭7 (Ré♭–Fá–Lá♭–Dó♭) têm o mesmo par de tensão: Si/Dó♭ e Fá. Por isso D♭7 → C funciona no lugar de G7 → C, criando um movimento cromático descendente elegante.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Dominante real', 'Substituto tritonal'],
            linhas: [
              ['G7', 'D♭7'],
              ['A7', 'E♭7'],
              ['D7', 'A♭7'],
              ['E7', 'B♭7'],
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'ciclo-das-quintas',
    numero: 10,
    titulo: 'Ciclo das quintas',
    resumo: 'O mapa das tonalidades, suas armaduras e relações.',
    secoes: [
      {
        titulo: 'O que é',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É uma sequência de notas separadas por quintas justas, que organiza as tonalidades e seus acidentes de forma cíclica.',
          },
          {
            tipo: 'formula',
            rotulo: 'Sentido horário (sustenidos)',
            texto: 'C → G → D → A → E → B → F♯ → C♯',
          },
          {
            tipo: 'formula',
            rotulo: 'Sentido anti-horário (bemóis)',
            texto: 'C → F → B♭ → E♭ → A♭ → D♭ → G♭ → C♭',
          },
        ],
      },
      {
        titulo: 'Armaduras',
        blocos: [
          {
            tipo: 'tabela',
            cabecalho: ['Tom', '# sustenidos', 'Tom', '# bemóis'],
            linhas: [
              ['C', '0', 'C', '0'],
              ['G', '1 (F♯)', 'F', '1 (B♭)'],
              ['D', '2', 'B♭', '2'],
              ['A', '3', 'E♭', '3'],
              ['E', '4', 'A♭', '4'],
              ['B', '5', 'D♭', '5'],
              ['F♯', '6', 'G♭', '6'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Cada passo no ciclo acrescenta um acidente. Basta contar os passos a partir de Dó: Lá maior está 3 passos no horário, logo tem 3 sustenidos.',
          },
        ],
      },
      {
        titulo: 'Para que serve',
        blocos: [
          {
            tipo: 'lista',
            itens: [
              'Descobrir quantos acidentes cada tonalidade tem',
              'Encontrar escalas relativas (mesma armadura)',
              'Montar progressões em movimento de quinta: C → Am → Dm → G → C',
              'Planejar modulações: tons vizinhos no ciclo compartilham quase todas as notas',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'modulacao-transposicao',
    numero: 11,
    titulo: 'Modulação e transposição',
    resumo: 'Duas formas de mudar de tonalidade — com finalidades opostas.',
    secoes: [
      {
        titulo: 'A diferença',
        blocos: [
          {
            tipo: 'tabela',
            cabecalho: ['Conceito', 'O que faz', 'Quando é usado'],
            linhas: [
              ['Modulação', 'Muda o centro tonal da música', 'Criar variação, tensão, drama'],
              ['Transposição', 'Mantém tudo igual, em outra altura', 'Adaptar à voz ou ao instrumento'],
            ],
          },
        ],
      },
      {
        titulo: 'Modulação',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Modular é sair de uma tonalidade e entrar em outra durante a música, de forma consciente. Pode ser suave ou brusca, e acontece por acordes pivôs, movimento cromático ou dominantes secundários. O objetivo é mudar o centro tonal — não repetir a mesma melodia mais acima.',
          },
        ],
      },
      {
        titulo: 'Transposição',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Transpor é levar a música inteira para outra tonalidade, preservando a estrutura intervalar. A função dos acordes e o movimento melódico não mudam — só a altura geral. É o que se faz para encaixar uma música na voz de quem canta.',
          },
        ],
      },
    ],
  },

  {
    id: 'modos-gregos',
    numero: 12,
    titulo: 'Modos gregos',
    resumo: 'Sete sonoridades a partir das mesmas notas, mudando a tônica.',
    secoes: [
      {
        titulo: 'O que são',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'São sete variações da escala maior, criadas ao mudar o ponto de partida dentro da mesma escala. As notas são as mesmas, mas a sonoridade muda por completo — porque mudam os intervalos em relação à nova tônica.',
          },
        ],
      },
      {
        titulo: 'Os sete modos',
        blocos: [
          {
            tipo: 'tabela',
            cabecalho: ['Modo', 'Grau', 'Fórmula', 'Clima'],
            linhas: [
              ['Jônio', '1º', '1–2–3–4–5–6–7', 'Alegre e estável (= escala maior)'],
              ['Dórico', '2º', '1–2–♭3–4–5–6–♭7', 'Menor com brilho, groove'],
              ['Frígio', '3º', '1–♭2–♭3–4–5–♭6–♭7', 'Sombrio, espanhol, exótico'],
              ['Lídio', '4º', '1–2–3–♯4–5–6–7', 'Brilhante, sonhador, etéreo'],
              ['Mixolídio', '5º', '1–2–3–4–5–6–♭7', 'Alegre com tensão, blues'],
              ['Eólio', '6º', '1–2–♭3–4–5–♭6–♭7', 'Menor natural, melancólico'],
              ['Lócrio', '7º', '1–♭2–♭3–4–♭5–♭6–♭7', 'Dissonante, instável'],
            ],
          },
        ],
      },
      {
        titulo: 'A nota que define cada modo',
        blocos: [
          {
            tipo: 'lista',
            itens: [
              'Dórico — a SEXTA MAIOR é o que o separa do menor natural',
              'Frígio — a SEGUNDA MENOR cria a tensão flamenca logo na saída',
              'Lídio — a QUARTA AUMENTADA dá o brilho etéreo',
              'Mixolídio — a SÉTIMA MENOR abre espaço para o groove e o blues',
              'Lócrio — a QUINTA DIMINUTA destrói a estabilidade (gera o m7♭5)',
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Como montar em qualquer tônica',
            texto:
              'Pergunte: qual escala maior tem essa nota como o grau que eu quero? Para Dó Dórico (2º grau), a resposta é Si♭ maior — logo, Dó Dórico = Dó–Ré–Mi♭–Fá–Sol–Lá–Si♭.',
          },
        ],
      },
    ],
  },

  {
    id: 'emprestimo-modal',
    numero: 13,
    titulo: 'Empréstimo modal',
    resumo: 'Pegar acordes de um modo paralelo sem sair da tonalidade.',
    secoes: [
      {
        titulo: 'O que é',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'É usar, dentro de uma música em determinada tonalidade, acordes vindos de um modo paralelo — ou seja, de outro modo com a MESMA tônica. Numa música em Dó maior, você pode pegar acordes emprestados de Dó menor, Dó Frígio, Dó Lídio, e assim por diante.',
          },
          {
            tipo: 'destaque',
            titulo: 'Paralelo ≠ relativo',
            texto:
              'Relativo compartilha as notas e muda a tônica (Dó maior / Lá menor). Paralelo mantém a tônica e muda as notas (Dó maior / Dó menor). O empréstimo modal usa o PARALELO.',
          },
        ],
      },
      {
        titulo: 'Na prática',
        blocos: [
          {
            tipo: 'formula',
            rotulo: 'Progressão comum',
            texto: 'C – Am – F – G',
          },
          {
            tipo: 'formula',
            rotulo: 'Com empréstimo modal',
            texto: 'C – A♭ – F – G',
          },
          {
            tipo: 'paragrafo',
            texto:
              'O A♭ veio de Dó menor (ou Dó Frígio) e cria uma virada emocional inesperada, sem quebrar a lógica tonal.',
          },
          {
            tipo: 'lista',
            itens: [
              'Identifique a tonalidade principal da música',
              'Liste os modos com a mesma tônica',
              'Veja quais acordes cada modo oferece',
              'Escolha um que faça sentido emocionalmente',
              'Use pontualmente e volte ao campo harmônico original',
            ],
          },
        ],
      },
    ],
  },
];

export function moduloPorId(id: string) {
  return MODULOS.find((m) => m.id === id);
}
