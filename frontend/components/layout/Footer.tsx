export function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:pl-16">
      <div className="mx-auto max-w-content px-6 text-sm text-foreground-muted">
        <p>
          &copy; {new Date().getFullYear()} Organizador de Atividades Online. Ferramenta
          educacional para apoio à correção de atividades.
        </p>
      </div>
    </footer>
  );
}
