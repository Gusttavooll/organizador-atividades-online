from dataclasses import dataclass


@dataclass(slots=True)
class Turma:
    id: str
    nome: str
