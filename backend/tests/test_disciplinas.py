from httpx import AsyncClient


async def _criar_turma(client: AsyncClient, nome: str = "3º Ano A") -> str:
    resposta = await client.post("/turmas", json={"nome": nome})
    turma_id: str = resposta.json()["id"]
    return turma_id


async def test_criar_e_listar_disciplina(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)

    resposta = await client.post(
        "/disciplinas",
        json={
            "nome": "Desenvolvimento Web",
            "turma_id": turma_id,
            "professor_nome": "Ana Souza",
            "professor_email": "ana.souza@escola.edu.br",
        },
    )
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["turma_id"] == turma_id

    resposta_lista = await client.get("/disciplinas", params={"turma_id": turma_id})
    assert resposta_lista.status_code == 200
    assert len(resposta_lista.json()) == 1


async def test_criar_disciplina_turma_inexistente(client: AsyncClient) -> None:
    resposta = await client.post(
        "/disciplinas",
        json={
            "nome": "Desenvolvimento Web",
            "turma_id": "turma-que-nao-existe",
            "professor_nome": "Ana Souza",
            "professor_email": "ana.souza@escola.edu.br",
        },
    )
    assert resposta.status_code == 404


async def test_listar_disciplinas_filtra_por_turma(client: AsyncClient) -> None:
    turma_a = await _criar_turma(client, "Turma A")
    turma_b = await _criar_turma(client, "Turma B")

    await client.post(
        "/disciplinas",
        json={
            "nome": "Matemática",
            "turma_id": turma_a,
            "professor_nome": "Ana Souza",
            "professor_email": "ana.souza@escola.edu.br",
        },
    )
    await client.post(
        "/disciplinas",
        json={
            "nome": "Física",
            "turma_id": turma_b,
            "professor_nome": "Bruno Lima",
            "professor_email": "bruno.lima@escola.edu.br",
        },
    )

    resposta = await client.get("/disciplinas", params={"turma_id": turma_a})
    corpo = resposta.json()
    assert len(corpo) == 1
    assert corpo[0]["nome"] == "Matemática"
