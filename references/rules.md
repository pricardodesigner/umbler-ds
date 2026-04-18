# Umbootstrap DS — Regras de Implementação

Este arquivo documenta todas as regras que devem ser seguidas ao gerar código com o Umbootstrap DS. Leia integralmente antes de gerar qualquer componente ou tela.

## Índice

1. Hierarquia de botões
2. Sistema de tamanhos
3. Border-radius
4. Input-groups (wrapper approach)
5. Labels de formulário
6. Tabs e Steps — espaçamento
7. Ações em tabelas
8. Logo no header
9. Navegação mobile
10. Hover do btn-text por tema
11. Sidebar no tema Escuro
12. Avatar menu (theme switcher + logout)
13. Sidebar e Header como componentes reutilizáveis
14. Itens canônicos da sidebar
15. Mobile Header como componente reutilizável
16. Scrollbars
17. Checkbox, Radio & Switch — label clicável
18. Steps (Passos) — estados e variantes
19. Breakpoints & Responsividade — desktop/mobile no mesmo HTML
20. O que NUNCA fazer

---

## 1. Hierarquia de botões

Os botões seguem uma hierarquia clara de importância visual:

| Estilo | Classe | Quando usar |
|---|---|---|
| **Primary sólido** | `btn btn-primary` | APENAS para CTAs de ação imediata que precisam chamar muita atenção (ex: "Finalizar ativação", "Enviar mensagem") |
| **Primary Outlined** | `btn btn-outline-primary` | Ação padrão em toolbars, modais, formulários |
| **Text Primary** | `btn btn-text` | Ações de tabela, ações secundárias, botões de três pontinhos |
| **Text Danger** | `btn btn-text-danger` | Ações destrutivas em contexto secundário |

Regras importantes:
- Nunca use dois `btn-primary` na mesma área de ação
- Evite `btn-outline-secondary` — prefira sempre `btn-outline-primary`
- O botão de três pontinhos (`dots-three-vertical`) é sempre `btn btn-icon btn-text` e aparece por último na linha
- O `btn-text` tem a mesma cor de texto do `btn-outline-primary` — a diferença é que no hover só aparece um background suave, sem mudar a cor do texto

## 2. Sistema de tamanhos

Três tiers de tamanho que se aplicam uniformemente a botões, campos de formulário e input-groups:

| Tier | Altura | Classes |
|---|---|---|
| **Sm** | 24px | `btn-sm`, `form-control-sm`, `form-select-sm`, `input-group-sm` |
| **Md** | 32px | (default, sem sufixo) |
| **Lg** | 40px | `btn-lg`, `form-control-lg`, `form-select-lg`, `input-group-lg` |

O tamanho **Lg é o padrão** para telas e formulários. Sempre garanta compatibilidade de altura entre botões e campos na mesma linha.

## 3. Border-radius

| Tamanho | Radius |
|---|---|
| Sm e Md | 12px |
| Lg | 16px |
| Botões (todos) | 30px (pill) |
| Badges/pills | 6px |
| Cards | 8px |
| Painéis | 10px |
| Modais | 12px |

## 4. Input-groups (wrapper approach)

Quando um campo tem um elemento interno (ícone, prefixo como "https://", sufixo), usar o pattern de **borda no wrapper**:

```css
/* Borda no container, filhos sem borda */
.input-group:has(.input-group-text) {
  border: 2px solid var(--umb-input-border);
  border-radius: 12px;
  overflow: hidden;
}
.input-group-lg:has(.input-group-text) { border-radius: 16px; }

/* Filhos: sem borda própria */
.input-group:has(.input-group-text) > .input-group-text,
.input-group:has(.input-group-text) > .form-control,
.input-group:has(.input-group-text) > .form-select {
  border: none !important;
  border-radius: 0 !important;
  background: var(--umb-input-bg) !important;
}
```

### Padding posicional
O padding interno segue a posição do elemento:
- **Borda externa** (first-child ou last-child): 12px (Sm/Md) ou 16px (Lg)
- **Lado interno** (entre elementos): 4px

Isso cria um campo visualmente contínuo com espaçamento harmônico.

### Hover e focus no wrapper
```css
.input-group:has(.input-group-text):hover:not(:focus-within) {
  border-color: var(--bs-primary);
}
.input-group:has(.input-group-text):focus-within {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), .15);
}
```

