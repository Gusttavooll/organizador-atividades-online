import { z } from "zod";

export const alunoFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe o nome completo do aluno.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  email: z.string().trim().min(1, "Informe o e-mail do aluno.").email("E-mail inválido."),
  turmaId: z.string().nullable(),
  observacao: z
    .string()
    .max(1000, "A observação deve ter no máximo 1000 caracteres.")
    .trim()
    .nullable(),
});

export type AlunoFormInput = z.infer<typeof alunoFormSchema>;

export const novoAlunoSchema = alunoFormSchema.omit({ observacao: true });

export type NovoAlunoInput = z.infer<typeof novoAlunoSchema>;
