# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Organizador de Atividades Online" — a system that ingests student activity
submissions (via Google Forms → Google Apps Script webhook), classifies the
content (GitHub repo / Google Drive doc / free text), enriches it (commit
count + README for GitHub, extracted text for Drive), and gives the
professor a panel to review and correct submissions while always preserving
the original content.

This is a monorepo with two independent projects that only communicate over
HTTP:

- `frontend/` — Next.js (App Router), TypeScript strict, Tailwind.
- `backend/` — FastAPI, Pydantic v2, MVC-ish layering.

The frontend calls the backend via `NEXT_PUBLIC_API_URL` (frontend env);
the backend allows that origin via `CORS_ORIGINS` (backend env). Neither
side has a build/path dependency on the other.

**Important**: the frontend's `lib/api/*.ts` files currently return mocked
data (not real fetch calls to the backend). They are already shaped to match
the backend's domain 1:1 so that swapping the mock implementation for a real
`fetch` to the FastAPI backend later doesn't require touching components.

## Commands

### Frontend (`frontend/`)

```bash
npm install
npm run dev          # dev server on :3000
npm run build        # production build (also runs a type/lint pass)
npm run lint         # eslint .
npm run format       # prettier --write .
npx tsc --noEmit     # standalone type-check
```

There is no automated test suite in `frontend/` yet (no jest/vitest
configured) — verification today is `tsc` + `eslint` + `next build`, and
manual/Playwright-driven smoke checks when UI behavior needs confirming.

### Backend (`backend/`)

```bash
cd backend
python -m venv .venv && .venv\Scripts\Activate.ps1   # Windows: use `py` if `python` opens the Store
pip install -e ".[dev]"
cp .env.example .env      # set at least WEBHOOK_SECRET

uvicorn app.main:app --reload --port 8000

pytest                                   # full suite
pytest tests/test_alunos.py              # one file
pytest tests/test_alunos.py::test_criar_e_listar_aluno   # one test
ruff check .
ruff check . --fix
mypy app
```

`asyncio_mode = "auto"` is set in `pyproject.toml`, so async test functions
don't need an `@pytest.mark.asyncio` decorator.

## Architecture

### Backend layering (`backend/app/`)

Strict one-way dependency flow: `controllers → services → repositories`,
with `models`, `schemas`, and `views` as supporting layers.

- `models/` — plain `@dataclass` domain entities (`Turma`, `Disciplina`,
  `Aluno`, `Entrega`), framework-agnostic. `Entrega.conteudo_enriquecido` is
  a discriminated union (`ConteudoGithub | ConteudoDrive | ConteudoTexto`)
  keyed by a `tipo` literal field.
- `schemas/` — Pydantic v2 request/response models. Never pass raw `dict`
  bodies. The `EntregaOut.conteudo_enriquecido` schema mirrors the domain
  union via `Annotated[Union[...], Field(discriminator="tipo")]`.
- `views/` — pure functions mapping domain models → response schemas (e.g.
  `views/entrega.py:to_entrega_out`). Controllers call a service, then a
  view function; they never build schemas by hand.
- `repositories/` — one `Protocol` per resource plus an `InMemory*`
  implementation (e.g. `TurmaRepository` / `InMemoryTurmaRepository`).
  Swapping to Postgres/Supabase later means writing a new class against the
  same `Protocol` and pointing `repositories/deps.py` at it — services and
  controllers don't change.
- `services/` — business logic and orchestration. `services/classification.py`
  detects one-or-more content types per submission via regex
  (`detectar_tipos_e_urls`); `services/entregas.py` orchestrates
  classification + enrichment + persistence for the webhook flow.
  `services/enrichment/github.py` calls the real GitHub REST API (commit
  count via the `Link` header, README via base64 decode);
  `services/enrichment/drive.py` is a deliberate placeholder (real Drive
  text extraction needs service-account credentials, out of scope) —
  same `Protocol` shape, ready to swap in.