### Propagação de tamanho para o form-control interno
Por padrão, o `.form-control` dentro de um `.input-group-lg` **não herda automaticamente** a altura do tamanho `lg` (40px) — sem regra explícita ele fica com 32px (default), gerando desalinhamento com botões `btn-lg` ao lado. O DS inclui regras que propagam a altura corretamente:

```css
.input-group-lg:has(.input-group-text) > .form-control:not(textarea),
.input-group-lg:has(.input-group-text) > .form-select {
  height: 40px !important;
  font-size: 14px !important;
}
.input-group-sm:has(.input-group-text) > .form-control:not(textarea),
.input-group-sm:has(.input-group-text) > .form-select {
  height: 24px !important;
  font-size: 12px !important;
}
```

Isso significa que o padrão correto em templates é:
```html
<!-- ✅ Correto: input-group-lg sem precisar repetir form-control-lg -->
<div class="input-group input-group-lg">
  <span class="input-group-text"><i class="ph ph-magnifying-glass"></i></span>
  <input type="text" class="form-control" placeholder="Pesquisar">
</div>
```

## 5. Labels de formulário

```css
.form-label {
  font-size: 13px;
  font-weight: 400;     /* Normal, NÃO bold */
  color: var(--umb-text-primary);
  margin-bottom: 5px;
  margin-left: 0.5rem;
}
```

## 6. Tabs e Steps — espaçamento

Nos fluxos de criação e edição, os componentes `umb-page-tabs` e `steps-container` devem ter **24px de margem** acima e abaixo. Usar a classe Bootstrap `my-4`:

```html
<!-- Steps em tela de criação -->
<div class="px-4 my-4">
  <div class="steps-container">...</div>
</div>

<!-- Tabs em tela de edição -->
<div class="umb-page-tabs px-4 my-4">...</div>
```

## 7. Ações em tabelas

- Ações de linha usam `btn btn-text` (Md Text Primary) com ícone
- O botão de três pontinhos é sempre o último da linha: `btn btn-icon btn-text`
- Use `btn btn-primary` sólido APENAS para ações imediatas de destaque (ex: "Finalizar ativação")

```html
<td>
  <div class="d-flex gap-1 justify-content-end">
    <button class="btn btn-text"><i class="ph ph-pencil-simple me-1"></i>Editar</button>
    <button class="btn btn-icon btn-text"><i class="ph ph-dots-three-vertical"></i></button>
  </div>
</td>
```

## 8. Logo no header

### Desktop (shell header)
- Usar `<img>` com a URL do SVG: `https://assets.umbler.com/utalk/assets/umblertalk.svg`
- Dimensões: 110×16px
- Tema Escuro: `filter: brightness(0) invert(1)` (logo branca)
- Tema Claro: sem filtro (logo no cinza escuro original)
- Temas Bravia e Esmeralda: `display: none !important` — sem logo no header

### Sidebar (todas as versões)
- Usar o SVG inline do símbolo Umbler (o "U" com sorriso)
- Sempre em branco sobre o fundo colorido da sidebar

### Mobile header
- Usar o SVG inline do símbolo (igual à sidebar), não o logo completo
- Temas Bravia e Esmeralda: `visibility: hidden`

## 9. Navegação mobile (bottom nav)

A barra inferior mobile usa fundo `var(--umb-sidebar-bg)`. Os ícones devem usar tokens da sidebar, não do conteúdo:

```css
.umb-mobile-nav-item       { color: var(--umb-nav-color); }
.umb-mobile-nav-item.active { color: var(--umb-nav-active-color); }
```

Isso garante contraste correto em todos os temas (inclusive no Claro onde o fundo é azul).

## 10. Hover do btn-text por tema

O hover do `btn-text` usa uma variável por tema para garantir contraste:

| Tema | `--umb-btn-text-hover` |
|---|---|
| Escuro | `rgba(255,255,255,.10)` — cinza neutro |
| Claro | `rgba(0,0,0,.06)` — cinza neutro |
| Esmeralda | `rgba(var(--bs-primary-rgb),.15)` — teal |
| Bravia | `rgba(var(--bs-primary-rgb),.15)` — teal |

