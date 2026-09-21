from typing import Protocol

from app.models.entrega import Entrega, StatusEntrega


class EntregaRepository(Protocol):
    async def create(self, entrega: Entrega) -> Entrega: ...
    async def list_all(
        self,
        turma_id: str | None = None,
        disciplina_id: str | None = None,
        aluno_id: str | None = None,
        status: StatusEntrega | None = None,
    ) -> list[Entrega]: ...
    async def get_by_id(self, entrega_id: str) -> Entrega | None: ...
    async def update(self, entrega: Entrega) -> Entrega: ...


class InMemoryEntregaRepository:
    """Implementação em memória — trocar por Supabase/Postgres implementando o mesmo Protocol."""

    def __init__(self) -> None:
        self._entregas: dict[str, Entrega] = {}

    async def create(self, entrega: Entrega) -> Entrega:
        self._entregas[entrega.id] = entrega
        return entrega

    async def list_all(
        self,
        turma_id: str | None = None,
        disciplina_id: str | None = None,
        aluno_id: str | None = None,
        status: StatusEntrega | None = None,
    ) -> list[Entrega]:
        entregas = list(self._entregas.values())
        if turma_id is not None:
            entregas = [e for e in entregas if e.turma_id == turma_id]
        if disciplina_id is not None:
            entregas = [e for e in entregas if e.disciplina_id == disciplina_id]
        if aluno_id is not None:
            entregas = [e for e in entregas if e.aluno_id == aluno_id]
        if status is not None:
            entregas = [e for e in entregas if e.status == status]
        return sorted(entregas, key=lambda e: e.criado_em, reverse=True)

    async def get_by_id(self, entrega_id: str) -> Entrega | None:
        return self._entregas.get(entrega_id)

    async def update(self, entrega: Entrega) -> Entrega:
        self._entregas[entrega.id] = entrega
        return entrega
