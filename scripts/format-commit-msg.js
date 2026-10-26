#!/usr/bin/env node
/**
 * Hook commit-msg: prefixa toda mensagem de commit com a versão do projeto.
 *
 *   git commit -m "corrige login"   ->   v1.00 Commit "corrige login"
 *
 * Chamado por .husky/commit-msg com:  node scripts/format-commit-msg.js "$1"
 * onde "$1" é o caminho do arquivo temporário com a mensagem (.git/COMMIT_EDITMSG).
 *
 * REGRA DE CONVERSÃO DA VERSÃO (package.json "version" -> vX.YY)
 *   X  = MAJOR
 *   YY = dígito do MINOR seguido do dígito do PATCH
 *
 *   1.0.0 -> v1.00    1.5.0 -> v1.50    1.5.3 -> v1.53    2.0.1 -> v2.01
 *
 *   Assim `npm version patch` avança a 2ª casa e `npm version minor` a 1ª.
 *   MINOR e PATCH precisam estar entre 0 e 9 (cada um ocupa uma casa decimal);
 *   se passarem disso o commit é recusado com instrução para subir a versão
 *   seguinte (ex.: em vez de 1.0.10, use `npm version minor` -> 1.1.0).
 *   Sufixos de pré-release/build (1.2.0-beta.1) são ignorados.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Padrão que identifica uma mensagem já formatada (garante idempotência).
const PADRAO_FORMATADO = /^v\d+\.\d+ Commit/;

// Mensagens geradas pelo próprio Git ou para autosquash: nunca reescrever.
const PREFIXOS_IGNORADOS = /^(Merge |Revert "|fixup! |squash! |amend! )/;

// Linha "tesoura" do `git commit -v`: tudo abaixo dela é descartado pelo Git.
const TESOURA = /^# -+ >8 -+$/;

function falhar(mensagem) {
  console.error(`\n[commit-msg] ${mensagem}\n`);
  process.exit(1);
}

/** Lê a versão do package.json da raiz do repositório (pasta acima de scripts/). */
function lerVersao() {
  const arquivo = path.join(__dirname, '..', 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  } catch (erro) {
    falhar(`Não foi possível ler ${arquivo}: ${erro.message}`);
  }
  if (!pkg.version) falhar(`Campo "version" ausente em ${arquivo}.`);
  return pkg.version;
}

/** Converte "MAJOR.MINOR.PATCH" em "vX.YY" seguindo a regra documentada acima. */
function formatarVersao(versao) {
  const partes = /^(\d+)\.(\d+)\.(\d+)/.exec(versao);
  if (!partes) falhar(`Versão "${versao}" não segue o formato MAJOR.MINOR.PATCH.`);

  const [, major, minor, patch] = partes.map(Number);
  if (minor > 9 || patch > 9) {
    falhar(
      `Versão ${versao} não cabe no formato vX.YY (MINOR e PATCH devem ser 0-9).\n` +
        '  Suba para a próxima versão: `npm version minor` ou `npm version major`.'
    );
  }
  return `v${major}.${minor}${patch}`;
}

/** Diz se o Git está no meio de um merge ou rebase (procura os arquivos de estado em .git). */
function emOperacaoEspecial() {
  try {
    const caminhos = execFileSync(
      'git',
      ['rev-parse', '--git-path', 'MERGE_HEAD', '--git-path', 'rebase-merge', '--git-path', 'rebase-apply'],
      { encoding: 'utf8' }
    )
      .split(/\r?\n/)
      .filter(Boolean);
    return caminhos.some((p) => fs.existsSync(p));
  } catch {
    // Se o git não responder, segue o fluxo normal em vez de bloquear o commit.
    return false;
  }
}

/** Remove comentários (#) e tudo após a linha "tesoura"; apara linhas vazias nas pontas. */
function limparMensagem(bruta) {
  const linhas = [];
  for (const linha of bruta.split(/\r?\n/)) {
    if (TESOURA.test(linha)) break;
    if (linha.startsWith('#')) continue;
    linhas.push(linha.replace(/\s+$/, ''));
  }
  return linhas.join('\n').trim();
}

function main() {
  const arquivoMensagem = process.argv[2];
  if (!arquivoMensagem) falhar('Uso: node scripts/format-commit-msg.js <arquivo-da-mensagem>');

  const mensagem = limparMensagem(fs.readFileSync(arquivoMensagem, 'utf8'));

  // 1) Mensagem vazia: recusa o commit.
  if (!mensagem) falhar('Mensagem de commit vazia. Use: git commit -m "descrição da mudança"');

  // 2) Já formatada (ex.: --amend de um commit padronizado): não duplica o prefixo.
  if (PADRAO_FORMATADO.test(mensagem)) return;

  // 3) Merge, revert, squash/fixup e rebase em andamento: mantém a mensagem do Git.
  if (PREFIXOS_IGNORADOS.test(mensagem) || emOperacaoEspecial()) return;

  // 4) Monta: v<versão> Commit "<assunto>" — o corpo (linhas seguintes) é preservado.
  const [assunto, ...corpo] = mensagem.split('\n');
  const versao = formatarVersao(lerVersao());
  const final = [`${versao} Commit "${assunto}"`, ...corpo].join('\n') + '\n';

  fs.writeFileSync(arquivoMensagem, final, 'utf8');
}

main();
