def mascarar_email(email: str) -> str:
    """Mascara um e-mail para uso seguro em logs (ex.: `j***@example.com`)."""
    usuario, separador, dominio = email.partition("@")
    if not separador:
        return "***"

    visivel = usuario[:1] or "*"
    return f"{visivel}{'*' * max(len(usuario) - 1, 3)}@{dominio}"
