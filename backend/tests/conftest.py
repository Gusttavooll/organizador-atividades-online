import os
from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

# `app.main` lê `Settings()` (via `get_settings()`) já na importação do módulo,
# então o WEBHOOK_SECRET precisa existir no ambiente antes desse import — sem
# isso, `pytest` puro falharia exigindo um `.env` só para carregar o app.
os.environ.setdefault("WEBHOOK_SECRET", "segredo-de-teste-carregado-antes-do-import")

from app.core.config import Settings, get_settings  # noqa: E402
from app.core.rate_limit import RateLimiter, get_rate_limiter  # noqa: E402
from app.main import app  # noqa: E402
from app.models.entrega import ConteudoDrive, ConteudoGithub, TipoConteudo
from app.repositories.alunos import InMemoryAlunoRepository
from app.repositories.deps import (
    get_aluno_repository,
    get_disciplina_repository,
    get_entrega_repository,
    get_turma_repository,
)
from app.repositories.disciplinas import InMemoryDisciplinaRepository
from app.repositories.entregas import InMemoryEntregaRepository
from app.repositories.turmas import InMemoryTurmaRepository
from app.services.deps import get_drive_enriquecedor, get_github_enriquecedor

TEST_WEBHOOK_SECRET = "segredo-de-teste"


def build_test_settings(**overrides: object) -> Settings:
    dados: dict[str, object] = {
        "webhook_secret": TEST_WEBHOOK_SECRET,
        "cors_origins": "http://localhost:3000",
        **overrides,
    }
    return Settings(**dados)  # type: ignore[arg-type]


class FakeGithubEnriquecedor:
    async def enriquecer(self, url_repositorio: str) -> ConteudoGithub:
        return ConteudoGithub(
            tipo=TipoConteudo.GITHUB,
            url_repositorio=url_repositorio,
            nome_repositorio="owner/repo",
            numero_commits=7,
            readme="README de teste.",
        )


class FakeDriveEnriquecedor:
    async def enriquecer(self, url_arquivo: str) -> ConteudoDrive:
        return ConteudoDrive(
            tipo=TipoConteudo.DRIVE,
            url_arquivo=url_arquivo,
            nome_arquivo="arquivo-teste.pdf",
            texto_extraido="Texto extraído de teste.",
        )


@pytest.fixture(autouse=True)
def _overrides() -> AsyncIterator[None]:  # type: ignore[misc]
    turma_repo = InMemoryTurmaRepository()
    disciplina_repo = InMemoryDisciplinaRepository()
    aluno_repo = InMemoryAlunoRepository()
    entrega_repo = InMemoryEntregaRepository()
    rate_limiter = RateLimiter()
    test_settings = build_test_settings()

    app.dependency_overrides[get_settings] = lambda: test_settings
    app.dependency_overrides[get_turma_repository] = lambda: turma_repo
    app.dependency_overrides[get_disciplina_repository] = lambda: disciplina_repo
    app.dependency_overrides[get_aluno_repository] = lambda: aluno_repo
    app.dependency_overrides[get_entrega_repository] = lambda: entrega_repo
    app.dependency_overrides[get_github_enriquecedor] = lambda: FakeGithubEnriquecedor()
    app.dependency_overrides[get_drive_enriquecedor] = lambda: FakeDriveEnriquecedor()
    app.dependency_overrides[get_rate_limiter] = lambda: rate_limiter

    yield

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def client() -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
