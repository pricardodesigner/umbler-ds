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
21. Template de Chat (atendimento)
22. Tokens de fundo — bgPrimary, hover e bgActive
23. Tokens de borda — border e border-on-brand
24. Font weight — máximo 600
25. Governança — fonte única da verdade

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
| Cards | 16px |
| Painéis | 10px |
| Modais | 12px |

**Regra inviolável para botões**: **todo** `.btn` do DS usa `border-radius: 30px` (pill) — independente do tamanho (Sm, Md, Lg), variante (`btn-primary`, `btn-outline-*`, `btn-text`) ou contexto (composer do chat, toolbar, modal, etc.). Nunca crie uma classe de botão customizada com raio diferente (ex.: `.umb-*-btn { border-radius: 8px }`). Se precisar de um CTA específico, use as variantes existentes (`btn-primary`, `btn-lg`, etc.) ou estenda via classe de utilidade que **preserve** o pill.

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

- O `.umb-avatar-menu` é o **único componente válido** para troca de tema em toda a aplicação. **Nunca** crie um theme switcher paralelo (botões flutuantes, barra lateral extra, modal de configurações, etc.) — mesmo em prévias, templates de demo ou telas isoladas. Se o usuário não pedir explicitamente um switcher adicional no prompt, reutilize o existente na sidebar canônica (`data-umb-c="sidebar"`).
- O dropdown do avatar **deve** fechar em três condições: (a) clique em um item do menu, (b) clique em qualquer ponto fora do `.umb-avatar-menu`, (c) tecla `Escape`. Esse é o comportamento padrão do Bootstrap 5 dropdown e é esperado pelo usuário — **nunca** modifique esse contrato (ex: `data-bs-auto-close="false"`, `stopPropagation()` no dropdown, `inside` ao invés de `true`) sem um pedido explícito do usuário. Em templates gerados que renderizam o avatar via `<template>`, garanta que o JS preserve o outside-click close: se o data-api do Bootstrap não disparar (overflow:hidden no container, elementos criados dinamicamente, etc.), adicione um handler defensivo com `bootstrap.Dropdown.getOrCreateInstance(trigger).hide()`.
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

<!-- Variant CHAT — chat aberto (§21): back + avatar + nome do contato + tags + phone + menu -->
<header class="umb-mobile-header"
        data-umb-c="mobile-header"
        data-variant="chat"
        data-contact-name="Maria Rocha"
        data-contact-tags="Cliente:green"></header>
```

### Atributos

| Atributo | Valores | Default | Descrição |
|---|---|---|---|
| `data-umb-c` | `"mobile-header"` | obrigatório | Marca o placeholder para o render JS |
| `data-variant` | `"home"` \| `"subpage"` \| `"chat"` | `"home"` | Layout: home mostra hamburger + logo U; subpage mostra back arrow; chat mostra back + avatar + nome do contato (§21) |
| `data-avatar` | iniciais | `"RC"` | (home/subpage) Iniciais do avatar do operador à direita |
| `data-actions` | `"none"` | — | Se `"none"`, remove o bloco da direita (sino + avatar em home/subpage; phone + menu em chat) |
| `data-contact-name` | texto | — | **(chat)** Nome do contato exibido no header |
| `data-contact-avatar` | URL | — | **(chat)** URL da foto (opcional; cai para iniciais do nome quando ausente) |
| `data-contact-tags` | `"Label:cor,Label:cor"` | — | **(chat)** Tags do contato separadas por vírgula, cada uma no formato `"texto:cor"` (cores disponíveis: `blue`, `green`, `amber`, `red`, `violet`; default `blue`) |
| `data-contact-sub` | texto | — | **(chat)** Texto livre abaixo do nome (ex: telefone, canal) |

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
- Nunca use `--umb-chat-canvas-bg` (removido): o fundo do chat **é** o `--umb-bg-primary` (ver §22)
- Nunca use `--umb-chat-list-active` (removido): conversa selecionada usa `--umb-bg-active` (§22); era um token paralelo que violava a regra sistêmica de um único token semântico para seleção
- Nunca crie um token de fundo dedicado por tela — reuse `--umb-bg-primary` para canvas e `--umb-bg-active` para seleção
- Nunca crie um theme switcher novo (botão flutuante, barra extra, modal) — a troca de tema é **exclusivamente** pelo `.umb-avatar-menu` da sidebar (§12). Exceção: apenas quando o usuário pedir explicitamente um switcher adicional no prompt.
- Nunca use `font-weight` > 600 no DS (valores proibidos: `700`, `800`, `900`, `bold`, `bolder`). Se precisar reforçar hierarquia, aumente o `font-size` ou use `color` de contraste — nunca um peso mais pesado que 600 (ver §24).
- Nunca crie classe custom de botão com `border-radius` diferente de 30px (pill). Todo `.btn` do DS é pill — sem exceção (§3).
- Nunca use `border-width` fora da escala 1px/2px. Valores proibidos: `1.5px`, `2.5px`, `3px` (ver §23.4). Divisores passivos = 1px; elementos interativos = 2px.
- Nunca use tabs (`.umb-chat-composer-tab`) no composer do chat — foi removido do DS em favor do Segmented (`.inset-control`) Mensagem/Notas (§21.4).
- Nunca use `btn-outline-secondary` em ações — use `btn-outline-primary`
- Nunca use `font-weight: bold` em labels de formulário
- Nunca coloque borda nos filhos do input-group — a borda vai no wrapper
- Nunca use `position: fixed` (quebra em iframes)
- Nunca use `useEffect` para data fetching (usar TanStack Query)
- Nunca misture tamanhos (ex: botão Lg com campo Md na mesma linha)
- Nunca use ícones que não sejam Phosphor Icons (`ph ph-*`)
- Nunca coloque o logo "Umbler Talk" no header dos temas Bravia/Esmeralda

## 21. Template de Chat (atendimento)

O Template 5 — Chat é a **tela mais usada do Umbler Talk**: lista de conversas à esquerda, detalhe do chat em conversa à direita. É o único template do DS que **NÃO usa `umb-shell-header`** — esse espaço é ocupado pelo header do chat (ações + contato).

### 21.1 Estrutura desktop — SEM `umb-shell-header`

```html
<div class="umb-shell d-none d-md-flex">
  <nav class="umb-shell-sidebar" data-umb-c="sidebar" data-active="Conversas"></nav>

  <!-- Em vez de umb-shell-main + umb-shell-header + umb-shell-content,
       usamos umb-chat-shell ocupando o flex:1 inteiro. -->
  <div class="umb-chat-shell">
    <aside class="umb-conv-list">…lista de conversas…</aside>
    <main  class="umb-chat-detail">…detalhe do chat ou empty state…</main>
  </div>
