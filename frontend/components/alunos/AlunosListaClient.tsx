"use client";

import { useState } from "react";
import { AlunoFormulario } from "@/components/alunos/AlunoFormulario";
import { AlunoLinha } from "@/components/alunos/AlunoLinha";
import { criarAluno, atualizarAluno, excluirAluno } from "@/lib/api/alunos";
import type { Aluno, AlunoAtualizacaoInput, AlunoInput } from "@/types/aluno";
import type { Turma } from "@/types/turma";

interface AlunosListaClientProps {
  alunosIniciais: Aluno[];
  turmas: Turma[];
}

export function AlunosListaClient({ alunosIniciais, turmas }: AlunosListaClientProps) {
  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);

  async function handleCriar(input: AlunoInput) {
    const novoAluno = await criarAluno(input);
    setAlunos((atual) =>
      [...atual, novoAluno].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    );
  }

  async function handleSalvar(id: string, dados: AlunoAtualizacaoInput) {
    const alunoAtualizado = await atualizarAluno(id, dados);
    setAlunos((atual) =>
      atual
        .map((aluno) => (aluno.id === id ? alunoAtualizado : aluno))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    );
  }

  async function handleExcluir(id: string) {
    await excluirAluno(id);
    setAlunos((atual) => atual.filter((aluno) => aluno.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <AlunoFormulario turmas={turmas} onCriar={handleCriar} />

      {alunos.length === 0 ? (
        <div className="rounded-xl border border-border bg-background-surface p-12 text-center">
          <p className="font-semibold text-foreground">Nenhum aluno cadastrado</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Use o formulário acima para adicionar o primeiro aluno.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {alunos.map((aluno) => (
            <AlunoLinha
              key={aluno.id}
              aluno={aluno}
              turmas={turmas}
              onSalvar={handleSalvar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}