Nos temas padrão (Escuro/Claro) o hover é **neutro** (sem tinta da cor primária), porque a primary é azul e ficaria destoante. Nos temas Esmeralda/Bravia o teal funciona bem como hover.

## 11. Sidebar no tema Escuro

No tema Escuro, `--umb-sidebar-bg` é `#141619` — o mesmo valor de `--umb-shell-header-bg` — para que sidebar e header fiquem com o mesmo fundo. Nos demais temas são diferentes.

## 12. Avatar menu (theme switcher + logout)

O `.umb-si-avatar` no canto inferior da sidebar é **sempre** um trigger de dropdown. Ao clicar, abre um popover listando os 5 temas do DS (Auto, Claro, Escuro, Esmeralda, Bravia) + link Sair. Isso permite trocar o tema e visualizar a mudança instantaneamente.

### Markup obrigatório

```html
<div class="umb-avatar-menu dropdown dropend">
  <button type="button" class="umb-si-avatar" data-bs-toggle="dropdown" aria-expanded="false" title="Perfil">RC</button>
  <div class="dropdown-menu umb-avatar-dropdown">
    <p class="umb-avatar-menu-label">Tema</p>
    <div class="umb-avatar-theme-options">
      <button class="theme-option" data-theme="auto"          onclick="setTheme('auto')"><i class="ph ph-arrows-clockwise"></i> Auto</button>
      <button class="theme-option" data-theme="light"         onclick="setTheme('light')"><i class="ph ph-sun"></i> Claro</button>
      <button class="theme-option active" data-theme="dark"   onclick="setTheme('dark')"><i class="ph ph-moon"></i> Escuro</button>
      <button class="theme-option" data-theme="emerald"       onclick="setTheme('emerald')"><i class="ph ph-leaf"></i> Esmeralda</button>
      <button class="theme-option" data-theme="dark-emerald"  onclick="setTheme('dark-emerald')"><i class="ph ph-circles-four"></i> Bravia</button>
    </div>
    <hr class="dropdown-divider my-2">
    <button type="button" class="umb-avatar-logout"><i class="ph ph-sign-out"></i> Sair</button>
  </div>
</div>
```

### Regras

- O trigger **sempre** é um `<button>` com `.umb-si-avatar` (não `<div>`) — necessário pra Bootstrap dropdown e acessibilidade.
- O container usa `dropend` (abre à direita da sidebar, que é estreita — 52px — e fica à esquerda da tela).
- Reaproveita a classe `.theme-option` já existente na sidebar de documentação do DS — o `setTheme()` global sincroniza o estado `active` em **todos** os theme-switchers do documento.
- O separador entre temas e logout usa `hr.dropdown-divider.my-2` (8px acima e abaixo, padrão Bootstrap 5.3).
- "Sair" usa `.umb-avatar-logout` — cor `var(--umb-alert-danger-color)`, hover `var(--umb-alert-danger-bg)`.
- Dentro de containers com `overflow: hidden` (ex: `.tpl-preview`, `.tpl-mobile-frame`), o DS já adiciona `:has(.dropdown-menu.show) { overflow: visible }` automaticamente para o menu não ser cortado.
- Os ícones de tema seguem o vocabulário visual: `arrows-clockwise` (auto), `sun` (claro), `moon` (escuro), `leaf` (esmeralda), `circles-four` (bravia).

### JS (já incluído no DS)

A função global `setTheme(theme)` aplica o tema no `<html data-bs-theme="...">`, salva em `localStorage` (`umb-theme`) e sincroniza o `.active` em todos os `.theme-option` da página. Não precisa de JS adicional.

## 13. Sidebar e Header como componentes reutilizáveis

A sidebar (`umb-shell-sidebar`) e o header (`umb-shell-header`) são **componentes únicos** definidos em `<template>` no fim do `umbootstrap-design-system.html`. Todos os templates (Shell isolado, Template 1–4) consomem esses componentes via placeholders — alterações feitas nos `<template id="umb-tpl-sidebar">` / `<template id="umb-tpl-header">` refletem automaticamente em **todos** os templates.

### Uso