</div>
```

**Motivo**: cada chat tem suas próprias ações (ligar, resolver, transferir, mais opções, fechar painel) e o contato em conversa já é mostrado no `umb-chat-header`. Duplicar breadcrumb + ações globais roubaria área útil das mensagens.

O `umb-chat-shell` é um container `display:flex` que ocupa altura total e divide em duas colunas (360px + flex:1). Não usar em outro template — é exclusivo do chat.

### 21.2 Coluna 1 — Lista de conversas (`.umb-conv-list`)

Largura fixa **360px** no desktop. Estrutura vertical:

1. **Topbar** (`.umb-conv-topbar`, 56px — bate com `.umb-chat-header`): 5 `btn-icon btn-text btn-lg` + spacer + 1 `btn-primary btn-icon btn-lg` (ph-plus).
2. **Toolbar** (`.umb-conv-toolbar`): busca + botão filtros.
3. **Segmented** (`.umb-conv-segmented > .inset-control.inset-control-lg`): Entrada / Esperando / Finalizados.
4. **Scroll** (`.umb-conv-scroll`) com a lista de `.umb-conv-item`.

#### Anatomia de um `.umb-conv-item`

```html
<div class="umb-conv-item">
  <!-- Avatar 48×48 com badge do canal no canto INFERIOR ESQUERDO -->
  <div class="umb-conv-avatar">
    <img src="..." alt="Vitor">
    <span class="umb-conv-avatar-ch whatsapp-starter"><i class="ph ph-whatsapp-logo"></i></span>
  </div>
  <div class="umb-conv-body">
    <!-- Linha 1: nome + ações/meta à direita -->
    <div class="umb-conv-head">
      <span class="umb-conv-name">Vitor</span>
      <div class="umb-conv-head-right">
        <span class="umb-conv-head-event"><i class="ph ph-calendar-blank"></i>1</span>
        <i class="ph ph-speaker-slash umb-conv-head-mute"></i>
        <span class="umb-conv-time">10 horas atrás</span>
      </div>
    </div>
    <!-- Linha 2: preview à esquerda; assignee + pending à direita -->
    <div class="umb-conv-preview-row">
      <p class="umb-conv-preview">Olá. Tudo bem?</p>
      <div class="umb-conv-preview-end">
        <img class="umb-conv-assignee" src="..." alt="Responsável">
        <span class="umb-conv-pending">3</span>
      </div>
    </div>
    <!-- Linha 3: tags à esquerda, setor outline à direita -->
    <div class="umb-conv-meta">
      <div class="umb-conv-meta-left">
        <span class="umb-conv-tag pink"><i class="ph ph-user-circle"></i>Magenta</span>
        <span class="umb-conv-tag-more">+3</span>
      </div>
      <div class="umb-conv-meta-right">
        <span class="umb-conv-sector">Comercial</span>
      </div>
    </div>
  </div>
</div>
```

#### Elementos

| Elemento | Descrição |
|---|---|
| `.umb-conv-avatar` | 52×52, circular. **Sempre** use `<img>` com a foto real do contato. `<span>` com iniciais é apenas fallback para quando a foto ainda não carregou ou o contato não tem foto cadastrada (raro em produção). |
| `.umb-conv-avatar-ch` | Badge do canal — **canto inferior esquerdo**, 20×20 com borda de 2px em `--umb-card-bg` (proporção ~38% do avatar). Ícone Phosphor inline com `font-size: 10px`. Posicionado em `bottom: 0; left: 0` (sem extrapolar para fora do avatar). |
| `.umb-conv-name` | 15px, `text-primary`. Peso **400** (Normal) por padrão; **600** (Semibold) apenas quando o item está `.active`. O peso bold é sinal visual da conversa selecionada — o único card com destaque tipográfico na lista. |
| `.umb-conv-head-right` | Container à direita da linha 1. Abriga `head-event` (calendário + N eventos), `head-mute` (ícone speaker-slash quando mudo) e `.umb-conv-time` (texto). |
| `.umb-conv-preview` | 13px, `text-mid`, 1 linha com ellipsis. Vive dentro de `.umb-conv-preview-row` com `flex: 1`, para que o pending (se houver) fique encostado à direita. Aceita ícone Phosphor inline para sinalizar tipo de mídia (áudio, anexo, etc.). |
| `.umb-conv-tag` | Pill colorida com ícone + label. Cores canônicas: `blue`, `green`, `amber`, `red`, `violet`, `pink`. Todas com fundo sólido + texto branco/escuro contrastante. |
| `.umb-conv-tag-more` | Pill **outline** "+N" — conta de tags adicionais não exibidas. |
| `.umb-conv-assignee` | Mini avatar 22×22 do atendente responsável. Vive na **linha 2** (dentro de `.umb-conv-preview-end`), **não** mais em `.umb-conv-meta-right`. |
| `.umb-conv-preview-row` | Container da linha 2. Flex horizontal: `.umb-conv-preview` (flex:1 com ellipsis) à esquerda e `.umb-conv-preview-end` (assignee + pending) à direita. |
| `.umb-conv-preview-end` | Wrapper à direita da linha 2. Abriga avatar do responsável (`.umb-conv-assignee`) e badge verde (`.umb-conv-pending`), nessa ordem. |
| `.umb-conv-pending` | Badge numérica circular 22×22 com fundo `--bs-success` (verde) — mensagens pendentes. Vive **na linha do preview** (linha 2), alinhado à direita. Nunca no `.umb-conv-meta-right` (linha 3). |
| `.umb-conv-sector` | Pill **outline** do setor (Comercial, Suporte, Vendas, Contas). |

#### Badges de canal (`.umb-conv-avatar-ch`)

Canais canônicos com cor fixa (não dependem do tema):

| Classe | Canal | Cor | Ícone |
|---|---|---|---|
| `.whatsapp-starter` | WhatsApp (Starter) | `#7c3aed` (roxo) | `ph-whatsapp-logo` |
| `.whatsapp-api` | WhatsApp Business API | `#25D366` (verde) | `ph-whatsapp-logo` |
| `.livechat` | Live chat (widget do site) | `#ff6b35` (laranja) | `ph-chat-circle` |
| `.instagram` | Instagram | gradient oficial IG | `ph-instagram-logo` |
| `.email` | Email | `#546E7A` | `ph-envelope` |
| `.telegram` | Telegram | `#229ED9` | `ph-telegram-logo` |

