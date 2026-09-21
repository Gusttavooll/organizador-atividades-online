from functools import lru_cache

import httpx
from fastapi import Depends

from app.core.config import Settings, get_settings
from app.repositories.alunos import AlunoRepository
from app.repositories.deps import (
    get_aluno_repository,
    get_disciplina_repository,
    get_entrega_repository,
    get_turma_repository,
)
from app.repositories.disciplinas import DisciplinaRepository
from app.repositories.entregas import EntregaRepository
from app.repositories.turmas import TurmaRepository
from app.services.alunos import AlunoService
from app.services.disciplinas import DisciplinaService
from app.services.enrichment.drive import DriveEnriquecedor
from app.services.enrichment.github import GithubEnriquecedor
from app.services.entregas import EntregaService
from app.services.turmas import TurmaService


@lru_cache
def get_http_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=10.0)


def get_github_enriquecedor(
    client: httpx.AsyncClient = Depends(get_http_client),
    settings: Settings = Depends(get_settings),
) -> GithubEnriquecedor:
    return GithubEnriquecedor(client=client, token=settings.github_api_token)


def get_drive_enriquecedor() -> DriveEnriquecedor:
    return DriveEnriquecedor()


def get_turma_service(repo: TurmaRepository = Depends(get_turma_repository)) -> TurmaService:
    return TurmaService(repo)


def get_disciplina_service(
    repo: DisciplinaRepository = Depends(get_disciplina_repository),
    turma_repo: TurmaRepository = Depends(get_turma_repository),
) -> DisciplinaService:
    return DisciplinaService(repo, turma_repo)


def get_aluno_service(
    repo: AlunoRepository = Depends(get_aluno_repository),
    turma_repo: TurmaRepository = Depends(get_turma_repository),
) -> AlunoService:
    return AlunoService(repo, turma_repo)


def get_entrega_service(
    entrega_repo: EntregaRepository = Depends(get_entrega_repository),
    aluno_repo: AlunoRepository = Depends(get_aluno_repository),
    disciplina_repo: DisciplinaRepository = Depends(get_disciplina_repository),
    github_enriquecedor: GithubEnriquecedor = Depends(get_github_enriquecedor),
    drive_enriquecedor: DriveEnriquecedor = Depends(get_drive_enriquecedor),
) -> EntregaService:
    return EntregaService(
        entrega_repo=entrega_repo,
        aluno_repo=aluno_repo,
        disciplina_repo=disciplina_repo,
        github_enriquecedor=github_enriquecedor,
        drive_enriquecedor=drive_enriquecedor,
    )
