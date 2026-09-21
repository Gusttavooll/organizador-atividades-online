# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FastAPI backend for "Organizador de Atividades Online": registers
turmas/disciplinas/alunos once, receives student activity submissions via a
webhook (from a Google Apps Script triggered by Google Forms), identifies
the student by e-mail, classifies the submitted content (GitHub repo /
Google Drive doc / free text — a submission can be more than one type),
enriches it, and exposes it to a professor-facing panel for review.

This directory is one half of a monorepo; see the repo root `README.md` and
`CLAUDE.md` for how it fits with `../frontend/`. They only talk over HTTP —
nothing here should assume anything about the frontend's file layout.

## Commands

```bash
python -m venv .venv && .venv\Scripts\Activate.ps1   # Windows: use `py` if `python` opens the Store
pip install -e ".[dev]"
cp .env.example .env      # set at least WEBHOOK_SECRET

uvicorn app.main:app --reload --port 8000   # http://localhost:8000, docs at /docs

pytest                                    # full suite (35 tests)
pytest tests/test_alunos.py               # one file
pytest tests/test_alunos.py::test_criar_e_listar_aluno   # one test
pytest -k "webhook"                       # by keyword

ruff check .                              # lint
ruff check . --fix
mypy app                                  # strict mode, pydantic plugin enabled
```

`asyncio_mode = "auto"` is set in `pyproject.toml` (`[tool.pytest.ini_options]`),
so async test functions run without an `@pytest.mark.asyncio` decorator.

Tests never hit the network or need a real `.env`: `tests/conftest.py`
overrides the repository and enrichment dependencies with in-memory fakes,
and sets a default `WEBHOOK_SECRET` via `os.environ.setdefault(...)` before
`app.main` is imported (see the import-order note below).

## Architecture

Strict one-way dependency flow: `controllers → services → repositories`,
with `models`, `schemas`, and `views` as supporting layers. Don't let a
controller import a repository directly, or a service import a schema —
each layer only talks to the one below it.

- **`models/`** — plain `@dataclass` domain entities (`Turma`, `Disciplina`,
  `Aluno`, `Entrega`), no framework dependency. `Entrega.conteudo_enriquecido`
  is a discriminated union — `ConteudoGithub | ConteudoDrive | ConteudoTexto`
  — keyed by a `tipo: Literal[...]` field on each variant.
- **`schemas/`** — Pydantic v2 request/response models. Every endpoint has
  its own `*Create`/`*Update`/`*Out` model; never accept a raw `dict` body.
  `EntregaOut.conteudo_enriquecido` mirrors the domain union via
  `Annotated[Union[ConteudoGithubOut, ConteudoDriveOut, ConteudoTextoOut], Field(discriminator="tipo")]`.
  `AlunoUpdate` and `EntregaUpdate` use a `model_validator(mode="after")`
  that rejects an empty patch body (checks `self.model_fields_set`).
- **`views/`** — pure functions mapping domain models → response schemas
  (e.g. `views/entrega.py:to_entrega_out`). Controllers call a service, then
  the matching view function; they never build a schema by hand.
- **`repositories/`** — one `Protocol` per resource plus an `InMemory*`
  implementation (e.g. `TurmaRepository` / `InMemoryTurmaRepository`).
  Swapping to Postgres/Supabase later is writing one new class against the
  same `Protocol` and repointing `repositories/deps.py` — services and
  controllers don't change.
- **`services/`**:
  - `classification.py` — `detectar_tipos_e_urls(conteudo)` detects GitHub
    and Drive URLs via regex, strips trailing sentence punctuation the regex
    over-captured, and reports whichever types apply (a submission can be
    `github` + `texto` at once if there's meaningful text alongside a link).
  - `enrichment/github.py` — real GitHub REST API calls (commit count parsed
    from the `Link` response header; README fetched and base64-decoded).
    Network failures are caught and degrade to a placeholder message rather
    than failing the whole submission.
  - `enrichment/drive.py` — **deliberate placeholder**: real Drive text
    extraction needs Google service-account credentials, out of scope for
    this version. Same `Protocol` shape (`EnriquecedorDrive`) as the GitHub
    one, so swapping in a real implementation later doesn't touch callers.
  - `entregas.py` — orchestrates: look up aluno by e-mail → look up
    disciplina → classify → enrich each detected type → persist.
  - `alunos.py` — enforces e-mail uniqueness (both against the repository
    and, at the schema layer, within a single `/alunos/lote` batch) and
    turma existence before create/update.
- **`services/deps.py`** / **`repositories/deps.py`** — all FastAPI DI
  wiring lives here. Repositories and the shared `httpx.AsyncClient` are
  process-wide singletons via `@lru_cache`. Tests override the dependency
  *callables* (`app.dependency_overrides[get_x_repository] = lambda: ...`)
  with one fresh fake instance shared across all requests in that test —
  see `tests/conftest.py`'s `_overrides` fixture. If you add a new
  dependency, wire it here, not inline in a controller.
- **`controllers/`** — one router per resource, tagged accordingly. The
  webhook is its own router (`webhooks.py`, `POST /webhooks/entregas`) kept
  separate from the professor-facing `/entregas` CRUD in `entregas.py`,
  because it has a different auth model (shared-secret header, not a
  future professor session) and a different consumer (Google Apps Script).

### Security building blocks (`core/`)

- `security.py` — `verificar_segredo_webhook` (constant-time comparison of
  `X-Webhook-Secret` against `settings.webhook_secret`) and
  `SecurityHeadersMiddleware` (adds `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy` to every response).
  `get_professor_atual` is an intentional no-op — the professor-panel auth
  extension point, not wired to any route yet.
- `rate_limit.py` — hand-rolled in-memory sliding-window limiter
  (`aplicar_limite_webhook`), not a third-party library. Limits are
  per-client-IP, configured via `WEBHOOK_RATE_LIMIT_MAX` /
  `WEBHOOK_RATE_LIMIT_JANELA_SEGUNDOS`.
- `errors.py` — two domain exceptions with global handlers:
  `RecursoNaoEncontradoError` → 404, `EmailJaCadastradoError` → 409, plus a
  catch-all `Exception` handler returning a generic 500 (never leaks a
  stack trace). Raise these from services; don't raise `HTTPException`
  from inside a service.
- `masking.py` — `mascarar_email` for logging; webhook log lines must mask
  the student e-mail, never log it raw.

### Gotcha: settings are read at import time

`app/main.py` does `settings = get_settings()` at **module import time**,
so anything that imports `app.main` (including pytest collecting
`tests/conftest.py`) requires `WEBHOOK_SECRET` to already be in the
environment. `tests/conftest.py` handles this with
`os.environ.setdefault("WEBHOOK_SECRET", ...)` placed *before* the
`from app.main import app` line — keep that ordering if you touch those
imports, or `pytest` breaks for anyone without a local `.env`.

## API naming note

Endpoints were deliberately renamed from an earlier draft contract: no
`/cadastro/*` verb prefix (REST resources, not actions), and the webhook is
namespaced under `/webhooks/entregas` rather than `/entregas/webhook`. Full
current endpoint list and the `.env` variables are in this folder's
`README.md`.