**Nota**: `.whatsapp` (sem sufixo) é alias legado de `.whatsapp-api` (verde) — use o nome canônico em código novo.

#### Regras

- Use `.umb-conv-meta-left` + `.umb-conv-meta-right` na linha 3; **não** use mais o padrão antigo `.umb-conv-right` fora do `.umb-conv-body`.
- Nunca posicione o badge de canal em outro canto do avatar — é sempre o inferior esquerdo.
- O `.umb-conv-sector` é **sempre** outline (sem fundo sólido). Cores de setor não variam.
- A `.umb-conv-tag` é **sempre** filled com cor forte — representa uma tag de contato definida pelo usuário. Se não souber a cor, use `violet` como fallback neutro.
- Quando há mais de 1 tag, mostre a primeira + `.umb-conv-tag-more` com o contador `+N` das demais.
- O `.umb-conv-assignee` (avatar do atendente) e o `.umb-conv-pending` (badge verde) ficam **sempre na linha 2** (dentro de `.umb-conv-preview-end`), alinhados à direita do preview. A ordem canônica é: **avatar → pending**.
- A linha 3 (`.umb-conv-meta`) fica só com tags à esquerda (`.umb-conv-tag` + `.umb-conv-tag-more`) e setor outline (`.umb-conv-sector`) à direita.
- Em produção, **sempre** use `<img>` no avatar do contato com a foto real; iniciais são fallback.

### 21.3 Coluna 2 — Detalhe do chat (`.umb-chat-detail`)

Ocupa o espaço restante (`flex: 1`) e usa `var(--umb-bg-primary, var(--bs-body-bg))` como fundo (§22). Layout vertical:

1. **Header** (`.umb-chat-header`, **56px** — mesma altura do `.umb-conv-topbar` para que o divisor horizontal inferior fique alinhado pixel-perfect entre as duas colunas). Substitui o shell header padrão. Contém:
   - `.umb-chat-header-contact` (avatar 36×36 + nome + meta com tags/setor/canal)
   - `.umb-chat-header-actions` — exatamente **8 botões icon-only** `btn btn-icon btn-text btn-lg` (§1), cada um com tooltip via `data-bs-toggle="tooltip" data-bs-placement="bottom" title="…"`, nesta ordem:
     - `ph-user` — "Detalhes do contato"
     - `ph-article` — "Detalhes da conversa"
     - `ph-arrow-bend-up-right` — "Transferir conversa"
     - `ph-lock-simple-open` — "Privar atendimento"
     - `ph-calendar-blank` — "Agendar envio de mensagem"
     - `ph-check` — "Finalizar conversa"
     - `ph-magnifying-glass` — "Pesquisar mensagem"
     - `ph-x` — "Ocultar essa janela"
2. **Pinned message** (`.umb-chat-pinned`, opcional) — barra amarela com ícone `ph-push-pin` para anotações/avisos fixados do chat. Mostra texto truncado e opcional link "Ver todas".
3. **Body** (`.umb-chat-body`) — área scrollável com `flex: 1`. Contém:
   - Separadores de data: `.umb-chat-date-sep` com `<span>Hoje</span>` / `<span>Ontem</span>` / `<span>18 de abril</span>`
   - Mensagens: `.umb-msg.{in|out}` com avatar + content + meta
   - Mensagens do sistema (transferências, automações): `.umb-msg-system` centralizada com ícone + texto
4. **Composer** (`.umb-chat-composer`) — sempre no rodapé, `flex-shrink: 0`. Contém:
   - Tabs (`.umb-chat-composer-tabs`): "Conversa / Nota interna / Resposta rápida" — única ativa por vez
   - `<textarea>` auto-expansível (min 38px, max 140px) em `.umb-chat-composer-input`
   - **Topbar**: atendente à esquerda (`.form-check.form-switch` com nome + botão `btn-icon btn-text` de editar) e Segmented (`.inset-control`) Mensagem/Notas à direita
   - **Textarea** (`.umb-chat-composer-input`) sem borda — o card do composer já delimita. Placeholder `Digite sua mensagem ou arraste um arquivo...`
   - **Toolbar**: à esquerda, 7 `btn btn-icon btn-text` com `gap: 4px` entre eles, nesta ordem canônica e com estes ícones: Anexar arquivo (`ph-paperclip`), Teclado emoji (`ph-smiley`), Respostas rápidas (`ph-chat-centered-dots`), Templates (`ph-quotes`), Chatbot (`ph-robot`), Figurinhas (`ph-sticker`), Editar atalhos (`ph-pencil-simple`). À direita: Agendar envio (`ph-clock`, `btn-icon btn-text`) + CTA circular `btn btn-primary btn-icon` (Gravar áudio — `ph-microphone`). Todos canônicos, pill (§3), tamanho Md (§2). Todos **sempre** com `data-bs-toggle="tooltip"` + `title` igual ao `aria-label`.

