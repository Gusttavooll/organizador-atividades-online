import { AlunosListaClient } from "@/components/alunos/AlunosListaClient";
import { listarAlunos } from "@/lib/api/alunos";
import { listarTurmas } from "@/lib/api/turmas";

// Mesma razão do /painel: dados vêm do backend real a cada request, não dá
// pra pré-renderizar no build.
export const dynamic = "force-dynamic";

export default async function AlunosPage() {
  const [alunos, turmas] = await Promise.all([listarAlunos(), listarTurmas()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Alunos</h1>
        <p className="mt-2 text-foreground-muted">
          Cadastre alunos, organize por turma e registre observações para facilitar a correção.
        </p>
      </div>

      <AlunosListaClient alunosIniciais={alunos} turmas={turmas} />
    </div>
  );
}
