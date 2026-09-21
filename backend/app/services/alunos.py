from typing import Any
from uuid import uuid4

from app.core.errors import EmailJaCadastradoError, RecursoNaoEncontradoError
from app.models.aluno import Aluno
from app.repositories.alunos import AlunoRepository
from app.repositories.turmas import TurmaRepository


class AlunoService:
    def __init__(self, repo: AlunoRepository, turma_repo: TurmaRepository) -> None:
        self._repo = repo
        self._turma_repo = turma_repo

    async def criar(self, nome: str, email: str, turma_id: str) -> Aluno:
        await self._garantir_turma_existe(turma_id)
        await self._garantir_email_disponivel(email)

        aluno = Aluno(id=str(uuid4()), nome=nome, email=email, turma_id=turma_id)
        return await self._repo.create(aluno)

    async def criar_lote(self, turma_id: str, itens: list[tuple[str, str]]) -> list[Aluno]:
        await self._garantir_turma_existe(turma_id)
        for _, email in itens:
            await self._garantir_email_disponivel(email)

        criados = [
            Aluno(id=str(uuid4()), nome=nome, email=email, turma_id=turma_id)
            for nome, email in itens
        ]
        for aluno in criados:
            await self._repo.create(aluno)
        return criados

    async def listar(self, turma_id: str | None = None) -> list[Aluno]:
        return await self._repo.list_all(turma_id=turma_id)

    async def atualizar(self, aluno_id: str, campos: dict[str, Any]) -> Aluno:
        aluno = await self._buscar_ou_falhar(aluno_id)

        novo_email = campos.get("email")
        if novo_email is not None and novo_email.lower() != aluno.email.lower():
            await self._garantir_email_disponivel(novo_email)

        novo_turma_id = campos.get("turma_id")
        if novo_turma_id is not None:
            await self._garantir_turma_existe(novo_turma_id)

        for campo, valor in campos.items():
            setattr(aluno, campo, valor)

        return await self._repo.update(aluno)

    async def excluir(self, aluno_id: str) -> None:
        await self._buscar_ou_falhar(aluno_id)
        await self._repo.delete(aluno_id)

    async def _buscar_ou_falhar(self, aluno_id: str) -> Aluno:
        aluno = await self._repo.get_by_id(aluno_id)
        if aluno is None:
            raise RecursoNaoEncontradoError(f"Aluno '{aluno_id}' não encontrado.")
        return aluno

    async def _garantir_turma_existe(self, turma_id: str) -> None:
        turma = await self._turma_repo.get_by_id(turma_id)
        if turma is None:
            raise RecursoNaoEncontradoError(f"Turma '{turma_id}' não encontrada.")

    async def _garantir_email_disponivel(self, email: str) -> None:
        existente = await self._repo.get_by_email(email)
        if existente is not None:
            raise EmailJaCadastradoError("Já existe um aluno cadastrado com este e-mail.")
