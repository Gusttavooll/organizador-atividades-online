import { ApiError, apiRequest } from "@/lib/api/client";
import { listarAlunos } from "@/lib/api/alunos";
import type {
  ConteudoEnriquecido,
  Entrega,
  FiltrosEntrega,
  StatusEntrega,
  TipoConteudo,
} from "@/types/entrega";

interface ConteudoGithubApi {
  tipo: "github";
  url_repositorio: string;
  nome_repositorio: string;
  numero_commits: number;
  readme: string;
}

interface ConteudoDriveApi {
  tipo: "drive";
  url_arquivo: string;
  nome_arquivo: string;
  texto_extraido: string;
}

interface ConteudoTextoApi {
  tipo: "texto";
  conteudo: string;
}

type ConteudoEnriquecidoApi = ConteudoGithubApi | ConteudoDriveApi | ConteudoTextoApi;

/** Formato exato devolvido pelo backend (snake_case). */
interface EntregaApi {
  id: string;
  aluno_id: string;
  turma_id: string;
  disciplina_id: string;
  conteudo_original: string;
  tipos_detectados: TipoConteudo[];
  conteudo_enriquecido: ConteudoEnriquecidoApi[];
  status: StatusEntrega;
  observacao_professor: string | null;
  criado_em: string;
}

function conteudoEnriquecidoFromApi(item: ConteudoEnriquecidoApi): ConteudoEnriquecido {
  switch (item.tipo) {
    case "github":
      return {
        tipo: "github",
        urlRepositorio: item.url_repositorio,
        nomeRepositorio: item.nome_repositorio,
        numeroCommits: item.numero_commits,
        readme: item.readme,
      };
    case "drive":
      return {
        tipo: "drive",
        urlArquivo: item.url_arquivo,
        nomeArquivo: item.nome_arquivo,
        textoExtraido: item.texto_extraido,
      };
    case "texto":
      return { tipo: "texto", conteudo: item.conteudo };
  }
}

/**
 * O backend não devolve o nome do aluno na entrega (só `aluno_id`) — de
 * propósito, para não duplicar esse dado em cada registro. Resolvemos o
 * nome aqui, no lado do frontend, buscando a lista de alunos e cruzando
 * por id.
 */
async function construirMapaDeNomes(): Promise<Map<string, string>> {
  const alunos = await listarAlunos();
  return new Map(alunos.map((aluno) => [aluno.id, aluno.nome]));
}

function entregaFromApi(api: EntregaApi, nomesPorAlunoId: Map<string, string>): Entrega {
  return {
    id: api.id,
    alunoId: api.aluno_id,
    alunoNome: nomesPorAlunoId.get(api.aluno_id) ?? "Aluno não encontrado",
    turmaId: api.turma_id,
    disciplinaId: api.disciplina_id,
    conteudoOriginal: api.conteudo_original,
    tiposDetectados: api.tipos_detectados,
    conteudoEnriquecido: api.conteudo_enriquecido.map(conteudoEnriquecidoFromApi),
    status: api.status,
    observacaoProfessor: api.observacao_professor,
    criadoEm: api.criado_em,
  };
}

function construirQuery(filtros: FiltrosEntrega): string {
  const params = new URLSearchParams();
  if (filtros.turmaId) params.set("turma_id", filtros.turmaId);
  if (filtros.disciplinaId) params.set("disciplina_id", filtros.disciplinaId);
  if (filtros.status) params.set("status", filtros.status);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function listarEntregas(filtros: FiltrosEntrega = {}): Promise<Entrega[]> {
  const [entregasApi, nomesPorAlunoId] = await Promise.all([
    apiRequest<EntregaApi[]>(`/entregas${construirQuery(filtros)}`),
    construirMapaDeNomes(),
  ]);

  return entregasApi.map((entrega) => entregaFromApi(entrega, nomesPorAlunoId));
}

export async function buscarEntrega(id: string): Promise<Entrega | null> {
  try {
    const [entregaApi, nomesPorAlunoId] = await Promise.all([
      apiRequest<EntregaApi>(`/entregas/${id}`),
      construirMapaDeNomes(),
    ]);
    return entregaFromApi(entregaApi, nomesPorAlunoId);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

export async function atualizarEntrega(
  id: string,
  dados: { status: StatusEntrega; observacaoProfessor: string | null },
): Promise<Entrega> {
  const [entregaApi, nomesPorAlunoId] = await Promise.all([
    apiRequest<EntregaApi>(`/entregas/${id}`, {
      method: "PATCH",
      body: { status: dados.status, observacao_professor: dados.observacaoProfessor },
    }),
    construirMapaDeNomes(),
  ]);

  return entregaFromApi(entregaApi, nomesPorAlunoId);
}
