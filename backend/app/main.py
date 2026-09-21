from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import alunos, disciplinas, entregas, turmas, webhooks
from app.core.config import get_settings
from app.core.errors import registrar_exception_handlers
from app.core.logging_config import configurar_logging
from app.core.security import SecurityHeadersMiddleware
from app.services.deps import get_http_client

settings = get_settings()
configurar_logging(settings.log_level)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await get_http_client().aclose()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "X-Webhook-Secret"],
)

registrar_exception_handlers(app)

app.include_router(turmas.router)
app.include_router(disciplinas.router)
app.include_router(alunos.router)
app.include_router(entregas.router)
app.include_router(webhooks.router)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
