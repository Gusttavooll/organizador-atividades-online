import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class DominioError(Exception):
    """Erro base para violações de regras de negócio."""


class RecursoNaoEncontradoError(DominioError):
    """Levantado quando um recurso referenciado por id não existe."""


class EmailJaCadastradoError(DominioError):
    """Levantado ao tentar cadastrar um e-mail de aluno já existente."""


def registrar_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RecursoNaoEncontradoError)
    async def _recurso_nao_encontrado(_: Request, exc: RecursoNaoEncontradoError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(EmailJaCadastradoError)
    async def _email_duplicado(_: Request, exc: EmailJaCadastradoError) -> JSONResponse:
        return JSONResponse(status_code=409, content={"detail": str(exc)})

    @app.exception_handler(Exception)
    async def _erro_interno(request: Request, exc: Exception) -> JSONResponse:
        logger.exception(
            "Erro não tratado em %s %s", request.method, request.url.path, exc_info=exc
        )
        return JSONResponse(status_code=500, content={"detail": "Erro interno no servidor."})