```html
<!-- Sidebar -->
<nav class="umb-shell-sidebar" data-umb-c="sidebar" data-active="Agentes de IA"></nav>

<!-- Header padrão (com brand e créditos) -->
<header class="umb-shell-header" data-umb-c="header"
        data-breadcrumb="Configurações / Agentes de IA"></header>

<!-- Header só com breadcrumb (ex: tela de Configurações) -->
<header class="umb-shell-header" data-umb-c="header"
        data-breadcrumb="Configurações" data-actions="none"></header>

<!-- Topbar isolada (sem brand, demo standalone) -->
<div class="umb-shell-header" data-umb-c="header"
     data-brand="false"
     data-breadcrumb="Configurações / Agentes de IA"></div>
```

### Atributos do placeholder

| Atributo | Default | Descrição |
|---|---|---|
| `data-umb-c` | — | `"sidebar"` ou `"header"` (obrigatório) |
| `data-active` | — | (sidebar) Título exato do item ativo: `"Conversas"`, `"Agentes de IA"` etc. |
| `data-breadcrumb` | vazio | (header) Caminho separado por ` / `; o último item recebe `.active` |
| `data-brand` | `"true"` | (header) `"false"` oculta a brand (ex: topbar isolada) |
| `data-actions` | `"credits"` | (header) `"none"` oculta créditos + botão |

### Regras

- **NUNCA** duplique o markup completo da sidebar/header num template — use sempre o placeholder.
- Alterações de itens de navegação, avatar dropdown ou layout do header devem ser feitas **no `<template>`** (dentro do arquivo do DS). Modificar o placeholder quebra o fluxo e perde a vantagem de ter um único ponto de verdade.
- O render roda uma vez ao carregar a página. Para re-render manual (ex: após injetar novo placeholder dinamicamente), chame `window.umbRenderShell()`.
- Tooltips nos itens da sidebar (incluindo avatar) são inicializados automaticamente pelo render — **não duplicar** o bloco de init de tooltip genérico.

## 14. Itens canônicos da sidebar

A sidebar do Umbler Talk tem **8 itens principais** + **3 itens inferiores**, na ordem abaixo. Essa lista é a única fonte de verdade — qualquer adição/remoção deve alterar o `<template id="umb-tpl-sidebar">` do DS.

### Nav principal (de cima para baixo)

| Ordem | Item | Ícone (Phosphor) |
|---|---|---|
| 1 | Conversas | `ph-chat` |
| 2 | Contatos | `ph-user` |
| 3 | Board | `ph-kanban` |
| 4 | Chatbots | `ph-robot` |
| 5 | Agentes de IA | `ph-sparkle` |
| 6 | Envios de campanhas | `ph-paper-plane-tilt` |
| 7 | Relatórios | `ph-chart-pie-slice` |
| 8 | Configurações | `ph-gear` |

### Nav inferior

| Ordem | Item | Ícone / Componente |
|---|---|---|
| 1 | Notificações | `ph-bell` |
| 2 | Suporte | `ph-question` |
| 3 | Perfil (Avatar) | `.umb-avatar-menu` (dropdown com theme switcher + Sair) |

### Regras de active state

- **Exatamente um** item pode estar com `.active` por template. Nunca deixe dois itens marcados simultaneamente (ex: "Agentes de IA" + "Configurações" ativos no mesmo template).
- O render define o estado ativo lendo o atributo `data-active` do placeholder — basta mudar o valor para mover a seleção (ex: `data-active="Configurações"`).
- O avatar **não participa** do estado active da sidebar — ele é um trigger de dropdown, nunca recebe `.active`.

### Tooltips

- **Todos** os itens da sidebar desktop (incluindo avatar) devem ter tooltip no hover, usando `data-bs-toggle="tooltip" data-bs-placement="right" title="..."`.
- O avatar é uma exceção técnica: como já usa `data-bs-toggle="dropdown"`, seu tooltip é inicializado manualmente via JS (já implementado no `umbRenderShell()`).

## 15. Mobile Header como componente reutilizável

O mobile header é o terceiro componente de shell do DS (junto com sidebar e header desktop) e é renderizado a partir do `<template id="umb-tpl-mobile-header">` com duas variantes de layout. Usa o mesmo background da sidebar (`var(--umb-sidebar-bg)`), garantindo consistência visual entre os 4 temas (Claro, Escuro, Esmeralda, Bravia).

### Uso

