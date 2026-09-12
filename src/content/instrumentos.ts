import type { Instrumento } from './tipos';

/**
 * Os três instrumentos de corda que a apostila usa como exemplo.
 *
 * O conteúdo aqui é de consulta, não de trilha: ninguém é aprovado em
 * "violão". Ele existe para o aluno conferir uma afinação no meio de uma aula
 * sem precisar sair do app.
 *
 * Um fato que a página inteira gira em torno: **violão e guitarra têm a mesma
 * afinação padrão, corda por corda**. Não é simplificação didática — é o mesmo
 * Mi2, Lá2, Ré3, Sol3, Si3, Mi4 nos dois. O que muda entre eles é corpo,
 * corda e captação, nunca a nota da corda solta. Escrever afinações
 * diferentes para os dois seria o erro mais fácil de cometer aqui.
 */
export const INSTRUMENTOS: readonly Instrumento[] = [
  {
    id: 'contrabaixo',
    nome: 'Contrabaixo',
    resumo:
      'Quatro cordas graves, afinadas em quartas justas. É o instrumento que amarra a harmonia ao ritmo.',
    cordas: [
      { ordem: 4, nota: 'Mi', cifra: 'E', oitava: 1 },
      { ordem: 3, nota: 'Lá', cifra: 'A', oitava: 1 },
      { ordem: 2, nota: 'Ré', cifra: 'D', oitava: 2 },
      { ordem: 1, nota: 'Sol', cifra: 'G', oitava: 2 },
    ],
    intervalos: 'Quarta justa entre cordas vizinhas — nas quatro, sem exceção.',
    clave: 'Clave de fá, escrito uma oitava acima do que soa.',
    papel: [
      'O baixo toca a nota mais grave do acorde, quase sempre a tônica, e é ela que diz ao ouvido qual acorde está soando. Trocar só essa nota muda como o acorde é ouvido, mesmo com as outras paradas: é exatamente isso que a cifra C/E descreve.',
      'Ele também é a dobradiça entre os dois pilares: escolhe QUE nota tocar pela harmonia, e QUANDO tocá-la pela levada. Por isso um baixista precisa de campo harmônico e de leitura rítmica na mesma medida.',
    ],
  },
  {
    id: 'violao',
    nome: 'Violão',
    resumo:
      'Seis cordas, de nylon ou de aço. Afinado em quartas — menos num ponto, e esse ponto tem motivo.',
    cordas: [
      { ordem: 6, nota: 'Mi', cifra: 'E', oitava: 2 },
      { ordem: 5, nota: 'Lá', cifra: 'A', oitava: 2 },
      { ordem: 4, nota: 'Ré', cifra: 'D', oitava: 3 },
      { ordem: 3, nota: 'Sol', cifra: 'G', oitava: 3 },
      { ordem: 2, nota: 'Si', cifra: 'B', oitava: 3 },
      { ordem: 1, nota: 'Mi', cifra: 'E', oitava: 4 },
    ],
    intervalos: 'Quartas justas, exceto de Sol para Si, que é uma terça maior.',
    clave: 'Clave de sol, escrito uma oitava acima do que soa.',
    papel: [
      'O violão é um instrumento harmônico: toca três, quatro, seis notas ao mesmo tempo e entrega o acorde inteiro. É por isso que ele sustenta uma música sozinho, enquanto o baixo precisa de companhia.',
      'Aquela terça maior entre a 3ª e a 2ª corda parece uma irregularidade, mas é o que torna os acordes pegáveis: com quartas o caminho todo, as formas de dó, sol e ré exigiriam uma abertura de mão que ninguém tem.',
    ],
  },
  {
    id: 'guitarra',
    nome: 'Guitarra',
    resumo:
      'Mesma afinação do violão, corda por corda. O que muda é o corpo, a corda de aço e os captadores.',
    cordas: [
      { ordem: 6, nota: 'Mi', cifra: 'E', oitava: 2 },
      { ordem: 5, nota: 'Lá', cifra: 'A', oitava: 2 },
      { ordem: 4, nota: 'Ré', cifra: 'D', oitava: 3 },
      { ordem: 3, nota: 'Sol', cifra: 'G', oitava: 3 },
      { ordem: 2, nota: 'Si', cifra: 'B', oitava: 3 },
      { ordem: 1, nota: 'Mi', cifra: 'E', oitava: 4 },
    ],
    intervalos: 'Quartas justas, exceto de Sol para Si, que é uma terça maior.',
    clave: 'Clave de sol, escrito uma oitava acima do que soa.',
    papel: [
      'A guitarra faz o que o violão faz e mais um papel: com sustain longo e som amplificado, uma nota só se segura no ar tempo suficiente para carregar uma melodia. Daí os riffs e os solos.',
      'Como a afinação é a mesma, toda forma de acorde e todo desenho de escala que você aprendeu num valem no outro sem mudar nada. Muda o som e a técnica de mão direita, não a teoria.',
    ],
  },
];

/**
 * A linha que resume a afinação: `Mi1 · Lá1 · Ré2 · Sol2`.
 *
 * Mora aqui, e não na tela, porque a página mostra essa mesma string em dois
 * lugares — no cabeçalho de cada instrumento e no resumo comparativo do fim.
 */
export function afinacaoDe(instrumento: Instrumento): string {
  return instrumento.cordas.map((corda) => `${corda.nota}${corda.oitava}`).join(' · ');
}
