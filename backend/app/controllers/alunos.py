from fastapi import APIRouter, Depends, Query, status

from app.schemas.aluno import AlunoCreate, AlunoLoteCreate, AlunoOut, AlunoUpdate
from app.services.alunos import AlunoService
from app.services.deps import get_aluno_service
from app.views.aluno import to_aluno_out

router = APIRouter(prefix="/alunos", tags=["alunos"])


@router.post("", response_model=AlunoOut, status_code=status.HTTP_201_CREATED)
async def criar_aluno(
    dados: AlunoCreate, service: AlunoService = Depends(get_aluno_service)
) -> AlunoOut:
    aluno = await service.criar(nome=dados.nome, email=dados.email, turma_id=dados.turma_id)
    return to_aluno_out(aluno)


@router.post("/lote", response_model=list[AlunoOut], status_code=status.HTTP_201_CREATED)
async def criar_alunos_em_lote(
    dados: AlunoLoteCreate, service: AlunoService = Depends(get_aluno_service)
) -> list[AlunoOut]:
    itens = [(item.nome, item.email) for item in dados.alunos]
    alunos = await service.criar_lote(turma_id=dados.turma_id, itens=itens)
    return [to_aluno_out(aluno) for aluno in alunos]


@router.get("", response_model=list[AlunoOut])
async def listar_alunos(
    turma_id: str | None = Query(default=None),
    service: AlunoService = Depends(get_aluno_service),
) -> list[AlunoOut]:
    alunos = await service.listar(turma_id=turma_id)
    return [to_aluno_out(aluno) for aluno in alunos]


@router.patch("/{aluno_id}", response_model=AlunoOut)
async def atualizar_aluno(
    aluno_id: str,
    dados: AlunoUpdate,
    service: AlunoService = Depends(get_aluno_service),
) -> AlunoOut:
    aluno = await service.atualizar(aluno_id, dados.model_dump(exclude_unset=True))
    return to_aluno_out(aluno)


@router.delete("/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir_aluno(aluno_id: str, service: AlunoService = Depends(get_aluno_service)) -> None:
    await service.excluir(aluno_id)