```html
<!-- Variant HOME — página inicial do recurso: hamburger + logo U (esquerda) + sino + avatar -->
<header class="umb-mobile-header" data-umb-c="mobile-header" data-variant="home"></header>

<!-- Variant SUBPAGE — novo/editar recurso: back + sino + avatar -->
<header class="umb-mobile-header" data-umb-c="mobile-header" data-variant="subpage"></header>
```

### Atributos

| Atributo | Valores | Default | Descrição |
|---|---|---|---|
| `data-umb-c` | `"mobile-header"` | obrigatório | Marca o placeholder para o render JS |
| `data-variant` | `"home"` \| `"subpage"` | `"home"` | Layout: home mostra hamburger + logo U à esquerda; subpage mostra back arrow |
| `data-avatar` | iniciais | `"RC"` | Iniciais do avatar à direita |
| `data-actions` | `"none"` | — | Se `"none"`, remove o bloco da direita (sino + avatar) |

### Regras visuais

- **Altura fixa**: 56px. Não aumente/diminua.
- **Sem título de página no header**: o header mobile **nunca** exibe o título da tela. O título vive no corpo da página, exatamente como na versão desktop (dentro do card/seção principal, usando `.umb-pg-title` ou no `.card-header`).
- **Logo "U"**: posicionado **à esquerda, imediatamente após o botão hamburger** (não centralizado). Aparece **em todos os temas** no variant `home` (inclusive Esmeralda e Bravia). A regra de esconder o wordmark "Umbler Talk" (§20 "NUNCA") só se aplica ao logo completo do header desktop, não ao símbolo "U".
- **Ícones** (hamburger, back, sino) usam `var(--umb-nav-color)` — adaptam-se a todos os temas automaticamente.
- **Bell + Avatar**: sempre juntos no canto direito (`.umb-mh-right`). Nunca insira ações extras entre eles.
- **Ícones do sistema**: hamburger = `ph-list`; back = `ph-caret-left`; sino = `ph-bell`.

### Re-render

Se você adicionar placeholders via DOM dinâmico, chame `window.umbRenderShell()` para re-renderizar sidebar + header + mobile-header em cascata.

## 16. Scrollbars

Todas as scrollbars (sidebar, frames de exemplo desktop/mobile, conteúdo, tabelas, textareas, listas) seguem um estilo único: finas, arredondadas, transparentes por default e com thumb sutil que escurece no hover. O DS aplica isso globalmente via seletor `*`:

```css
* { scrollbar-width: thin; scrollbar-color: var(--umb-border-strong) transparent; }
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: var(--umb-border-strong);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color .15s;
}
*::-webkit-scrollbar-thumb:hover { background: var(--umb-text-mid); background-clip: padding-box; border: 2px solid transparent; }
[data-bs-theme="light"] *::-webkit-scrollbar-thumb { background: rgba(0,0,0,.18); ... }
[data-bs-theme="light"] *::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.32); ... }
```

Regras:
- **Não sobrescreva** o estilo global em componentes específicos, a menos que queira explicitamente esconder o scroll (`::-webkit-scrollbar { display: none }`) — usado apenas em `.umb-page-tabs` e `.umb-wizard-steps`.
- **Cor do thumb** = `var(--umb-border-strong)` nos temas escuros, rgba `rgba(0,0,0,.18)` no tema claro — suficientemente sutil para não competir com o conteúdo, mas visível o bastante para indicar scroll.
- **Largura** = 8px (tanto vertical quanto horizontal). Nunca aumente para "deixar mais visível".

## 17. Checkbox, Radio & Switch — label clicável

Todo `.form-check-input` com label visível **deve** ter `id` e o `<label>` correspondente deve ter `for="<id>"`. Sem isso, clicar no texto do label não altera o estado do componente — quebrando a expectativa de UX.

```html
<!-- ✅ Correto -->
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="signSwitch" checked>
  <label class="form-check-label" for="signSwitch">Assinar conversa</label>
</div>

<!-- ❌ Errado — clicar no texto "Assinar conversa" não alterna o switch -->
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" checked>
  <label class="form-check-label">Assinar conversa</label>
</div>
```

