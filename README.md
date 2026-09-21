# Organizador de Atividades Online

Sistema para captura, classificação e enriquecimento automático de entregas
de atividades enviadas por alunos via Google Forms, com um painel para o
professor acompanhar e corrigir tudo em um só lugar — sempre preservando o
conteúdo original enviado.

## Estrutura do repositório

```
frontend/   Next.js (App Router) — landing page e painel do professor
backend/    FastAPI — cadastro, webhook de entregas, enriquecimento e API do painel
```

Cada pasta é independente (dependências, testes e configuração próprios) e
se comunica só por HTTP: o frontend chama a API do backend através da
variável `NEXT_PUBLIC_API_URL` (ver `frontend/.env.local.example`), e o
backend libera essa origem via `CORS_ORIGINS` (ver `backend/.env.example`).

## Como rodar

Veja o README de cada pasta para instruções completas:

- [`frontend/`](frontend) — Next.js, Tailwind, TypeScript.
- [`backend/`](backend) — FastAPI, Pydantic v2, pytest.

Resumo rápido, em dois terminais separados:

```bash
# terminal 1 — backend
cd backend
python -m venv .venv && .venv\Scripts\Activate.ps1   # ou source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env   # defina WEBHOOK_SECRET
uvicorn app.main:app --reload --port 8000

# terminal 2 — frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend em `http://localhost:3000`, API em `http://localhost:8000`
(documentação interativa em `http://localhost:8000/docs`).
