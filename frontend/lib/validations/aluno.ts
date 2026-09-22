import { z } from "zod";

const nomeSchema = z
  .string()
  .trim()
  .min(2, "Informe o nome completo do aluno.")
  .max(120, "O nome deve ter no máximo 120 caracteres.");

const emailSchema = z.string().trim().min(1, "Informe o e-mail do aluno.").email("E-mail inválido.");

/** Criação: o backend exige uma turma no cadastro (`turma_id` não é opcional). */
export const novoAlunoSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  turmaId: z.string().min(1, "Selecione uma turma."),
});

export type NovoAlunoInput = z.infer<typeof novoAlunoSchema>;

/** Edição: aqui a turma pode ser desmarcada ("Sem turma"). */
export const alunoFormSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  turmaId: z.string().nullable(),
  observacao: z
    .string()
    .max(1000, "A observação deve ter no máximo 1000 caracteres.")
    .trim()
    .nullable(),
});

export type AlunoFormInput = z.infer<typeof alunoFormSchema>;