**Empty state** (nenhum chat selecionado): substitua o conteúdo da coluna 2 por um `.umb-chat-empty` com ícone circular (`.umb-chat-empty-ico`) + título + subtítulo.

### 21.4 Mensagens (`.umb-msg`)

Cada mensagem é um flex de 3 partes: **avatar** (28×28) + **content** + **meta**. Em `.umb-msg.out` (enviada pelo operador) o layout vira `row-reverse` e o content alinha à direita.

Estrutura canônica:
```html
<div class="umb-msg in">
  <div class="umb-msg-avatar">MR</div>
  <div class="umb-msg-content">
    <!-- autor opcional para conversas multi-operador: -->
    <!-- <span class="umb-msg-author">Ana Paula</span> -->
    <div class="umb-msg-bubble">…texto…</div>
    <div class="umb-msg-meta"><span>14:23</span><i class="ph ph-checks umb-msg-status-read"></i></div>
  </div>
</div>
```

- `max-width: 72%` (desktop) / `86%` (mobile) no `.umb-msg` inteiro — evita bubbles infinitas.
- Canto superior do bubble é "cortado" (3px) do lado do autor: `in` perde radius top-left, `out` perde radius top-right. Esse detalhe cria a "pontinha" visual sem usar SVG.
- Texto é `white-space: pre-wrap; word-wrap: break-word` — respeita quebras de linha e quebra palavras longas.

**Status de leitura** (`out`): `<i class="ph ph-checks umb-msg-status-read"></i>` (duplo check azul) para lida; use `ph-check` para entregue e `ph-clock` para pendente.

**Variantes de conteúdo** — substituem o texto dentro de `.umb-msg-bubble` (com `style="padding:4px;background:transparent;border:0"` para não duplicar bordas):
- **Imagem**: `.umb-msg-image > img` (max-width 280px, border-radius 10px)
- **Áudio**: `.umb-msg-audio` (pill) com `.umb-msg-audio-btn` (play) + `.umb-msg-audio-wave` + `.umb-msg-audio-time`
- **Arquivo**: `.umb-msg-file` com `.umb-msg-file-ico` (ícone Phosphor do tipo) + `.umb-msg-file-body` (nome + tamanho)

Em mensagens `out` os containers internos (audio/file) ganham background `rgba(255,255,255,.14)` sobre o bubble azul — contraste mantido.

**Mensagem do sistema** (`.umb-msg-system`) — pill cinza centralizada, usada para transferências, entradas/saídas de agentes, automações. Nunca tem avatar nem meta. Ex:
```html
<div class="umb-msg-system">
  <i class="ph ph-arrows-left-right"></i>
  Chat transferido de <strong>Atendimento Inicial</strong> para <strong>Suporte</strong>
</div>
```

### 21.5 Tags de conversa (`.umb-conv-tag`)

Cinco cores semânticas, cada uma com tokens próprios por tema (bg/color). Use consistência de significado por organização:

| Cor | Classe | Uso típico |
|---|---|---|
| Azul | `.umb-conv-tag.blue` | Lead / prospect |
| Verde | `.umb-conv-tag.green` | Cliente ativo |
| Amarelo | `.umb-conv-tag.amber` | Trial / atenção |
| Vermelho | `.umb-conv-tag.red` | VIP / urgência |
| Violeta | `.umb-conv-tag.violet` | Parceiro / expert |

Aparecem em: `.umb-conv-meta` (lista), `.umb-chat-header-meta` (header do chat) e `.umb-mh-chat-sub` (header mobile chat). Sempre como pills finas (border-radius 100px, padding 2px 8px, font-size 10.5px).

### 21.6 Mobile — duas variantes de tela

A lista de conversas **reusa** a variant `home` do mobile header (§15) porque é uma "home" de recurso (Chat). O chat aberto usa a **nova variant `chat`** introduzida aqui:

```html
<!-- Lista de conversas (mobile) — variant home padrão -->
<header class="umb-mobile-header" data-umb-c="mobile-header" data-variant="home"></header>

<!-- Chat aberto (mobile) — variant chat — contato no header, phone+menu à direita -->
<header class="umb-mobile-header"
        data-umb-c="mobile-header"
        data-variant="chat"
        data-contact-name="Maria Rocha"
        data-contact-tags="Cliente:green"></header>
```

Dentro da lista mobile, use `umb-conv-list` sem a largura fixa (ele ocupa o `umb-mobile-content` inteiro), mantendo **a mesma anatomia do desktop**: `.umb-conv-topbar` (6 botões) + `.umb-conv-toolbar` + `.umb-conv-segmented` + `.umb-conv-item`. Dentro do chat aberto mobile, use `.umb-chat-pinned` (opcional) + `.umb-chat-body` + `.umb-chat-composer`, **sem** o `.umb-chat-header` desktop (o mobile-header chat já cumpre esse papel).

**Navegação entre telas mobile**: clicar num `.umb-conv-item` no mobile deve abrir a tela de chat (push navigation). Voltar para a lista via botão back do mobile header (variant `chat` → `home`). Essa lógica não é parte do DS — é responsabilidade do produto — mas o markup das duas telas **deve** coexistir no mesmo HTML gerado, alternando por media query + JS de navegação (ver §19).

### 21.7 Tokens específicos do chat

Todos os tokens abaixo são sobrescritos em cada um dos 4 temas (`:root/dark`, `light`, `emerald`, `dark-emerald`):

| Token | Uso |
|---|---|
| `--umb-chat-bubble-in-bg` / `-color` | Bubble recebido (entrada) |
| `--umb-chat-bubble-out-bg` / `-color` | Bubble enviado (saída) — usa a `--bs-primary` do tema |
| `--umb-chat-list-hover` | Hover de `.umb-conv-item` |
| `--umb-chat-list-active` | Background do item ativo (contraste sutil) |
| `--umb-chat-sep-bg` | Linha horizontal dos separadores de data |
| `--umb-chat-pinned-bg` / `-color` / `-accent` | Barra de mensagem fixada |
| `--umb-conv-tag-{blue,green,amber,red,violet}-bg` / `-color` | Cores de tag de conversa |

