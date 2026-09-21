import secrets
from collections.abc import Awaitable, Callable

from fastapi import Depends, Header, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.config import Settings, get_settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adiciona headers de segurança básicos a toda resposta da API."""

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response


async def verificar_segredo_webhook(
    x_webhook_secret: str = Header(..., alias="X-Webhook-Secret"),
    settings: Settings = Depends(get_settings),
) -> None:
    """Exige o header `X-Webhook-Secret` com o valor configurado em `WEBHOOK_SECRET`."""
    if not secrets.compare_digest(x_webhook_secret, settings.webhook_secret):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Segredo de webhook inválido.",
        )


async def get_professor_atual() -> None:
    """
    Ponto de extensão para autenticação do professor no painel.

    Hoje não valida nada — quando a autenticação real existir (ex.: sessão/JWT
    emitido no login), este dependency deve validar as credenciais e retornar
    o professor autenticado, e passar a ser exigido nos routers de cadastro e
    de entregas via `Depends(get_professor_atual)`.
    """
    return None
