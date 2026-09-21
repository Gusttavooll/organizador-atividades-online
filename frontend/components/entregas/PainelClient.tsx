"use client";

import { useState } from "react";
import { FiltroPainel } from "@/components/entregas/FiltroPainel";
import { EntregaCard } from "@/components/entregas/EntregaCard";
import { EntregaDetalheModal } from "@/components/entregas/EntregaDetalheModal";
import { useEntregas } from "@/hooks/useEntregas";
import { atualizarEntrega } from "@/lib/api/entregas";
import type { Entrega, FiltrosEntrega, StatusEntrega } from "@/types/entrega";
import type { Turma } from "@/types/turma";
import type { Disciplina } from "@/types/disciplina";

interface PainelClientProps {
  turmas: Turma[];
  disciplinas: Disciplina[];
}

export function PainelClient({ turmas, disciplinas }: PainelClientProps) {
  const [filtros, setFiltros] = useState<FiltrosEntrega>({});
  const { entregas, carregando, erro, atualizarEntregaLocal } = useEntregas(filtros);
  const [entregaSelecionada, setEntregaSelecionada] = useState<Entrega | null>(null);

  async function handleSalvarEntrega(
    id: string,
    dados: { status: StatusEntrega; observacaoProfessor: string | null },
  ) {
    const atualizada = await atualizarEntrega(id, dados);
    atualizarEntregaLocal(atualizada);
  }

  return (
    <div className="flex flex-col gap-8">
      <FiltroPainel
        filtros={filtros}
        onFiltrosChange={setFiltros}
        turmas={turmas}
        disciplinas={disciplinas}
      />

      {carregando && (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Carregando entregas"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-xl border border-border bg-background-surface"
            />
          ))}
        </div>
      )}

      {!carregando && erro && (
        <div className="rounded-xl border border-status-nao-corrigido/40 bg-background-surface p-8 text-center">
          <p className="text-foreground">{erro}</p>
        </div>
      )}

      {!carregando && !erro && entregas.length === 0 && (
        <div className="rounded-xl border border-border bg-background-surface p-12 text-center">
          <p className="font-semibold text-foreground">Nenhuma entrega encontrada</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Ajuste os filtros ou aguarde novas entregas dos alunos.
          </p>
        </div>
      )}

      {!carregando && !erro && entregas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entregas.map((entrega) => (
            <EntregaCard
              key={entrega.id}
              entrega={entrega}
              onClick={() => setEntregaSelecionada(entrega)}
            />
          ))}
        </div>
      )}

      <EntregaDetalheModal
        entrega={entregaSelecionada}
        onClose={() => setEntregaSelecionada(null)}
        onSalvar={handleSalvarEntrega}
      />
    </div>
  );
}