O fundo da área de mensagens (`.umb-chat-detail`) usa `--umb-bg-primary` (ver §22) — o mesmo token do fundo principal de qualquer tela do DS. Não existe mais token dedicado `--umb-chat-canvas-bg`: isso garante que o chat, menus, tabelas e demais telas compartilhem o mesmo fundo por tema. Nos temas **claro/esmeralda** os bubbles de entrada ficam em `#ffffff` sobre `--umb-bg-primary` (card sobre canvas levemente colorido). Nos temas **escuro/bravia** o `--umb-card-bg` da lista é mais claro que o canvas, criando profundidade.

### 21.8 Regras específicas do chat

- **Nunca** coloque o `umb-shell-header` em cima do chat — o espaço é do chat.
- **Nunca** coloque `.umb-page-tabs`, `.umb-pg-header` ou `.umb-toolbar` dentro de `.umb-chat-detail` — essas abstrações são para páginas de CRUD, não para a tela de atendimento.
- **Sempre** use **um** item `.umb-conv-item.active` por lista no desktop quando há chat aberto; no empty state, **nenhum** item fica ativo.
- **Sempre** ancore o composer no rodapé (`flex-shrink: 0`) e faça o body scrollar — nunca o body empurre o composer para fora da viewport.
- **Ações do header do chat**: sempre `btn btn-icon btn-text btn-lg` (§1), exatamente 8 botões na ordem canônica descrita em §21.3. Todos **obrigatoriamente** com tooltip (`data-bs-toggle="tooltip"`). Nunca use `btn-primary` sólido no header do chat — o único sólido desta tela está no topbar da coluna 1 (o "Iniciar nova conversa" `ph-plus`) e no botão Enviar do composer.
- **Topbar da lista de conversas** (`.umb-conv-topbar`): 5 `btn-icon btn-text btn-lg` + spacer + 1 `btn-primary btn-icon btn-lg` (ordem fixa: `ph-chat`, `ph-users-three`, `ph-eye`, `ph-list-checks`, `ph-sort-descending`, spacer, `ph-plus`). Todos com tooltip. Altura **56px** = altura do `.umb-chat-header`, de modo que o `border-bottom` das duas colunas fique alinhado pixel-perfect.
- **Filtros de lista**: use **Segmented** (`.umb-conv-segmented > .inset-control.inset-control-lg`) com 3 segmentos "Entrada / Esperando / Finalizados" e contadores via `<span class="umb-seg-count">`. Nunca use `.umb-conv-tabs` (deprecated — mantido apenas por retrocompatibilidade).
- **CTA do composer**: único botão sólido da tela. Use `btn btn-primary btn-icon` (microfone — gravar áudio) quando o textarea está vazio; substitua o ícone por `ph-paper-plane-right` (ou troque para `btn btn-primary` com texto `Enviar`) quando houver conteúdo. Sempre canônico (pill §3, tamanho Md §2). **Nunca** use classe custom com border-radius menor. Disable quando nenhuma ação for possível.
- **Pinned message — usa o componente Alert canônico**: a faixa de anotação fixada (`.umb-chat-pinned`) é uma composição com `.alert .alert-warning` do DS (§5). Estrutura obrigatória:
  ```html
  <div class="umb-chat-pinned alert alert-warning" role="status">
    <i class="ph ph-push-pin umb-chat-pinned-icon"></i>
    <span class="umb-chat-pinned-text">É um cara legal</span>
    <a href="#" class="umb-chat-pinned-link"><i class="ph ph-list-bullets"></i>(1)</a>
    <button type="button" class="umb-chat-pinned-close" aria-label="Fechar anotação"><i class="ph ph-x"></i></button>
  </div>
  ```
  É um card flutuante (`margin: 12px 16px 0`), sem `border-bottom` (o card já delimita). O ícone de push-pin usa `var(--umb-chat-pinned-accent)` (amarelo vibrante). O link à direita (`"(1)"` com ícone `ph-list-bullets`) abre a lista de todas as anotações. O botão `.umb-chat-pinned-close` fecha a faixa — handler global no DS escuta o clique e remove a div via `element.remove()`. **Nunca** use `background: var(--umb-chat-pinned-bg)` direto; sempre via `.alert.alert-warning` para que a cor responda ao tema.
- **Composer — estrutura obrigatória**: card flutuante (`margin: 12px 16px 16px`, `border-radius: 12px`, `background: var(--umb-card-bg)`) com 3 seções verticais: topbar (switch + nome + edit à esquerda, Segmented `.inset-control` Mensagem/Notas à direita) → textarea → toolbar (ícones à esquerda, agendar + CTA à direita). **Nunca** use tabs (`.umb-chat-composer-tab` está deprecated desde a troca para Segmented — marcador canônico do DS para seletor binário). **Nunca** adicione borda ao textarea — o card já delimita e o foco do textarea é visual (cursor piscando), não decoração.
- **Badges de canal** (`.umb-conv-avatar-ch`): sempre usam as cores oficiais do canal (WhatsApp verde `#25D366`, Instagram gradient, etc.) — essas são as únicas cores hex permitidas na tela de chat, porque são brand dos canais (exceção à §20).

## 22. Tokens de fundo — bgPrimary, hover e bgActive

Estes são os três tokens semânticos que governam o fundo de qualquer tela, o hover de qualquer item interativo e o estado selecionado. Todo componente novo deve usar **apenas estes três** para fundos de superfície, hover e seleção — não crie tokens paralelos por tela, tabela ou menu.

### 22.1 `--umb-bg-primary` — fundo principal das telas

