from app.models.entrega import (
    ConteudoDrive,
    ConteudoEnriquecido,
    ConteudoGithub,
    ConteudoTexto,
    Entrega,
)
from app.schemas.entrega import (
    ConteudoDriveOut,
    ConteudoEnriquecidoOut,
    ConteudoGithubOut,
    ConteudoTextoOut,
    EntregaOut,
)


def _to_conteudo_out(item: ConteudoEnriquecido) -> ConteudoEnriquecidoOut:
    if isinstance(item, ConteudoGithub):
        return ConteudoGithubOut(
            url_repositorio=item.url_repositorio,
            nome_repositorio=item.nome_repositorio,
            numero_commits=item.numero_commits,
            readme=item.readme,
        )
    if isinstance(item, ConteudoDrive):
        return ConteudoDriveOut(
            url_arquivo=item.url_arquivo,
            nome_arquivo=item.nome_arquivo,
            texto_extraido=item.texto_extraido,
        )
    if isinstance(item, ConteudoTexto):
        return ConteudoTextoOut(conteudo=item.conteudo)
    raise TypeError(f"Tipo de conteúdo enriquecido desconhecido: {item!r}")


def to_entrega_out(entrega: Entrega) -> EntregaOut:
    return EntregaOut(
        id=entrega.id,
        aluno_id=entrega.aluno_id,
        turma_id=entrega.turma_id,
        disciplina_id=entrega.disciplina_id,
        conteudo_original=entrega.conteudo_original,
        tipos_detectados=entrega.tipos_detectados,
        conteudo_enriquecido=[_to_conteudo_out(item) for item in entrega.conteudo_enriquecido],
        status=entrega.status,
        observacao_professor=entrega.observacao_professor,
        criado_em=entrega.criado_em,
    )
