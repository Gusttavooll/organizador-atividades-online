from app.models.disciplina import Disciplina
from app.schemas.disciplina import DisciplinaOut


def to_disciplina_out(disciplina: Disciplina) -> DisciplinaOut:
    return DisciplinaOut(
        id=disciplina.id,
        nome=disciplina.nome,
        turma_id=disciplina.turma_id,
        professor_nome=disciplina.professor_nome,
        professor_email=disciplina.professor_email,
    )
