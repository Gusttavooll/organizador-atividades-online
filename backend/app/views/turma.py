from app.models.turma import Turma
from app.schemas.turma import TurmaOut


def to_turma_out(turma: Turma) -> TurmaOut:
    return TurmaOut(id=turma.id, nome=turma.nome)
