import { apiRequest } from "@/lib/api/client";
import type { Disciplina } from "@/types/disciplina";

/** Formato exato devolvido pelo backend (snake_case). */
interface DisciplinaApi {
  id: string;
  nome: string;
  turma_id: string;
  professor_nome: string;
  professor_email: string;
}

function disciplinaFromApi(api: DisciplinaApi): Disciplina {
  return {
    id: api.id,
    nome: api.nome,
    turmaId: api.turma_id,
    professorNome: api.professor_nome,
    professorEmail: api.professor_email,
  };
}

export async function listarDisciplinas(turmaId?: string): Promise<Disciplina[]> {
  const query = turmaId ? `?turma_id=${encodeURIComponent(turmaId)}` : "";
  const disciplinas = await apiRequest<DisciplinaApi[]>(`/disciplinas${query}`);
  return disciplinas.map(disciplinaFromApi);
}

export async function buscarDisciplina(id: string): Promise<Disciplina | null> {
  // O backend não expõe GET /disciplinas/{id}; filtramos a listagem completa.
  const disciplinas = await listarDisciplinas();
  return disciplinas.find((disciplina) => disciplina.id === id) ?? null;
}
