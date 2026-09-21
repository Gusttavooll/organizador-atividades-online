import { LinkButton } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-content flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-6 rounded-full border border-border bg-background-surface px-4 py-1.5 text-xs font-medium text-accent-soft">
        Feito para professores organizarem entregas com menos esforço
      </span>

      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        Todas as entregas dos seus alunos, organizadas em um único painel
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-foreground-muted">
        O Organizador de Atividades Online recebe as respostas do Google Forms,
        identifica automaticamente repositórios do GitHub, documentos do Drive e
        textos livres, enriquece o conteúdo com metadados úteis e entrega tudo
        pronto para correção — sem perder o que o aluno enviou originalmente.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <LinkButton href="/painel" variant="primary">
          Acessar o painel do professor
        </LinkButton>
        <LinkButton href="#como-funciona" variant="secondary">
          Como funciona
        </LinkButton>
      </div>

      <div
        id="como-funciona"
        className="mt-24 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3"
      >
        <FeatureCard
          titulo="Classificação automática"
          descricao="Cada entrega é identificada como repositório GitHub, documento do Drive ou texto livre assim que chega."
        />
        <FeatureCard
          titulo="Conteúdo enriquecido"
          descricao="Commits e README de repositórios, texto extraído de PDFs — tudo ao lado do conteúdo original do aluno."
        />
        <FeatureCard
          titulo="Correção centralizada"
          descricao="Filtre por turma, disciplina e status, e acompanhe o progresso da correção em um só lugar."
        />
      </div>
    </section>
  );
}

function FeatureCard({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="rounded-xl border border-border bg-background-surface p-6">
      <h2 className="font-semibold text-foreground">{titulo}</h2>
      <p className="mt-2 text-sm text-foreground-muted">{descricao}</p>
    </div>
  );
}
