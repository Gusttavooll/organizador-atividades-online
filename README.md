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

## Skill Claude

O repositório inclui uma skill própria do Claude Code,
[`painel-professor-ui`](.claude/skills/painel-professor-ui), que orienta a
criação e a revisão das telas do painel do professor e da landing page
usando os tokens, componentes e regras de acessibilidade do projeto, e
garante que o conteúdo original enviado pelo aluno nunca seja alterado ou
escondido na interface.

Ela é carregada automaticamente ao abrir o Claude Code neste repositório e
pode ser chamada com `/painel-professor-ui`. Veja o
[README da skill](.claude/skills/painel-professor-ui/README.md) para
instalação em outros projetos e exemplos de uso.
