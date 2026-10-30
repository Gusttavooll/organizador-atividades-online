# Referência visual — Organizador de Atividades Online

Valores extraídos do código atual de `frontend/`. Se este arquivo e o código
divergirem, o código (`tailwind.config.ts`, `components/ui/`) é a fonte da
verdade: atualize este arquivo junto.

## 1. Paleta e tokens

Definidos em `frontend/tailwind.config.ts` (`theme.extend.colors`). O projeto
tem um tema único, escuro. Nunca use hex direto nos componentes.

| Token Tailwind                | Hex       | Uso                                             |
| ----------------------------- | --------- | ----------------------------------------------- |
| `bg-background`               | `#0A0A0A` | Fundo da página (`body`, em `globals.css`)      |
| `bg-background-surface`       | `#121212` | Cards, modal, selects do filtro, estados vazios |
| `bg-background-elevated`      | `#18181B` | Blocos dentro de um card/modal, inputs, pílulas |
| `text-foreground`             | `#F5F5F5` | Títulos, nomes, texto principal                 |
| `text-foreground-muted`       | `#A1A1AA` | Texto secundário, datas, labels, descrições     |
| `bg-accent`                   | `#7C3AED` | Botão primário, logotipo "OA"                   |
| `accent-strong`               | `#6D28D9` | Reservado para ênfase do acento                 |
| `accent-soft`                 | `#A78BFA` | Hover, anel de foco, texto de pílula de tipo    |
| `border-border`               | `#27272A` | Todas as bordas                                 |
| `bg-status-nao-lido`          | `#3B82F6` | Status "Não lido"                               |
| `bg-status-lido`              | `#EAB308` | Status "Lido"                                   |
| `bg-status-corrigido`         | `#22C55E` | Status "Corrigido"                              |
| `bg-status-nao-corrigido`     | `#EF4444` | Status "Não corrigido"; também texto de erro    |

Outros usos de cor que já existem: `bg-accent/30` na seleção de texto,
`bg-black/70` no overlay do modal, `bg-background/80 backdrop-blur` no
header fixo, `border-status-nao-corrigido/40` no bloco de erro e
`border-accent-soft/40` na linha de aluno em edição.

### Contrastes medidos (WCAG 2.1)

| Combinação                                   | Razão   | Uso permitido                       |
| -------------------------------------------- | ------- | ----------------------------------- |
| `foreground` sobre `background`/`surface`    | 18.2 / 17.2 | Qualquer texto                  |
| `foreground-muted` sobre `surface`/`elevated`| 7.3 / 6.9   | Qualquer texto                  |
| branco sobre `accent`                        | 5.7     | Texto de botão primário             |
| `background` sobre `accent-soft`             | 7.3     | Texto do botão primário em hover    |
| `accent-soft` sobre `surface`/`elevated`     | 6.9 / 6.5   | Texto pequeno, anel de foco     |
| `status-nao-corrigido` sobre `surface`/`elevated` | 5.0 / 4.7 | Mensagem de erro em `text-sm` |
| `accent` sobre `surface`                     | 3.3     | Só texto grande (≥ 24px ou 18.7px bold) ou ícone |
| `border` sobre `surface`                     | 1.3     | Só borda decorativa, nunca o único limite de um controle |

## 2. Tipografia

Fonte: Inter via `next/font/google` (`--font-inter`), aplicada por
`font-sans antialiased` no `<body>`. Idioma `pt-BR`.

| Papel                       | Classes                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| Hero da landing (h1)        | `text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`        |
| Título de página do painel  | `text-3xl font-extrabold tracking-tight text-foreground`                |
| Título do modal (h2)        | `text-xl font-bold text-foreground`                                     |
| Subtítulo da landing        | `text-lg text-foreground-muted`                                         |
| Título de card (h2/h3)      | `font-semibold text-foreground` (tamanho base)                          |
| Título de seção no modal    | `text-sm font-semibold text-foreground`                                 |
| Corpo, datas, labels        | `text-sm text-foreground-muted`                                         |
| Pílulas, badges, erro de campo | `text-xs font-medium`                                                |

Escala em uso: `text-xs`, `text-sm`, base, `text-lg`, `text-xl`, `text-3xl`
e, só na landing, `text-4xl` a `text-6xl`. Não introduza `text-2xl` ou
tamanhos arbitrários (`text-[15px]`) sem motivo.

## 3. Espaçamento e forma

Base de 4px (escala padrão do Tailwind).

- **Entre blocos da página**: `gap-8` (cabeçalho → filtros → grid).
- **Entre cards e campos**: `gap-4`; dentro de grupos pequenos `gap-2`/`gap-3`.
- **Padding de card e modal**: `p-6`. Estado vazio `p-12`, erro `p-8`.
  Blocos internos `p-4` (`p-3` na observação do card).
