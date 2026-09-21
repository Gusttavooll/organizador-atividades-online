from pydantic import BaseModel, EmailStr, Field


class DisciplinaCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    turma_id: str
    professor_nome: str = Field(min_length=2, max_length=120)
    professor_email: EmailStr


class DisciplinaOut(BaseModel):
    id: str
    nome: str
    turma_id: str
    professor_nome: str
    professor_email: EmailStr