- `services/deps.py` and `repositories/deps.py` — all FastAPI DI wiring.
  Repositories and the shared `httpx.AsyncClient` are process-wide
  singletons via `@lru_cache`. Tests override these dependency callables
  (`app.dependency_overrides[...]`) with fresh fakes per test — see
  `tests/conftest.py`'s `_overrides` fixture. Don't create new repository
  instances ad hoc inside a request path; always resolve them through
  `Depends(get_*_repository)`.
- `controllers/` — one router per resource. The webhook lives in its own
  `webhooks.py` router (`POST /webhooks/entregas`, not grouped with the
  professor-facing `/entregas` CRUD), because it has a different auth model
  (shared-secret header) and a different consumer (Google Apps Script, not
  the panel).

**Gotcha**: `app/main.py` calls `get_settings()` at *module import time*
(`settings = get_settings()`), so importing `app.main` requires
`WEBHOOK_SECRET` to already be set in the environment. `tests/conftest.py`
sets a default via `os.environ.setdefault(...)` *before* importing
`app.main` — keep that ordering if you touch conftest imports.

**Security building blocks** (`core/`): `core/security.py` has the webhook
shared-secret dependency (`verificar_segredo_webhook`, constant-time
compare) and a security-headers middleware; `core/rate_limit.py` is a
hand-rolled in-memory sliding-window limiter (`aplicar_limite_webhook`) —
no third-party rate-limit library. `core/errors.py` maps two domain
exceptions (`RecursoNaoEncontradoError` → 404, `EmailJaCadastradoError` →
409) plus a catch-all handler that never leaks internals. Auth for the
professor panel is *not* implemented — `core/security.py:get_professor_atual`
is an intentional no-op extension point.

### API naming note

Endpoints were deliberately renamed from an earlier draft contract: no
`/cadastro/*` prefix (REST resources, not verb prefixes), and the webhook is
`POST /webhooks/entregas` (its own namespace, not `/entregas/webhook`),
because it has a different auth/consumer than the rest of the API. See
`backend/README.md` for the full current endpoint list.

### Frontend structure (`frontend/`)

- `app/(public)/` — the `"/"` landing page (route group, doesn't affect the
  URL). `app/painel/` — the professor panel (`/painel` entregas list,
  `/painel/alunos` student management), wrapped by `components/auth/AuthGuard`
  (currently a no-op passthrough — auth isn't implemented on this side
  either; `context/AuthContext.tsx` is the matching unused-but-ready
  context).
- Server Components by default; `'use client'` only where there's real
  interactivity (`PainelClient`, `FiltroPainel`, `AlunosListaClient`,
  `AlunoLinha`, `EntregaDetalheModal`, `useEntregas`, `AuthContext`).
- `lib/api/*.ts` — one file per resource (`entregas.ts`, `alunos.ts`,
  `turmas.ts`, `disciplinas.ts`), each exporting async functions
  (`listarEntregas`, `atualizarEntrega`, etc.) that currently resolve
  against an in-module mock array with a simulated delay. `types/*.ts`
  mirror the backend's domain fields (snake_case backend ↔ camelCase
  frontend is the expected translation at integration time — nothing
  auto-converts this today).
- `lib/validations/*.ts` — Zod schemas shared by client-side forms
  (`FiltroPainel`, `AlunoFormulario`, `AlunoLinha`'s inline edit,
  `EntregaDetalheModal`).
- Tailwind tokens (colors, not raw hex) are defined in `tailwind.config.ts`
  under `background`, `foreground`, `accent`, `border`, `status.*` — reuse
  these tokens rather than hardcoding hex values.

**Gotchas already hit once, don't reintroduce them:**
- `next.config.ts`'s CSP only allows `'unsafe-eval'` when
  `NODE_ENV !== "production"`. Next.js dev mode (Fast Refresh) needs `eval`;
  without this, buttons/forms silently break in dev (partial hydration)
  while looking fine in a prod build.
- `app/layout.tsx`'s `<html>` has `suppressHydrationWarning` — some browser
  extensions inject `data-*` attributes into `<html>` before hydration,
  causing false-positive hydration-mismatch errors otherwise.
- `eslint.config.mjs` explicitly ignores `.next/**` — without that, lint
  picks up Next's generated route-type files and fails on rules meant for
  application code.
