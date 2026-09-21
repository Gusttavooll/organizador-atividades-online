import { z } from "zod";

export const observacaoProfessorSchema = z.object({
  observacao: z
    .string()
    .max(2000, "A observação deve ter no máximo 2000 caracteres.")
    .trim(),
  status: z.enum(["nao_lido", "lido", "corrigido", "nao_corrigido"]),
});

export type ObservacaoProfessorInput = z.infer<typeof observacaoProfessorSchema>;
