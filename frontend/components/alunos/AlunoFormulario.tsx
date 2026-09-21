"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { novoAlunoSchema } from "@/lib/validations/aluno";
import type { AlunoInput } from "@/types/aluno";
import type { Turma } from "@/types/turma";

interface AlunoFormularioProps {
  turmas: Turma[];
  onCriar: (input: AlunoInput) => Promise<void>;
}

const INPUT_CLASSES =
  "w-full rounded-lg border border-border bg-background-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-soft focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

export function AlunoFormulario({ turmas, onCriar }: AlunoFormularioProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const resultado = novoAlunoSchema.safeParse({
      nome,
      email,
      turmaId: turmaId === "" ? null : turmaId,
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
    setEnviando(true);
    try {
      await onCriar(resultado.data);
      setNome("");
      setEmail("");
      setTurmaId("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-background-surface p-6 sm:grid-cols-[2fr_2fr_1.5fr_auto]"
      aria-label="Adicionar aluno"
    >
      <div>
        <label htmlFor="novo-aluno-nome" className="mb-1.5 block text-sm text-foreground-muted">
          Nome
        </label>
        <input
          id="novo-aluno-nome"
          className={INPUT_CLASSES}
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder="Nome completo"
          aria-invalid={Boolean(erros.nome)}
        />
        {erros.nome && <p className="mt-1 text-xs text-status-nao-corrigido">{erros.nome}</p>}
      </div>

      <div>
        <label htmlFor="novo-aluno-email" className="mb-1.5 block text-sm text-foreground-muted">
          E-mail
        </label>
        <input
          id="novo-aluno-email"
          type="email"
          className={INPUT_CLASSES}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="aluno@escola.edu.br"
          aria-invalid={Boolean(erros.email)}
        />
        {erros.email && <p className="mt-1 text-xs text-status-nao-corrigido">{erros.email}</p>}
      </div>

      <div>
        <label htmlFor="novo-aluno-turma" className="mb-1.5 block text-sm text-foreground-muted">
          Turma
        </label>
        <select
          id="novo-aluno-turma"
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

      <div className="flex items-end">
        <Button type="submit" disabled={enviando} className="w-full sm:w-auto">
          {enviando ? "Adicionando..." : "Adicionar aluno"}
        </Button>
      </div>
    </form>
  );
}
