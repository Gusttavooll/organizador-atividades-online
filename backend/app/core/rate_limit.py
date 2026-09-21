import time
from collections import defaultdict, deque

from fastapi import Depends, HTTPException, Request, status

from app.core.config import Settings, get_settings


class RateLimiter:
    """Limitador de taxa em memória, por chave (ex.: IP), com janela deslizante."""

    def __init__(self) -> None:
        self._acessos: dict[str, deque[float]] = defaultdict(deque)

    def permitir(self, chave: str, limite: int, janela_segundos: float) -> bool:
        agora = time.monotonic()
        historico = self._acessos[chave]

        while historico and agora - historico[0] > janela_segundos:
            historico.popleft()

        if len(historico) >= limite:
            return False

        historico.append(agora)
        return True


_rate_limiter_global = RateLimiter()


def get_rate_limiter() -> RateLimiter:
    return _rate_limiter_global


async def aplicar_limite_webhook(
    request: Request,
    settings: Settings = Depends(get_settings),
    limiter: RateLimiter = Depends(get_rate_limiter),
) -> None:
    chave = request.client.host if request.client else "desconhecido"
    permitido = limiter.permitir(
        chave=chave,
        limite=settings.webhook_rate_limit_max,
        janela_segundos=settings.webhook_rate_limit_janela_segundos,
    )
    if not permitido:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Limite de requisições excedido. Tente novamente mais tarde.",
        )
