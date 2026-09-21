import base64
import logging
import re

import httpx

from app.models.entrega import ConteudoGithub, TipoConteudo

logger = logging.getLogger(__name__)

_REPO_PATH_RE = re.compile(r"github\.com/([^/\s]+)/([^/\s#?]+)")
_LAST_PAGE_RE = re.compile(r'[?&]page=(\d+)>;\s*rel="last"')


class GithubEnriquecedor:
    """Enriquece uma URL de repositório GitHub com nº de commits e README."""

    def __init__(self, client: httpx.AsyncClient, token: str | None = None) -> None:
        self._client = client
        self._headers = {"Accept": "application/vnd.github+json"}
        if token:
            self._headers["Authorization"] = f"Bearer {token}"

    async def enriquecer(self, url_repositorio: str) -> ConteudoGithub:
        match = _REPO_PATH_RE.search(url_repositorio)
        if not match:
            return ConteudoGithub(
                tipo=TipoConteudo.GITHUB,
                url_repositorio=url_repositorio,
                nome_repositorio=url_repositorio,
                numero_commits=0,
                readme="Não foi possível identificar o repositório a partir da URL.",
            )

        owner, repo = match.group(1), match.group(2).removesuffix(".git")

        try:
            numero_commits = await self._contar_commits(owner, repo)
            readme = await self._buscar_readme(owner, repo)
        except httpx.HTTPError:
            logger.warning("Falha ao enriquecer repositório GitHub %s/%s", owner, repo)
            return ConteudoGithub(
                tipo=TipoConteudo.GITHUB,
                url_repositorio=url_repositorio,
                nome_repositorio=f"{owner}/{repo}",
                numero_commits=0,
                readme="Não foi possível obter os dados do repositório no momento.",
            )

        return ConteudoGithub(
            tipo=TipoConteudo.GITHUB,
            url_repositorio=url_repositorio,
            nome_repositorio=f"{owner}/{repo}",
            numero_commits=numero_commits,
            readme=readme,
        )

    async def _contar_commits(self, owner: str, repo: str) -> int:
        resposta = await self._client.get(
            f"https://api.github.com/repos/{owner}/{repo}/commits",
            params={"per_page": 1},
            headers=self._headers,
        )
        resposta.raise_for_status()

        link_header = resposta.headers.get("Link", "")
        match = _LAST_PAGE_RE.search(link_header)
        if match:
            return int(match.group(1))
        return len(resposta.json())

    async def _buscar_readme(self, owner: str, repo: str) -> str:
        resposta = await self._client.get(
            f"https://api.github.com/repos/{owner}/{repo}/readme",
            headers=self._headers,
        )
        if resposta.status_code == 404:
            return "Repositório não possui README."

        resposta.raise_for_status()
        dados = resposta.json()
        conteudo_base64 = dados.get("content", "")
        try:
            return base64.b64decode(conteudo_base64).decode("utf-8", errors="replace")
        except (ValueError, UnicodeDecodeError):
            return "Não foi possível decodificar o README."
