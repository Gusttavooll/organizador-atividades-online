"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { alunoFormSchema } from "@/lib/validations/aluno";
import type { Aluno } from "@/types/aluno";
import type { Turma } from "@/types/turma";

interface AlunoLinhaProps {
  aluno: Aluno;
  turmas: Turma[];
  onSalvar: (
    id: string,
    dados: { nome: string; email: string; turmaId: string | null; observacao: string | null },
  ) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
}

const INPUT_CLASSES =
  "w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-soft focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

export function AlunoLinha({ aluno, turmas, onSalvar, onExcluir }: AlunoLinhaProps) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(aluno.nome);
  const [email, setEmail] = useState(aluno.email);
  const [turmaId, setTurmaId] = useState(aluno.turmaId ?? "");
  const [observacao, setObservacao] = useState(aluno.observacao ?? "");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const turmaAtual = turmas.find((turma) => turma.id === aluno.turmaId);

  function cancelarEdicao() {
    setNome(aluno.nome);
    setEmail(aluno.email);
    setTurmaId(aluno.turmaId ?? "");
    setObservacao(aluno.observacao ?? "");
    setErros({});
    setEditando(false);
  }

  async function salvar() {
    const resultado = alunoFormSchema.safeParse({
      nome,
      email,
      turmaId: turmaId === "" ? null : turmaId,
      observacao: observacao.trim() === "" ? null : observacao,
    });

    if (!resultado.success) {
      const proximosErros: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        proximosErros[String(issue.path[0])] = issue.message;
      }
      setErros(proximosErros);
      return;
    }

    setErros({});
    setSalvando(true);
    try {
      await onSalvar(aluno.id, resultado.data);
      setEditando(false);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    setExcluindo(true);
    try {
      await onExcluir(aluno.id);
    } finally {
      setExcluindo(false);
    }
  }

  if (editando) {
    return (
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-accent-soft/40 bg-background-surface p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-foreground-muted">Nome</label>
            <input
              className={INPUT_CLASSES}
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
            {erros.nome && <p className="mt-1 text-xs text-status-nao-corrigido">{erros.nome}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-foreground-muted">E-mail</label>
            <input
              type="email"
              className={INPUT_CLASSES}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {erros.email && <p className="mt-1 text-xs text-status-nao-corrigido">{erros.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-foreground-muted">Turma</label>
            <select
              className={INPUT_CLASSES}
              value={turmaId}
              onChange={(event) => setTurmaId(event.target.value)}
            >
              <option value="">Sem turma</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-foreground-muted">Observação</label>
            <textarea
              className={INPUT_CLASSES}
              rows={2}
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              placeholder="Anotações sobre o aluno (opcional)"
            />
            {erros.observacao && (
              <p className="mt-1 text-xs text-status-nao-corrigido">{erros.observacao}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={cancelarEdicao} disabled={salvando}>
            Cancelar
          </Button>
          <Button type="button" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">{aluno.nome}</p>
        <p className="text-sm text-foreground-muted">{aluno.email}</p>
        {aluno.observacao && (
          <p className="mt-1 text-sm text-foreground-muted">
            <span className="font-medium text-foreground">Observação: </span>
            {aluno.observacao}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Badge>{turmaAtual ? turmaAtual.nome : "Sem turma"}</Badge>
        <Button variant="secondary" type="button" onClick={() => setEditando(true)}>
          Editar
        </Button>
        <Button variant="ghost" type="button" onClick={excluir} disabled={excluindo}>
          {excluindo ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </div>
  );
}