Aplique em qualquer área de conteúdo "canvas" (shell content, chat detail, mobile content, edit body, preview container). É o fundo mais amplo da tela, por trás dos cards/sidebar.

| Tema | Valor |
|---|---|
| Escuro (`dark`) | `#141619` |
| Claro (`light`) | `#EEF2FE` |
| Bravia (`dark-emerald`) | `#000C0B` |
| Esmeralda (`emerald`) | `#F6F7F7` |

**Uso em CSS**: `background: var(--umb-bg-primary, var(--bs-body-bg));`

**Alias legado**: `--umb-content-bg` continua existindo como alias de `--umb-bg-primary` para retrocompatibilidade. Em código novo, sempre prefira `--umb-bg-primary`.

### 22.2 `--umb-hover-bg` — fundo de hover (único token de hover do DS)

Aplique em **qualquer item interativo** em estado `:hover`:

- Linha de tabela (`.table tbody tr:hover`)
- Item de dropdown (`.dropdown-item:hover`)
- Item de popover de seleção (`.umb-tag-pop-item:hover`, `.umb-tag-pop-item` não selecionado)
- Item de theme switcher (`.umb-avatar-dropdown .theme-option:hover`)
- Botões flat sem fundo próprio (`.btn-text:hover` já usa este token via regras específicas)
- Linhas de `.umb-settings-item`, accordion button, nav-pills, chat-tabs, page-tabs

| Tema | Valor |
|---|---|
| Escuro (`dark`) | `rgba(255,255,255,.03)` |
| Claro (`light`) | `rgba(0,0,0,.025)` |
| Bravia (`dark-emerald`) | `rgba(255,255,255,.025)` |
| Esmeralda (`emerald`) | `rgba(0,0,0,.025)` |

**Uso em CSS**: `background: var(--umb-hover-bg);`

**Alias legados** (não usar em código novo — só existem para retrocompatibilidade):

- `--umb-table-hover` → alias de `--umb-hover-bg`
- `--umb-menu-item-hover-bg` → alias de `--umb-hover-bg`

### 22.3 `--umb-bg-active` — fundo do item selecionado

Aplique em todos os estados "ativo/selecionado" de:

- Linha de tabela selecionada (`.table tbody tr.selected`)
- Item de menu dropdown selecionado (`.dropdown-item.active`)
- Item de popover de seleção selecionado (`.umb-tag-pop-item.selected`)
- Card selecionado
- Conversa ativa na lista lateral do chat (quando o detalhe dessa conversa está aberto)
- Qualquer item de nav secundária que represente seleção persistente

| Tema | Valor |
|---|---|
| Escuro (`dark`) | `#484B53` |
| Claro (`light`) | `#E2E9FE` |
| Bravia (`dark-emerald`) | `#175651` |
| Esmeralda (`emerald`) | `#D3EFEC` |

**Uso em CSS**: `background: var(--umb-bg-active);`

**Alias legados** (não usar em código novo — só existem para retrocompatibilidade):

- `--umb-table-row-active` → alias de `--umb-bg-active`
- `--umb-menu-item-active-bg` → alias de `--umb-bg-active`

### 22.4 Hover vs selected — a distinção canônica

Dois estados visualmente distintos, dois tokens diferentes:

| Estado | Token | Quando |
|---|---|---|
| Mouse sobre o item | `--umb-hover-bg` | Transiente, desaparece ao sair |
| Item escolhido/selecionado | `--umb-bg-active` | Persistente, reflete estado do app |

Quando um item selecionado recebe hover, mantenha `--umb-bg-active` (não sobrescreva com hover) — o "selecionado" é mais importante que o "pairado". Padrão no CSS:

```css
.item:hover { background: var(--umb-hover-bg); }
.item.selected { background: var(--umb-bg-active); }
.item.selected:hover { background: var(--umb-bg-active); }
```

### 22.5 O que NÃO é `--umb-bg-active`

- **Nav ativo da sidebar principal** → continua com `--umb-nav-active-bg` (tem contraste específico sobre fundo azul/esmeralda do sidebar).
- **Estado ativo de botão/segmented** → continua com os tokens do próprio componente.

A distinção: `--umb-bg-active` é para **seleção de conteúdo** (o usuário escolheu essa linha/card/conversa). Os demais tokens de "ativo" são para **estados de UI** em componentes específicos.

## 23. Tokens de borda — border e border-on-brand

O DS expõe dois tokens semânticos para bordas. Todo componente novo deve usar **apenas estes dois** — não crie tokens paralelos por componente.

### 23.1 `--umb-border` — borda padrão (surfaces neutras)

Use em qualquer divisor, contorno ou separador sobre superfície neutra (cards, tabelas, inputs, accordions, tabs, page dividers, header do shell). É o token default — na dúvida, use este.

| Tema | Valor |
|---|---|
| Escuro (`dark`) | `#3D4047` |
| Claro (`light`) | `#D9D9D9` |
| Bravia (`dark-emerald`) | `#3D4047` |
| Esmeralda (`emerald`) | `#002B27` |

**Uso em CSS**: `border: 1px solid var(--umb-border);`

### 23.2 `--umb-border-on-brand` — borda sobre surface em cor de marca

Use quando a superfície por baixo é colorida via tema (azul no Bravia, verde no Esmeralda). Nesses temas, o token vira `rgba(255,255,255,.18)` — uma borda branca com alpha que funciona sobre saturação alta. Em Claro/Escuro mantém valor neutro equivalente ao `--umb-border`, então a mesma regra CSS funciona nos 4 temas sem override.

Casos canônicos:

- `.umb-shell-sidebar` — `border-right` (sidebar vira azul no Bravia e verde no Esmeralda)
- `.umb-mobile-header` — `border-bottom` (usa `--umb-sidebar-bg` como fundo)
- Qualquer elemento dentro da sidebar que precise de divisor (ex.: botão de créditos)

| Tema | Valor |
|---|---|
| Escuro (`dark`) | `#3D4047` |
| Claro (`light`) | `#D9D9D9` |
| Bravia (`dark-emerald`) | `rgba(255,255,255,.18)` |
| Esmeralda (`emerald`) | `rgba(255,255,255,.18)` |

