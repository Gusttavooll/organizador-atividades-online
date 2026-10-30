# painel-professor-ui

Skill do Claude Code para criar, estilizar e revisar as telas do
**Organizador de Atividades Online**: o painel do professor (lista de
entregas, filtros, tela de correção, cadastro de alunos) e a landing page.
O frontend é feito em Next.js (App Router), Tailwind e TypeScript.

## O que a skill faz

- Faz o Claude reaproveitar o sistema visual que já existe no projeto (tema
  escuro com acento roxo, tokens de `tailwind.config.ts`, componentes
  `Button`, `Card`, `Badge` e `StatusTag`) em vez de inventar estilos novos.
- Segue um fluxo fixo: levantar os tokens existentes, montar a estrutura
  semântica, aplicar estilo, cobrir os estados e validar.
- Valida acessibilidade (contraste WCAG AA, foco visível, alvos de ~44px,
  HTML semântico, responsividade de 320px ao desktop).
- Garante a regra principal do projeto: o conteúdo original enviado pelo
  aluno nunca é alterado, truncado ou escondido na interface.

Ela usa *progressive disclosure*: o `SKILL.md` é curto e só orienta; os
detalhes ficam em arquivos que o Claude lê quando precisa.

| Arquivo                                  | Conteúdo                                                        |
| ---------------------------------------- | --------------------------------------------------------------- |
| [`SKILL.md`](SKILL.md)                   | Quando usar, fluxo de trabalho e regra do conteúdo original     |
| [`reference.md`](reference.md)           | Tokens e cores reais, tipografia, espaçamento, padrões, o que evitar |
| [`checklist-a11y.md`](checklist-a11y.md) | Checklist de validação antes de concluir ou revisar uma tela    |

## Como instalar

Copie a pasta `painel-professor-ui/` inteira para um destes lugares:

- **Só neste projeto**: `.claude/skills/painel-professor-ui/` na raiz do
  repositório (já está aqui).
- **Para todos os seus projetos**: `~/.claude/skills/painel-professor-ui/`
  (no Windows, `C:\Users\<seu-usuario>\.claude\skills\painel-professor-ui\`).

```bash
# exemplo: instalar no nível do usuário a partir deste repositório
mkdir -p ~/.claude/skills
cp -r .claude/skills/painel-professor-ui ~/.claude/skills/
```

Reinicie o Claude Code (ou abra uma nova sessão) para a skill ser carregada.
Os valores de `reference.md` descrevem este projeto; em outro repositório,
ajuste-os aos tokens de lá.

## Como invocar

- **Manualmente**: digite `/painel-professor-ui` seguido do pedido.
- **Automaticamente**: o Claude carrega a skill sozinho quando o pedido fala
  de painel, entrega, tela, componente, filtro, correção ou revisão de UI.

A skill só pode usar as ferramentas `Read`, `Grep`, `Glob`, `Edit` e `Write`
(campo `allowed-tools`).

## Exemplos de uso

**1. Criar um componente novo**

```text
/painel-professor-ui crie um contador de entregas por status acima da lista
do painel, mostrando quantas estão "Não lido", "Lido", "Corrigido" e
"Não corrigido"
```

O Claude lê os tokens e `lib/utils/status.ts`, reaproveita `Badge`/`Card`,
monta a estrutura com rótulos em texto (não só cor), aplica o grid
responsivo do painel e confere o resultado com o checklist.

**2. Revisar uma tela existente**

```text
/painel-professor-ui revise o EntregaDetalheModal quanto a acessibilidade
e consistência visual
```

O Claude percorre `checklist-a11y.md` e devolve os problemas agrupados por
seção (contraste, foco, alvos de toque, HTML semântico), com arquivo e
linha, conferindo também se o conteúdo original do aluno continua completo.
