# Checklist de validação — painel do professor

Percorra todos os itens antes de concluir uma tela ou componente. Numa
revisão, reporte cada falha com arquivo, linha e a seção deste checklist.
Valores de cor e classes citados estão em [reference.md](reference.md).

## 1. Conteúdo original do aluno

- [ ] `conteudoOriginal` aparece completo na tela de detalhe/correção, com
      `whitespace-pre-wrap`, sem `truncate`, `line-clamp`, `max-h` com
      `overflow-hidden` ou resumo.
- [ ] O original fica visualmente separado do conteúdo enriquecido e da
      observação do professor, com título próprio ("Conteúdo original").
- [ ] Nenhum campo, máscara ou formatação altera o texto exibido.

## 2. Hierarquia

- [ ] Um único `h1` por página; títulos seguem a ordem `h1` → `h2` → `h3`
      sem pular níveis.
- [ ] Há uma ação principal clara por tela/seção (um `Button` `primary`).
- [ ] O nome do aluno e o status são o primeiro par de informações de cada
      entrega; data e tipos vêm depois.
- [ ] Hierarquia feita com tamanho, peso e cor juntos (`text-foreground`
      vs. `text-foreground-muted`), não só com tamanho.

## 3. Consistência

- [ ] Só tokens do tema; nenhum hex, `rgb()` ou cor fora do tema.
- [ ] `Button`, `Card`, `Badge` e `StatusTag` reutilizados em vez de
      recriados.
- [ ] Status e tipos vêm de `getStatusMeta`/`getTipoLabel`/`STATUS_OPTIONS`.
- [ ] Raios, sombras e espaçamentos seguem a escala de reference.md.
- [ ] Textos da interface em português do Brasil, no mesmo tom das telas
      existentes.

## 4. Responsividade

- [ ] Em 320px e 420px de largura: sem rolagem horizontal, botões e
      selects não estouram, nomes e e-mails longos quebram linha.
- [ ] Layout mobile-first: `grid-cols-1` na base, `sm:`/`lg:` para ampliar;
      linhas de ação passam de `flex-col` para `sm:flex-row`.
- [ ] Em desktop (1280px ou mais), o conteúdo respeita `max-w-content` e o
      grid de entregas chega a 3 colunas.
- [ ] O modal cabe na tela (`max-h-[90vh]` com rolagem interna) em celular
      e desktop.
- [ ] O header fixo não cobre o início do conteúdo (`pt-28` no painel).

## 5. Contraste (WCAG 2.1 AA)

- [ ] Texto normal com pelo menos 4.5:1; texto grande (24px, ou 18.7px em
      negrito) com pelo menos 3:1.
- [ ] Componentes de interface e anéis de foco com pelo menos 3:1 contra o
      fundo vizinho (`accent-soft` atende; `border` `#27272A` sozinha não).
- [ ] `accent` `#7C3AED` não é usado como cor de texto pequeno.
- [ ] Mensagens de erro em `text-status-nao-corrigido` só sobre `surface`
      ou `elevated` (4.7:1 ou mais).
- [ ] Texto desabilitado (`opacity-50`) é aceitável só em controles inativos.

## 6. Foco e teclado

- [ ] Todo elemento interativo mostra foco visível
      (`focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft`).
- [ ] Tudo funciona só com teclado: Tab chega a cada controle, Enter/Espaço
      ativam cards clicáveis, Esc fecha o modal.
- [ ] Ao fechar o modal, o foco volta para um ponto lógico da lista.
- [ ] A ordem de tabulação segue a ordem visual.

## 7. Alvos de toque

- [ ] Botões, links de navegação e o botão de fechar têm cerca de 44×44px
      (os `Button` atuais com `px-5 py-3` atendem).
- [ ] Selects e inputs com `py-2 text-sm` ficam perto de 38px: em telas
      novas prefira `py-2.5` ou `min-h-11`.
- [ ] Botões de ícone (fechar do modal, `p-2` + ícone `h-5`) aumentados
      para `p-3` ou `h-11 w-11` quando usados no celular.
- [ ] Há pelo menos `gap-2` entre alvos vizinhos.

## 8. HTML semântico

- [ ] `button` para ações e `Link`/`a` para navegação; `div` clicável só
      com `role="button"`, `tabIndex={0}` e `onKeyDown`.
- [ ] Todo campo tem `label` com `htmlFor` ligado ao `id` do campo (o
      formulário de edição de `AlunoLinha` ainda não liga e deve ser
      corrigido quando for tocado).
- [ ] Formulários em `form` com `aria-label` quando não há título visível.
- [ ] Modal com `role="dialog"`, `aria-modal="true"` e `aria-label` ou
      `aria-labelledby`.
- [ ] Botões só com ícone têm `aria-label`; ícones decorativos têm
      `aria-hidden="true"`.
- [ ] Carregamento sinalizado com `aria-busy`; erros novos anunciados
      (`role="alert"` ou `aria-live="polite"`).
- [ ] Regiões da página: `header`, `nav` com `aria-label`, `main`, `section`.

## 9. Não depender só de cor

- [ ] Status sempre mostra o rótulo em texto ao lado da bolinha colorida
      (`StatusTag`).
- [ ] Erros têm texto explicativo, não só borda vermelha.
- [ ] Hover e foco não se distinguem apenas por mudança de cor sutil; o
      anel de foco está presente.

## 10. Tema escuro

- [ ] O projeto tem só o tema escuro: não adicione classes `dark:` nem um
      tema claro paralelo sem uma decisão explícita.
- [ ] Todas as cores passam pelos tokens de `tailwind.config.ts`, para que
      um tema futuro possa ser criado redefinindo os tokens, sem editar
      componentes.
- [ ] Nada assume fundo branco (sombras escuras invisíveis, ícones pretos,
      imagens com fundo branco sem moldura).
- [ ] `globals.css` continua aplicando `bg-background text-foreground` no
      `body` e a seleção em `bg-accent/30`.
