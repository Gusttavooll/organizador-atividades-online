# Organizador de Atividades Online — Backend

API em FastAPI para o cadastro de turmas/disciplinas/alunos e para o
recebimento, classificação, enriquecimento e correção das entregas dos
alunos.

## Arquitetura

```
app/
├── main.py            # instancia o FastAPI, CORS, middlewares, exception handlers
├── core/               # configuração, segurança, logging, rate limiting, erros de domínio
├── models/             # entidades de domínio (dataclasses), sem dependência de framework
├── schemas/             # Pydantic v2 — validação de entrada e formato de saída da API
├── views/              # mapeamento entre models de domínio e schemas de resposta
├── controllers/         # routers do FastAPI (um por recurso)
├── services/            # regras de negócio: classificação, enriquecimento, orquestração
└── repositories/        # persistência — Protocol + implementação em memória hoje
```

A camada `repositories/` define um `Protocol` por recurso e uma
implementação em memória (`InMemory*Repository`). Trocar por Supabase/Postgres
no futuro significa escrever uma nova classe que implemente o mesmo
`Protocol` e apontar `app/repositories/deps.py` para ela — services e
controllers não mudam.

## Rodando localmente

Requer Python 3.12+.

```bash
cd backend
python -m venv .venv
# Windows: se "python"/"pip" abrirem a Microsoft Store em vez de rodar,
# use o launcher `py` no lugar de `python` (ex.: `py -m venv .venv`).

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# Linux/macOS
source .venv/bin/activate

pip install -e ".[dev]"

cp .env.example .env
# edite .env e defina pelo menos WEBHOOK_SECRET com um valor forte
```

Variáveis de ambiente (ver `.env.example`):

| Variável | Obrigatória | Descrição |
|---|---|---|
| `WEBHOOK_SECRET` | sim | Segredo exigido no header `X-Webhook-Secret` do endpoint `/webhooks/entregas`. |
| `CORS_ORIGINS` | não (padrão `http://localhost:3000`) | Origens do frontend permitidas, separadas por vírgula. |
| `WEBHOOK_RATE_LIMIT_MAX` / `WEBHOOK_RATE_LIMIT_JANELA_SEGUNDOS` | não | Limite de requisições ao webhook por IP na janela configurada. |
| `GITHUB_API_TOKEN` | não | Aumenta o limite de requisições à API do GitHub ao enriquecer entregas. |
| `LOG_LEVEL` | não (padrão `INFO`) | Nível de log. |

Subir o servidor:

```bash
uvicorn app.main:app --reload --port 8000
```

A API fica disponível em `http://localhost:8000`, e a documentação
interativa (Swagger) em `http://localhost:8000/docs`.

## Rodando os testes

```bash
pytest
```

Os testes usam `httpx.AsyncClient` contra a aplicação em memória (via
`ASGITransport`), com os repositórios e os enriquecedores de GitHub/Drive
substituídos por dependências fake — não fazem chamadas de rede reais nem
exigem um `.env` configurado (o segredo de webhook de teste é definido em
`tests/conftest.py`).

## Lint e tipagem

```bash
ruff check .
mypy app
```

## Endpoints

Ver o changelog no README principal do projeto para o histórico de decisões
de nomeação. Resumo da API atual:

- `POST /turmas`, `GET /turmas`
- `POST /disciplinas`, `GET /disciplinas?turma_id=`
- `POST /alunos`, `POST /alunos/lote`, `GET /alunos?turma_id=`,
  `PATCH /alunos/{id}`, `DELETE /alunos/{id}`
- `POST /webhooks/entregas` (requer header `X-Webhook-Secret`)
- `GET /entregas?turma_id=&disciplina_id=&aluno_id=&status=`,
  `GET /entregas/{id}`, `PATCH /entregas/{id}`
- `GET /health`

## Limitações conhecidas desta versão

- Persistência em memória: os dados são perdidos ao reiniciar o processo.
- Enriquecimento do Google Drive é um placeholder (extração real de texto
  exige credenciais da Drive API, fora do escopo desta versão) —
  `app/services/enrichment/drive.py` documenta o ponto de extensão.
- Autenticação do professor no painel ainda não é aplicada
  (`app/core/security.py:get_professor_atual` é o ponto de extensão pronto).
