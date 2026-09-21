from pydantic import BaseModel, Field


class TurmaCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)


class TurmaOut(BaseModel):
    id: str
    nome: str
