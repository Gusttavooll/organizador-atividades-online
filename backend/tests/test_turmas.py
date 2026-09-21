from httpx import AsyncClient


async def test_criar_e_listar_turma(client: AsyncClient) -> None:
    resposta = await client.post("/turmas", json={"nome": "3º Ano A"})
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["nome"] == "3º Ano A"
    assert corpo["id"]

    resposta_lista = await client.get("/turmas")
    assert resposta_lista.status_code == 200
    assert len(resposta_lista.json()) == 1


async def test_criar_turma_nome_invalido(client: AsyncClient) -> None:
    resposta = await client.post("/turmas", json={"nome": "A"})
    assert resposta.status_code == 422
