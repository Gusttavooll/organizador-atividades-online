import type { Aluno, AlunoInput } from "@/types/aluno";

const ALUNOS_MOCK: Aluno[] = [
  {
    id: "aluno-1",
    nome: "Beatriz Souza",
    email: "beatriz.souza@escola.edu.br",
    turmaId: "turma-1",
    observacao: null,
  },
  {
    id: "aluno-2",
    nome: "Carlos Eduardo Lima",
    email: "carlos.lima@escola.edu.br",
    turmaId: "turma-1",
    observacao: "Costuma entregar atividades com atraso.",
  },
  {
    id: "aluno-3",
    nome: "Fernanda Alves",
    email: "fernanda.alves@escola.edu.br",
    turmaId: "turma-2",
    observacao: null,
  },
  {
    id: "aluno-4",
    nome: "Gustavo Ramos",
    email: "gustavo.ramos@escola.edu.br",
    turmaId: "turma-3",
    observacao: null,
  },
  {
    id: "aluno-5",
    nome: "Juliana Martins",
    email: "juliana.martins@escola.edu.br",
    turmaId: null,
    observacao: "Aguardando confirmação da turma.",
  },
];

const SIMULATED_LATENCY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function gerarId(): string {
  return `aluno-${Math.random().toString(36).slice(2, 10)}`;
}

export async function listarAlunos(): Promise<Aluno[]> {
  await delay(SIMULATED_LATENCY_MS);
  return [...ALUNOS_MOCK].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function criarAluno(input: AlunoInput): Promise<Aluno> {
  await delay(SIMULATED_LATENCY_MS);

  const novoAluno: Aluno = {
    id: gerarId(),
    nome: input.nome,
    email: input.email,
    turmaId: input.turmaId,
    observacao: null,
  };

  ALUNOS_MOCK.push(novoAluno);
  return novoAluno;
}

export async function atualizarAluno(
  id: string,
  input: AlunoInput & { observacao: string | null },
): Promise<Aluno> {
  await delay(SIMULATED_LATENCY_MS);

  const aluno = ALUNOS_MOCK.find((item) => item.id === id);
  if (!aluno) {
    throw new Error(`Aluno ${id} não encontrado.`);
  }

  aluno.nome = input.nome;
  aluno.email = input.email;
  aluno.turmaId = input.turmaId;
  aluno.observacao = input.observacao;

  return aluno;
}

export async function excluirAluno(id: string): Promise<void> {
  await delay(SIMULATED_LATENCY_MS);

  const indice = ALUNOS_MOCK.findIndex((item) => item.id === id);
  if (indice === -1) {
    throw new Error(`Aluno ${id} não encontrado.`);
  }

  ALUNOS_MOCK.splice(indice, 1);
}
