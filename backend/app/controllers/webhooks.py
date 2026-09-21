import logging

from fastapi import APIRouter, Depends, status

from app.core.masking import mascarar_email
from app.core.rate_limit import aplicar_limite_webhook
from app.core.security import verificar_segredo_webhook
from app.schemas.entrega import EntregaOut, EntregaWebhookIn
from app.services.deps import get_entrega_service
from app.services.entregas import EntregaService
from app.views.entrega import to_entrega_out

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post(
    "/entregas",
    response_model=EntregaOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verificar_segredo_webhook), Depends(aplicar_limite_webhook)],
)
async def receber_entrega(
    payload: EntregaWebhookIn,
    service: EntregaService = Depends(get_entrega_service),
) -> EntregaOut:
    logger.info(
        "Webhook de entrega recebido para %s (disciplina=%s)",
        mascarar_email(payload.email_aluno),
        payload.disciplina_id,
    )
    entrega = await service.processar_webhook(
        email_aluno=payload.email_aluno,
        disciplina_id=payload.disciplina_id,
        conteudo=payload.conteudo,
    )
    return to_entrega_out(entrega)
