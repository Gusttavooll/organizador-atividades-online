const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

interface ErroApi {
  detail?: string;
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, signal } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está rodando.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await extrairMensagemDeErro(response, path), response.status);
  }

  // 204 (ex.: DELETE) ou corpo vazio não têm JSON para decodificar.
  const texto = await response.text();
  if (!texto) {
    return undefined as TResponse;
  }

  return JSON.parse(texto) as TResponse;
}

async function extrairMensagemDeErro(response: Response, path: string): Promise<string> {
  try {
    const dados = (await response.json()) as ErroApi;
    if (dados.detail) return dados.detail;
  } catch {
    // corpo da resposta não era JSON — cai no fallback abaixo.
  }
  return `Falha na requisição para ${path} (status ${response.status}).`;
}
