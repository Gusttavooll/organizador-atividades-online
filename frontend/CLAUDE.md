# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js (App Router) frontend for "Organizador de Atividades Online": a
landing page and a professor-facing panel for reviewing student activity
submissions (entregas) — filtering by turma/disciplina/status, viewing
enriched content (GitHub/Drive/text) in a modal, updating status/observação,
and managing the roster of alunos (create/edit/delete, assign turma, add an
observação).

This directory is one half of a monorepo; see the repo root `README.md` and
`CLAUDE.md` for how it fits with `../backend/`. They only talk over HTTP.

**Important**: `lib/api/*.ts` currently returns mocked, in-memory data (with
a simulated delay), not real requests to the backend. The functions are
already shaped to match the backend's domain 1:1 (see `types/*.ts`) so that
swapping the mock body for a real `fetch(process.env.NEXT_PUBLIC_API_URL + ...)`
later shouldn't require touching any component.

## Commands

```bash
npm install
npm run dev          # dev server on :3000
npm run build        # production build (also type-checks and lints)
npm run lint         # eslint .
npm run format       # prettier --write .
npx tsc --noEmit     # standalone type-check
```

There is no automated test suite here yet (no jest/vitest configured).
Verification today is `tsc` + `eslint` + `next build`, plus manual or
Playwright-driven smoke checks in a real browser when UI behavior needs
confirming (dev-server interactivity bugs, in particular, don't show up in
a static build or in `tsc`/`eslint`).

## Architecture

- **`app/(public)/`** — the `"/"` landing page. It's a route group (the
  parens don't affect the URL) so it can have its own layout (`Header` +
  icon `Sidebar` + `Footer`) distinct from the panel.
- **`app/painel/`** — the professor panel: `/painel` (entregas list) and
  `/painel/alunos` (student roster). Wrapped in `components/auth/AuthGuard`,
  which is currently a no-op passthrough — auth isn't implemented yet.
  `context/AuthContext.tsx` is the matching context, defined but unused,
  ready for when real login exists.
- **Server Components by default.** `'use client'` is only on components
  with real interactivity: `PainelClient`, `FiltroPainel`,
  `EntregaDetalheModal`, `AlunosListaClient`, `AlunoFormulario`,
  `AlunoLinha`, the `useEntregas` hook, and `AuthContext`. Page components
  (`app/painel/page.tsx`, `app/painel/alunos/page.tsx`) are `async` Server
  Components that fetch initial data and hand it to a client component as
  props — don't add `'use client'` to a page just to use a hook one of its
  children needs.
- **`lib/api/`** — one file per resource (`entregas.ts`, `alunos.ts`,
  `turmas.ts`, `disciplinas.ts`), each exporting async functions
  (`listarEntregas`, `criarAluno`, `atualizarEntrega`, etc.) over an
  in-module mock array. `lib/api/client.ts`'s `apiRequest` fetch wrapper
  exists for when the mocks are swapped for real calls, but nothing calls
  it yet.
- **`lib/validations/`** — Zod schemas shared by the client-side forms
  (`FiltroPainel`, `AlunoFormulario`, `AlunoLinha`'s inline edit form,
  `EntregaDetalheModal`'s status/observação form).
- **`lib/utils/status.ts`** — the single source of truth for status/tipo
  label text and status→color mapping (`getStatusMeta`, `getTipoLabel`,
  `STATUS_OPTIONS`). Add new status/tipo display logic here, not inline in
  components.
- **`types/*.ts`** mirror the backend's domain fields. The backend uses
  snake_case, these use camelCase — that translation is manual today
  (nothing auto-converts), so keep field names 1:1 in spirit
  (`turmaId` ↔ `turma_id`, etc.) when either side changes.
- **Tailwind tokens** (not raw hex) are defined in `tailwind.config.ts`:
  `background` (+ `.surface`/`.elevated`), `foreground` (+ `.muted`),
  `accent` (+ `.strong`/`.soft`), `border`, `status.*`. Reuse these instead
  of hardcoding colors — they're what keeps the dark, purple-accented
  palette consistent and WCAG-AA-contrast-checked.

## Gotchas already hit once — don't reintroduce them

- **`next.config.ts`'s CSP** only allows `'unsafe-eval'` when
  `NODE_ENV !== "production"`. Next dev mode (Fast Refresh) needs `eval`;
  without the dev-only exception, buttons/forms silently misbehave in `npm
  run dev` (partial hydration) while a production build looks fine —
  a very confusing symptom if you don't know to check the CSP.
- **`app/layout.tsx`'s `<html>`** has `suppressHydrationWarning`. Some
  browser extensions inject `data-*` attributes into `<html>` before React
  hydrates, producing a false-positive hydration-mismatch error otherwise.
- **`eslint.config.mjs`** explicitly `ignores: [".next/**", ...]`. Without
  it, lint picks up Next's generated route-type files
  (`.next/types/**`) and fails on rules meant for application code, not
  generated output.
- Entrega cards (`EntregaCard`) are clickable via an `onClick` prop with
  `role="button"`/`tabIndex`/`onKeyDown` for Enter/Space — when adding new
  clickable-but-not-a-real-`<button>` elements, follow that same pattern
  rather than a bare `onClick` on a `div`.
