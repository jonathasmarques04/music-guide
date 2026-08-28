import type { Flashcard } from './tipos';

/** Baralhos de flashcards por módulo (chave = id do módulo). */
export const FLASHCARDS: Record<string, Flashcard[]> = {
  'conceitos-basicos': [
    { frente: 'O que é um semitom?', verso: 'A menor distância entre duas notas: uma tecla vizinha no piano, uma casa no violão.' },
    { frente: '1 tom equivale a quantos semitons?', verso: '2 semitons.' },
    { frente: 'Quais pares de notas naturais estão a 1 semitom?', verso: 'Mi → Fá e Si → Dó.' },
    { frente: 'Nota x acorde', verso: 'Nota é um som isolado (uma frequência). Acorde é o som de três ou mais notas simultâneas.' },
    { frente: 'Os três pilares da música', verso: 'Melodia (notas em sequência), harmonia (acordes que sustentam) e ritmo (organização no tempo).' },
    { frente: 'Pulsação x ritmo', verso: 'Pulsação é o batimento regular; ritmo é como as notas se distribuem sobre ela.' },
    { frente: 'O que significam os números do compasso 4/4?', verso: 'Em cima: quantas batidas cabem no compasso. Embaixo: qual figura vale uma batida (4 = semínima).' },
    { frente: 'Sustenido e bemol', verso: '♯ aumenta a nota em um semitom; ♭ diminui em um semitom.' },
    { frente: 'O que são notas enarmônicas?', verso: 'Mesmo som, nomes diferentes — como Dó♯ e Ré♭. O nome depende da tonalidade.' },
    { frente: 'Dó → Mi é qual intervalo?', verso: 'Terça maior (2 tons / 4 semitons).' },
    { frente: 'Dó → Sol é qual intervalo?', verso: 'Quinta justa (3,5 tons / 7 semitons).' },
  ],

  escalas: [
    { frente: 'Fórmula da escala maior', verso: 'T – T – st – T – T – T – st' },
    { frente: 'Fórmula da menor natural', verso: 'T – st – T – T – st – T – T' },
    { frente: 'Onde caem os semitons na escala maior?', verso: 'Entre o 3º e o 4º grau, e entre o 7º e o 8º. Em Dó: Mi→Fá e Si→Dó.' },
    { frente: 'O que é a tônica?', verso: 'A nota principal da escala — o 1º grau, o centro de gravidade sonoro.' },
    { frente: 'Como achar a relativa menor?', verso: 'Um tom e meio (3 semitons) abaixo da tônica maior. Dó maior → Lá menor.' },
    { frente: 'O que é o trítono?', verso: 'Intervalo de 3 tons (6 semitons). Divide a oitava ao meio e é o mais tenso da música tonal.' },
    { frente: 'Pentatônica maior — fórmula', verso: '1 – 2 – 3 – 5 – 6. Em Dó: Dó – Ré – Mi – Sol – Lá.' },
    { frente: 'Pentatônica menor — fórmula', verso: '1 – ♭3 – 4 – 5 – ♭7. Em Lá: Lá – Dó – Ré – Mi – Sol.' },
    { frente: 'Por que a pentatônica soa "segura"?', verso: 'Porque não tem trítono — as notas de maior tensão foram removidas.' },
  ],

  triades: [
    { frente: 'Quais notas formam uma tríade?', verso: 'Fundamental, terça e quinta.' },
    { frente: 'O que a terça define no acorde?', verso: 'Se ele é maior (terça maior, 2 tons) ou menor (terça menor, 1,5 tom).' },
    { frente: 'O que a quinta define?', verso: 'A estabilidade: justa = estável, diminuta = tensa, aumentada = excêntrica.' },
    { frente: 'Tríade maior — fórmula', verso: 'Fundamental + terça maior + quinta justa. Em Dó: Dó – Mi – Sol.' },
    { frente: 'Tríade menor — fórmula', verso: 'Fundamental + terça menor + quinta justa. Em Lá: Lá – Dó – Mi.' },
    { frente: 'Tríade diminuta — fórmula', verso: 'Fundamental + terça menor + quinta diminuta. Em Si: Si – Ré – Fá.' },
    { frente: 'Tríade aumentada — fórmula', verso: 'Fundamental + terça maior + quinta aumentada. Em Dó: Dó – Mi – Sol♯.' },
  ],

  tetrades: [
    { frente: 'X7M — estrutura', verso: 'Fundamental + 3ª maior + 5ª justa + 7ª MAIOR. C7M = Dó–Mi–Sol–Si.' },
    { frente: 'X7 (dominante) — estrutura', verso: 'Fundamental + 3ª maior + 5ª justa + 7ª MENOR. C7 = Dó–Mi–Sol–Si♭.' },
    { frente: 'Xm7 — estrutura', verso: 'Fundamental + 3ª menor + 5ª justa + 7ª menor. Am7 = Lá–Dó–Mi–Sol.' },
    { frente: 'Xm7(♭5) — estrutura', verso: 'Fundamental + 3ª menor + 5ª diminuta + 7ª menor. Bm7♭5 = Si–Ré–Fá–Lá.' },
    { frente: 'Por que a tétrade soa mais rica?', verso: 'Porque contém duas tríades sobrepostas. C7M tem Dó–Mi–Sol (maior) e Mi–Sol–Si (menor).' },
    { frente: 'O que é um acorde suspenso?', verso: 'Um acorde sem terça — substituída pela 2ª (sus2) ou pela 4ª (sus4). Não é maior nem menor.' },
    { frente: 'Csus4 — notas e resolução', verso: 'Dó – Fá – Sol. Resolve em C, com o Fá descendo para o Mi.' },
  ],

  'campo-harmonico': [
    { frente: 'Campo harmônico maior com tríades', verso: 'I – ii – iii – IV – V – vi – vii°' },
    { frente: 'Campo harmônico de Dó maior', verso: 'C – Dm – Em – F – G – Am – B°' },
    { frente: 'Campo harmônico maior com tétrades', verso: 'I7M – ii m7 – iii m7 – IV7M – V7 – vi m7 – vii m7♭5' },
    { frente: 'Campo harmônico de Dó maior (tétrades)', verso: 'C7M – Dm7 – Em7 – F7M – G7 – Am7 – Bm7♭5' },
    { frente: 'Campo harmônico menor natural', verso: 'i – ii° – III – iv – v – VI – VII. Em Lá menor: Am – B° – C – Dm – Em – F – G.' },
    { frente: 'Como se constrói um campo harmônico?', verso: 'Empilhando terças diatônicas sobre cada grau, usando só as notas da escala.' },
    { frente: 'Qual grau é o único dominante no campo maior?', verso: 'O V (G7 em Dó maior) — é o único que contém o trítono.' },
  ],

  'funcoes-harmonicas': [
    { frente: 'As três funções harmônicas', verso: 'Tônica (repouso), subdominante (movimento) e dominante (tensão).' },
    { frente: 'Graus de função tônica', verso: 'I, vi e iii. Em Dó maior: C, Am e Em.' },
    { frente: 'Graus de função subdominante', verso: 'IV e ii. Em Dó maior: F e Dm.' },
    { frente: 'Graus de função dominante', verso: 'V e vii°. Em Dó maior: G (ou G7) e B°.' },
    { frente: 'De onde vem a tensão da dominante?', verso: 'Do trítono entre a terça e a sétima do acorde (Si e Fá, em G7).' },
    { frente: 'Como reconhecer a função tônica de ouvido?', verso: 'Pela sensação de "cheguei" — a frase parece não precisar continuar.' },
  ],

  'menores-harmonica-melodica': [
    { frente: 'Menor harmônica — alteração', verso: 'Eleva o 7º grau. Em Lá: Lá–Si–Dó–Ré–Mi–Fá–Sol♯.' },
    { frente: 'Menor melódica — alteração', verso: 'Eleva o 6º e o 7º graus. Em Lá: Lá–Si–Dó–Ré–Mi–Fá♯–Sol♯.' },
    { frente: 'Por que a menor harmônica existe?', verso: 'Para criar um dominante forte (V7) no tom menor — a menor natural tem V menor, sem trítono.' },
    { frente: 'V grau de Lá menor harmônica', verso: 'E maior (Mi–Sol♯–Si), ou E7 como tétrade.' },
    { frente: 'Campo harmônico da menor harmônica', verso: 'i – ii° – III+ – iv – V – VI – vii°' },
  ],

  cadencias: [
    { frente: 'Cadência perfeita', verso: 'V → I, com a tônica na fundamental e no baixo. G7 → C. Conclusão total.' },
    { frente: 'Cadência plagal', verso: 'IV → I. F → C. A "cadência do amém": suave, sem trítono.' },
    { frente: 'Cadência deceptiva', verso: 'V → vi. G7 → Am. Quebra de propósito a expectativa de resolução.' },
    { frente: 'Meia cadência', verso: 'Qualquer progressão que termina no V. Cria suspense — é a vírgula da música.' },
    { frente: 'O que torna uma cadência imperfeita?', verso: 'V → I enfraquecido: tônica invertida, dominante sem sétima ou melodia que não termina na tônica.' },
  ],

  dominantes: [
    { frente: 'Estrutura do V7', verso: 'Acorde maior com sétima menor. G7 = Sol – Si – Ré – Fá.' },
    { frente: 'Como o trítono de G7 resolve em C?', verso: 'Si sobe meio tom para Dó; Fá desce meio tom para Mi.' },
    { frente: 'O que é um dominante secundário?', verso: 'Um V7 que resolve em outro grau, tratado como tônica provisória. E7 → Am é V7/vi.' },
    { frente: 'Dominante secundário de Dm em Dó maior', verso: 'A7 (V7/ii).' },
    { frente: 'Dominante secundário de G em Dó maior', verso: 'D7 (V7/V).' },
    { frente: 'O que é substituição tritonal?', verso: 'Trocar o V7 por um dominante a um trítono de distância, que compartilha o mesmo trítono interno. G7 → D♭7.' },
    { frente: 'Dominantes estendidos — exemplo', verso: 'A7 → D7 → G7 → C. Cada um é o V7 do próximo.' },
  ],

  'ciclo-das-quintas': [
    { frente: 'Ciclo das quintas — sentido horário', verso: 'C → G → D → A → E → B → F♯ → C♯. Cada passo acrescenta um sustenido.' },
    { frente: 'Ciclo das quintas — sentido anti-horário', verso: 'C → F → B♭ → E♭ → A♭ → D♭ → G♭. Cada passo acrescenta um bemol.' },
    { frente: 'Quantos sustenidos tem Ré maior?', verso: '2 (Fá♯ e Dó♯) — dois passos no sentido horário.' },
    { frente: 'Quantos bemóis tem Mi♭ maior?', verso: '3 (Si♭, Mi♭ e Lá♭) — três passos no sentido anti-horário.' },
    { frente: 'Para que serve o ciclo das quintas?', verso: 'Descobrir armaduras, achar relativas, montar progressões em quintas e planejar modulações.' },
  ],

  'modulacao-transposicao': [
    { frente: 'O que é modulação?', verso: 'Mudar o centro tonal durante a música — sair de uma tonalidade e entrar em outra.' },
    { frente: 'O que é transposição?', verso: 'Levar a música inteira para outra altura, preservando a estrutura intervalar e as funções.' },
    { frente: 'Quando se usa transposição?', verso: 'Para adaptar a música à voz de quem canta ou a outro instrumento.' },
    { frente: 'Recursos comuns para modular', verso: 'Acordes pivôs, movimento cromático e dominantes secundários.' },
  ],

  'modos-gregos': [
    { frente: 'Como se formam os modos gregos?', verso: 'Mudando a tônica dentro da mesma escala maior. As notas são as mesmas; os intervalos em relação à tônica mudam.' },
    { frente: 'Modo Jônio', verso: '1º grau. 1–2–3–4–5–6–7. É a própria escala maior.' },
    { frente: 'Modo Dórico', verso: '2º grau. 1–2–♭3–4–5–6–♭7. Menor com SEXTA MAIOR — menor com brilho.' },
    { frente: 'Modo Frígio', verso: '3º grau. 1–♭2–♭3–4–5–♭6–♭7. A SEGUNDA MENOR dá o som espanhol/flamenco.' },
    { frente: 'Modo Lídio', verso: '4º grau. 1–2–3–♯4–5–6–7. A QUARTA AUMENTADA dá o brilho etéreo.' },
    { frente: 'Modo Mixolídio', verso: '5º grau. 1–2–3–4–5–6–♭7. Maior com sétima menor — o modo do dominante e do blues.' },
    { frente: 'Modo Eólio', verso: '6º grau. 1–2–♭3–4–5–♭6–♭7. É a escala menor natural.' },
    { frente: 'Modo Lócrio', verso: '7º grau. 1–♭2–♭3–4–♭5–♭6–♭7. Quinta diminuta: instável, gera o m7♭5.' },
    { frente: 'Como montar Dó Dórico?', verso: 'Qual escala maior tem Dó como 2º grau? Si♭ maior. Logo: Dó–Ré–Mi♭–Fá–Sol–Lá–Si♭.' },
  ],

  'emprestimo-modal': [
    { frente: 'O que é empréstimo modal?', verso: 'Usar acordes de um modo PARALELO (mesma tônica) dentro da tonalidade original.' },
    { frente: 'Paralelo x relativo', verso: 'Paralelo mantém a tônica e muda as notas (Dó maior / Dó menor). Relativo mantém as notas e muda a tônica (Dó maior / Lá menor).' },
    { frente: 'Exemplo clássico em Dó maior', verso: 'C – A♭ – F – G. O A♭ (♭VI) vem do paralelo menor.' },
    { frente: 'Como aplicar o empréstimo modal?', verso: 'Pontualmente, voltando depois ao campo harmônico original. O efeito vem do contraste.' },
    { frente: 'Acordes mais emprestados numa música em Dó maior', verso: 'A♭, E♭ e B♭ — todos vindos de Dó menor.' },
  ],
};

export function flashcardsPorModulo(id: string) {
  return FLASHCARDS[id] ?? [];
}
