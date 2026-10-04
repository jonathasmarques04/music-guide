'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');

const projeto = path.resolve(__dirname, '..');
const requireProjeto = createRequire(path.join(projeto, 'package.json'));
const ts = requireProjeto('typescript');
const cache = new Map();

function carregar(relativo) {
  const arquivo = path.resolve(projeto, relativo);
  assert.ok(arquivo.startsWith(projeto + path.sep), 'Modulo fora do projeto');
  if (cache.has(arquivo)) return cache.get(arquivo).exports;
  const modulo = { exports: {} };
  cache.set(arquivo, modulo);
  const fonte = fs.readFileSync(arquivo, 'utf8');
  const js = ts.transpileModule(fonte, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const resolver = (nome) => {
    if (nome.startsWith('.')) {
      return carregar(path.resolve(path.dirname(arquivo), nome) + '.ts');
    }
    if (nome.startsWith('@/')) {
      return carregar(path.join('src', nome.slice(2)) + '.ts');
    }
    return requireProjeto(nome);
  };
  vm.runInNewContext(js, {
    module: modulo,
    exports: modulo.exports,
    require: resolver,
    Date,
  }, { filename: arquivo, timeout: 5000 });
  return modulo.exports;
}

function verificarConteudo() {
  const { MODULOS, moduloPorId } = carregar('src/content/modulos.ts');
  const { QUIZZES, quizPorModulo } = carregar('src/content/quiz.ts');
  const { FLASHCARDS, flashcardsPorModulo } = carregar('src/content/flashcards.ts');
  const { INSTRUMENTOS, afinacaoDe } = carregar('src/content/instrumentos.ts');
  const ids = Array.from(MODULOS, (m) => m.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs de modulos duplicados');
  assert.deepEqual(Object.keys(QUIZZES).sort(), [...ids].sort(), 'Referencias dos quizzes');
  assert.deepEqual(Object.keys(FLASHCARDS).sort(), [...ids].sort(), 'Referencias dos flashcards');
  let questoes = 0;
  let cards = 0;
  let blocos = 0;
  MODULOS.forEach((modulo, indice) => {
    assert.equal(modulo.numero, indice + 1, 'Numeracao sequencial dos modulos');
    assert.ok(modulo.titulo && modulo.resumo && modulo.secoes.length);
    for (const secao of modulo.secoes) {
      assert.ok(secao.titulo && secao.blocos.length);
      for (const bloco of secao.blocos) {
        blocos++;
        if (bloco.tipo === 'tabela') {
          for (const linha of bloco.linhas) {
            assert.equal(linha.length, bloco.cabecalho.length, modulo.id + ': tabela desalinhada');
          }
        }
      }
    }
    const quiz = QUIZZES[modulo.id];
    assert.ok(quiz.length);
    assert.equal(new Set(quiz.map((q) => q.pergunta)).size, quiz.length, 'Pergunta repetida em ' + modulo.id);
    for (const questao of quiz) {
      questoes++;
      assert.ok(questao.pergunta && questao.explicacao);
      assert.ok(questao.alternativas.length >= 2);
      assert.ok(Number.isInteger(questao.correta));
      assert.ok(questao.correta >= 0 && questao.correta < questao.alternativas.length);
      assert.equal(new Set(questao.alternativas).size, questao.alternativas.length, 'Alternativa duplicada');
    }
    const baralho = FLASHCARDS[modulo.id];
    assert.ok(baralho.length);
    assert.equal(new Set(baralho.map((c) => c.frente)).size, baralho.length, 'Chaves de card duplicadas');
    for (const card of baralho) {
      cards++;
      assert.ok(card.frente && card.verso);
    }
  });
  assert.equal(moduloPorId('nao-existe'), undefined);
  assert.equal(quizPorModulo('nao-existe').length, 0);
  assert.equal(flashcardsPorModulo('nao-existe').length, 0);
  assert.equal(new Set(INSTRUMENTOS.map((i) => i.id)).size, INSTRUMENTOS.length);
  for (const instrumento of INSTRUMENTOS) {
    assert.ok(afinacaoDe(instrumento));
    assert.equal(new Set(instrumento.cordas.map((c) => c.ordem)).size, instrumento.cordas.length);
  }
  console.log('APROVADO: integridade estrutural de ' + JSON.stringify({
    modulos: ids.length, questoes, flashcards: cards, blocos, instrumentos: INSTRUMENTOS.length,
  }));
  // Integridade estrutural nao equivale a uma revisao pedagogica completa.
}

function verificarRepeticao() {
  const r = carregar('src/content/repeticao.ts');
  const agora = 1800000000000;
  for (const [avaliacao, minutos] of Object.entries({ errei: 10, dificil: 1440, bom: 5760, facil: 14400 })) {
    const estado = r.revisar(undefined, avaliacao, agora);
    assert.equal(estado.intervaloMinutos, minutos);
    assert.equal(estado.proximaRevisao, agora + 60000 * minutos);
    assert.equal(r.previsao(undefined, avaliacao, agora), minutos);
    assert.equal(r.estaVencido(estado, estado.proximaRevisao), true);
    assert.equal(r.estaVencido(estado, estado.proximaRevisao - 1), false);
  }
  assert.equal(r.estaVencido(undefined, agora), true);
  let transicoes = 0;
  for (let semente = 0; semente < 100; semente++) {
    let estado;
    for (let i = 0; i < 1000; i++) {
      const avaliacao = r.ORDEM_AVALIACOES[(semente * 13 + i * 17 + Math.floor(i / 7)) % 4];
      const anterior = estado && { ...estado };
      const referenciaAnterior = estado;
      estado = r.revisar(estado, avaliacao, agora + i * 60000);
      if (anterior) assert.deepEqual({ ...referenciaAnterior }, anterior, 'Estado anterior foi mutado');
      transicoes++;
      assert.ok(estado.facilidade >= 1.3 && estado.facilidade <= 2.8);
      assert.ok(estado.intervaloMinutos >= 10 && estado.intervaloMinutos <= 259200);
      assert.ok(Number.isFinite(estado.proximaRevisao));
      if (avaliacao === 'errei') {
        assert.equal(estado.repeticoes, 0);
        assert.equal(estado.intervaloMinutos, 10);
      }
    }
  }
  for (const avaliacao of ['errei', 'dificil', 'bom', 'facil']) {
    let estado;
    for (let i = 0; i < 100; i++) estado = r.revisar(estado, avaliacao, agora);
    assert.equal(estado.intervaloMinutos, avaliacao === 'errei' ? 10 : 259200);
  }
  for (const [minutos, rotulo] of [[10, '10 min'], [60, '1 hora'], [120, '2 horas'], [1440, '1 dia'], [5760, '4 dias'], [30240, '3 semanas'], [86400, '2 meses']]) {
    assert.equal(r.formatarIntervalo(minutos), rotulo);
  }
  assert.equal(r.tempoAte(agora + 600000, agora), '10 min');
  console.log('APROVADO: repeticao, vencimento exato, lapsos, limites, imutabilidade, rotulos e ' + transicoes + ' transicoes.');
}

function verificarHelpers() {
  const formato = carregar('src/lib/formato.ts');
  const credenciais = carregar('src/lib/credenciais.ts');
  assert.equal(formato.iniciais('  Ana   Souza  '), 'AS');
  assert.equal(formato.iniciais('Ana'), 'A');
  assert.equal(formato.iniciais(''), '');
  assert.equal(formato.doisDigitos(1), '01');
  assert.equal(formato.doisDigitos(12), '12');
  assert.equal(formato.percentual(0.596), 60);
  assert.equal(credenciais.emailValido('pessoa@example.com'), true);
  assert.equal(credenciais.emailValido('sem-arroba'), false);
  assert.equal(credenciais.emailValido('a b@example.com'), false);
  assert.equal(credenciais.faltamCaracteres(1), 'Falta 1 caractere.');
  assert.equal(credenciais.faltamCaracteres(2), 'Faltam 2 caracteres.');
  console.log('APROVADO: casos usuais dos helpers de formato e credenciais.');
  assert.equal(credenciais.emailValido('a@@example.com'), false);
  console.log('APROVADO: email com multiplos arrobas recusado.');
}


const { test } = require('node:test');
test('integridade do conteudo', verificarConteudo);
test('repeticao espacada', verificarRepeticao);
test('formatacao e credenciais', verificarHelpers);