**Uso em CSS**: `border-right: 1px solid var(--umb-border-on-brand);`

### 23.3 Como decidir entre os dois

Pergunta: **"Esta superfície pode ficar com fundo saturado/colorido em algum tema?"**

- **Não** (fundo sempre neutro — card, tabela, input, header do shell que é `#ffffff` nos temas coloridos) → `--umb-border`
- **Sim** (fundo é `--umb-sidebar-bg` ou análogo que muda para cor de marca) → `--umb-border-on-brand`

Nunca assuma "é da sidebar, então usa `border-on-brand`" — o que importa é a cor da superfície, não o componente. O header do shell vive no topo do layout ao lado da sidebar, mas tem fundo próprio (`--umb-shell-header-bg: #ffffff` em Bravia/Esmeralda), então usa `--umb-border`.

### 23.4 Espessura de borda — 1px para divisores, 2px para elementos interativos

Os tokens `--umb-border` e `--umb-border-on-brand` definem a **cor** da borda. A **espessura** segue uma regra de intenção:

| Espessura | Quando usar | Exemplos canônicos |
|---|---|---|
| `1px` | Divisores passivos, contornos de surface que **não capturam input do usuário** | Cards de conteúdo, tabelas, accordions fechados, page-tabs, divisores horizontais |
| `2px` | Elementos interativos que **capturam escolha ou input do usuário** | `.btn` (todos), `.form-control`, `.form-select`, `.umb-path-card`, `.umb-choice-card`, `.umb-fn-card`, `.umb-stat-card` |

Valores fora dessa escala são proibidos — incluindo `1.5px`, `2.5px`, `3px`. A escala binária 1/2 existe porque:

- **Affordance:** 2px sinaliza "isso responde ao seu clique/input"; 1px sinaliza "isso é conteúdo". O cérebro humano percebe a diferença sem pensar.
- **Hover previsível:** os elementos interativos já mudam `border-color` no hover para `var(--bs-primary)`. Com 2px, o salto de contraste é perceptível sem flash/shift de layout. Com 1.5px a diferença fica ambígua.
- **Pixel snapping:** `1.5px` renderiza diferente em telas @1x vs @2x (borrado em @1x). `2px` é sempre crisp.

#### Card selecionável — pattern canônico

Qualquer card que represente uma escolha do usuário deve seguir este pattern:

```css
.meu-card-clicavel {
  border: 2px solid var(--umb-border);
  border-radius: X;                      /* X conforme §3 */
  background: var(--umb-card-bg);
  cursor: pointer;
  transition: border-color .15s, background-color .15s;
}
.meu-card-clicavel:hover {
  border-color: var(--bs-primary);
  background: color-mix(in srgb, var(--bs-primary) 3%, var(--umb-card-bg));
}
.meu-card-clicavel.selected {  /* opcional, se o card tem estado persistente */
  border-color: var(--bs-primary);
  background: color-mix(in srgb, var(--bs-primary) 5%, var(--umb-card-bg));
}
```

Exemplos no DS que seguem este pattern: `.umb-path-card`, `.umb-choice-card`, `.umb-fn-card`, `.umb-stat-card`. Ao criar um novo "card selecionável", reutilize uma dessas classes se a semântica bater — **não crie uma variante nova** só por cor de hover ou padding diferente (§20 não duplicar componentes).

#### Cards de decisão (`.umb-path-card`) — regras de construção

Regras específicas do `.umb-path-card` que vão além do CSS — afetam **como as telas devem ser construídas**. Aplicam-se ao planejar conteúdo e layout de qualquer fluxo de escolha (onboarding, primeiros passos, próximo passo).

**Cor de ícone — regra dos 5**

- **Cor default é `neutral`** (`var(--umb-text-mid)`). A maioria dos cards deve ficar neutral; é a cor sóbria que mantém o olho do usuário nas palavras, não nos ícones.
- **Até 5 opções na tela:** modificadores (`.primary`, `.success`, `.warning`, `.danger`) podem ser aplicados individualmente quando há destaque semântico claro — primary para ação recomendada, success para aprovação, warning para aviso, etc.
- **6 ou mais opções na tela:** todos os ícones ficam neutros. Muitas cores transformam a lista em ruído visual — o cérebro não consegue priorizar quando tudo brilha. Se precisa muito de hierarquia, use apenas o modificador `.recommended` no card pai pra destacar 1 opção via borda colorida.
- Se a lista extrapola 5 opções com frequência, provavelmente o componente certo não é `.umb-path-card`. Considere um `.list-group` com Radio ou um Select — cards de decisão foram pensados para escolhas estratégicas curtas.

**Paridade de comprimento entre cards**

Todos os cards de uma mesma lista devem ter **a mesma quantidade de linhas** em título e subtítulo. Isso não é opcional — é o que mantém o peso visual equilibrado entre opções.

| Viewport | Título | Subtítulo |
|---|---|---|
| Desktop (≥768px) | **1 linha** (obrigatório) | **1 linha** (obrigatório) |
| Mobile (<768px) | mesma quantidade em todos os cards da lista | mesma quantidade em todos os cards da lista |

**Como escrever o copy:**

- No desktop, o container tem `max-width: 640px` (§21). Título e subtítulo precisam caber em 1 linha cada nesse espaço. Se não couber, o texto está longo demais — reescreva.
- Ao migrar pra mobile, se um card quebra pra 2 linhas, todos os outros da mesma lista devem estar em 2 linhas também. O contrário também vale: se um card tem só 1 linha no mobile, os outros não devem ter 2.

**Por quê (a razão, não só a regra):**

Quando um card tem texto mais longo que os outros, o cérebro **interpreta o maior como mais importante** — é uma heurística automática e inconsciente. Isso cria uma falsa hierarquia de importância entre opções que, do ponto de vista da decisão real, são paralelas. O usuário pode escolher a opção mais "pesada" visualmente simplesmente porque o texto parecia mais denso, não porque é a melhor escolha.

