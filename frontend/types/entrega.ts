export type StatusEntrega = "nao_lido" | "lido" | "corrigido" | "nao_corrigido";

export type TipoConteudo = "github" | "drive" | "texto";

export interface ConteudoEnriquecidoGithub {
  tipo: "github";
  urlRepositorio: string;
  nomeRepositorio: string;
  numeroCommits: number;
  readme: string;
}

export interface ConteudoEnriquecidoDrive {
  tipo: "drive";
  urlArquivo: string;
  nomeArquivo: string;
  textoExtraido: string;
}

export interface ConteudoEnriquecidoTexto {
  tipo: "texto";
  conteudo: string;
}

export type ConteudoEnriquecido =
  | ConteudoEnriquecidoGithub
  | ConteudoEnriquecidoDrive
  | ConteudoEnriquecidoTexto;

export interface Entrega {
  id: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  disciplinaId: string;
  conteudoOriginal: string;
  tiposDetectados: TipoConteudo[];
  conteudoEnriquecido: ConteudoEnriquecido[];
  status: StatusEntrega;
  observacaoProfessor: string | null;
  criadoEm: string;
}

export interface FiltrosEntrega {
  turmaId?: string;
  disciplinaId?: string;
  status?: StatusEntrega;
}