- **Label → campo**: `mb-1.5`. Erro de campo: `mt-1`.
- **Container**: `mx-auto max-w-content px-6` (1200px). O painel usa
  `pt-28 pb-16` para compensar o header fixo de `h-16`.
- **Raios**: `rounded-xl` em cards, modal e blocos de estado; `rounded-lg`
  em botões, inputs e blocos internos; `rounded-full` em pílulas e badges.
- **Sombras**: `shadow-sm` no `Card`, `shadow-xl` só no modal. Nada além.

## 4. Padrões de componentes do painel

- **Botões**: sempre `Button` ou `LinkButton` de `components/ui/Button.tsx`.
  `primary` para a ação principal (uma por tela ou seção), `secondary` para
  navegação/ação alternativa, `ghost` para cancelar ou excluir. Estados de
  carregamento trocam o texto (por exemplo "Salvar" → "Salvando") e usam
  `disabled`.
- **Card**: `Card` de `components/ui/Card.tsx`
  (`rounded-xl border border-border bg-background-surface p-6 shadow-sm`).
- **Status**: `StatusTag` → `Badge` com bolinha colorida `aria-hidden` e o
  rótulo em texto. Rótulos e cores vêm de `getStatusMeta`; a lista de opções
  de `STATUS_OPTIONS`.
- **Tipo de conteúdo**: pílula
  `rounded-full bg-background-elevated px-3 py-1 text-xs font-medium text-accent-soft`
  com texto de `getTipoLabel` ("GitHub", "Documento/PDF", "Texto livre").
- **Card clicável**: `role="button"`, `tabIndex={0}`, `onKeyDown` tratando
  Enter e Espaço, `hover:border-accent-soft` e anel de foco (ver `EntregaCard`).
- **Campos de formulário** (select, input, textarea):
  `w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent-soft focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft`
  (nos filtros, `bg-background-surface`). Label:
  `mb-1.5 block text-sm text-foreground-muted` com `htmlFor`.
- **Filtros**: `form` com `aria-label`, grid `grid-cols-1 sm:grid-cols-3`,
  primeira opção "Todas/Todos" com valor vazio, validação por Zod
  (`lib/validations/filtro.ts`).
- **Lista de entregas**: grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.
- **Estados**: carregando com 6 skeletons
  `h-44 animate-pulse rounded-xl border border-border bg-background-surface`
  e `aria-busy`; vazio com título `font-semibold` e dica `text-sm muted`
  centralizados; erro com `border-status-nao-corrigido/40`.
- **Tela de correção (modal)**: overlay `fixed inset-0 z-50 bg-black/70 backdrop-blur-sm`,
  painel `role="dialog" aria-modal="true" aria-label`, `max-w-2xl max-h-[90vh] overflow-y-auto`.
  Ordem fixa das seções: cabeçalho (nome, data, fechar) → status e tipos →
  **Conteúdo original** → Conteúdo enriquecido (GitHub: repositório, commits,
  README; Drive: arquivo, texto extraído; texto livre) → formulário de
  status e observação com `border-t border-border pt-6`. Fecha com Esc,
  clique no overlay e botão com `aria-label="Fechar"`; trava o scroll do body.
- **Conteúdo do aluno**: texto longo sempre em `whitespace-pre-wrap` dentro de
  `rounded-lg border border-border bg-background-elevated p-4 text-sm`.
- **Mensagens de erro**: `text-sm text-status-nao-corrigido` (ou `text-xs`
  embaixo de um campo), texto vindo de `mensagemDeErro`.

## 5. O que evitar

- Hex ou `rgb()` direto em classes (`bg-[#7C3AED]`) ou em `style`.
- Cores do Tailwind fora do tema (`bg-purple-600`, `text-gray-400`) em vez
  dos tokens.
- Mapear status para cor ou rótulo dentro do componente em vez de usar
  `lib/utils/status.ts`.
- `div` com `onClick` sem `role`, `tabIndex` e teclado.
- `accent` (`#7C3AED`) como cor de texto pequeno sobre fundo escuro (3.3:1).
- Remover `focus-visible:outline` ou usar `outline-none` sem substituto.
- Novas sombras, gradientes ou raios fora de `rounded-lg`/`xl`/`full`.
- Truncar, resumir, reformatar ou esconder `conteudoOriginal` (ver SKILL.md).
- `'use client'` em `page.tsx` só para usar um hook de um filho.
- Centralizar tudo: o painel é alinhado à esquerda; só a landing é centralizada.
