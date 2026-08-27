/**
 * Repetição espaçada — variação do SM-2.
 *
 * A ideia: cada card guarda um FATOR DE FACILIDADE que sobe quando você acerta
 * com folga e desce quando você tropeça. O próximo intervalo não é uma tabela
 * fixa — é o intervalo anterior multiplicado por esse fator. Assim, dois cards
 * avaliados como "Bom" hoje podem voltar em prazos bem diferentes, dependendo
 * de como você se saiu com cada um até aqui.
 *
 * Os prazos da primeira revisão (10 min / 1 dia / 4 dias / 10 dias) são só o
 * ponto de partida. A partir da segunda, quem manda é o histórico.
 */

export type Avaliacao = 'errei' | 'dificil' | 'bom' | 'facil';

export type EstadoCard = {
  /** Acertos consecutivos desde o último erro. */
  repeticoes: number;
  /** Fator de facilidade acumulado. Começa em 2.5 e se ajusta a cada revisão. */
  facilidade: number;
  /** Intervalo atual, em minutos. */
  intervaloMinutos: number;
  /** Quando o card volta a aparecer (timestamp em ms). */
  proximaRevisao: number;
  /** Quantas vezes o card foi esquecido. */
  lapsos: number;
  /** Total de revisões feitas. */
  revisoes: number;
};

const MINUTOS_POR_DIA = 1440;

/** Prazo da PRIMEIRA revisão bem-sucedida (ou da primeira depois de um erro). */
const INTERVALO_BASE: Record<Avaliacao, number> = {
  errei: 10,
  dificil: 1 * MINUTOS_POR_DIA,
  bom: 4 * MINUTOS_POR_DIA,
  facil: 10 * MINUTOS_POR_DIA,
};

/** Quanto cada resposta mexe no fator de facilidade. */
const AJUSTE_FACILIDADE: Record<Avaliacao, number> = {
  errei: -0.2,
  dificil: -0.15,
  bom: 0,
  facil: 0.15,
};

export const FACILIDADE_INICIAL = 2.5;
const FACILIDADE_MIN = 1.3;
const FACILIDADE_MAX = 2.8;

/** Teto de 6 meses: além disso o prazo deixa de ser útil para estudo. */
const INTERVALO_MAX = 180 * MINUTOS_POR_DIA;

/** Um card que nunca foi revisado. */
export function estadoInicial(agora = Date.now()): EstadoCard {
  return {
    repeticoes: 0,
    facilidade: FACILIDADE_INICIAL,
    intervaloMinutos: 0,
    proximaRevisao: agora,
    lapsos: 0,
    revisoes: 0,
  };
}

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.min(Math.max(valor, minimo), maximo);
}

/**
 * Calcula o próximo estado do card a partir da resposta dada.
 *
 * `anterior` é `undefined` quando o card nunca foi visto.
 */
export function revisar(
  anterior: EstadoCard | undefined,
  avaliacao: Avaliacao,
  agora = Date.now()
): EstadoCard {
  const estado = anterior ?? estadoInicial(agora);

  const facilidade = limitar(
    estado.facilidade + AJUSTE_FACILIDADE[avaliacao],
    FACILIDADE_MIN,
    FACILIDADE_MAX
  );

  let repeticoes: number;
  let intervalo: number;

  if (avaliacao === 'errei') {
    // Errou: o card volta para o começo e reaparece em minutos.
    repeticoes = 0;
    intervalo = INTERVALO_BASE.errei;
  } else {
    repeticoes = estado.repeticoes + 1;

    if (repeticoes === 1) {
      // Primeira revisão bem-sucedida (ou a primeira depois de um lapso).
      intervalo = INTERVALO_BASE[avaliacao];
    } else {
      // Daqui em diante o prazo cresce com base no histórico do card.
      const multiplicador =
        avaliacao === 'dificil' ? 1.2 : avaliacao === 'facil' ? facilidade * 1.3 : facilidade;

      intervalo = Math.max(
        estado.intervaloMinutos * multiplicador,
        // "Difícil" nunca deve encurtar o prazo abaixo de um dia.
        avaliacao === 'dificil' ? MINUTOS_POR_DIA : 0
      );
    }
  }

  intervalo = Math.min(Math.round(intervalo), INTERVALO_MAX);

  return {
    repeticoes,
    facilidade,
    intervaloMinutos: intervalo,
    proximaRevisao: agora + intervalo * 60_000,
    lapsos: estado.lapsos + (avaliacao === 'errei' ? 1 : 0),
    revisoes: estado.revisoes + 1,
  };
}

/** Prazo que cada botão vai gerar — usado para rotular os botões antes do toque. */
export function previsao(
  anterior: EstadoCard | undefined,
  avaliacao: Avaliacao,
  agora = Date.now()
): number {
  return revisar(anterior, avaliacao, agora).intervaloMinutos;
}

/** Um card está vencido quando chegou a hora dele (ou já passou). */
export function estaVencido(estado: EstadoCard | undefined, agora = Date.now()): boolean {
  return estado === undefined || estado.proximaRevisao <= agora;
}

/** "10 minutos", "1 dia", "4 dias", "3 semanas", "2 meses". */
export function formatarIntervalo(minutos: number): string {
  if (minutos < 60) {
    return `${Math.max(1, Math.round(minutos))} min`;
  }

  const horas = minutos / 60;
  if (horas < 24) {
    const h = Math.round(horas);
    return h === 1 ? '1 hora' : `${h} horas`;
  }

  const dias = Math.round(minutos / MINUTOS_POR_DIA);
  if (dias < 14) {
    return dias === 1 ? '1 dia' : `${dias} dias`;
  }

  if (dias < 60) {
    const semanas = Math.round(dias / 7);
    return semanas === 1 ? '1 semana' : `${semanas} semanas`;
  }

  const meses = Math.round(dias / 30);
  return meses === 1 ? '1 mês' : `${meses} meses`;
}

/** Quanto falta até a próxima revisão, em texto. */
export function tempoAte(timestamp: number, agora = Date.now()): string {
  const minutos = Math.max(0, (timestamp - agora) / 60_000);
  return formatarIntervalo(minutos);
}

export const ROTULOS: Record<Avaliacao, string> = {
  errei: 'Errei',
  dificil: 'Difícil',
  bom: 'Bom',
  facil: 'Fácil',
};

export const ORDEM_AVALIACOES: Avaliacao[] = ['errei', 'dificil', 'bom', 'facil'];