Vale para checkbox (`type="checkbox"`), radio (`type="radio"`) e switch (`form-switch`). **Exceção**: checkboxes "select-all" e "select-row" em tabelas não precisam de label visível, mas recomenda-se `aria-label` para acessibilidade.

Use IDs **únicos** na página — mesmo quando o template aparece dentro de um frame/iframe de exemplo, o DS é renderizado como uma única página HTML, então IDs colidindo quebram o pair `for`.

## 18. Steps (Passos) — estados e variantes

O componente Steps é um marcador de progresso usado em fluxos multi-etapa (criação/edição). Sua estrutura canônica:

```html
<div class="steps-container">
  <div class="step-item done">
    <div class="step-circle"><i class="ph ph-check" style="font-size:13px"></i></div>
    <div class="step-label">Perfil</div>
  </div>
  <div class="step-item active">
    <div class="step-circle">2</div>
    <div class="step-label">Comportamento</div>
  </div>
  <div class="step-item">
    <div class="step-circle">3</div>
    <div class="step-label">Conhecimento</div>
  </div>
  <!-- ...n passos -->
</div>
```

### Estados (em `.step-item`)

- **Pending** (default, sem classe extra) — circle com borda e fundo neutros (`--umb-step-track`/`--umb-step-bg`), label em `--umb-text-mid`, linha conectora neutra.
- **Active** (`.active`) — circle com borda e fundo `--bs-primary`, número em branco, label em `--bs-primary` bold, linha conectora em gradiente primary→track.
- **Done** (`.done`) — circle com borda/fundo neutros mas **ícone check em `--bs-primary`**, label em `--bs-primary`, linha conectora para o próximo step em `--bs-primary`. A estética é **sutil**, não um "badge cheio".
- **Hover-active** (`.hover-active`) — adiciona um chip de background (`--umb-hover-bg`) por cima de qualquer um dos estados acima, indicando hover/seleção ativa. Usar para o step atual de um wizard clicável.

> **Convenção**: todo step `.done` é automaticamente clicável (`cursor: pointer` + chip no hover). Isso permite que o usuário volte a qualquer passo já concluído sem markup extra. Use `.clickable` no container apenas quando **todos** os steps (inclusive Pending/Active) devem ser navegáveis — cenário raro.

### Largura uniforme (horizontal)

Todos os steps têm **largura igual e responsiva** — use `flex: 1 1 0; min-width: 0` (já embutido em `.step-item`). **Nunca** aplique `style="flex:0"` ou larguras fixas em steps individuais — a ideia é que os 6 (ou n) passos ocupem a mesma fatia do container.

### Variantes do `.steps-container`

- **Horizontal Full** (default) — circles + labels abaixo.
- **Horizontal Points only** — adicione `.points-only` ao container para esconder os labels. **Obrigatório em mobile** em wizards com muitos passos (ex: "Novo agente de IA" tem 6 passos → points-only no mobile).
- **Vertical Full** — adicione `.vertical` ao container: layout em coluna com label à direita do circle, trilha vertical entre os dots.
- **Vertical Points only** — `.vertical.points-only` — apenas bolinhas empilhadas (para drawers estreitos).

### Clickable (wizard navegável)

Adicione `.clickable` ao container para habilitar cursor pointer e hover-chip automático em todos os itens:

```html
<div class="steps-container clickable">
  <div class="step-item done">...</div>
  <div class="step-item active">...</div>
  <div class="step-item">...</div>
</div>
```

### Exemplos de uso nos templates

- **Desktop (wizard de criação)** — `Horizontal Full`. Wrapper `<div class="px-4 my-4">` (§6).
- **Mobile (wizard de criação)** — `Horizontal Points only`. Nunca use overflow-scroll horizontal para "caber" todos os steps: o `points-only` já resolve com largura uniforme.
- **Drawer lateral de progresso** — `Vertical Full`.

### Tokens envolvidos

- `--umb-step-track` — cor da trilha/borda neutra (tem override por tema: claro/escuro/bravia/esmeralda).
- `--umb-step-bg` — background do circle em estados Pending e Done.
- `--bs-primary` — circle Active e elementos destacados (check, label done/active, trilha done).

## 19. Breakpoints & Responsividade — desktop/mobile no mesmo HTML

