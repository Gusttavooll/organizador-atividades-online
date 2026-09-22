export interface Aluno {
  id: string;
  nome: string;
  email: string;
  turmaId: string | null;
  observacao: string | null;
}

/** Payload de criação — o backend exige turma no cadastro (`turma_id` não é opcional). */
export interface AlunoInput {
  nome: string;
  email: string;
  turmaId: string;
}

/** Payload de edição — aqui a turma pode ser desmarcada ("Sem turma"). */
export interface AlunoAtualizacaoInput {
  nome: string;
  email: string;
  turmaId: string | null;
  observacao: string | null;
}
