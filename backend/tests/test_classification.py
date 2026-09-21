from app.models.entrega import TipoConteudo
from app.services.classification import detectar_tipos_e_urls


def test_detecta_apenas_texto() -> None:
    tipos, github_urls, drive_urls, texto_restante = detectar_tipos_e_urls(
        "Apenas um texto livre, sem links."
    )
    assert tipos == [TipoConteudo.TEXTO]
    assert github_urls == []
    assert drive_urls == []
    assert texto_restante == "Apenas um texto livre, sem links."


def test_detecta_apenas_github() -> None:
    tipos, github_urls, drive_urls, texto_restante = detectar_tipos_e_urls(
        "https://github.com/usuario/repositorio"
    )
    assert tipos == [TipoConteudo.GITHUB]
    assert github_urls == ["https://github.com/usuario/repositorio"]
    assert drive_urls == []
    assert texto_restante == ""


def test_detecta_apenas_drive() -> None:
    tipos, github_urls, drive_urls, _ = detectar_tipos_e_urls(
        "https://drive.google.com/file/d/abc123/view"
    )
    assert tipos == [TipoConteudo.DRIVE]
    assert drive_urls == ["https://drive.google.com/file/d/abc123/view"]


def test_detecta_github_e_texto_misturados() -> None:
    conteudo = "Meu projeto: https://github.com/usuario/repositorio. Também escrevi testes manuais."
    tipos, github_urls, _, texto_restante = detectar_tipos_e_urls(conteudo)

    assert tipos == [TipoConteudo.GITHUB, TipoConteudo.TEXTO]
    assert github_urls == ["https://github.com/usuario/repositorio"]
    assert "github.com" not in texto_restante
    assert "Meu projeto" in texto_restante
    assert "Também escrevi testes manuais" in texto_restante


def test_detecta_multiplos_links_github() -> None:
    conteudo = "https://github.com/usuario/repo1 e https://github.com/usuario/repo2"
    tipos, github_urls, _, _ = detectar_tipos_e_urls(conteudo)
    assert tipos == [TipoConteudo.GITHUB, TipoConteudo.TEXTO]
    assert len(github_urls) == 2
