import type { Entrega, FiltrosEntrega, StatusEntrega } from "@/types/entrega";

const ENTREGAS_MOCK: Entrega[] = [
  {
    id: "entrega-1",
    alunoId: "aluno-1",
    alunoNome: "Beatriz Souza",
    turmaId: "turma-1",
    disciplinaId: "disciplina-1",
    conteudoOriginal: "https://github.com/beatriz-souza/lista-tarefas-react",
    tiposDetectados: ["github"],
    conteudoEnriquecido: [
      {
        tipo: "github",
        urlRepositorio: "https://github.com/beatriz-souza/lista-tarefas-react",
        nomeRepositorio: "lista-tarefas-react",
        numeroCommits: 14,
        readme:
          "# Lista de Tarefas\n\nAplicação React para gerenciamento de tarefas com persistência local.",
      },
    ],
    status: "nao_lido",
    observacaoProfessor: null,
    criadoEm: "2026-09-15T13:24:00.000Z",
  },
  {
    id: "entrega-2",
    alunoId: "aluno-2",
    alunoNome: "Carlos Eduardo Lima",
    turmaId: "turma-1",
    disciplinaId: "disciplina-2",
    conteudoOriginal: "https://drive.google.com/file/d/1a2b3c4d5e/view",
    tiposDetectados: ["drive"],
    conteudoEnriquecido: [
      {
        tipo: "drive",
        urlArquivo: "https://drive.google.com/file/d/1a2b3c4d5e/view",
        nomeArquivo: "modelagem-banco-dados.pdf",
        textoExtraido:
          "Trabalho apresenta a modelagem entidade-relacionamento do sistema de biblioteca...",
      },
    ],
    status: "lido",
    observacaoProfessor: null,
    criadoEm: "2026-09-14T10:05:00.000Z",
  },
  {
    id: "entrega-3",
    alunoId: "aluno-3",
    alunoNome: "Fernanda Alves",
    turmaId: "turma-2",
    disciplinaId: "disciplina-3",
    conteudoOriginal:
      "Implementei a pilha e a fila usando listas encadeadas, conforme pedido no exercício 4.",
    tiposDetectados: ["texto"],
    conteudoEnriquecido: [
      {
        tipo: "texto",
        conteudo:
          "Implementei a pilha e a fila usando listas encadeadas, conforme pedido no exercício 4.",
      },
    ],
    status: "corrigido",
    observacaoProfessor: "Boa implementação, faltou tratar underflow na fila.",
    criadoEm: "2026-09-12T18:40:00.000Z",
  },
  {
    id: "entrega-4",
    alunoId: "aluno-4",
    alunoNome: "Gustavo Ramos",
    turmaId: "turma-3",
    disciplinaId: "disciplina-4",
    conteudoOriginal: "https://github.com/gustavoramos/projeto-integrador-final",
    tiposDetectados: ["github"],
    conteudoEnriquecido: [
      {
        tipo: "github",
        urlRepositorio: "https://github.com/gustavoramos/projeto-integrador-final",
        nomeRepositorio: "projeto-integrador-final",
        numeroCommits: 42,
        readme:
          "# Projeto Integrador\n\nSistema de gestão de estoque com API REST e dashboard.",
      },
    ],
    status: "nao_corrigido",
    observacaoProfessor: "Faltou o relatório final em PDF, retornar ao aluno.",
    criadoEm: "2026-09-10T09:15:00.000Z",
  },
  {
    id: "entrega-5",
    alunoId: "aluno-5",
    alunoNome: "Juliana Martins",
    turmaId: "turma-1",
    disciplinaId: "disciplina-1",
    conteudoOriginal: "https://drive.google.com/file/d/9z8y7x6w5v/view",
    tiposDetectados: ["drive"],
    conteudoEnriquecido: [
      {
        tipo: "drive",
        urlArquivo: "https://drive.google.com/file/d/9z8y7x6w5v/view",
        nomeArquivo: "relatorio-html-css.pdf",
        textoExtraido:
          "Relatório descreve a construção de uma landing page responsiva com HTML semântico e CSS Grid...",
      },
    ],
    status: "nao_lido",
    observacaoProfessor: null,
    criadoEm: "2026-09-16T08:50:00.000Z",
  },
];

const SIMULATED_LATENCY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listarEntregas(filtros: FiltrosEntrega = {}): Promise<Entrega[]> {
  await delay(SIMULATED_LATENCY_MS);

  return ENTREGAS_MOCK.filter((entrega) => {
    if (filtros.turmaId && entrega.turmaId !== filtros.turmaId) return false;
    if (filtros.disciplinaId && entrega.disciplinaId !== filtros.disciplinaId) return false;
    if (filtros.status && entrega.status !== filtros.status) return false;
    return true;
  }).sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export async function buscarEntrega(id: string): Promise<Entrega | null> {
  await delay(SIMULATED_LATENCY_MS);
  return ENTREGAS_MOCK.find((entrega) => entrega.id === id) ?? null;
}

interface AtualizarEntregaInput {
  status: StatusEntrega;
  observacaoProfessor: string | null;
}

export async function atualizarEntrega(
  id: string,
  dados: AtualizarEntregaInput,
): Promise<Entrega> {
  await delay(SIMULATED_LATENCY_MS);

  const entrega = ENTREGAS_MOCK.find((item) => item.id === id);
  if (!entrega) {
    throw new Error(`Entrega ${id} não encontrada.`);
  }

  entrega.status = dados.status;
  entrega.observacaoProfessor = dados.observacaoProfessor;
  return entrega;
}
