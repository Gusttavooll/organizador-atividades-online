export interface Aluno {
  id: string;
  nome: string;
  email: string;
  turmaId: string | null;
  observacao: string | null;
}

export interface AlunoInput {
  nome: string;
  email: string;
  turmaId: string | null;
}
