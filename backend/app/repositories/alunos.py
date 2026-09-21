from typing import Protocol

from app.models.aluno import Aluno


class AlunoRepository(Protocol):
    async def create(self, aluno: Aluno) -> Aluno: ...
    async def list_all(self, turma_id: str | None = None) -> list[Aluno]: ...
    async def get_by_id(self, aluno_id: str) -> Aluno | None: ...
    async def get_by_email(self, email: str) -> Aluno | None: ...
    async def update(self, aluno: Aluno) -> Aluno: ...
    async def delete(self, aluno_id: str) -> None: ...


class InMemoryAlunoRepository:
    """Implementação em memória — trocar por Supabase/Postgres implementando o mesmo Protocol."""

    def __init__(self) -> None:
        self._alunos: dict[str, Aluno] = {}

    async def create(self, aluno: Aluno) -> Aluno:
        self._alunos[aluno.id] = aluno
        return aluno

    async def list_all(self, turma_id: str | None = None) -> list[Aluno]:
        alunos = list(self._alunos.values())
        if turma_id is not None:
            alunos = [a for a in alunos if a.turma_id == turma_id]
        return alunos

    async def get_by_id(self, aluno_id: str) -> Aluno | None:
        return self._alunos.get(aluno_id)

    async def get_by_email(self, email: str) -> Aluno | None:
        email_normalizado = email.lower()
        for aluno in self._alunos.values():
            if aluno.email.lower() == email_normalizado:
                return aluno
        return None

    async def update(self, aluno: Aluno) -> Aluno:
        self._alunos[aluno.id] = aluno
        return aluno

    async def delete(self, aluno_id: str) -> None:
        self._alunos.pop(aluno_id, None)
