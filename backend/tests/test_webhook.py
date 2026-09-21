from httpx import AsyncClient

from app.core.config import get_settings
from app.main import app
from tests.conftest import TEST_WEBHOOK_SECRET, build_test_settings


async def _preparar_turma_disciplina_aluno(client: AsyncClient) -> tuple[str, str]:
    turma = await client.post("/turmas", json={"nome": "3º Ano A"})
    turma_id = turma.json()["id"]

    disciplina = await client.post(
        "/disciplinas",
        json={
            "nome": "Desenvolvimento Web",
            "turma_id": turma_id,
            "professor_nome": "Ana Souza",
            "professor_email": "ana.souza@escola.edu.br",
        },
    )
    disciplina_id = disciplina.json()["id"]

    await client.post(
        "/alunos",
        json={"nome": "Beatriz Souza", "email": "beatriz@escola.edu.br", "turma_id": turma_id},
    )

    return disciplina_id, turma_id


async def test_webhook_aluno_existente_conteudo_texto(client: AsyncClient) -> None:
    disciplina_id, turma_id = await _preparar_turma_disciplina_aluno(client)

    resposta = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "beatriz@escola.edu.br",
            "disciplina_id": disciplina_id,
            "conteudo": "Implementei a pilha usando listas encadeadas.",
        },
        headers={"X-Webhook-Secret": TEST_WEBHOOK_SECRET},
    )
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["tipos_detectados"] == ["texto"]
    assert corpo["turma_id"] == turma_id
    assert corpo["status"] == "nao_lido"
    assert corpo["conteudo_enriquecido"][0]["tipo"] == "texto"


async def test_webhook_aluno_existente_conteudo_github(client: AsyncClient) -> None:
    disciplina_id, _ = await _preparar_turma_disciplina_aluno(client)

    resposta = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "beatriz@escola.edu.br",
            "disciplina_id": disciplina_id,
            "conteudo": "Meu projeto: https://github.com/beatriz/lista-tarefas",
        },
        headers={"X-Webhook-Secret": TEST_WEBHOOK_SECRET},
    )
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert "github" in corpo["tipos_detectados"]
    assert "texto" in corpo["tipos_detectados"]
    tipos_enriquecidos = {item["tipo"] for item in corpo["conteudo_enriquecido"]}
    assert tipos_enriquecidos == {"github", "texto"}


async def test_webhook_aluno_inexistente(client: AsyncClient) -> None:
    disciplina_id, _ = await _preparar_turma_disciplina_aluno(client)

    resposta = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "nao-cadastrado@escola.edu.br",
            "disciplina_id": disciplina_id,
            "conteudo": "Texto qualquer.",
        },
        headers={"X-Webhook-Secret": TEST_WEBHOOK_SECRET},
    )
    assert resposta.status_code == 404


async def test_webhook_disciplina_inexistente(client: AsyncClient) -> None:
    await _preparar_turma_disciplina_aluno(client)

    resposta = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "beatriz@escola.edu.br",
            "disciplina_id": "disciplina-que-nao-existe",
            "conteudo": "Texto qualquer.",
        },
        headers={"X-Webhook-Secret": TEST_WEBHOOK_SECRET},
    )
    assert resposta.status_code == 404


async def test_webhook_sem_header_de_segredo(client: AsyncClient) -> None:
    disciplina_id, _ = await _preparar_turma_disciplina_aluno(client)

    resposta = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "beatriz@escola.edu.br",
            "disciplina_id": disciplina_id,
            "conteudo": "Texto qualquer.",
        },
    )
    assert resposta.status_code == 422


async def test_webhook_segredo_invalido(client: AsyncClient) -> None:
    disciplina_id, _ = await _preparar_turma_disciplina_aluno(client)

    resposta = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "beatriz@escola.edu.br",
            "disciplina_id": disciplina_id,
            "conteudo": "Texto qualquer.",
        },
        headers={"X-Webhook-Secret": "segredo-errado"},
    )
    assert resposta.status_code == 401


async def test_webhook_limite_de_requisicoes_excedido(client: AsyncClient) -> None:
    disciplina_id, _ = await _preparar_turma_disciplina_aluno(client)

    app.dependency_overrides[get_settings] = lambda: build_test_settings(
        webhook_rate_limit_max=2, webhook_rate_limit_janela_segundos=60.0
    )

    payload = {
        "email_aluno": "beatriz@escola.edu.br",
        "disciplina_id": disciplina_id,
        "conteudo": "Texto qualquer.",
    }
    headers = {"X-Webhook-Secret": TEST_WEBHOOK_SECRET}

    primeira = await client.post("/webhooks/entregas", json=payload, headers=headers)
    segunda = await client.post("/webhooks/entregas", json=payload, headers=headers)
    terceira = await client.post("/webhooks/entregas", json=payload, headers=headers)

    assert primeira.status_code == 201
    assert segunda.status_code == 201
    assert terceira.status_code == 429
