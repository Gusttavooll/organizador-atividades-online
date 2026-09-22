import { apiRequest } from "@/lib/api/client";
import type { Turma } from "@/types/turma";

/** Formato exato devolvido pelo backend (snake_case). */
interface TurmaApi {
  id: string;
  nome: string;
}

function turmaFromApi(api: TurmaApi): Turma {
  return { id: api.id, nome: api.nome };
}

export async function listarTurmas(): Promise<Turma[]> {
  const turmas = await apiRequest<TurmaApi[]>("/turmas");
  return turmas.map(turmaFromApi);
}

export async function buscarTurma(id: string): Promise<Turma | null> {
  // O backend não expõe GET /turmas/{id}; filtramos a listagem completa.
  const turmas = await listarTurmas();
  return turmas.find((turma) => turma.id === id) ?? null;
}
