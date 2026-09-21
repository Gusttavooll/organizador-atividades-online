import { PainelClient } from "@/components/entregas/PainelClient";
import { LinkButton } from "@/components/ui/Button";
import { listarTurmas } from "@/lib/api/turmas";
import { listarDisciplinas } from "@/lib/api/disciplinas";

export default async function PainelPage() {
  const [turmas, disciplinas] = await Promise.all([
    listarTurmas(),
    listarDisciplinas(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Painel de entregas
          </h1>
          <p className="mt-2 text-foreground-muted">
            Acompanhe e corrija as atividades enviadas pelos alunos.
          </p>
        </div>
        <LinkButton href="/painel/alunos" variant="secondary">
          Gerenciar alunos
        </LinkButton>
      </div>

      <PainelClient turmas={turmas} disciplinas={disciplinas} />
    </div>
  );
}
