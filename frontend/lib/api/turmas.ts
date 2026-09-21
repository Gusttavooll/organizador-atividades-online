import type { Turma } from "@/types/turma";

const TURMAS_MOCK: Turma[] = [
  { id: "turma-1", nome: "3º Ano A - Ensino Médio", anoLetivo: 2026 },
  { id: "turma-2", nome: "3º Ano B - Ensino Médio", anoLetivo: 2026 },
  { id: "turma-3", nome: "Turma de Extensão - Dev Web", anoLetivo: 2026 },
];

export async function listarTurmas(): Promise<Turma[]> {
  return TURMAS_MOCK;
}

export async function buscarTurma(id: string): Promise<Turma | null> {
  return TURMAS_MOCK.find((turma) => turma.id === id) ?? null;
}
