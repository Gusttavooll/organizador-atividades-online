from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from app.core.errors import RecursoNaoEncontradoError
from app.models.entrega import (
    ConteudoEnriquecido,
    ConteudoTexto,
    Entrega,
    StatusEntrega,
    TipoConteudo,
)
from app.repositories.alunos import AlunoRepository
from app.repositories.disciplinas import DisciplinaRepository
from app.repositories.entregas import EntregaRepository
from app.services.classification import detectar_tipos_e_urls
from app.services.enrichment.base import EnriquecedorDrive, EnriquecedorGithub


class EntregaService:
    def __init__(
        self,
        entrega_repo: EntregaRepository,
        aluno_repo: AlunoRepository,
        disciplina_repo: DisciplinaRepository,
        github_enriquecedor: EnriquecedorGithub,
        drive_enriquecedor: EnriquecedorDrive,
    ) -> None:
        self._entrega_repo = entrega_repo
        self._aluno_repo = aluno_repo
        self._disciplina_repo = disciplina_repo
        self._github_enriquecedor = github_enriquecedor
        self._drive_enriquecedor = drive_enriquecedor

    async def processar_webhook(
        self, email_aluno: str, disciplina_id: str, conteudo: str
    ) -> Entrega:
        aluno = await self._aluno_repo.get_by_email(email_aluno)
        if aluno is None:
            raise RecursoNaoEncontradoError("Nenhum aluno cadastrado com este e-mail.")

        disciplina = await self._disciplina_repo.get_by_id(disciplina_id)
        if disciplina is None:
            raise RecursoNaoEncontradoError(f"Disciplina '{disciplina_id}' não encontrada.")

        tipos, github_urls, drive_urls, texto_restante = detectar_tipos_e_urls(conteudo)

        enriquecido: list[ConteudoEnriquecido] = []
        for url in github_urls:
            enriquecido.append(await self._github_enriquecedor.enriquecer(url))
        for url in drive_urls:
            enriquecido.append(await self._drive_enriquecedor.enriquecer(url))
        if TipoConteudo.TEXTO in tipos:
            enriquecido.append(
                ConteudoTexto(tipo=TipoConteudo.TEXTO, conteudo=texto_restante or conteudo)
            )

        entrega = Entrega(
            id=str(uuid4()),
            aluno_id=aluno.id,
            turma_id=aluno.turma_id,
            disciplina_id=disciplina.id,
            conteudo_original=conteudo,
            tipos_detectados=tipos,
            conteudo_enriquecido=enriquecido,
            status=StatusEntrega.NAO_LIDO,
            observacao_professor=None,
            criado_em=datetime.now(UTC),
        )
        return await self._entrega_repo.create(entrega)

    async def listar(
        self,
        turma_id: str | None = None,
        disciplina_id: str | None = None,
        aluno_id: str | None = None,
        status: StatusEntrega | None = None,
    ) -> list[Entrega]:
        return await self._entrega_repo.list_all(
            turma_id=turma_id,
            disciplina_id=disciplina_id,
            aluno_id=aluno_id,
            status=status,
        )

    async def buscar(self, entrega_id: str) -> Entrega:
        entrega = await self._entrega_repo.get_by_id(entrega_id)
        if entrega is None:
            raise RecursoNaoEncontradoError(f"Entrega '{entrega_id}' não encontrada.")
        return entrega

    async def atualizar(self, entrega_id: str, campos: dict[str, Any]) -> Entrega:
        entrega = await self.buscar(entrega_id)

        if "status" in campos:
            entrega.status = campos["status"]
        if "observacao_professor" in campos:
            entrega.observacao_professor = campos["observacao_professor"]

        return await self._entrega_repo.update(entrega)
