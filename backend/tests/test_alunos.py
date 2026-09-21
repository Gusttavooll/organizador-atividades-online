from httpx import AsyncClient


async def _criar_turma(client: AsyncClient, nome: str = "3º Ano A") -> str:
    resposta = await client.post("/turmas", json={"nome": nome})
    turma_id: str = resposta.json()["id"]
    return turma_id


def _dados_beatriz(turma_id: str) -> dict[str, str]:
    return {"nome": "Beatriz Souza", "email": "beatriz@escola.edu.br", "turma_id": turma_id}


async def test_criar_e_listar_aluno(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)

    resposta = await client.post("/alunos", json=_dados_beatriz(turma_id))
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["email"] == "beatriz@escola.edu.br"

    resposta_lista = await client.get("/alunos", params={"turma_id": turma_id})
    assert len(resposta_lista.json()) == 1


async def test_criar_aluno_email_duplicado(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)
    dados = {"nome": "Beatriz Souza", "email": "beatriz@escola.edu.br", "turma_id": turma_id}

    primeira = await client.post("/alunos", json=dados)
    assert primeira.status_code == 201

    segunda = await client.post("/alunos", json=dados)
    assert segunda.status_code == 409


async def test_criar_aluno_turma_inexistente(client: AsyncClient) -> None:
    resposta = await client.post(
        "/alunos",
        json={"nome": "Beatriz Souza", "email": "beatriz@escola.edu.br", "turma_id": "nao-existe"},
    )
    assert resposta.status_code == 404


async def test_criar_alunos_em_lote(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)

    resposta = await client.post(
        "/alunos/lote",
        json={
            "turma_id": turma_id,
            "alunos": [
                {"nome": "Carlos Lima", "email": "carlos@escola.edu.br"},
                {"nome": "Diana Reis", "email": "diana@escola.edu.br"},
            ],
        },
    )
    assert resposta.status_code == 201
    assert len(resposta.json()) == 2


async def test_criar_alunos_em_lote_com_email_duplicado_no_payload(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)

    resposta = await client.post(
        "/alunos/lote",
        json={
            "turma_id": turma_id,
            "alunos": [
                {"nome": "Carlos Lima", "email": "carlos@escola.edu.br"},
                {"nome": "Carlos Lima Duplicado", "email": "carlos@escola.edu.br"},
            ],
        },
    )
    assert resposta.status_code == 422


async def test_atualizar_aluno(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)
    criado = await client.post("/alunos", json=_dados_beatriz(turma_id))
    aluno_id = criado.json()["id"]

    outra_turma_id = await _criar_turma(client, "Turma de Extensão")

    resposta = await client.patch(
        f"/alunos/{aluno_id}", json={"nome": "Beatriz S. Souza", "turma_id": outra_turma_id}
    )
    assert resposta.status_code == 200
    corpo = resposta.json()
    assert corpo["nome"] == "Beatriz S. Souza"
    assert corpo["turma_id"] == outra_turma_id


async def test_atualizar_aluno_inexistente(client: AsyncClient) -> None:
    resposta = await client.patch("/alunos/nao-existe", json={"nome": "Novo Nome"})
    assert resposta.status_code == 404


async def test_atualizar_aluno_sem_campos_e_invalido(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)
    criado = await client.post("/alunos", json=_dados_beatriz(turma_id))
    aluno_id = criado.json()["id"]

    resposta = await client.patch(f"/alunos/{aluno_id}", json={})
    assert resposta.status_code == 422


async def test_excluir_aluno(client: AsyncClient) -> None:
    turma_id = await _criar_turma(client)
    criado = await client.post("/alunos", json=_dados_beatriz(turma_id))
    aluno_id = criado.json()["id"]

    resposta = await client.delete(f"/alunos/{aluno_id}")
    assert resposta.status_code == 204

    resposta_lista = await client.get("/alunos", params={"turma_id": turma_id})
    assert resposta_lista.json() == []


async def test_excluir_aluno_inexistente(client: AsyncClient) -> None:
    resposta = await client.delete("/alunos/nao-existe")
    assert resposta.status_code == 404