A paridade visual garante que a decisão aconteça no **conteúdo** (o que cada opção faz), não no **peso visual** (qual parece maior). Isso vale principalmente quando o `.umb-path-card.recommended` já existe na lista — ele é o único destaque legítimo, e não pode competir com um card vizinho que ficou grande só porque o copy saiu longo.

**Enforcement:** não há CSS que force essa regra (ellipsis truncaria conteúdo real — pior que quebra visual). É regra editorial: quem escreve o copy é responsável por manter paridade. Ao revisar uma tela nova, conte linhas antes de aprovar.

**Exceção ao stat-card:** o `.umb-stat-card` NÃO segue a regra dos 5 — cores nos ícones (`.total`, `.valid`, `.warn`, `.error`) são parte do seu contrato semântico (dashboard/filtros com código de cor fixo). A regra dos 5 e de paridade valem apenas para `.umb-path-card`.

## 24. Font weight — máximo 600

O DS limita o peso de fonte a três valores: **400 (regular)**, **500 (medium)** e **600 (semibold)**. Qualquer valor acima é proibido — incluindo `700`, `800`, `900`, `bold` e `bolder`.

### Por quê

- **Hierarquia visual consistente.** Limitar a 3 pesos evita que cada tela invente a própria escala, o que leva a descompasso entre títulos, labels, CTAs e badges.
- **Performance.** Carregar só os pesos realmente usados reduz o tamanho das fontes baixadas do Google Fonts (Poppins e Plus Jakarta Sans).
- **Acessibilidade de renderização.** Em telas de baixa densidade e em fonts sem hinting fino para 700+, pesos altos podem criar borramento; 600 é suficiente para diferenciar títulos de corpo.

### Como aplicar hierarquia sem usar peso > 600

| Necessidade | Solução no DS |
|---|---|
| Diferenciar título de parágrafo | `font-size` maior + `600` |
| Destacar número/métrica | `font-size` maior + `color: var(--umb-text-primary)` |
| Dar ênfase em palavra no meio do texto | `color: var(--umb-text-primary)` ou tag específica (`<strong>` estilizada com `600`) |
| Eyebrow/label de seção | `text-transform: uppercase` + `letter-spacing` + `600` |

### Configuração do Google Fonts

Carregue **apenas** os pesos permitidos:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

**Nunca** inclua `;700`, `;800` ou `;900` na query de pesos.

### Auditoria

Para verificar o código do DS:

```bash
# Não deve retornar nenhuma ocorrência:
grep -rE "font-weight\s*:\s*(700|800|900|bold|bolder)" .
grep -rE 'font-weight="(700|800|900)"' .   # SVGs
```

### Exceção

A única exceção são **elementos de marca externos** (ex: logos de canais — WhatsApp, Instagram) que trazem sua própria tipografia e não estão sob o escopo do DS.

## 25. Governança — fonte única da verdade

O `umbootstrap-design-system.html` é a **única fonte da verdade** do DS. Todas as outras telas do repo (`chat.html`, futuros exemplos, protótipos) são **consumidoras** — nunca fontes.

### A regra

Toda mudança de token, variável CSS ou regra de componente (hover, active, focus, variantes de botão, spacing, etc.) entra **primeiro** no `umbootstrap-design-system.html`. Só depois é replicada, se necessário, para telas de exemplo.

Ordem inversa é proibida: não aplique um token novo direto em `chat.html` (ou qualquer tela) esperando propagar pro DS depois. Esse fluxo é a principal causa de divergência silenciosa entre o DS nominal e o DS real.

### Por quê

A skill `umbler-ds` clona este repo em toda execução e lê **exclusivamente** o `umbootstrap-design-system.html` pra gerar telas novas. Se uma mudança vive só em `chat.html`, ela é invisível pra skill — qualquer tela nova nasce com o estado antigo, mesmo que visualmente o `chat.html` esteja correto.

Já aconteceu: os tokens `--umb-menu-item-hover-bg` / `--umb-menu-item-active-bg` (popup menu) foram adicionados em `chat.html` no patch 0018 e levaram o patch 0019 separado pra propagar ao DS-mestre. Telas geradas entre os dois patches nasceram com dropdown desatualizado.

### Como aplicar

Ao mudar qualquer coisa sistêmica (token, componente, regra de hover/active, variável de tema):

1. Abra `umbootstrap-design-system.html` primeiro. Faça a alteração nele — nos **todos** os blocos de tema aplicáveis (`[data-bs-theme="dark"]`, `"light"`, `"emerald"`, `"dark-emerald"`) + os 2 blocos `@media (prefers-color-scheme)` do tema `auto`.
2. Se a mudança afeta uma regra CSS de componente (`.dropdown-item`, `.btn`, etc.), edite a regra global — não replique só no escopo de uma tela.
3. Depois, se `chat.html` (ou outra tela) precisar refletir a mudança visualmente, replique ali — mas com a consciência de que é cópia, não origem.
4. Commit + push no GitHub. Sem push, a skill `umbler-ds` continua gerando com a versão antiga do repo remoto.

### Checklist de propagação

Antes de dar por encerrada uma mudança sistêmica:

- [ ] Alterado no `umbootstrap-design-system.html` (todos os blocos de tema)
- [ ] Regras CSS de componente atualizadas no escopo global, não no escopo de uma tela
- [ ] `chat.html` e outras telas refletem a mudança (opcional, se o visual depender)
- [ ] Commit no main + push pro `origin`
- [ ] Validação: `git clone --depth 1` do repo num diretório limpo e `grep` confirma que a mudança chegou

### Artefatos locais fora do repo

`*.patch`, `*.diff` e outros arquivos de rascunho de trabalho **não** entram no Git. Use `.gitignore` pra mantê-los fora do `git status`. A história do DS é o `git log`, não um monte de patches soltos no working tree.

