from functools import lru_cache

from app.repositories.alunos import AlunoRepository, InMemoryAlunoRepository
from app.repositories.disciplinas import DisciplinaRepository, InMemoryDisciplinaRepository
from app.repositories.entregas import EntregaRepository, InMemoryEntregaRepository
from app.repositories.turmas import InMemoryTurmaRepository, TurmaRepository


@lru_cache
def get_turma_repository() -> TurmaRepository:
    return InMemoryTurmaRepository()


@lru_cache
def get_disciplina_repository() -> DisciplinaRepository:
    return InMemoryDisciplinaRepository()


@lru_cache
def get_aluno_repository() -> AlunoRepository:
    return InMemoryAlunoRepository()


@lru_cache
def get_entrega_repository() -> EntregaRepository:
    return InMemoryEntregaRepository()
