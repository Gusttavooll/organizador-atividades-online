---
name: painel-professor-ui
description: Use ao criar, estilizar ou revisar telas do painel do professor e da landing page do Organizador de Atividades Online (Next.js + Tailwind), como listas de entregas, filtros, tela de correção e cadastro de alunos. Acione com pedidos como "painel", "entrega", "tela", "componente", "filtro", "correção" ou "revisar UI".
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Painel do professor — UI

Orienta a construção e a revisão da interface em `frontend/` usando o
sistema visual que o projeto já tem (tema escuro com acento roxo, tokens
Tailwind, primitivos em `components/ui/`).

## Quando usar

- Criar ou alterar telas em `frontend/app/painel/` ou `frontend/app/(public)/`.
- Criar componentes em `frontend/components/` (entregas, alunos, layout, ui).
- Revisar uma tela ou um diff de frontend quanto a visual, consistência e acessibilidade.

## Quando NÃO usar

- Lógica de backend, webhook, enriquecimento ou API (`backend/`).
- Mudanças só de dados ou tipos em `lib/api/`, `types/` ou `lib/validations/`
  que não alteram nada visível.
- Telas de outros projetos: os tokens e regras daqui são específicos deste repositório.

## Regra inegociável do projeto

O conteúdo original enviado pelo aluno (`entrega.conteudoOriginal`) nunca é
alterado, reescrito, truncado ou escondido na interface. Ele aparece por
inteiro, com `whitespace-pre-wrap`, na seção "Conteúdo original" do
`EntregaDetalheModal`, separado do conteúdo enriquecido e da observação do
professor. A única prévia encurtada permitida é a do `EntregaCard`
(`line-clamp-2`), que abre o texto completo ao clicar. Não adicione outro
corte, "ver mais" que oculte trechos, sanitização que remova texto ou
campo que edite esse valor.

## Fluxo de trabalho

1. **Levantar o que já existe.** Leia `frontend/tailwind.config.ts`,
   `frontend/components/ui/` e `frontend/lib/utils/status.ts`. Procure um
   componente parecido antes de criar um novo. Para tokens, escalas e
   padrões de componentes, leia [reference.md](reference.md).
2. **Montar a estrutura semântica.** Defina a árvore de componentes e o HTML
   (`main`, `section`, `h1`→`h3`, `form` + `label htmlFor`, `button`) antes
   de qualquer classe. Página é Server Component; `'use client'` só no
   componente que tem interação.
3. **Aplicar estilo com tokens.** Use apenas as cores do tema
   (`bg-background-surface`, `text-foreground-muted`, `border-border`,
   `bg-accent`, `bg-status-*`), os primitivos `Button`/`Card`/`Badge` e as
   escalas de [reference.md](reference.md). Status e tipos vêm sempre de
   `getStatusMeta` e `getTipoLabel`.
4. **Cobrir os estados.** Carregando (skeleton `animate-pulse`), erro,
   vazio e lista com dados, além de hover, foco e desabilitado.
5. **Validar antes de concluir.** Percorra [checklist-a11y.md](checklist-a11y.md)
   item por item. Numa revisão, aponte problemas organizados pelas seções
   do checklist, com arquivo e linha.

## Arquivos de apoio

- [reference.md](reference.md): paleta e tokens reais, escalas de tipografia
  e espaçamento, padrões de componentes do painel e o que evitar.
- [checklist-a11y.md](checklist-a11y.md): checklist de hierarquia,
  consistência, responsividade, contraste WCAG AA, foco, alvos de toque,
  HTML semântico e tema.
