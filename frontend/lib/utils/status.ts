import type { StatusEntrega, TipoConteudo } from "@/types/entrega";

interface StatusMeta {
  label: string;
  colorClass: string;
}

const STATUS_META: Record<StatusEntrega, StatusMeta> = {
  nao_lido: { label: "Não lido", colorClass: "bg-status-nao-lido" },
  lido: { label: "Lido", colorClass: "bg-status-lido" },
  corrigido: { label: "Corrigido", colorClass: "bg-status-corrigido" },
  nao_corrigido: { label: "Não corrigido", colorClass: "bg-status-nao-corrigido" },
};

export function getStatusMeta(status: StatusEntrega): StatusMeta {
  return STATUS_META[status];
}

export const STATUS_OPTIONS: StatusEntrega[] = [
  "nao_lido",
  "lido",
  "corrigido",
  "nao_corrigido",
];

const TIPO_LABELS: Record<TipoConteudo, string> = {
  github: "GitHub",
  drive: "Documento/PDF",
  texto: "Texto livre",
};

export function getTipoLabel(tipo: TipoConteudo): string {
  return TIPO_LABELS[tipo];
}
