"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusTag } from "@/components/entregas/StatusTag";
import { STATUS_OPTIONS, getStatusMeta, getTipoLabel } from "@/lib/utils/status";
import { formatDate } from "@/lib/utils/formatDate";
import { mensagemDeErro } from "@/lib/utils/erro";
import { observacaoProfessorSchema } from "@/lib/validations/entrega";
import type { Entrega, StatusEntrega } from "@/types/entrega";

interface EntregaDetalheModalProps {
  entrega: Entrega | null;
  onClose: () => void;
  onSalvar: (
    id: string,
    dados: { status: StatusEntrega; observacaoProfessor: string | null },
  ) => Promise<void>;
}

const SELECT_CLASSES =
  "w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-soft focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

export function EntregaDetalheModal({ entrega, onClose, onSalvar }: EntregaDetalheModalProps) {
  const [status, setStatus] = useState<StatusEntrega>(entrega?.status ?? "nao_lido");
  const [observacao, setObservacao] = useState(entrega?.observacaoProfessor ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!entrega) return;
    setStatus(entrega.status);
    setObservacao(entrega.observacaoProfessor ?? "");
    setErro(null);
  }, [entrega]);

  useEffect(() => {
    if (!entrega) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entrega, onClose]);

  if (!entrega) return null;

  async function handleSalvar() {
    const resultado = observacaoProfessorSchema.safeParse({ status, observacao });
    if (!resultado.success) {
      setErro(resultado.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }

    setErro(null);
    setSalvando(true);
    try {
      await onSalvar(entrega!.id, {
        status: resultado.data.status,
        observacaoProfessor: resultado.data.observacao === "" ? null : resultado.data.observacao,
      });
      onClose();
    } catch (erro) {
      setErro(mensagemDeErro(erro, "Não foi possível salvar as alterações. Tente novamente."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes da entrega de ${entrega.alunoNome}`}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-xl border border-border bg-background-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{entrega.alunoNome}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{formatDate(entrega.criadoEm)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-background-elevated hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.4 6.3 6.3-6.3 6.29 1.4 1.41 6.3-6.3 6.3 6.3 1.4-1.41-6.3-6.29 6.3-6.3z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusTag status={entrega.status} />
          {entrega.tiposDetectados.map((tipo) => (
            <span
              key={tipo}
              className="rounded-full bg-background-elevated px-3 py-1 text-xs font-medium text-accent-soft"
            >
              {getTipoLabel(tipo)}
            </span>
          ))}
        </div>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Conteúdo original</h3>
          <p className="whitespace-pre-wrap rounded-lg border border-border bg-background-elevated p-4 text-sm text-foreground-muted">
            {entrega.conteudoOriginal}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Conteúdo enriquecido</h3>
          {entrega.conteudoEnriquecido.map((item, index) => {
            if (item.tipo === "github") {
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-background-elevated p-4 text-sm"
                >
                  <p className="font-medium text-foreground">{item.nomeRepositorio}</p>
                  <p className="mt-1 text-foreground-muted">{item.numeroCommits} commits</p>
                  <p className="mt-2 whitespace-pre-wrap text-foreground-muted">{item.readme}</p>
                </div>
              );
            }

            if (item.tipo === "drive") {
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-background-elevated p-4 text-sm"
                >
                  <p className="font-medium text-foreground">{item.nomeArquivo}</p>
                  <p className="mt-2 whitespace-pre-wrap text-foreground-muted">
                    {item.textoExtraido}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-background-elevated p-4 text-sm"
              >
                <p className="whitespace-pre-wrap text-foreground-muted">{item.conteudo}</p>
              </div>
            );
          })}
        </section>

        <section className="flex flex-col gap-4 border-t border-border pt-6">
          <div>
            <label htmlFor="modal-status" className="mb-1.5 block text-sm text-foreground-muted">
              Status da correção
            </label>
            <select
              id="modal-status"
              className={SELECT_CLASSES}
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusEntrega)}
            >
              {STATUS_OPTIONS.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {getStatusMeta(opcao).label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="modal-observacao"
              className="mb-1.5 block text-sm text-foreground-muted"
            >
              Observação para o aluno
            </label>
            <textarea
              id="modal-observacao"
              className={SELECT_CLASSES}
              rows={3}
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              placeholder="Comentários sobre a correção (opcional)"
            />
          </div>

          {erro && <p className="text-sm text-status-nao-corrigido">{erro}</p>}

          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={onClose} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSalvar} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
