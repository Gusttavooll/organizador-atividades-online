import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/painel", label: "Painel" },
  { href: "/painel/alunos", label: "Alunos" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-6 sm:pl-20">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm text-white"
            aria-hidden="true"
          >
            OA
          </span>
          <span className="text-foreground">Organizador de Atividades</span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
