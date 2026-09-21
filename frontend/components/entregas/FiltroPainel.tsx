"use client";

import { STATUS_OPTIONS, getStatusMeta } from "@/lib/utils/status";
import { filtroEntregaSchema } from "@/lib/validations/filtro";
import type { FiltrosEntrega } from "@/types/entrega";
import type { Turma } from "@/types/turma";
import type { Disciplina } from "@/types/disciplina";

interface FiltroPainelProps {
  filtros: FiltrosEntrega;
  onFiltrosChange: (filtros: FiltrosEntrega) => void;
  turmas: Turma[];
  disciplinas: Disciplina[];
}

const SELECT_CLASSES =
  "w-full rounded-lg border border-border bg-background-surface px-3 py-2 text-sm text-foreground focus:border-accent-soft focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

export function FiltroPainel({
  filtros,
  onFiltrosChange,
  turmas,
  disciplinas,
}: FiltroPainelProps) {
  function atualizarFiltro(campo: keyof FiltrosEntrega, valor: string) {
    const proposto = { ...filtros, [campo]: valor === "" ? undefined : valor };
    const validado = filtroEntregaSchema.safeParse(proposto);
    if (validado.success) {
      onFiltrosChange(validado.data);
    }
  }

  const disciplinasFiltradas = filtros.turmaId
    ? disciplinas.filter((disciplina) => disciplina.turmaId === filtros.turmaId)
    : disciplinas;

  return (
    <form
      aria-label="Filtros de entregas"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <label htmlFor="filtro-turma" className="mb-1.5 block text-sm text-foreground-muted">
          Turma
        </label>
        <select
          id="filtro-turma"
          className={SELECT_CLASSES}
          value={filtros.turmaId ?? ""}
          onChange={(event) => atualizarFiltro("turmaId", event.target.value)}
        >
          <option value="">Todas as turmas</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="filtro-disciplina"
          className="mb-1.5 block text-sm text-foreground-muted"
        >
          Disciplina
        </label>
        <select
          id="filtro-disciplina"
          className={SELECT_CLASSES}
          value={filtros.disciplinaId ?? ""}
          onChange={(event) => atualizarFiltro("disciplinaId", event.target.value)}
        >
          <option value="">Todas as disciplinas</option>
          {disciplinasFiltradas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filtro-status" className="mb-1.5 block text-sm text-foreground-muted">
          Status
        </label>
        <select
          id="filtro-status"
          className={SELECT_CLASSES}
          value={filtros.status ?? ""}
          onChange={(event) => atualizarFiltro("status", event.target.value)}
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {getStatusMeta(status).label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
