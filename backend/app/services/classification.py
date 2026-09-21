import re

from app.models.entrega import TipoConteudo

_GITHUB_URL_RE = re.compile(r"https?://github\.com/\S+")
_DRIVE_URL_RE = re.compile(r"https?://(?:drive|docs)\.google\.com/\S+")
_PONTUACAO_FINAL = ".,;:!?)]}\"'"
_ESPACOS_REPETIDOS_RE = re.compile(r"[ \t]{2,}")


def _limpar_url(url_bruta: str) -> str:
    """Remove pontuação de fim de frase que a regex capturou junto da URL."""
    return url_bruta.rstrip(_PONTUACAO_FINAL)


def detectar_tipos_e_urls(
    conteudo: str,
) -> tuple[list[TipoConteudo], list[str], list[str], str]:
    """
    Classifica o conteúdo de uma entrega, podendo detectar mais de um tipo.

    Retorna: (tipos detectados, URLs de GitHub, URLs de Drive, texto restante
    depois de remover as URLs reconhecidas). Se não sobrar texto e nenhuma URL
    for encontrada, ou se sobrar texto mesmo com URLs presentes, o tipo
    "texto" também é incluído.
    """
    github_urls = [_limpar_url(url) for url in _GITHUB_URL_RE.findall(conteudo)]
    drive_urls = [_limpar_url(url) for url in _DRIVE_URL_RE.findall(conteudo)]

    texto_restante = conteudo
    for url in (*github_urls, *drive_urls):
        texto_restante = texto_restante.replace(url, "")
    texto_restante = _ESPACOS_REPETIDOS_RE.sub(" ", texto_restante).strip()

    tipos: list[TipoConteudo] = []
    if github_urls:
        tipos.append(TipoConteudo.GITHUB)
    if drive_urls:
        tipos.append(TipoConteudo.DRIVE)
    if not tipos or texto_restante:
        tipos.append(TipoConteudo.TEXTO)

    return tipos, github_urls, drive_urls, texto_restante
