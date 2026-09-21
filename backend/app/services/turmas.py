from uuid import uuid4

from app.models.turma import Turma
from app.repositories.turmas import TurmaRepository


class TurmaService:
    def __init__(self, repo: TurmaRepository) -> None:
        self._repo = repo

    async def criar(self, nome: str) -> Turma:
        turma = Turma(id=str(uuid4()), nome=nome)
        return await self._repo.create(turma)

    async def listar(self) -> list[Turma]:
        return await self._repo.list_all()
