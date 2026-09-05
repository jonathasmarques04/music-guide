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
      {
        titulo: 'Os caminhos da modulação',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Modular não é trocar de tom por decreto: é preparar o ouvido para aceitar um novo centro. Há quatro caminhos usuais, do mais suave ao mais abrupto.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Caminho', 'Como funciona', 'Efeito'],
            linhas: [
              ['Acorde pivô', 'Usa um acorde que existe nos dois campos harmônicos', 'Costura invisível'],
              ['Dominante secundário', 'Prepara a nova tônica com o V7 dela', 'Direcionado, natural'],
              ['Cromática', 'Desliza por semitom até o novo acorde', 'Tenso, moderno'],
              ['Direta', 'Entra no tom novo sem preparo nenhum', 'Corte seco, típico do refrão final'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'O acorde pivô é o mais comum. Para modular de Dó maior para Sol maior, Am serve: é o vi de Dó e o ii de Sol. Chega-se nele pensando em Dó e sai-se dele pensando em Sol.',
          },
          {
            tipo: 'destaque',
            titulo: 'Quando o ouvido aceita',
            texto:
              'A modulação só se confirma quando a nova tônica é ouvida como repouso. Antes disso, o que houve foi só um acorde de fora — modular exige ficar no tom novo tempo suficiente para o ouvido mudar de referência.',
          },
        ],
      },
      {
        titulo: 'Transpondo na prática',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O jeito seguro de transpor não é decorar tabelas de acordes: é passar pelos graus. Converta a progressão em números, troque de tom, converta de volta.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Etapa', 'Exemplo'],
            linhas: [
              ['Progressão original (Dó maior)', 'C – Am – F – G'],
              ['Em graus', 'I – vi – IV – V'],
              ['Aplicando em Mi maior', 'E – C♯m – A – B'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'O caminho alternativo é contar semitons: de Dó para Mi são 4 semitons, então todo acorde sobe 4 semitons. Funciona, mas erra com facilidade na hora de escolher entre sustenido e bemol — os graus não erram.',
          },
          {
            tipo: 'lista',
            itens: [
              'Pensar em graus mostra a função de cada acorde e sobrevive à troca de tom',
              'No braço do instrumento, transpor é mover a mesma forma algumas casas',
              'Escolha a direção pela voz: se o cantor aperta no agudo, desça; se some no grave, suba',
            ],
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

  {
    id: 'extensoes',
    numero: 14,
    titulo: 'Extensões e tensões',
    resumo: 'A nona, a décima primeira e a décima terceira — a cor que vem depois da sétima.',
    secoes: [
      {
        titulo: 'Empilhando terças além da sétima',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A tríade empilha duas terças, a tétrade empilha três. Nada impede continuar: a quarta terça traz a nona, a quinta traz a décima primeira e a sexta traz a décima terceira.',
          },
          {
            tipo: 'formula',
            rotulo: 'A pilha completa',
            texto: '1 – 3 – 5 – 7 – 9 – 11 – 13',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Repare que 9, 11 e 13 são a 2ª, a 4ª e a 6ª da escala, só que uma oitava acima. O número maior não é enfeite: ele avisa que a nota entra por cima da sétima, e não colada na fundamental.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Extensão', 'Mesmo grau que', 'Em Dó'],
            linhas: [
              ['9ª', '2º grau', 'Ré'],
              ['11ª', '4º grau', 'Fá'],
              ['13ª', '6º grau', 'Lá'],
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Por que parar na 13ª',
            texto:
              'A próxima terça da pilha seria a 15ª — que é a própria fundamental duas oitavas acima. O ciclo fecha ali: com 1, 3, 5, 7, 9, 11 e 13 você já usou as sete notas da escala.',
          },
        ],
      },
      {
        titulo: 'Nona: o cuidado com a cifra',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A nona é a extensão mais usada — e a que mais confunde, porque a mesma cifra significa coisas diferentes dependendo de quem escreveu.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Cifra', 'Uso popular (PT-BR)', 'Uso no jazz'],
            linhas: [
              ['C9', 'Dó–Ré–Mi–Sol (sem sétima)', 'Dó–Mi–Sol–Si♭–Ré (com 7ª menor)'],
              ['Cadd9', 'Dó–Ré–Mi–Sol (sem sétima)', 'Dó–Ré–Mi–Sol (sem sétima)'],
              ['C7(9)', 'Dó–Mi–Sol–Si♭–Ré', 'Dó–Mi–Sol–Si♭–Ré'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Na música popular brasileira, "C9" quase sempre quer dizer o acorde sem sétima — aquele violão aberto e arejado. No jazz, "C9" pressupõe a sétima menor. Na dúvida, escreva "add9" ou "7(9)": são cifras que ninguém lê errado.',
          },
          {
            tipo: 'lista',
            itens: [
              '♭9 e ♯9 — nonas alteradas, quase exclusivas de acordes dominantes; carregam tensão para resolver',
              'sus2 x add9 — mesmas notas no papel, papéis diferentes: no sus2 a 2ª substitui a terça, no add9 a terça continua lá',
            ],
          },
        ],
      },
      {
        titulo: 'Décima primeira: a nota que briga com a terça',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A 11ª justa fica a apenas um semitom acima da terça maior. Em Dó: Fá contra Mi. Esse choque é áspero e turva o acorde — por isso a 11ª justa raramente aparece sobre acordes maiores.',
          },
          {
            tipo: 'lista',
            itens: [
              'Acorde menor — a 11ª justa cabe bem, porque a terça é menor e o choque desaparece (Dm11)',
              'Acorde maior ou dominante — usa-se a ♯11 no lugar (C7M(♯11)), que soa aberta em vez de suja',
              'Acorde sus4 — aqui a 4ª entra justamente porque a terça saiu de cena',
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Nota de evitar',
            texto:
              'É esse o sentido de "avoid note": não é nota proibida, é nota que exige contexto. Sobre C7M, o Fá pede para ser passagem rápida, não nota de apoio.',
          },
        ],
      },
      {
        titulo: 'Décima terceira e o dominante colorido',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A 13ª é a extensão mais confortável de todas: não briga com nenhuma nota do acorde e acrescenta um brilho suave. Seu habitat natural é o acorde dominante.',
          },
          {
            tipo: 'lista',
            itens: [
              'C13 → Dó–Mi–Sol–Si♭–Ré–Lá (na prática se omitem notas; ver a seção seguinte)',
              'C7(13) → mesma ideia, cifrando só a extensão que interessa',
              '13ª é Lá, não Lá♭ — a ♭13 é outra coisa, uma tensão alterada de dominante',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Um C13 completo tem seis notas. Ninguém toca as seis: descarta-se a quinta, que não define nada, e muitas vezes a própria fundamental — que o baixo já está cobrindo.',
          },
        ],
      },
      {
        titulo: 'O que sobra quando o baixo já toca a fundamental',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Numa banda, a fundamental é responsabilidade do baixo. Isso libera o instrumento harmônico para tocar só o que define a cor do acorde.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Nota', 'Pode sair?', 'Por quê'],
            linhas: [
              ['Fundamental', 'Sim, se o baixo tocar', 'A raiz já está soando embaixo'],
              ['3ª', 'Não', 'É ela que diz maior ou menor'],
              ['5ª justa', 'Sim', 'Não altera a qualidade do acorde'],
              ['7ª', 'Não', 'É ela que define a função do acorde'],
              ['9ª / 11ª / 13ª', 'Sim, são opcionais', 'São cor, não estrutura'],
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'O par que não sai',
            texto:
              'Terça e sétima são o guia do acorde. Com essas duas notas mais o baixo na fundamental, o acorde já está dito por inteiro — o resto é escolha de sabor.',
          },
        ],
      },
    ],
  },

  {
    id: 'inversoes',
    numero: 15,
    titulo: 'Inversões e cifras com barra',
    resumo: 'Quem manda no acorde é a nota do baixo: estados de inversão e condução da linha grave.',
    secoes: [
      {
        titulo: 'Estado fundamental e inversões',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Um acorde está no estado fundamental quando a fundamental é a nota mais grave. Trocar qual nota fica embaixo não muda o acorde — muda o seu estado.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Estado', 'Nota no baixo', 'Dó maior', 'Cifra'],
            linhas: [
              ['Fundamental', 'Fundamental', 'Dó–Mi–Sol', 'C'],
              ['1ª inversão', '3ª', 'Mi–Sol–Dó', 'C/E'],
              ['2ª inversão', '5ª', 'Sol–Dó–Mi', 'C/G'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Tétrades têm uma inversão a mais, a terceira, com a sétima no baixo: C7M/Si. Tríade tem três estados possíveis; tétrade tem quatro.',
          },
          {
            tipo: 'destaque',
            titulo: 'Quem decide a inversão',
            texto:
              'Não é o violão nem o teclado: é o baixo. Por mais que o acorde no violão comece em Mi, se o baixo toca Dó o ouvido escuta C no estado fundamental. A nota mais grave da banda é que manda.',
          },
        ],
      },
      {
        titulo: 'Lendo a cifra com barra',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A barra separa duas informações: antes dela, o acorde; depois, a nota que vai no baixo. Lê-se "C sobre E" ou "C com Mi no baixo".',
          },
          {
            tipo: 'lista',
            itens: [
              'C/E — Dó maior com Mi no baixo: é inversão, porque Mi pertence ao acorde',
              'C/G — Dó maior com Sol no baixo: também inversão',
              'C/D — Dó maior com Ré no baixo: o Ré não pertence ao acorde, então não é inversão',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Só é inversão quando a nota do baixo já faz parte do acorde. Quando ela vem de fora, o resultado é um acorde novo por sobreposição — e muitas vezes é exatamente esse o efeito desejado.',
          },
        ],
      },
      {
        titulo: 'Baixo caminhante por graus conjuntos',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A razão prática de inverter acordes é fazer a linha do baixo andar de vizinho em vez de saltar. Compare a mesma progressão nas duas leituras.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Sem inversão', 'Baixo', 'Com inversão', 'Baixo'],
            linhas: [
              ['C', 'Dó', 'C', 'Dó'],
              ['G', 'Sol (salto de 5ª)', 'G/B', 'Si'],
              ['Am', 'Lá', 'Am', 'Lá'],
              ['F', 'Fá', 'F/G', 'Sol'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Na coluna da direita o baixo faz Dó–Si–Lá–Sol: uma escada descendente. A harmonia é a mesma, mas a linha grave virou melodia.',
          },
          {
            tipo: 'destaque',
            titulo: 'A descida clássica',
            texto:
              'C – C/B – Am – Am/G – F – F/E – Dm – G7 é o exemplo mais conhecido dessa ideia. O baixo desce Dó–Si–Lá–Sol–Fá–Mi–Ré enquanto os acordes por cima quase não se mexem.',
          },
        ],
      },
      {
        titulo: 'Pedal e outros baixos que não se movem',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O efeito oposto também vale: segurar uma nota grave enquanto a harmonia muda por cima. Isso se chama pedal.',
          },
          {
            tipo: 'lista',
            itens: [
              'Pedal de tônica — o baixo trava no 1º grau; a harmonia se afasta e volta sem perder o chão',
              'Pedal de dominante — o baixo trava no 5º grau; acumula tensão antes de uma entrada ou refrão',
              'Cifras típicas de pedal: F/G, Dm7/G, Am7/G — sempre a mesma nota embaixo',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'F/G merece atenção: soa como um dominante de Dó sem ser um G7 comum. Muita música brasileira resolve em Dó vindo daí, com um repouso mais macio do que o G7 daria.',
          },
        ],
      },
      {
        titulo: 'Escolhendo a inversão na prática',
        blocos: [
          {
            tipo: 'lista',
            itens: [
              'Quer estabilidade — fundamental no baixo, principalmente no primeiro e no último acorde da frase',
              'Quer movimento — inverta para que o baixo ande por tom ou semitom até o próximo acorde',
              'Quer suspensão — a 2ª inversão, com a quinta no baixo, soa instável e pede continuação',
              'Quer surpresa — baixo estranho ao acorde, como C/D ou C/F♯',
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Regra de bolso',
            texto:
              'Meio da frase pede movimento; começo e fim pedem chão. Inverter tudo cansa tanto quanto não inverter nada.',
          },
        ],
      },
    ],
  },

  {
    id: 'leitura-ritmica',
    numero: 16,
    titulo: 'Leitura rítmica',
    resumo: 'Figuras, pausas, ponto, ligadura, síncope e quiálteras — o tempo no papel.',
    secoes: [
      {
        titulo: 'As figuras e o que elas valem',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Cada figura dura o dobro da seguinte. Os valores abaixo estão em tempos de compasso 4/4, onde a semínima vale uma batida.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Figura', 'Vale', 'Cabem em 4/4'],
            linhas: [
              ['Semibreve', '4 tempos', '1'],
              ['Mínima', '2 tempos', '2'],
              ['Semínima', '1 tempo', '4'],
              ['Colcheia', '1/2 tempo', '8'],
              ['Semicolcheia', '1/4 de tempo', '16'],
              ['Fusa', '1/8 de tempo', '32'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Cada figura tem uma pausa equivalente, que vale exatamente o mesmo em silêncio. Pausa não é buraco: é uma duração que se conta igual às outras.',
          },
          {
            tipo: 'destaque',
            titulo: 'Os valores são relativos',
            texto:
              'A semínima só vale 1 tempo porque o denominador do 4/4 é 4. Em 4/2 quem vale a batida é a mínima. O que nunca muda é a proporção entre as figuras.',
          },
        ],
      },
      {
        titulo: 'Contando em voz alta',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Ler ritmo é contar sempre a mesma grade e encaixar as notas nela. A contagem não muda quando o ritmo fica difícil — é ela que segura o barco.',
          },
          {
            tipo: 'formula',
            rotulo: 'Semínimas',
            texto: '1 — 2 — 3 — 4',
          },
          {
            tipo: 'formula',
            rotulo: 'Colcheias',
            texto: '1 e 2 e 3 e 4 e',
          },
          {
            tipo: 'formula',
            rotulo: 'Semicolcheias',
            texto: '1 e ê a 2 e ê a 3 e ê a 4 e ê a',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Os números caem no tempo; o "e" cai no contratempo. Quem consegue dizer a contagem inteira enquanto toca já não se perde no compasso.',
          },
        ],
      },
      {
        titulo: 'Ponto de aumento e ligadura',
        blocos: [
          {
            tipo: 'paragrafo',
            texto: 'Há duas formas de esticar uma nota além do valor da figura escrita.',
          },
          {
            tipo: 'formula',
            rotulo: 'Ponto de aumento',
            texto: 'figura + metade dela mesma',
          },
          {
            tipo: 'lista',
            itens: [
              'Semínima pontuada = 1 + 1/2 = 1,5 tempo',
              'Mínima pontuada = 2 + 1 = 3 tempos',
              'Colcheia pontuada = 1/2 + 1/4 = 0,75 de tempo',
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'A ligadura de valor une duas figuras de mesma altura e soma as durações: a segunda não é tocada de novo, só prolonga a primeira. É assim que uma nota atravessa a barra de compasso.',
          },
          {
            tipo: 'destaque',
            titulo: 'Não confunda as duas ligaduras',
            texto:
              'A ligadura de valor une notas de mesma altura e soma tempo. A ligadura de expressão cobre notas diferentes e pede que soem conectadas. O desenho é parecido; a instrução é outra.',
          },
        ],
      },
      {
        titulo: 'Síncope e contratempo',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Os dois deslocam o acento para fora do tempo forte, mas de maneiras diferentes.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['', 'Contratempo', 'Síncope'],
            linhas: [
              ['O que acontece', 'A nota soa entre os tempos', 'A nota começa no fraco e se prolonga no forte'],
              ['O tempo forte', 'Fica em silêncio', 'É ocupado pela nota que já vinha soando'],
              ['Sensação', 'Picotado, saltitante', 'Empurra a música para a frente'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'A síncope é a espinha dorsal do ritmo brasileiro. Samba, choro, baião e maracatu vivem de notas que entram antes do tempo forte e o atravessam.',
          },
        ],
      },
      {
        titulo: 'Compassos simples, compostos e quiálteras',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Em compasso simples cada tempo se divide em 2. Em compasso composto cada tempo se divide em 3 — e o número de cima é múltiplo de 3.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Compasso', 'Tipo', 'Sensação'],
            linhas: [
              ['2/4', 'Simples', '2 tempos divididos em 2'],
              ['3/4', 'Simples', '3 tempos divididos em 2 (valsa)'],
              ['4/4', 'Simples', '4 tempos divididos em 2'],
              ['6/8', 'Composto', '2 tempos divididos em 3'],
              ['12/8', 'Composto', '4 tempos divididos em 3'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'A quiáltera é a exceção temporária: ela empresta a divisão do outro time. A mais comum é a tercina — três notas ocupando o espaço de duas, escritas com um "3" em cima.',
          },
          {
            tipo: 'destaque',
            titulo: 'Como sentir 6/8',
            texto:
              'Não conte seis. Conte dois, com três subdivisões cada: "1 e a 2 e a". Contar as seis colcheias uma a uma destrói o balanço que faz o 6/8 existir.',
          },
        ],
      },
    ],
  },

  {
    id: 'braco-do-baixo',
    numero: 17,
    titulo: 'O braço do baixo',
    resumo: 'Afinação, mapa das notas, formas de oitava e quinta, e como achar qualquer nota.',
    secoes: [
      {
        titulo: 'A afinação padrão',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'O baixo de quatro cordas é afinado, da mais grave para a mais aguda, em Mi–Lá–Ré–Sol (E–A–D–G). São as mesmas quatro cordas graves do violão, uma oitava abaixo.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Corda', 'Nota', 'Cifra'],
            linhas: [
              ['4ª (mais grave)', 'Mi', 'E'],
              ['3ª', 'Lá', 'A'],
              ['2ª', 'Ré', 'D'],
              ['1ª (mais aguda)', 'Sol', 'G'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Cada corda está uma 4ª justa acima da anterior — cinco semitons. No baixo de cinco cordas acrescenta-se um Si abaixo do Mi (B–E–A–D–G), mantendo a mesma distância de 4ª.',
          },
          {
            tipo: 'destaque',
            titulo: 'Por que as 4ªs importam',
            texto:
              'Como o intervalo entre cordas vizinhas é sempre o mesmo, qualquer desenho de dedos vale em qualquer par de cordas. Aprender uma forma é aprendê-la no braço inteiro.',
          },
        ],
      },
      {
        titulo: 'Casas, semitons e a oitava na casa 12',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Cada casa avança exatamente um semitom. Doze casas depois você percorreu os doze semitons e chegou na mesma nota, uma oitava acima.',
          },
          {
            tipo: 'formula',
            rotulo: 'Regra do braço',
            texto: '1 casa = 1 semitom · 2 casas = 1 tom · 12 casas = 1 oitava',
          },
          {
            tipo: 'lista',
            itens: [
              'Casa 12 da corda Mi = Mi, uma oitava acima da corda solta',
              'A partir da casa 12 o desenho de notas se repete igual ao começo',
              'As marcações do braço (3, 5, 7, 9 e 12) existem para você achar a casa sem contar',
            ],
          },
        ],
      },
      {
        titulo: 'Notas naturais na corda Mi e na corda Lá',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Essas duas cordas concentram a maioria das fundamentais que um baixista toca. Decorar só elas já resolve boa parte do repertório.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Casa', 'Corda Mi (E)', 'Corda Lá (A)'],
            linhas: [
              ['solta', 'Mi', 'Lá'],
              ['1', 'Fá', 'Lá♯ / Si♭'],
              ['2', 'Fá♯ / Sol♭', 'Si'],
              ['3', 'Sol', 'Dó'],
              ['5', 'Lá', 'Ré'],
              ['7', 'Si', 'Mi'],
              ['8', 'Dó', 'Fá'],
              ['10', 'Ré', 'Sol'],
              ['12', 'Mi', 'Lá'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Note os dois lugares onde a distância é de uma casa só: Mi→Fá e Si→Dó. São os mesmos semitons naturais da teoria, agora visíveis no braço.',
          },
        ],
      },
      {
        titulo: 'As formas que valem em qualquer tom',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Como a afinação é regular, os intervalos viram desenhos fixos. Aprenda estes três e você toca em qualquer tonalidade só mudando de casa.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Intervalo', 'Onde está', 'A partir de Dó (corda Lá, casa 3)'],
            linhas: [
              ['4ª justa', 'Mesma casa, corda seguinte', 'Fá — corda Ré, casa 3'],
              ['5ª justa', 'Corda seguinte, 2 casas à frente', 'Sol — corda Ré, casa 5'],
              ['Oitava', 'Duas cordas adiante, 2 casas à frente', 'Dó — corda Sol, casa 5'],
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'O desenho da fundamental',
            texto:
              'Fundamental, quinta e oitava formam uma figura compacta que cabe sob a mão sem sair da posição. É a base de quase toda linha de baixo de rock, pop e sertanejo.',
          },
        ],
      },
      {
        titulo: 'Posição de mão e economia de movimento',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Chamamos de posição a região de quatro casas que a mão alcança sem se deslocar — um dedo por casa. Tocar bem é escolher a posição que evita o maior número de saltos.',
          },
          {
            tipo: 'lista',
            itens: [
              'Um dedo por casa: indicador, médio, anular e mínimo cobrem quatro casas seguidas',
              'Prefira mudar de corda a mudar de posição — o salto entre cordas custa menos que o deslize pelo braço',
              'Nas casas 1 a 5 o espaçamento é maior; nas casas altas, menor. A mesma frase exige esforços diferentes conforme a região',
              'Ao ensaiar uma linha, marque antes onde a mão troca de posição, em vez de descobrir isso no meio da música',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'linhas-de-baixo',
    numero: 18,
    titulo: 'Construção de linhas de baixo',
    resumo: 'Da fundamental ao walking: como transformar uma cifra em linha que sustenta a banda.',
    secoes: [
      {
        titulo: 'O que o baixo faz',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'A linha de baixo tem duas funções ao mesmo tempo: dizer qual é a nota grave de cada acorde e trancar o ritmo junto com a bateria. Qualquer nota que atrapalhe uma dessas duas coisas está sobrando.',
          },
          {
            tipo: 'lista',
            itens: [
              'Função harmônica — o baixo declara a fundamental e, com ela, define o estado do acorde',
              'Função rítmica — o baixo escolhe onde a harmonia bate, casando com o bumbo',
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'A linha serve a música',
            texto:
              'Uma linha boa é a que ninguém percebe até você tirá-la. Frase demais no baixo rouba espaço do vocal e da harmonia — o brilho aqui vem do encaixe, não da quantidade de notas.',
          },
        ],
      },
      {
        titulo: 'Os quatro níveis de construção',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Toda linha, por mais elaborada, é uma dessas camadas ou uma mistura delas. Suba um degrau de cada vez sobre a mesma progressão.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Nível', 'O que tocar', 'Sobre C – Am – F – G'],
            linhas: [
              ['1. Fundamental', 'A raiz na cabeça do compasso', 'Dó – Lá – Fá – Sol'],
              ['2. Fund. + 5ª', 'Raiz e quinta alternando', 'Dó-Sol / Lá-Mi / Fá-Dó / Sol-Ré'],
              ['3. Arpejo', 'As notas do próprio acorde', 'Dó-Mi-Sol / Lá-Dó-Mi / Fá-Lá-Dó / Sol-Si-Ré'],
              ['4. Passagem', 'Arpejo mais notas de ligação', 'Arpejo + escala e cromatismo entre acordes'],
            ],
          },
          {
            tipo: 'paragrafo',
            texto:
              'Não pule para o nível 4 antes de a mão direita estar firme no nível 1. Um baixista que toca só a fundamental no tempo certo é mais útil que um que toca escalas fora do tempo.',
          },
        ],
      },
      {
        titulo: 'Notas de passagem e aproximação cromática',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Nota de passagem é a que preenche o caminho entre duas notas importantes. A mais eficaz é a aproximação cromática: chegar na fundamental do próximo acorde por um semitom.',
          },
          {
            tipo: 'lista',
            itens: [
              'Aproximação por baixo — um semitom abaixo do alvo: para chegar em Fá, toque Mi antes',
              'Aproximação por cima — um semitom acima do alvo: para chegar em Fá, toque Fá♯ antes',
              'Aproximação diatônica — chega pela nota vizinha da escala, mais suave que a cromática',
              'Aproximação por dominante — vem da 5ª justa acima do alvo, imitando a resolução V–I',
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Onde a nota de passagem entra',
            texto:
              'No último tempo do compasso, imediatamente antes da mudança de acorde. Ali ela empurra; em qualquer outro lugar costuma soar como erro.',
          },
        ],
      },
      {
        titulo: 'Walking bass',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Walking é a linha em semínimas contínuas — quatro notas por compasso, sem parar — típica do jazz, do blues e do choro. A regra que a organiza é simples.',
          },
          {
            tipo: 'formula',
            rotulo: 'A regra do walking',
            texto: 'Tempo 1 = fundamental do acorde · Tempo 4 = aproximação do próximo acorde',
          },
          {
            tipo: 'paragrafo',
            texto:
              'Com os tempos 1 e 4 definidos, sobram os tempos 2 e 3 para preencher com notas do acorde ou da escala. Toda a arte do walking mora nesse preenchimento.',
          },
          {
            tipo: 'tabela',
            cabecalho: ['Compasso', 'Acorde', 'Linha possível'],
            linhas: [
              ['1', 'Dm7', 'Ré – Fá – Lá – Si (aproxima Sol por cima)'],
              ['2', 'G7', 'Sol – Si – Ré – Mi (aproxima Fá por cima)'],
              ['3', 'C7M', 'Dó – Mi – Sol – Lá'],
            ],
          },
        ],
      },
      {
        titulo: 'Groove: repetição, espaço e encaixe',
        blocos: [
          {
            tipo: 'paragrafo',
            texto:
              'Nas músicas de levada, a linha não é uma frase nova a cada compasso: é um desenho curto que se repete e vira identidade. O ouvinte precisa reconhecê-lo.',
          },
          {
            tipo: 'lista',
            itens: [
              'Escolha um desenho de um ou dois compassos e repita-o com convicção',
              'Case o ataque das notas graves com o bumbo; onde a caixa bate, o baixo geralmente respira',
              'Silêncio é parte do groove — a pausa dá o balanço que a nota a mais tira',
              'Guarde a variação para a virada, no fim de cada quatro ou oito compassos',
            ],
          },
          {
            tipo: 'destaque',
            titulo: 'Erros mais comuns',
            texto:
              'Encher todos os espaços com notas; mudar de desenho a cada compasso; tocar arpejos rápidos sobre uma música que pedia fundamental; e acelerar na virada. Todos vêm de tratar o baixo como instrumento solista.',
          },
        ],
      },
    ],
  },
];

export function moduloPorId(id: string) {
  return MODULOS.find((m) => m.id === id);
}
