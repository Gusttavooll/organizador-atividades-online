from fastapi import APIRouter, Depends, Query

from app.models.entrega import StatusEntrega
from app.schemas.entrega import EntregaOut, EntregaUpdate
from app.services.deps import get_entrega_service
from app.services.entregas import EntregaService
from app.views.entrega import to_entrega_out

router = APIRouter(prefix="/entregas", tags=["entregas"])


@router.get("", response_model=list[EntregaOut])
async def listar_entregas(
    turma_id: str | None = Query(default=None),
    disciplina_id: str | None = Query(default=None),
    aluno_id: str | None = Query(default=None),
    status: StatusEntrega | None = Query(default=None),
    service: EntregaService = Depends(get_entrega_service),
) -> list[EntregaOut]:
    entregas = await service.listar(
        turma_id=turma_id,
        disciplina_id=disciplina_id,
        aluno_id=aluno_id,
        status=status,
    )
    return [to_entrega_out(entrega) for entrega in entregas]


@router.get("/{entrega_id}", response_model=EntregaOut)
async def buscar_entrega(
    entrega_id: str, service: EntregaService = Depends(get_entrega_service)
) -> EntregaOut:
    entrega = await service.buscar(entrega_id)
    return to_entrega_out(entrega)


@router.patch("/{entrega_id}", response_model=EntregaOut)
async def atualizar_entrega(
    entrega_id: str,
    dados: EntregaUpdate,
    service: EntregaService = Depends(get_entrega_service),
) -> EntregaOut:
    entrega = await service.atualizar(entrega_id, dados.model_dump(exclude_unset=True))
    return to_entrega_out(entrega)
