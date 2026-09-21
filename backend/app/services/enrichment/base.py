from typing import Protocol

from app.models.entrega import ConteudoDrive, ConteudoGithub


class EnriquecedorGithub(Protocol):
    async def enriquecer(self, url_repositorio: str) -> ConteudoGithub: ...


class EnriquecedorDrive(Protocol):
    async def enriquecer(self, url_arquivo: str) -> ConteudoDrive: ...
