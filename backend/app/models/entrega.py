from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Literal


class StatusEntrega(str, Enum):
    NAO_LIDO = "nao_lido"
    LIDO = "lido"
    CORRIGIDO = "corrigido"
    NAO_CORRIGIDO = "nao_corrigido"


class TipoConteudo(str, Enum):
    GITHUB = "github"
    DRIVE = "drive"
    TEXTO = "texto"


@dataclass(slots=True, frozen=True)
class ConteudoGithub:
    tipo: Literal[TipoConteudo.GITHUB]
    url_repositorio: str
    nome_repositorio: str
    numero_commits: int
    readme: str


@dataclass(slots=True, frozen=True)
class ConteudoDrive:
    tipo: Literal[TipoConteudo.DRIVE]
    url_arquivo: str
    nome_arquivo: str
    texto_extraido: str


@dataclass(slots=True, frozen=True)
class ConteudoTexto:
    tipo: Literal[TipoConteudo.TEXTO]
    conteudo: str


ConteudoEnriquecido = ConteudoGithub | ConteudoDrive | ConteudoTexto


@dataclass(slots=True)
class Entrega:
    id: str
    aluno_id: str
    turma_id: str
    disciplina_id: str
    conteudo_original: str
    tipos_detectados: list[TipoConteudo]
    conteudo_enriquecido: list[ConteudoEnriquecido]
    status: StatusEntrega
    observacao_professor: str | None
    criado_em: datetime
