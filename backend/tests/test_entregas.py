from httpx import AsyncClient

from tests.conftest import TEST_WEBHOOK_SECRET


async def _criar_entrega(
    client: AsyncClient, conteudo: str = "Texto qualquer."
) -> tuple[str, str, str]:
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

    entrega = await client.post(
        "/webhooks/entregas",
        json={
            "email_aluno": "beatriz@escola.edu.br",
            "disciplina_id": disciplina_id,
            "conteudo": conteudo,
        },
        headers={"X-Webhook-Secret": TEST_WEBHOOK_SECRET},
    )
    entrega_id = entrega.json()["id"]
    return entrega_id, turma_id, disciplina_id


async def test_listar_entregas_com_filtros(client: AsyncClient) -> None:
    entrega_id, turma_id, disciplina_id = await _criar_entrega(client)

    resposta = await client.get("/entregas", params={"turma_id": turma_id})
    assert resposta.status_code == 200
    assert len(resposta.json()) == 1

    resposta_disciplina = await client.get("/entregas", params={"disciplina_id": disciplina_id})
    assert len(resposta_disciplina.json()) == 1

    resposta_status = await client.get("/entregas", params={"status": "corrigido"})
    assert resposta_status.json() == []

    resposta_sem_match = await client.get("/entregas", params={"turma_id": "outra-turma"})
    assert resposta_sem_match.json() == []

    assert entrega_id


async def test_buscar_entrega_por_id(client: AsyncClient) -> None:
    entrega_id, _, _ = await _criar_entrega(client)

    resposta = await client.get(f"/entregas/{entrega_id}")
    assert resposta.status_code == 200
    assert resposta.json()["id"] == entrega_id


async def test_buscar_entrega_inexistente(client: AsyncClient) -> None:
    resposta = await client.get("/entregas/nao-existe")
    assert resposta.status_code == 404


async def test_atualizar_status_e_observacao(client: AsyncClient) -> None:
    entrega_id, _, _ = await _criar_entrega(client)

    resposta = await client.patch(
        f"/entregas/{entrega_id}",
        json={"status": "corrigido", "observacao_professor": "Bom trabalho!"},
    )
    assert resposta.status_code == 200
    corpo = resposta.json()
    assert corpo["status"] == "corrigido"
    assert corpo["observacao_professor"] == "Bom trabalho!"


async def test_atualizar_entrega_inexistente(client: AsyncClient) -> None:
    resposta = await client.patch("/entregas/nao-existe", json={"status": "lido"})
    assert resposta.status_code == 404


async def test_atualizar_entrega_sem_campos(client: AsyncClient) -> None:
    entrega_id, _, _ = await _criar_entrega(client)

    resposta = await client.patch(f"/entregas/{entrega_id}", json={})
    assert resposta.status_code == 422
