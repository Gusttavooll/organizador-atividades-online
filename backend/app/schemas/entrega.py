from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from app.models.entrega import StatusEntrega, TipoConteudo


class EntregaWebhookIn(BaseModel):
    email_aluno: EmailStr
    disciplina_id: str
    conteudo: str = Field(min_length=1, max_length=20_000)

    @field_validator("conteudo")
    @classmethod
    def _limpar_conteudo(cls, valor: str) -> str:
        valor = valor.strip()
        if not valor:
            raise ValueError("O conteúdo da entrega não pode ser vazio.")
        return valor


class ConteudoGithubOut(BaseModel):
    tipo: Literal["github"] = "github"
    url_repositorio: str
    nome_repositorio: str
    numero_commits: int
    readme: str


class ConteudoDriveOut(BaseModel):
    tipo: Literal["drive"] = "drive"
    url_arquivo: str
    nome_arquivo: str
    texto_extraido: str


class ConteudoTextoOut(BaseModel):
    tipo: Literal["texto"] = "texto"
    conteudo: str


ConteudoEnriquecidoOut = Annotated[
    ConteudoGithubOut | ConteudoDriveOut | ConteudoTextoOut,
    Field(discriminator="tipo"),
]


class EntregaOut(BaseModel):
    id: str
    aluno_id: str
    turma_id: str
    disciplina_id: str
    conteudo_original: str
    tipos_detectados: list[TipoConteudo]
    conteudo_enriquecido: list[ConteudoEnriquecidoOut]
    status: StatusEntrega
    observacao_professor: str | None
    criado_em: datetime


class EntregaUpdate(BaseModel):
    status: StatusEntrega | None = None
    observacao_professor: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def _pelo_menos_um_campo(self) -> "EntregaUpdate":
        if not self.model_fields_set:
            raise ValueError("Informe ao menos um campo para atualizar.")
        return self
