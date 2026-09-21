from dataclasses import dataclass


@dataclass(slots=True)
class Aluno:
    id: str
    nome: str
    email: str
    turma_id: str
