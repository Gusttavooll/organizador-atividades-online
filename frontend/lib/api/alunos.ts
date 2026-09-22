import { apiRequest } from "@/lib/api/client";
import type { Aluno, AlunoAtualizacaoInput, AlunoInput } from "@/types/aluno";

/** Formato exato devolvido pelo backend (snake_case). */
interface AlunoApi {
  id: string;
  nome: string;
  email: string;
  turma_id: string;
  observacao: string | null;
}

function alunoFromApi(api: AlunoApi): Aluno {
  return {
    id: api.id,
    nome: api.nome,
    email: api.email,
    turmaId: api.turma_id,
    observacao: api.observacao,
  };
}

export async function listarAlunos(): Promise<Aluno[]> {
  const alunos = await apiRequest<AlunoApi[]>("/alunos");
  return alunos.map(alunoFromApi).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function criarAluno(input: AlunoInput): Promise<Aluno> {
  const criado = await apiRequest<AlunoApi>("/alunos", {
    method: "POST",
    body: { nome: input.nome, email: input.email, turma_id: input.turmaId },
  });
  return alunoFromApi(criado);
}

export async function atualizarAluno(id: string, input: AlunoAtualizacaoInput): Promise<Aluno> {
  const atualizado = await apiRequest<AlunoApi>(`/alunos/${id}`, {
    method: "PATCH",
    body: {
      nome: input.nome,
      email: input.email,
      turma_id: input.turmaId,
      observacao: input.observacao,
    },
  });
  return alunoFromApi(atualizado);
}

export async function excluirAluno(id: string): Promise<void> {
  await apiRequest<void>(`/alunos/${id}`, { method: "DELETE" });
}
