from fastapi import APIRouter, Depends, Query, status

from app.schemas.disciplina import DisciplinaCreate, DisciplinaOut
from app.services.deps import get_disciplina_service
from app.services.disciplinas import DisciplinaService
from app.views.disciplina import to_disciplina_out

router = APIRouter(prefix="/disciplinas", tags=["disciplinas"])


@router.post("", response_model=DisciplinaOut, status_code=status.HTTP_201_CREATED)
async def criar_disciplina(
    dados: DisciplinaCreate,
    service: DisciplinaService = Depends(get_disciplina_service),
) -> DisciplinaOut:
    disciplina = await service.criar(
        nome=dados.nome,
        turma_id=dados.turma_id,
        professor_nome=dados.professor_nome,
        professor_email=dados.professor_email,
    )
    return to_disciplina_out(disciplina)


@router.get("", response_model=list[DisciplinaOut])
async def listar_disciplinas(
    turma_id: str | None = Query(default=None),
    service: DisciplinaService = Depends(get_disciplina_service),
) -> list[DisciplinaOut]:
    disciplinas = await service.listar(turma_id=turma_id)
    return [to_disciplina_out(disciplina) for disciplina in disciplinas]
