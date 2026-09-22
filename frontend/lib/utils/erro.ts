import { ApiError } from "@/lib/api/client";

/** Converte um erro capturado numa chamada de API numa mensagem exibível ao professor. */
export function mensagemDeErro(erro: unknown, fallback: string): string {
  if (erro instanceof ApiError) {
    if (erro.status === 0) {
      return "Não foi possível conectar à API. Verifique se o backend está rodando.";
    }
    if (erro.status === 404) {
      return "Não encontrado.";
    }
    return erro.message;
  }
  return fallback;
}
