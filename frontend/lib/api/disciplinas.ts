import type { Disciplina } from "@/types/disciplina";

const DISCIPLINAS_MOCK: Disciplina[] = [
  {
    id: "disciplina-1",
    nome: "Desenvolvimento Web",
    turmaId: "turma-1",
    professorResponsavelId: "professor-1",
  },
  {
    id: "disciplina-2",
    nome: "Banco de Dados",
    turmaId: "turma-1",
    professorResponsavelId: "professor-1",
  },
  {
    id: "disciplina-3",
    nome: "Estrutura de Dados",
    turmaId: "turma-2",
    professorResponsavelId: "professor-2",
  },
  {
    id: "disciplina-4",
    nome: "Projeto Integrador",
    turmaId: "turma-3",
    professorResponsavelId: "professor-1",
  },
];

export async function listarDisciplinas(turmaId?: string): Promise<Disciplina[]> {
  if (!turmaId) return DISCIPLINAS_MOCK;
  return DISCIPLINAS_MOCK.filter((disciplina) => disciplina.turmaId === turmaId);
}

export async function buscarDisciplina(id: string): Promise<Disciplina | null> {
  return DISCIPLINAS_MOCK.find((disciplina) => disciplina.id === id) ?? null;
}
