from typing import Protocol

from app.models.turma import Turma


class TurmaRepository(Protocol):
    async def create(self, turma: Turma) -> Turma: ...
    async def list_all(self) -> list[Turma]: ...
    async def get_by_id(self, turma_id: str) -> Turma | None: ...


class InMemoryTurmaRepository:
    """Implementação em memória — trocar por Supabase/Postgres implementando o mesmo Protocol."""

    def __init__(self) -> None:
        self._turmas: dict[str, Turma] = {}

    async def create(self, turma: Turma) -> Turma:
        self._turmas[turma.id] = turma
        return turma

    async def list_all(self) -> list[Turma]:
        return list(self._turmas.values())

    async def get_by_id(self, turma_id: str) -> Turma | None:
        return self._turmas.get(turma_id)
