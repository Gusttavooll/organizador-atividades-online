import re

from app.models.entrega import ConteudoDrive, TipoConteudo

_FILE_ID_RE = re.compile(r"/d/([a-zA-Z0-9_-]+)")


class DriveEnriquecedor:
    """
    Extração real de texto de um arquivo do Google Drive exige a Drive API
    com credenciais de serviço, fora do escopo desta versão. Este
    enriquecedor devolve um placeholder claro, mantendo o ponto de extensão
    pronto: basta substituir `enriquecer` por uma implementação que chame a
    Drive API (mesma assinatura, mesmo tipo de retorno).
    """

    async def enriquecer(self, url_arquivo: str) -> ConteudoDrive:
        match = _FILE_ID_RE.search(url_arquivo)
        identificador = match.group(1) if match else url_arquivo

        return ConteudoDrive(
            tipo=TipoConteudo.DRIVE,
            url_arquivo=url_arquivo,
            nome_arquivo=f"Arquivo do Drive ({identificador})",
            texto_extraido=(
                "Extração de texto do Google Drive ainda não configurada. "
                "Configure credenciais da Google Drive API para habilitar esta função."
            ),
        )
