import type { KeyboardEvent } from "react";
import { Card } from "@/components/ui/Card";
import { StatusTag } from "@/components/entregas/StatusTag";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/formatDate";
import { getTipoLabel } from "@/lib/utils/status";
import type { Entrega } from "@/types/entrega";

interface EntregaCardProps {
  entrega: Entrega;
  onClick?: () => void;
}

export function EntregaCard({ entrega, onClick }: EntregaCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <Card
      className={cn(
        "flex flex-col gap-4 text-left transition-colors",
        onClick &&
          "cursor-pointer hover:border-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft",
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{entrega.alunoNome}</h3>
          <p className="text-sm text-foreground-muted">
            {formatDate(entrega.criadoEm)}
          </p>
        </div>
        <StatusTag status={entrega.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        {entrega.tiposDetectados.map((tipo) => (
          <span
            key={tipo}
            className="rounded-full bg-background-elevated px-3 py-1 text-xs font-medium text-accent-soft"
          >
            {getTipoLabel(tipo)}
          </span>
        ))}
      </div>

      <p className="line-clamp-2 text-sm text-foreground-muted">
        {entrega.conteudoOriginal}
      </p>

      {entrega.observacaoProfessor && (
        <p className="rounded-lg border border-border bg-background-elevated p-3 text-sm text-foreground-muted">
          <span className="font-medium text-foreground">Observação: </span>
          {entrega.observacaoProfessor}
        </p>
      )}
    </Card>
  );
}
