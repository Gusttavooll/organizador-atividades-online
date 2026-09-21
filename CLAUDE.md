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

- `frontend/` — Next.js (App Router), TypeScript strict, Tailwind. See
  `frontend/CLAUDE.md` for architecture, components, and commands.
- `backend/` — FastAPI, Pydantic v2, MVC-ish layering. See
  `backend/CLAUDE.md` for architecture, security, and commands.

Don't duplicate that per-project detail here — this file is only for
context that spans both sides. To run either project, `cd` into it and
follow its own `CLAUDE.md` (or the root `README.md` for a copy-pasteable
two-terminal quick start).

The frontend calls the backend via `NEXT_PUBLIC_API_URL` (frontend env);
the backend allows that origin via `CORS_ORIGINS` (backend env). Neither
side has a build/path dependency on the other.

**Important**: the frontend's `lib/api/*.ts` files currently return mocked
data (not real fetch calls to the backend). They are already shaped to match
the backend's domain 1:1 so that swapping the mock implementation for a real
`fetch` to the FastAPI backend later doesn't require touching components.

## Domain (shared vocabulary — both sides model these the same way)

- **Turma** — a class group. Has many `Disciplina`s and `Aluno`s.
- **Disciplina** — one subject within a turma, one responsible professor.
- **Aluno** — registered **once per turma** (nome + email), independently of
  any submission. Bulk import exists (`POST /alunos/lote`) for onboarding a
  whole roster at once.
- **Entrega** — one student's submission for a disciplina. Can carry more
  than one detected content type at once (e.g. a GitHub link *and*
  free-text explanation in the same submission).

## Why student identification is by e-mail, not manual selection

The webhook payload only carries `email_aluno` + `disciplina_id` +
`conteudo` — never `aluno_id`/`turma_id` directly (see
`backend/app/services/entregas.py:processar_webhook`). The backend resolves
the student — and therefore their turma — by matching that e-mail against
the roster registered once via `/alunos`. This is deliberate: the professor
registers students once per turma, and from then on every submission is
attributed automatically. **Nobody manually filters submissions by
student.** If you touch this flow, preserve that property — don't add a
path where the professor (or the Apps Script) has to specify
turma_id/aluno_id by hand.

## How a submission actually reaches this repo

This repo does **not** contain the Google Apps Script that fires the
webhook — it lives inside each disciplina's Google Form (Extensions →
Apps Script), one script per disciplina, hardcoding that disciplina's id
and the backend's `/webhooks/entregas` URL + `WEBHOOK_SECRET`. If a
submission isn't showing up, the Apps Script config is the first place to
check (outside this repo), not the backend code.