Toda tela gerada deve ter **uma única marcação HTML** que se adapta ao redimensionamento da janela do browser — a versão desktop e a versão mobile **não** são arquivos/templates separados, são a **mesma página** com variantes controladas por media query.

### Breakpoint padrão

Usamos o **breakpoint `md` do Bootstrap 5.3 (768px)** como divisor:

- `< 768px` → **mobile** (phone/tablet pequeno) — usa `.umb-mobile-shell` + `umb-mobile-header` + `umb-bottom-nav`
- `≥ 768px` → **desktop** (tablet landscape/desktop) — usa `.umb-shell` com `umb-shell-sidebar` + `umb-shell-header`

### Markup canônico

Inclua **os dois shells** na mesma página e use `d-md-none` / `d-none d-md-flex` (Bootstrap utilities) para alternar:

```html
<!-- Shell desktop — some em telas < md -->
<div class="umb-shell d-none d-md-flex">
  <nav class="umb-shell-sidebar" data-umb-c="sidebar" data-active="…"></nav>
  <div class="umb-shell-main">
    <header class="umb-shell-header" data-umb-c="header" data-breadcrumb="…"></header>
    <div class="umb-shell-content">…conteúdo…</div>
  </div>
</div>

<!-- Shell mobile — some em telas ≥ md -->
<div class="umb-mobile-shell d-md-none">
  <header class="umb-mobile-header" data-umb-c="mobile-header" data-title="…"></header>
  <main class="umb-mobile-content">…conteúdo…</main>
  <nav class="umb-bottom-nav" data-umb-c="bottom-nav" data-active="…"></nav>
</div>
```

Alternativamente, se o conteúdo interno for idêntico em estrutura e só muda nos paddings/colunas/steps, use **um único shell** com utilities responsivas do Bootstrap dentro dele (`row-cols-1 row-cols-md-2`, `px-3 px-md-4`, `form-select-lg` em mobile vs `form-select` em desktop, etc.) — mas isso raramente cobre todos os casos porque sidebar vs bottom-nav exigem markups distintos.

### O que muda entre desktop e mobile

- **Navegação**: sidebar (desktop) ↔ bottom nav (mobile)
- **Header**: shell header com breadcrumb (desktop) ↔ mobile header com botão hambúrguer + título (mobile)
- **Campos**: Md (34px) em desktop ↔ **Lg (40px)** em mobile (touch target WCAG — ver §2)
- **Steps**: `steps-container` horizontal full (desktop) ↔ `steps-container points-only` (mobile) — ver §18
- **Colunas**: multi-coluna (desktop) ↔ coluna única empilhada (mobile), usando grid do Bootstrap
- **Paddings de conteúdo**: `px-4` / `py-4` (desktop) ↔ `px-3` / `py-3` (mobile)
- **Modais/wizards**: drawer lateral ou modal central (desktop) ↔ full-screen card (mobile)

### Preview na página do DS

Na página do Design System (`umbootstrap-design-system.html`), os templates são exibidos em **dois frames lado a lado** (`.tpl-preview` com largura fixa) apenas como referência visual — isso é um artefato do catálogo, **não** é como a tela deve ser entregue ao produto. A tela final entregue deve ter os dois shells no mesmo HTML com o comportamento de media query descrito acima.

### Validação

Após gerar uma tela, redimensione a janela do browser cruzando os 768px e confirme:
- Abaixo de 768px: apenas shell mobile visível, bottom nav fixo embaixo, campos Lg, sem sidebar
- A partir de 768px: apenas shell desktop visível, sidebar à esquerda, header com breadcrumb, campos Md

## 20. O que NUNCA fazer

- Nunca use cores hex hardcoded — sempre tokens via `var(--umb-*)`
- Nunca use `btn-outline-secondary` em ações — use `btn-outline-primary`
- Nunca use `font-weight: bold` em labels de formulário
- Nunca coloque borda nos filhos do input-group — a borda vai no wrapper
- Nunca use `position: fixed` (quebra em iframes)
- Nunca use `useEffect` para data fetching (usar TanStack Query)
- Nunca misture tamanhos (ex: botão Lg com campo Md na mesma linha)
- Nunca use ícones que não sejam Phosphor Icons (`ph ph-*`)
- Nunca coloque o logo "Umbler Talk" no header dos temas Bravia/Esmeralda
