from pydantic import BaseModel, EmailStr, Field, model_validator


class AlunoCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: EmailStr
    turma_id: str


class AlunoLoteItem(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: EmailStr


class AlunoLoteCreate(BaseModel):
    turma_id: str
    alunos: list[AlunoLoteItem] = Field(min_length=1, max_length=200)

    @model_validator(mode="after")
    def _sem_emails_duplicados(self) -> "AlunoLoteCreate":
        emails = [item.email.lower() for item in self.alunos]
        if len(emails) != len(set(emails)):
            raise ValueError("A lista de alunos contém e-mails duplicados.")
        return self


class AlunoUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    turma_id: str | None = None
    observacao: str | None = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def _pelo_menos_um_campo(self) -> "AlunoUpdate":
        if not self.model_fields_set:
            raise ValueError("Informe ao menos um campo para atualizar.")
        return self


class AlunoOut(BaseModel):
    id: str
    nome: str
    email: EmailStr
    turma_id: str
    observacao: str | None
