from uuid import uuid4

from app.core.errors import RecursoNaoEncontradoError
from app.models.disciplina import Disciplina
from app.repositories.disciplinas import DisciplinaRepository
from app.repositories.turmas import TurmaRepository


class DisciplinaService:
    def __init__(self, repo: DisciplinaRepository, turma_repo: TurmaRepository) -> None:
        self._repo = repo
        self._turma_repo = turma_repo

    async def criar(
        self, nome: str, turma_id: str, professor_nome: str, professor_email: str
    ) -> Disciplina:
        turma = await self._turma_repo.get_by_id(turma_id)
        if turma is None:
            raise RecursoNaoEncontradoError(f"Turma '{turma_id}' não encontrada.")

        disciplina = Disciplina(
            id=str(uuid4()),
            nome=nome,
            turma_id=turma_id,
            professor_nome=professor_nome,
            professor_email=professor_email,
        )
        return await self._repo.create(disciplina)

    async def listar(self, turma_id: str | None = None) -> list[Disciplina]:
        return await self._repo.list_all(turma_id=turma_id)
