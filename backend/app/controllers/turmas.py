from fastapi import APIRouter, Depends, status

from app.schemas.turma import TurmaCreate, TurmaOut
from app.services.deps import get_turma_service
from app.services.turmas import TurmaService
from app.views.turma import to_turma_out

router = APIRouter(prefix="/turmas", tags=["turmas"])


@router.post("", response_model=TurmaOut, status_code=status.HTTP_201_CREATED)
async def criar_turma(
    dados: TurmaCreate, service: TurmaService = Depends(get_turma_service)
) -> TurmaOut:
    turma = await service.criar(dados.nome)
    return to_turma_out(turma)


@router.get("", response_model=list[TurmaOut])
async def listar_turmas(service: TurmaService = Depends(get_turma_service)) -> list[TurmaOut]:
    turmas = await service.listar()
    return [to_turma_out(turma) for turma in turmas]
