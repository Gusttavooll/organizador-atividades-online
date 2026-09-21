import { z } from "zod";

export const filtroEntregaSchema = z.object({
  turmaId: z.string().optional(),
  disciplinaId: z.string().optional(),
  status: z.enum(["nao_lido", "lido", "corrigido", "nao_corrigido"]).optional(),
});

export type FiltroEntregaInput = z.infer<typeof filtroEntregaSchema>;
