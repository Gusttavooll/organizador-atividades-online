from app.models.aluno import Aluno
from app.schemas.aluno import AlunoOut


def to_aluno_out(aluno: Aluno) -> AlunoOut:
    return AlunoOut(id=aluno.id, nome=aluno.nome, email=aluno.email, turma_id=aluno.turma_id)
