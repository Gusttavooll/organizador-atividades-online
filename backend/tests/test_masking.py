from app.core.masking import mascarar_email


def test_mascara_email_preserva_dominio_e_esconde_usuario() -> None:
    mascarado = mascarar_email("beatriz.souza@escola.edu.br")
    assert mascarado.endswith("@escola.edu.br")
    assert "beatriz.souza" not in mascarado
    assert mascarado.startswith("b")


def test_mascara_email_sem_arroba_retorna_placeholder() -> None:
    assert mascarar_email("nao-e-um-email") == "***"
