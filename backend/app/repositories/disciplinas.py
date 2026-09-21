from typing import Protocol

from app.models.disciplina import Disciplina


class DisciplinaRepository(Protocol):
    async def create(self, disciplina: Disciplina) -> Disciplina: ...
    async def list_all(self, turma_id: str | None = None) -> list[Disciplina]: ...
    async def get_by_id(self, disciplina_id: str) -> Disciplina | None: ...


class InMemoryDisciplinaRepository:
    """Implementação em memória — trocar por Supabase/Postgres implementando o mesmo Protocol."""

    def __init__(self) -> None:
        self._disciplinas: dict[str, Disciplina] = {}

    async def create(self, disciplina: Disciplina) -> Disciplina:
        self._disciplinas[disciplina.id] = disciplina
        return disciplina

    async def list_all(self, turma_id: str | None = None) -> list[Disciplina]:
        disciplinas = list(self._disciplinas.values())
        if turma_id is not None:
            disciplinas = [d for d in disciplinas if d.turma_id == turma_id]
        return disciplinas

    async def get_by_id(self, disciplina_id: str) -> Disciplina | None:
        return self._disciplinas.get(disciplina_id)
