const SIDEBAR_LINKS = [
  {
    label: "GitHub do projeto",
    href: "https://github.com",
    icon: (
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.94c-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92v2.85c0 .28.18.6.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    ),
  },
  {
    label: "Enviar e-mail",
    href: "mailto:contato@organizador-atividades.com",
    icon: (
      <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.7 2 7.3 5.4L19.3 7H4.7ZM4 8.4V18h16V8.4l-8 5.9-8-5.9Z" />
    ),
  },
  {
    label: "Documentação",
    href: "/painel",
    icon: (
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM8 13h8v1.5H8V13Zm0 3.5h8V18H8v-1.5ZM8 9.5h4V11H8V9.5Z" />
    ),
  },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center gap-6 border-r border-border bg-background py-8 sm:flex">
      <nav aria-label="Links externos">
        <ul className="flex flex-col items-center gap-4">
          {SIDEBAR_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={link.label}
                title={link.label}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-background-surface hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  {link.icon}
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
