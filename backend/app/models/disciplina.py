from dataclasses import dataclass


@dataclass(slots=True)
class Disciplina:
    id: str
    nome: str
    turma_id: str
    professor_nome: str
    professor_email: str
