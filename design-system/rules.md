# Umbootstrap DS — Regras de Implementação

Este arquivo documenta todas as regras que devem ser seguidas ao gerar código com o Umbootstrap DS. Leia integralmente antes de gerar qualquer componente ou tela.

## Índice

0. **Regra Mestre — Só componentes do DS** (a regra que governa todas as outras)
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
11. Sidebar e Header — paridade de fundo por tema
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
26. .umb-stat-card como filtro de lista
27. Tela de operação assíncrona em massa (importação, exportação, sync)
28. Modal vs Página — heurística de container
29. Hierarquia visual proporcional à frequência da ação
30. Section header com toggle de busca
31. .umb-account-popup — popup de perfil com organizações
32. Iterar peso visual de baixo pra cima
33. Single entry point para ações raras
34. Reusar componentes do DS carrega o wrapper
35. Validar HTML balance após edits programáticos

---

## 0. Regra Mestre — Só componentes do DS

**Esta é a regra que governa todas as outras.** Se uma geração violar esta regra, a tela está errada — mesmo que todo o resto esteja correto.

### O princípio

Qualquer input que o usuário fornecer — descrição em texto, screenshot/imagem, HTML colado, URL de referência — é tratado **exclusivamente como expressão de intenção** sobre a estrutura/layout da tela. A implementação usa **apenas componentes, tokens e regras do DS**. O input não é copiado; é interpretado e reconstruído com as peças do sistema.

### Como processar cada tipo de input

**Texto descritivo** ("crie uma tela de contatos com busca e tabela")
- Identifique os componentes necessários (shell desktop+mobile, header, tabela, input-group de busca, botões de ação).
- Monte exclusivamente com as classes canonicas (`.umb-shell-*`, `.table`, `.input-group`, `.btn btn-outline-primary`, etc).

**Screenshot ou imagem**
- Identifique qual componente do DS corresponde a cada elemento visual (o card virou `.card`, o avatar virou `.profile-avatar`, a barra de busca virou `.input-group.input-group-lg`).
- **Não recrie pixel-perfect.** Se o screenshot usa um radius de 8px e o DS é 12/16, use o do DS. Se o screenshot usa uma cor custom, mapeie pro token mais próximo. A referência visual ensina a **estrutura**, não o estilo.

**HTML colado** (este é o caso que mais induz ao erro)
- **Leia e entenda** a estrutura (hierarquia de seções, quais blocos existem, como os dados fluem).
- **Não copie o HTML.** Traduza cada elemento 1:1 para o componente equivalente do DS:
  - `<div class="user-card">` do input → `.card` do DS
  - `<button class="action-button primary">` do input → `.btn.btn-primary` do DS
  - `<input class="search-box">` com ícone do input → `.input-group` com `.input-group-text` + `.form-control` do DS
  - CSS custom do input → ignore; aplique os tokens e classes do DS
  - Cores hex do input → mapeie pra `var(--bs-*)` ou `var(--umb-*)`
  - Espaçamentos arbitrários do input → use utilitários Bootstrap (`mb-3`, `gap-2`, etc) seguindo as regras de espaçamento do DS

**URL**
- Mesma lógica do screenshot: extraia a estrutura conceitual, não o visual bruto.

### Única exceção: conteúdo realmente único

Houver **um elemento visual sem equivalente no DS** — e apenas esse elemento — pode ser implementado com CSS custom. Exemplos típicos:
- Um gráfico de linha/barras específico (o DS não tem componente de gráfico ainda).
- Um logotipo de terceiro (clientes, integrações).
- Uma ilustração decorativa (hero image).

**Mesmo nesse caso**, o custom precisa herdar o que for aplicável:
- Bordas usam `var(--umb-border)`, não hex.
- Background usa `var(--umb-card-bg)` ou `var(--umb-surface-raised)`, não hex.
- Radius usa 12/16px (escala do DS), não valores arbitrários.
- Tipografia usa `--bs-body-font-family` e os tamanhos da §24.
- Cor de texto usa `--umb-text-primary/mid/dim`.

### Como decidir

Antes de escrever qualquer linha de HTML/CSS que não venha diretamente do DS, pare e responda:

1. **Já existe um componente no DS para isso?** Abra `umbootstrap-design-system.html` e procure. O DS cobre: botoes, inputs, tabelas, tabs, cards, modais, offcanvas, alerts, badges, steps, tooltips, popovers, dropdowns, accordions, breadcrumbs, avatares, loaders, tags, chat bubbles, stat cards, map rows, empty states, copy fields, code blocks.
2. **Se não existe exatamente, existe algo próximo que eu posso compor?** A maioria dos "novos componentes" é composição de componentes existentes (ex: uma "barra de filtros" é `.input-group` + `.btn-group` + `.dropdown`).
3. **Só se não existe nada próximo** — custom com tokens.

### O que isso proibe na prática

- ❌ Copiar CSS do HTML do usuário pra dentro do resultado
- ❌ Criar classes novas (`.minha-tela-header`, `.custom-card`) quando existe equivalente
- ❌ Usar hex inline (`background:#557CF2`) quando existe token
- ❌ Usar radius/padding/gap fora da escala do DS
- ❌ Replicar um componente de um screenshot pixel-perfect ignorando o DS
- ❌ Inline `style="color:#..."`, `style="border-radius:8px"`, `style="padding:13px"`

### O que isso produz

Tela gerada é **indistinguível** (em linguagem visual) de qualquer outra tela do Umbler Talk. Mesma hierarquia de botões, mesmos tamanhos, mesmos radius, mesma paleta reagindo a tema. A única coisa que varia entre telas é a composição dos componentes — não os componentes em si.

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
  font-size: 14px;
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

## 6.1 Footer de ações em cards (wizard, modal, drawer) — sticky, sem border-top

O `.umb-wiz-footer` (e qualquer barra de ações no rodapé de card central — modal, drawer, panel) tem um conjunto de regras que **só funcionam juntas**. Quebrar uma quebra o padrão inteiro. As regras existem porque cada uma resolve um bug real observado em produção.

### Comportamento esperado

Quando o conteúdo do card extrapola a altura da viewport, a barra de ações **fica fixa na base da viewport** durante o scroll, voltando à base natural do card quando o scroll chega ao fim. Isso garante que o usuário sempre vê "Voltar / Avançar" sem rolar.

### Implementação canônica

```css
.umb-wiz-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;

  /* Sticky bottom — engata na base do scroll container quando há scroll */
  position: sticky;
  bottom: 0;

  /* Background sólido tampa o conteúdo passando atrás durante o sticky */
  background: var(--umb-card-bg);

  /* Padding 16px em CIMA E EMBAIXO — o top separa do conteúdo, o bottom
     evita que os botões encostem na base da viewport quando o sticky engata */
  padding: 16px 0;

  /* Sem border-top, sem margens laterais negativas, sem border-radius */
  z-index: 5;
}
```

```css
/* Mobile: padding vertical reduzido */
@media (max-width: 767.98px) {
  .umb-wiz-footer {
    padding: 12px 0;
  }
}
```

### Os 6 requisitos que precisam coexistir

#### 1. Scroll container SEM `padding-bottom`

O sticky `bottom: 0` engata no edge interno do `padding-bottom` do scroll container. Se o `.umb-shell-content` tem `padding: 24px`, o sticky vai grudar **24px acima da base real da viewport** — fica um gap visível embaixo da barra.

**Regra:** o scroll container tem `padding: 24px 24px 0` (sem padding-bottom). Migre o respiro inferior para o wrapper interno:

```css
.umb-shell-content { padding: 24px 24px 0; overflow-y: auto; }
.umb-page-inner    { padding-bottom: 24px; }   /* respiro inferior aqui */
```

#### 2. Footer NÃO pode ter wrapper sem altura própria

Em telas com sub-views (`progress` / `done` / `summary` / etc), o footer trocado por sub-view **deve carregar o `data-subview` direto no `.umb-wiz-footer`**, não dentro de um wrapper que apenas envolve o footer. Esse wrapper teria altura igual à do footer (range = 0), e `position: sticky` precisa de range no pai pra ter onde "deslizar" antes de engatar.

```html
<!-- ❌ Errado — wrapper limita range do sticky a zero, sticky vira static -->
<div data-subview="progress">
  <div class="umb-wiz-footer">…</div>
</div>

<!-- ✅ Correto — footer é filho direto do .umb-wiz, range = altura do card -->
<div class="umb-wiz-footer" data-subview="progress">…</div>
```

#### 3. Padding vertical igual em cima e embaixo

Use `padding: 16px 0` (e não `padding: 16px 0 0`). O padding-bottom mantém os botões afastados da base da viewport quando o sticky engata — sem ele os botões ficam colados na borda inferior do browser, sensação de "desalinhado".

#### 4. Sem `border-top`

A barra de ações **nunca tem `border-top`** sobre o conteúdo — a separação visual é dada exclusivamente pelo `padding` interno e pela mudança de background. Adicionar uma linha cria peso desnecessário e quebra a sensação de continuidade do card.

```css
/* ❌ Errado — vira "barra de outro componente" */
.umb-wiz-footer { border-top: 1px solid var(--umb-border); }

/* ✅ Correto — só padding e background */
.umb-wiz-footer { padding: 16px 0; background: var(--umb-card-bg); }
```

#### 5. Sem margens laterais negativas (approach minimalista)

Já tentamos `margin-inline: -32px` para o footer "furar" o padding-inline do card e ocupar toda a largura. **Não funciona bem** — em alguns layouts a margem negativa quebra o engate do sticky em Chrome/Safari, e o footer fica solto no fim do card sem grudar.

A abordagem canônica é manter o footer **dentro do padding-inline do `.umb-wiz`**, como uma barra inset. O card já tem padding 32px nos lados; o footer respeita esse padding e fica visualmente alinhado com o conteúdo acima.

#### 6. Background sólido

`background: var(--umb-card-bg)` é obrigatório — é ele que "tampa" o conteúdo passando por baixo durante o sticky. Sem isso, o conteúdo aparece atrás dos botões enquanto o usuário rola.

### Por quê tudo isso

- **Sticky** evita o problema clássico de "preciso rolar pra ver o botão Avançar" em formulários longos — padrão dos wizards modernos (Stripe, Notion, Figma).
- **Sem border-top** porque a barra é parte do mesmo card. Background sólido + padding já criam separação. Linha adicional sugere "barra de outro componente" e quebra a leitura "tudo isso é uma única superfície".
- **Sem wrappers sem altura** porque é a primeira coisa que dá bug quando você tem múltiplas sub-views — agrupar é tentador, mas zera o range do sticky.
- **Sem padding-bottom no scroll container** porque é a segunda coisa que dá bug — o offset visual aparece "do nada" quando o sticky engata, e é difícil de debugar sem inspetor.
- **Sem margens negativas** porque é a terceira coisa que dá bug — funciona no Firefox, falha no Chrome em alguns layouts. Approach minimalista é mais portável.
- A combinação só funciona junta — sticky sem background tampa nada, sticky com border-top vira "ferramenta de browser" em vez de "ação do card", sticky com wrapper de range zero não engata.

### Aplica-se a

- `.umb-wiz-footer` (wizards / fluxos multi-passo)
- `.modal-footer` (modais Bootstrap reestilizados, quando o conteúdo do modal é scrollável)
- `.offcanvas-footer` (drawers)
- Qualquer barra de ações persistente na base de um `.card` ou container similar com scroll

### Auditoria rápida

Antes de entregar uma tela com wizard/modal/drawer:

```bash
# 1. Footer não envolvido em wrapper sem altura:
grep -B1 -A1 "umb-wiz-footer" arquivo.html | grep -B1 "data-subview" | grep "<div data-subview"
# (não deve retornar — se retornar, mover data-subview pro footer)

# 2. Sem border-top no footer:
grep -A5 "\.umb-wiz-footer" arquivo.html | grep "border-top"
# (não deve retornar)

# 3. Scroll container sem padding-bottom:
grep -A3 "\.umb-shell-content" arquivo.html | grep -E "padding:.*24px(\s|;|$)"
# (deve retornar "padding: 24px 24px 0", não "padding: 24px")
```

## 7. Ações em tabelas

- Ações de linha usam `btn btn-text` (Md Text Primary) com ícone
- O botão de três pontinhos é sempre o último da linha: `btn btn-icon btn-text`
- Use `btn btn-primary` sólido APENAS para ações imediatas de destaque (ex: "Finalizar ativação")
- Tabela desktop **sempre** tem contraparte mobile como `.umb-record-list` no mesmo HTML — ver §19.1.

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

## 11. Sidebar e Header — paridade de fundo por tema

Nos temas de **fundo escuro** (`dark` e `dark-emerald/Bravia`), `--umb-shell-header-bg` é idêntico a `--umb-sidebar-bg` (por referência ou por valor repetido) — sidebar e header formam uma faixa contínua. Nos temas de **fundo claro com sidebar colorida** (`light` com sidebar azul, `emerald` com sidebar verde), o header usa `#ffffff` explícito, destacando-se visualmente da sidebar colorida.

| Tema | `--umb-sidebar-bg` | `--umb-shell-header-bg` | Relação |
|---|---|---|---|
| Escuro (`dark`) | `#141619` | `#141619` | iguais |
| Claro (`light`) | `#557CF2` (azul) | `#ffffff` | diferentes (header branco) |
| Esmeralda (`emerald`) | `#005C55` (verde) | `#ffffff` | diferentes (header branco) |
| Bravia (`dark-emerald`) | `#000C0B` | `var(--umb-sidebar-bg)` | iguais |

Ao criar um tema novo, decida cedo qual dos dois padrões seguir — não deixe `--umb-shell-header-bg` sem definir (herda do `:root` e quebra a identidade visual do tema).

### 11.1 Altura unificada — 62px em todos os headers

Para que o símbolo/wordmark da sidebar fique alinhado horizontalmente com o conteúdo do header em qualquer tela, **todos os elementos de "topo" do DS têm altura fixa 62px**:

| Elemento | Onde aparece | Altura |
|---|---|---|
| `.umb-shell-head` | Topo da sidebar (.umb-shell-sidebar) — abriga logo + toggle | **62px** |
| `.umb-shell-header` | Header padrão das telas (T1–T4: breadcrumb + créditos) | **62px** |
| `.umb-conv-topbar` | Topbar da lista de conversas (T5 — chat) | **62px** |
| `.umb-chat-header` | Header do detail do chat (T5 — chat) | **62px** |

Como todas as faixas têm a mesma altura, o eixo Y central (31px) é o mesmo em qualquer tela — o símbolo "U" do canto superior esquerdo alinha com breadcrumb, créditos, ícones de topbar, avatar do contato, etc. Nunca crie um header novo com altura diferente de 62px no DS — se precisar de 2 linhas de informação, empilhe logicamente (ex: header + subheader stacked) mas mantenha o bloco do topo em 62px.

## 12. Avatar menu (theme switcher + logout)

> **DEPRECATED em apps multi-org**: o `.umb-avatar-dropdown` foi substituído pelo `.umb-account-popup` (§31) no template canônico do DS. O `<template id="umb-tpl-sidebar">` agora renderiza o trigger conectado à `.umb-account-popup` em vez do dropdown legado. Esta seção (§12) permanece como referência histórica e para apps single-tenant que ainda queiram o dropdown simples (Tema + Sair), mas geração nova deve usar §31.

O `.umb-si-avatar` no canto inferior da sidebar é **sempre** um trigger de popup. Ao clicar, abre um popover listando os 5 temas do DS (Auto, Claro, Escuro, Esmeralda, Bravia) + link Sair. Isso permite trocar o tema e visualizar a mudança instantaneamente.

### Markup obrigatório

```html
<div class="umb-avatar-menu dropdown dropend">
  <button type="button" class="umb-avatar-trigger" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" title="Perfil">
    <span class="umb-si-avatar">RC</span>
    <span class="umb-avatar-info" aria-hidden="true">
      <span class="umb-avatar-name">Rodrigo Costa</span>
      <span class="umb-avatar-email">rodrigo@email.com</span>
    </span>
  </button>
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
- O trigger **sempre** é um `<button class="umb-avatar-trigger">` — não é o avatar sozinho, é um **wrapper** que envolve o avatar (`.umb-si-avatar`) e o bloco de info (`.umb-avatar-info`). Isso garante que qualquer click dentro do trigger (inclusive nos textos de nome/email no expanded) abre o dropdown, sem precisar de JS extra pra redirecionar. `<button>` é obrigatório pra Bootstrap dropdown reconhecer e pra acessibilidade.
- O avatar tem **32×32px** com `font-size: 12px`. Esse tamanho equilibra a "massa visual" com os demais `.umb-si` (40×40) — avatar menor por convenção (identidade de "perfil", não "botão"), mas sem percepção de desalinhamento. Nunca use dimensões fora dessas duas: 32px avatar vs 40px botões.
- **No estado `.is-expanded`**, ao lado do avatar aparece `.umb-avatar-info` com nome (`.umb-avatar-name`, 13px/500) e email (`.umb-avatar-email`, 11px/opacity .7), ambos com ellipsis se estourarem a largura. No collapsed esse bloco fica `display: none` — só o círculo do avatar aparece. O trigger wrapper (`.umb-avatar-trigger`) cresce pra cobrir avatar+info no expanded (`width: 100%`, `gap: 12px`, `padding: 4px 12px`) — mesma área clicável dos demais itens do menu.
- **Cor do nome/email:** `var(--umb-nav-color)` — o mesmo token dos itens de menu. Isso garante contraste com `--umb-sidebar-bg` em qualquer tema (inclusive Claro/Esmeralda com sidebar colorida, onde `--umb-text-primary` / `--umb-text-mid` ficariam invisíveis). O email usa `opacity: .7` pra hierarquia sobre o nome, em vez de um token paralelo — funciona consistente em todos os temas sem casos especiais.
- O container usa `dropend` (abre à direita da sidebar, que é estreita — 60px — e fica à esquerda da tela).
- O trigger **obrigatoriamente** tem `data-bs-display="static"` **e** o CSS `.umb-avatar-menu > .dropdown-menu` força `position: absolute !important; left: 100% !important; bottom: 0 !important; top: auto !important; transform: none !important`. Os dois juntos garantem posicionamento fixo: o `data-bs-display="static"` desliga o Popper.js (sem cálculo dinâmico de posição entre aberturas), e o CSS com `!important` força o menu a ficar à direita do trigger, crescendo pra cima (`bottom: 0` alinha a base do menu com a base do avatar).

  **Motivo do `bottom: 0` em vez de `top: 0`:** o avatar vive no **fundo da sidebar** — se o menu abrir pra baixo (top: 0), ele estoura o viewport e corta. Abrindo pra cima (bottom: 0), o menu expande dentro do espaço livre acima do avatar, cabendo naturalmente mesmo em viewports com altura menor.

  **Motivo de desligar Popper:** com Popper ativo, o bug "primeira abertura OK, 2ª fecha, 3ª flipa pra baixo" reproduz mesmo com `flip` desabilitado via `popperConfig` — algum estado interno de Popper fica corrompido entre aberturas no contexto específico desse DS (sidebar estreita + trigger no fundo da viewport). Testei várias configurações de Popper e nenhuma resolveu de forma confiável. A solução cirúrgica é desligar Popper + fixar CSS. Trade-off: sem Popper, o menu não se ajusta dinamicamente se faltar espaço à direita. Como a sidebar vive na esquerda da tela (fixed, 60px) e o viewport mínimo de uso é >= 768px, sempre tem espaço — o trade-off não compromete o uso real.
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
- **Ícone do item ativo é renderizado no peso `fill` do Phosphor**: o glyph permanece o mesmo (HTML continua `<i class="ph ph-*">`), mas a regra `.umb-si.active .ph::before { font-family: "Phosphor-Fill" !important; }` troca a fonte para a versão preenchida. Isso exige carregar `https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css` junto com `regular/style.css` e `bold/style.css` no `<head>`. Não troque a classe HTML para `ph-fill` na ativação — o swap é puramente CSS, mantendo o mesmo markup nos estados default/hover/active.

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

### Standalone files (arquivos `template-N-*.html`)

Cada tela da seção "Shell & Templates" tem versões standalone pra abrir em nova aba:

- **`template-N-desktop.html`** — contém **ambos os shells** (desktop + mobile) com classes Bootstrap (`d-none d-md-flex` e `d-md-none`). Em browser grande mostra desktop; ao redimensionar pra `<768px` automaticamente alterna pro shell mobile. **Esse arquivo é a referência de como a tela funciona no produto real** — breakpoint funcional, mesmo HTML cobre ambos viewports.
- **`template-N-mobile.html`** — contém **apenas o mobile shell** dentro de um `.device-frame` (simulando celular no browser desktop). Serve pra inspeção isolada da versão mobile sem ter que redimensionar o browser. Em viewport real `<768px`, o frame some e o mobile ocupa fullscreen.

**Regra imutável:** ao criar uma tela nova no DS, o standalone desktop tem que nascer com o breakpoint funcional (ambos shells embutidos, classes Bootstrap no root de cada). Gerar só a versão desktop sem o shell mobile é considerado incompleto — a responsividade faz parte do contrato da tela.

### Validação

Após gerar uma tela, redimensione a janela do browser cruzando os 768px e confirme:
- Abaixo de 768px: apenas shell mobile visível, bottom nav fixo embaixo, campos Lg, sem sidebar
- A partir de 768px: apenas shell desktop visível, sidebar à esquerda, header com breadcrumb, campos Md

## 19.1 Tabela ↔ Lista de cards no breakpoint

Caso especial da §19. Toda lista de registros (`.table`) precisa ter uma contraparte mobile (`.umb-record-list`) no mesmo HTML — não basta ter os dois shells, **os dados também precisam ser duplicados na marcação correta de cada shell**. Tabela em mobile vira ilegível (truncate, scroll horizontal, ações invisíveis), e o "card mobile" inline-styled diverge entre telas e perde funcionalidade (seleção, dropdown de ações).

### Regra imutável

Sempre que uma tela exibir registros tabulares, ela deve conter:

- No `.umb-shell` (desktop, ≥768px): `<table class="table table-hover">` dentro de `.table-responsive`.
- No `.umb-mobile-shell` (mobile, <768px): `<div class="umb-record-list">` com um `.umb-record-card` por registro.

Gerar **só** a tabela (sem a lista mobile equivalente) é considerado incompleto — a tela está fora do contrato do DS.

### Markup canônico

```html
<!-- Mobile — dentro de .umb-mobile-shell.umb-mobile-content -->
<div class="umb-record-list">
  <div class="umb-record-card">                                <!-- .selected destaca o item -->
    <div class="umb-rc-head">                                  <!-- linha 1: select + identidade + badge -->
      <input type="checkbox" class="form-check-input form-check-input-lg umb-rc-select" aria-label="…">
      <div class="profile-avatar">…</div>                       <!-- 32×32, igual desktop -->
      <span class="umb-rc-title">Nome do registro</span>
      <span class="umb-rc-head-end badge text-bg-success">Ativo</span>
    </div>
    <div class="umb-rc-foot">                                  <!-- linha 2: meta + ações -->
      <span class="umb-rc-meta">Tipo <span class="umb-rc-sep">·</span> há 1 hora</span>
      <div class="umb-rc-actions">
        <button class="btn btn-text"><i class="ph ph-pencil-simple me-1"></i>Editar</button>
        <div class="dropdown">
          <button class="btn btn-icon btn-text dropdown-toggle" data-bs-toggle="dropdown" onclick="event.stopPropagation()">
            <i class="ph ph-dots-three-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">…</ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Mapeamento campo-a-campo

A coluna do desktop determina onde o campo aparece no card mobile:

| `<th>` desktop | Slot mobile | Observação |
|---|---|---|
| Checkbox de seleção | `.umb-rc-select` (dentro de `.umb-rc-head`) | Mesma classe `form-check-input-lg` |
| Coluna identidade (avatar + nome) | `.umb-rc-head` (avatar + `.umb-rc-title`) | Avatar mantém 32×32 — não diminuir |
| Status crítico (1 badge único) | `.umb-rc-head-end` | Canto superior direito; reservado pra **um** indicador |
| Colunas secundárias (Tipo, Data, Valor) | `.umb-rc-meta` separadas por `<span class="umb-rc-sep">·</span>` | Texto 12px, `--umb-text-mid` |
| Coluna de ações | `.umb-rc-actions` | 1 ação primária visível + dropdown three-dots |

### Estados visuais

- `:hover` → `--umb-hover-bg`
- `.selected` → `--umb-bg-active`
- Card sem hover/selected → `--umb-card-bg` + `border: 1px solid var(--umb-border)` + `border-radius: 12px`

### Princípios

- **Card é clicável**, mas com borda 1px (não 2px) — segue `.table tbody tr` que também é clicável com 1px de delimitação. Borda 2px continua reservada a controles primários (botões, inputs).
- **Botões dentro do card são `.btn .btn-text` (32px Md)** — NUNCA inventar `btn-xs` com inline `font-size:11px;padding:3px 8px`. Touch target abaixo de 44px é aceitável aqui porque o tap principal é na linha inteira; ações secundárias vivem no dropdown.
- **Avatar mantém 32×32** (igual desktop). Não reduzir pra 28×28 com inline style — a redução era só pra "caber" os cards inline-styled antigos.
- **Apenas um item visualmente destacado por `.umb-rc-head-end`** (status, badge crítico). Demais badges/meta vão pra `.umb-rc-meta`.
- **Lista sem wrapper com border** — segue a mesma lógica de tabelas (ver memória "Tabelas no DS — sem paginação e sem wrapper com borda"). A `.umb-record-list` é direta no `.umb-mobile-content`.

### Validação

Cruze 768px no browser e confirme:

- Mesmo número de registros nos dois lados (a `.table` desktop e o `.umb-record-list` mobile mostram a mesma fonte de dados).
- Mesmas ações disponíveis (qualquer ação que existe na linha existe no card — visível ou via dropdown).
- Mesma seleção mantida (`.selected` no card ↔ `tr.selected` na tabela).
- Avatares no mesmo tamanho; badge primário (Status) consistente em ambos.

### Quando NÃO usar `.umb-record-card`

- Listas com 1 só campo por item (lista de strings) → `.list-group` cobre ambos viewports.
- Linhas de chat/conversas → use `.umb-conv-item` (componente próprio com regras de avatar/timestamp/badge de canal).
- Cards de "estatística" ou "card de ação" da home → não são registros tabulares, usam `.card` do Bootstrap ou `.umb-path-card`.

## 20. O que NUNCA fazer

- Nunca gere uma tela com `.table` sem a contraparte mobile `.umb-record-list` no mesmo HTML. Tabela em viewport `<768px` é ilegível e perde funcionalidades (seleção, dropdown). Ver §19.1 para o markup canônico e mapeamento campo-a-campo.
- Nunca use `btn-xs` ou inline `style="font-size:11px;padding:3px 8px"` em ações de card mobile. Dentro de `.umb-record-card` use `btn btn-text` (32px Md) — ações secundárias vão pro dropdown three-dots. Ver §19.1.
- Nunca cole cards mobile improvisados (`<div class="p-3" style="background:var(--umb-card-bg);border:...">`). Use sempre `.umb-record-card` com seus slots fixos (`.umb-rc-head`, `.umb-rc-foot`, `.umb-rc-meta`, `.umb-rc-actions`). Ver §19.1.
- Nunca use cores hex hardcoded — sempre tokens via `var(--umb-*)`
- Nunca use `--umb-bg-primary` (nem o alias `--umb-content-bg`) como `background` de qualquer componente **dentro** de um card/wizard/drawer/modal. Essa cor é o canvas atrás dos cards, não dentro deles. Sub-blocos usam `transparent` + borda, `--umb-hover-bg`, `--umb-bg-active` ou `.alert.alert-info` — ver §22.6 para a tabela completa.
- Nunca coloque `border-top` no `.umb-wiz-footer` (nem em `.modal-footer`, `.offcanvas-footer` ou qualquer barra de ações na base de um card). A separação é só padding + background; uma linha adicional quebra a continuidade do card. Ver §6.1 para o padrão completo de footer sticky sem border-top.
- Nunca envolva o `.umb-wiz-footer` em um `<div>` extra que apenas o agrupe (ex: `<div data-subview="progress"><div class="umb-wiz-footer">…</div></div>`). Esse wrapper tem altura igual à do footer e zera o range do `position: sticky` — o footer não engata e some do scroll. Carregue o atributo de toggle direto no `.umb-wiz-footer`. Ver §6.1 §2.
- Nunca aplique `padding-bottom` ao scroll container que hospeda um `.umb-wiz-footer` sticky (ex: `.umb-shell-content`). O sticky `bottom: 0` engata no edge interno do padding e gera um gap visível abaixo do footer. Migre o respiro inferior para um wrapper interno (`.umb-page-inner`). Ver §6.1 §1.
- Nunca use margens laterais negativas no `.umb-wiz-footer` (`margin-inline: -32px`) tentando furar o padding-inline do card pra fazer barra full-bleed. Em Chrome/Safari isso quebra o engate do sticky em alguns layouts. O footer vive dentro do padding do card como barra inset. Ver §6.1 §5.
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

1. **Topbar** (`.umb-conv-topbar`, 62px — bate com `.umb-chat-header`): 5 `btn-icon btn-text btn-lg` + spacer + 1 `btn-primary btn-icon btn-lg` (ph-plus).
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

1. **Header** (`.umb-chat-header`, **62px** — mesma altura do `.umb-conv-topbar` para que o divisor horizontal inferior fique alinhado pixel-perfect entre as duas colunas). Substitui o shell header padrão. Contém:
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
- **Topbar da lista de conversas** (`.umb-conv-topbar`): 5 `btn-icon btn-text btn-lg` + spacer + 1 `btn-primary btn-icon btn-lg` (ordem fixa: `ph-chat`, `ph-users-three`, `ph-eye`, `ph-list-checks`, `ph-sort-descending`, spacer, `ph-plus`). Todos com tooltip. Altura **62px** = altura do `.umb-chat-header`, de modo que o `border-bottom` das duas colunas fique alinhado pixel-perfect.
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
| Escuro (`dark`) | `rgba(255,255,255,.05)` |
| Claro (`light`) | `rgba(0,0,0,.04)` |
| Bravia (`dark-emerald`) | `rgba(255,255,255,.04)` |
| Esmeralda (`emerald`) | `rgba(0,0,0,.04)` |

**Uso em CSS**: `background: var(--umb-hover-bg);`

**Nota sobre escolha do alpha:** Valores mais sutis (`.03/.025`) produziam hover quase imperceptível quando o item estava sobre `--umb-card-bg` (surface já raised em relação ao body-bg), porque o mesmo delta de lightness é perceptualmente menor em superfícies mais claras. A escala `.05/.04` mantém o hover visível em ambos os contextos (tabela em body-bg e settings-item em card-bg) sem perder o caráter sutil.

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

### 22.6 Regra inviolável — `--umb-bg-primary` NÃO entra dentro de cards

`--umb-bg-primary` é o **canvas da tela** — fica por trás dos cards, não dentro deles. Qualquer componente filho de um card (`.card`, `.umb-wiz`, `.umb-chat-detail`, `.umb-shell-content > .umb-page-inner`, drawer, modal) **nunca** pode usar `--umb-bg-primary` (nem seu alias `--umb-content-bg`) como `background`.

#### Por quê

Nos temas claros (`light`, `emerald`) o canvas é levemente colorido (`#EEF2FE` no Claro, `#F6F7F7` no Esmeralda) e o card é branco (`#ffffff`). Quando um sub-bloco de card recebe `--umb-bg-primary`, ele vira uma "ilha colorida" dentro do branco — quebra a hierarquia visual e parece um bug de tema.

Nos temas escuros (`dark`, `dark-emerald`) o efeito é mais sutil mas ainda errado: o card-bg é mais claro que o canvas, então o sub-bloco fica mais escuro que o resto do card — invertendo a regra de "elevação cresce para o topo".

#### Tokens corretos para sub-blocos dentro de cards

| Intenção do sub-bloco | Token correto |
|---|---|
| Apenas separar visualmente sem peso de cor | `background: transparent` + `border: 1px solid var(--umb-border)` (a borda já delimita) |
| Bloco de hover transitório (linha, item de lista) | `background: var(--umb-hover-bg)` |
| Bloco selecionado/persistente | `background: var(--umb-bg-active)` |
| Card aninhado (raro) | `background: var(--umb-card-bg)` (mesmo do pai — borda separa) |
| Aviso/dica informativa | converter para `.alert.alert-info` (tem fundo próprio responsivo a tema) |

#### O que isso proíbe na prática

```css
/* ❌ Errado — sub-bloco dentro de .umb-wiz/.card usando canvas */
.umb-dropzone     { background: var(--umb-bg-primary); }
.umb-map-source   { background: var(--umb-bg-primary); }
.minha-dica-box   { background: var(--umb-bg-primary); }
.badge-extension  { background: var(--umb-bg-primary); }
```

```html
<!-- ❌ Errado — inline style com canvas dentro de card -->
<div class="card">
  <div style="background: var(--umb-bg-primary); padding: 14px">…</div>
</div>
```

```css
/* ✅ Correto — transparente + borda */
.umb-dropzone   { background: transparent; border: 2px dashed var(--umb-border-strong); }
.umb-map-source { background: transparent; border: 1px solid var(--umb-border); }
```

```html
<!-- ✅ Correto — alert canônico para dica/sugestão -->
<div class="card">
  <div class="alert alert-info alert-action">
    <i class="ph ph-info alert-icon"></i>
    <div class="alert-body">
      <div class="alert-title">Título da dica</div>
      <div style="font-size:13px;opacity:.9">Subtítulo da dica.</div>
    </div>
    <button class="btn btn-text btn-lg">Ação</button>
  </div>
</div>
```

#### Exceção única — chat detail (§21.3)

`.umb-chat-detail` usa `--umb-bg-primary` como fundo da área de mensagens (§21.7) — mas isso é o **canvas do chat**, não um sub-bloco de card. Os bubbles dentro dele (`.umb-msg-bubble`) usam `--umb-card-bg`, mantendo a regra. Não generalize esse caso para outras telas.

#### Auditoria rápida

```bash
# Em qualquer arquivo de tela, esta busca não pode retornar resultados — exceto
# em definições de token (`--umb-content-bg: var(--umb-bg-primary)`):
grep -nE "background:\s*var\(--umb-bg-primary\)" arquivo.html | grep -v "umb-content-bg:"
```

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

Nunca assuma "é da sidebar, então usa `border-on-brand`" — o que importa é a cor da superfície, não o componente. O header do shell vive no topo do layout ao lado da sidebar, mas tem fundo próprio (`#ffffff` em Claro/Esmeralda; mesmo da sidebar em Escuro/Bravia — ver §11), então usa `--umb-border`.

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

O `umbootstrap-design-system.html` é a **única fonte da verdade** do DS. Todas as outras telas do repo (`template-5-desktop.html`, futuros exemplos, protótipos) são **consumidoras** — nunca fontes.

### A regra

Toda mudança de token, variável CSS ou regra de componente (hover, active, focus, variantes de botão, spacing, etc.) entra **primeiro** no `umbootstrap-design-system.html`. Só depois é replicada, se necessário, para telas de exemplo.

Ordem inversa é proibida: não aplique um token novo direto em `template-5-desktop.html` (ou qualquer tela) esperando propagar pro DS depois. Esse fluxo é a principal causa de divergência silenciosa entre o DS nominal e o DS real.

### Por quê

A skill `umbler-ds` clona este repo em toda execução e lê **exclusivamente** o `umbootstrap-design-system.html` pra gerar telas novas. Se uma mudança vive só em `template-5-desktop.html`, ela é invisível pra skill — qualquer tela nova nasce com o estado antigo, mesmo que visualmente o `template-5-desktop.html` esteja correto.

Já aconteceu: os tokens `--umb-menu-item-hover-bg` / `--umb-menu-item-active-bg` (popup menu) foram adicionados em `template-5-desktop.html` no patch 0018 e levaram o patch 0019 separado pra propagar ao DS-mestre. Telas geradas entre os dois patches nasceram com dropdown desatualizado.

### Como aplicar

Ao mudar qualquer coisa sistêmica (token, componente, regra de hover/active, variável de tema):

1. Abra `umbootstrap-design-system.html` primeiro. Faça a alteração nele — nos **todos** os blocos de tema aplicáveis (`[data-bs-theme="dark"]`, `"light"`, `"emerald"`, `"dark-emerald"`) + os 2 blocos `@media (prefers-color-scheme)` do tema `auto`.
2. Se a mudança afeta uma regra CSS de componente (`.dropdown-item`, `.btn`, etc.), edite a regra global — não replique só no escopo de uma tela.
3. Depois, se `template-5-desktop.html` (ou outra tela) precisar refletir a mudança visualmente, replique ali — mas com a consciência de que é cópia, não origem.
4. Commit + push no GitHub. Sem push, a skill `umbler-ds` continua gerando com a versão antiga do repo remoto.

### Checklist de propagação

Antes de dar por encerrada uma mudança sistêmica:

- [ ] Alterado no `umbootstrap-design-system.html` (todos os blocos de tema)
- [ ] Regras CSS de componente atualizadas no escopo global, não no escopo de uma tela
- [ ] `template-5-desktop.html` e outras telas refletem a mudança (opcional, se o visual depender)
- [ ] Commit no main + push pro `origin`
- [ ] Validação: `git clone --depth 1` do repo num diretório limpo e `grep` confirma que a mudança chegou

### Artefatos locais fora do repo

`*.patch`, `*.diff` e outros arquivos de rascunho de trabalho **não** entram no Git. Use `.gitignore` pra mantê-los fora do `git status`. A história do DS é o `git log`, não um monte de patches soltos no working tree.

## §20 — index.html como entry point do DS

O arquivo `/index.html` na raiz do repositório é a **landing page pública do DS** servida pelo GitHub Pages. Funciona como índice visual dos arquivos com acesso individual e é a porta de entrada pros usuários externos (designers, PMs, devs de outras áreas).

### §20.1 Regra de propagação — NOVA PÁGINA = NOVO CARD

Toda vez que um arquivo HTML **com acesso individual** (standalone, navegável por URL própria) for adicionado, renomeado ou removido na pasta `design-system/`, o `/index.html` deve ser atualizado no mesmo commit:

- **Arquivo novo** → adicionar card na seção correspondente (Templates, Utilitários, ou criar nova seção se o tipo não existir).
- **Arquivo renomeado** → atualizar o `href` do card e, se aplicável, o título.
- **Arquivo removido** → remover o card e atualizar o contador da seção.

### §20.2 Estrutura de um card

Cada card no index deve conter:

- **Ícone Phosphor** (`.ph-*`) consistente com a natureza da tela — ex: `ph-chat-circle-dots` pra chat, `ph-gear-six` pra settings, `ph-swatches` pra previews de token.
- **Título** igual ao usado no DS (evita dissonância entre contextos).
- **Descrição** de 1 linha explicando o que aquele template demonstra.
- **Links diretos** pra cada variante (Desktop / Mobile), sempre com `target="_blank" rel="noopener"`.

### §20.3 Seções do index

1. **Documentação** — 1 card principal (DS completo `umbootstrap-design-system.html`).
2. **Shell & Templates** — 1 card por template numerado (T1–TN), cada um com botões Desktop e Mobile.
3. **Utilitários** — previews de token, sandboxes, ferramentas auxiliares (ex: `preview-tokens-bg.html`).

### §20.4 Quando NÃO adicionar card

Arquivos que **não** devem virar card:

- Patches `.patch` / `.diff` (artefatos de dev).
- `rules.md` (documento interno, não página navegável).
- `.gitignore` e similares.
- Arquivos incluídos como *dependência* de outra página em vez de serem abertos diretamente.

### §20.5 Impacto técnico — tokens compartilhados

O `index.html` consome os tokens do DS via `<link rel="stylesheet" href="design-system/tokens.css">` (ver §21). Não duplica nada — mudança em `tokens.css` reflete imediatamente na landing.

Componentes visuais da landing (`.lp-card`, `.lp-header`, `.lp-theme-switch`, etc.) são próprios, mas usam apenas tokens `--bs-*` e `--umb-*` nas declarações, nunca cores literais — garante que os 4 temas (Escuro, Claro, Esmeralda, Bravia) funcionem automaticamente.

---

## §21 — `tokens.css` como single source of truth dos tokens

O arquivo `design-system/tokens.css` contém **todos** os tokens `--bs-*` e `--umb-*` de todos os temas do DS. É o único lugar onde esses valores são definidos.

### §21.1 Regra fundamental — DRY de tokens

É **proibido duplicar** blocos `:root` ou `[data-bs-theme="..."]` com tokens em qualquer outro arquivo HTML/CSS do projeto. Se aparecer um bloco desses fora do `tokens.css`, é bug.

**Por quê:** antes da extração (abril/2026), os tokens eram replicados inline em 11 arquivos HTML. Mudança de um token exigia 11 edits sincronizados, e divergências silenciosas eram inevitáveis. Com `tokens.css`, 1 edit propaga pra todos.

### §21.2 Como arquivos do DS carregam os tokens

Toda página que usa o DS precisa importar `tokens.css` no `<head>`, **antes** de qualquer `<style>` inline:

```html
<link rel="stylesheet" href="tokens.css">
<style>
  /* component styles aqui — livres pra usar var(--umb-*) e var(--bs-*) */
</style>
```

Para arquivos **dentro** de `design-system/` (os 11 HTMLs + index da pasta): path relativo `tokens.css`.
Para arquivos **fora** de `design-system/` (raiz do repo, ex: `index.html`): path relativo `design-system/tokens.css`.

### §21.3 Themes suportados

`tokens.css` define 5 variantes via atributo `[data-bs-theme]` no `<html>`:

- `dark` (default, referenciado como `:root`)
- `light`
- `emerald`
- `dark-emerald` (aka "Bravia")
- `auto` (segue `prefers-color-scheme` do SO)

### §21.4 Como adicionar / editar tokens

1. Editar **apenas** `design-system/tokens.css`.
2. Adicionar o token nos 5 blocos de tema (dark, light, emerald, auto dark, auto light, dark-emerald) — se o valor não muda entre temas, definir só no bloco `:root, [data-bs-theme="dark"]` e ele é herdado.
3. Documentar o propósito com comment inline, especialmente pra tokens semânticos (`--umb-chat-bubble-out-bg`, etc.).
4. Testar em **pelo menos**: DS principal + 1 template standalone + `index.html` em cada tema.

### §21.5 O que NÃO vai em `tokens.css`

- **Estilos de componente** (`.umb-card`, `.umb-conv-list`, etc.) — vão em `components.css` (§21.7) ou, enquanto não extraídos, ficam nos `<style>` inline dos HTMLs.
- **Seletores que usam tokens mas não definem nada** — ex: `[data-bs-theme="light"] .umb-brand-logo { filter: none; }` fica no HTML, não em `tokens.css`.
- **Tokens específicos de um único componente que não variam por tema** — podem ser definidos localmente na classe do componente (ex: `--umb-card-padding: 20px` dentro de `.umb-card`).

### §21.6 Trade-off aceito

`tokens.css` adiciona 1 round-trip HTTP no carregamento inicial das páginas (file:// é instantâneo; HTTP, ~50-100ms de latência em cold cache). Em troca:

- Eliminação de ~27KB duplicados por página × 11 arquivos = ~300KB removidos.
- Consistência visual garantida por construção.
- Mudança de token = 1 edit, não 11.

O trade-off vale a pena. Se um dia precisarmos otimizar cold-start ao extremo, dá pra voltar ao modelo inline **via build script** (tokens.css continua sendo a fonte, mas é inlineado em cada HTML no build). Por enquanto, não precisa — as páginas são estáticas e servidas via GitHub Pages com CDN.

### §21.7 `components.css` — componentes compartilhados

Complementa `tokens.css`: contém os **estilos de componente** reutilizáveis entre DS e landing. Primeira versão (abril/2026) tem um **subset** focado no que a landing pública (`/index.html`) consome:

- **Buttons** (`.btn` + variantes solid/outline/text/link/icon + sm/lg/focus/active)
- **Theme switcher** (`.theme-switcher`, `.theme-option` + estados)
- **Shell header family** (`.umb-shell-header`, `.umb-shell-header-right`, `.umb-breadcrumb`, `.umb-shell-content`, `.umb-page-inner`)
- **Path card family** (`.umb-path-card`, `.umb-path-icon` + modifiers, `.umb-path-title`, `.umb-path-badge`, `.umb-path-sub`)

**Regra de uso:**

```html
<!-- Ordem importa: tokens antes de components -->
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components.css">
```

**Status da extração:**

A v1 é **aditiva** — `components.css` é usado apenas pela landing. Os 11 HTMLs do DS (main + 10 standalones) **ainda têm esses componentes inline** no `<style>`. Portanto, durante a v1:

- Se mudar `.umb-path-card` no DS main → também editar em `components.css`.
- Se mudar em `components.css` → também propagar no DS main.

**Phase 2 (a fazer):** extrair **todos** os componentes do DS pra `components.css` e transformar os 11 HTMLs em consumers-only. Quando isso for feito, a regra acima desaparece — `components.css` vira a única fonte. Abrir issue/PR separado quando o escopo do DS justificar.

### §21.8 Onde fica o quê — resumo

| Tipo | Vai em | Exemplo |
|---|---|---|
| Tokens (`--bs-*`, `--umb-*`) | `tokens.css` | `--umb-card-bg: #202326` |
| Componentes reutilizáveis já extraídos | `components.css` | `.umb-path-card { ... }` |
| Componentes do DS ainda não extraídos | `<style>` inline do HTML | `.umb-conv-list { ... }` |
| Estilos específicos de uma página | `<style>` inline do HTML | `.lp-hero { ... }` na landing |
| Overrides de tema em componente | `<style>` inline do HTML | `[data-bs-theme="light"] .umb-brand-logo { filter: none; }` |

---

## 26. `.umb-stat-card` como filtro de lista

O `.umb-stat-card` (definido na §23.4 como card interativo com borda 2px) tem dois usos canônicos: (a) **dashboard** — exibir métricas estáticas em telas de overview; (b) **filtro** — quando os mesmos números são também os filtros aplicáveis a uma lista logo abaixo.

O caso (b) substitui combinações redundantes de `.inset-control` (Segmented) + 4 cards de KPI mostrando os mesmos números — pattern que aparecia em telas pré-DS e era ruído visual puro.

### Quando usar como filtro

Use stat-cards clicáveis **sempre** que:

- A tela tem 3–5 categorias mutuamente exclusivas + uma categoria "Todos"
- Cada categoria tem uma métrica numérica (count) que importa
- A lista abaixo é filtrada pela categoria selecionada
- O usuário precisa ver os totais e filtrar com um clique só (sem 2 componentes pra mesma informação)

Exemplos canônicos:
- Tela de importação em massa: Processados / Criados / Atualizados / Com erro
- Dashboard de campanha: Enviados / Entregues / Lidos / Falhados
- Lista de conversas com filtro: Total / Esperando / Atendendo / Resolvidos
- Auditoria de contatos: Todos / Válidos / Com aviso / Inválidos

### Markup canônico

```html
<div class="umb-stat-grid" role="tablist" aria-label="Filtrar por status">
  <div class="umb-stat-card active" data-imp-filter="all" role="tab" tabindex="0" aria-selected="true">
    <i class="ph ph-list umb-stat-icon total"></i>
    <div>
      <div class="umb-stat-num" data-imp-stat="processed">0</div>
      <div class="umb-stat-label">Processados</div>
    </div>
  </div>
  <div class="umb-stat-card" data-imp-filter="success" role="tab" tabindex="0" aria-selected="false">
    <i class="ph ph-check-circle umb-stat-icon valid"></i>
    <div>
      <div class="umb-stat-num" data-imp-stat="success">0</div>
      <div class="umb-stat-label">Criados</div>
    </div>
  </div>
  <!-- … -->
</div>

<!-- Lista filtrável logo abaixo -->
<div class="umb-ct-table-wrap" aria-live="polite">
  <table class="table umb-ct-table">…</table>
</div>

<!-- Empty state quando o filtro retorna 0 resultados -->
<div data-imp-empty style="display:none;text-align:center;padding:24px 16px;color:var(--umb-text-mid)">
  <i class="ph ph-funnel" style="font-size:24px;display:block;margin-bottom:6px"></i>
  Nenhum item com este status.
</div>
```

### Atributos obrigatórios

| Atributo | Valor | Motivo |
|---|---|---|
| `role="tablist"` | no `.umb-stat-grid` | Anuncia ao screen reader que é um grupo de filtros |
| `role="tab"` | em cada `.umb-stat-card` | Cada card é um filtro |
| `tabindex="0"` | em cada `.umb-stat-card` | Tornar tabbável (foco via teclado) |
| `aria-selected="true/false"` | em cada `.umb-stat-card` | Estado de seleção sincronizado com `.active` |
| `data-*-filter="<key>"` | em cada `.umb-stat-card` | Identificador do filtro (use prefixo do contexto: `data-imp-filter`, `data-conv-filter`, etc) |

A classe `.active` controla o estado visual (borda + bg em primary, herdado da §23.4). O atributo `aria-selected` deve sempre acompanhar — anuncia o estado pra screen readers.

### JS canônico

```js
function setFilter(filter) {
  document.querySelectorAll('[data-imp-filter]').forEach(card => {
    const isActive = card.dataset.impFilter === filter;
    card.classList.toggle('active', isActive);
    card.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  applyFilter(filter);
}
function applyFilter(filter) {
  document.querySelectorAll('[data-imp-row]').forEach(row => {
    row.style.display = (filter === 'all' || row.dataset.impRow === filter) ? '' : 'none';
  });
  updateEmpty();
}
function updateEmpty() {
  const visibleRows = document.querySelectorAll('[data-imp-row]:not([style*="display: none"])').length;
  const hasAnyRow  = document.querySelectorAll('[data-imp-row]').length > 0;
  document.querySelector('[data-imp-empty]').style.display = (hasAnyRow && visibleRows === 0) ? '' : 'none';
}
// Click + Enter/Space (a11y)
document.addEventListener('click', e => {
  const card = e.target.closest('[data-imp-filter]');
  if (card) setFilter(card.dataset.impFilter);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('[data-imp-filter]');
  if (card) { e.preventDefault(); setFilter(card.dataset.impFilter); }
});
```

### Anti-patterns

```html
<!-- ❌ Errado — Segmented duplicando os mesmos contadores dos stat-cards -->
<div class="umb-stat-grid">
  <div class="umb-stat-card">200 Processados</div>
  <div class="umb-stat-card">170 Criados</div>
  <!-- … -->
</div>
<div class="inset-control">
  <button>Todos 200</button>
  <button>Criados 170</button>
  <!-- … -->
</div>

<!-- ❌ Errado — stat-card sem aria-selected nem role="tab" (a11y quebrada) -->
<div class="umb-stat-card active" onclick="filtrar('error')">
  <i class="ph ph-x-circle umb-stat-icon error"></i>
  <div><div class="umb-stat-num">10</div><div class="umb-stat-label">Erros</div></div>
</div>

<!-- ❌ Errado — borda 1px em stat-card clicável (viola §23.4) -->
<div class="umb-stat-card" style="border: 1px solid var(--umb-border)">…</div>
```

### Por quê

- **Eliminação de redundância:** Segmented + 4 cards mostrando os mesmos números é uma das duplicações mais comuns em telas legadas. Stat-cards clicáveis fazem ambos os trabalhos com 1 componente — economiza altura vertical e elimina a tentação de pôr os dois em desincrono.
- **Affordance honesta:** o card clicável segue a regra dos 2px (§23.4), então o usuário "sente" pelo design que aquilo responde a clique. Sem precisar adicionar setas, hover-only states ou outras dicas extras.
- **A11y forte:** com `role="tab"` + `aria-selected`, screen readers anunciam "Criados, 170, selecionado" — equivalente ao que um Segmented faria, sem precisar do componente extra.
- **Empty state claro:** quando o filtro retorna 0, o `data-*-empty` aparece com ícone de funil e texto explicativo — usuário não fica vendo tabela vazia sem saber o porquê.

---

## 27. Tela de operação assíncrona em massa (importação, exportação, sync)

Tela canônica para operações que rodam em lote e demoram o suficiente pra exigir feedback de progresso ao usuário (importação de contatos, exportação de relatório, sincronização com sistema externo, processamento de campanha).

### Quando usar

- O processamento leva mais de ~3 segundos
- O resultado por item importa (não é só "sucesso"/"falha" geral)
- O usuário pode querer cancelar ou rodar em segundo plano
- Existem múltiplos status terminais por item (ex: criado / atualizado / com erro)

### Estrutura — duas sub-views compartilhando elementos

A tela tem dois estados visualmente distintos mas que **compartilham os mesmos stat-cards e a mesma tabela**. Os elementos compartilhados ficam **fora** dos `[data-subview]` para que o usuário não perca contexto entre o "rolar" da execução e o "concluído". As sub-views mudam apenas o **header** e o **footer**.

```html
<div class="umb-screen" data-screen="contacts-importing">

  <!-- ===== Header sub-view A: PROGRESSO (durante a execução) ===== -->
  <div data-subview="progress">
    <div class="umb-wiz-header">
      <h2 class="umb-wiz-title">Importando contatos</h2>
      <p class="umb-wiz-sub">Pode acompanhar aqui ou seguir para outras tarefas — avisamos quando terminar.</p>
    </div>
    <!-- Barra de progresso linear -->
    <div style="margin-top:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px">
        <div style="display:flex;align-items:center;gap:8px;color:var(--umb-text-primary);font-weight:500">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span data-imp-status>Importando contatos…</span>
        </div>
        <div style="color:var(--umb-text-mid)">
          <span data-imp-current>0</span> de <span data-imp-total>200</span>
          · <span data-imp-eta>calculando…</span>
        </div>
      </div>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="height:10px">
        <div class="progress-bar" style="width:0%;background:var(--bs-primary)" data-imp-bar></div>
      </div>
    </div>
  </div>

  <!-- ===== Header sub-view B: CONCLUÍDO (estado terminal) ===== -->
  <div data-subview="done" style="display:none">
    <div class="umb-wiz-header" style="display:flex;flex-direction:column;align-items:center;text-align:center">
      <div style="width:56px;height:56px;border-radius:50%;background:color-mix(in srgb,var(--bs-success) 15%,transparent);color:var(--bs-success);display:inline-flex;align-items:center;justify-content:center;margin-bottom:8px">
        <i class="ph ph-check" style="font-size:28px"></i>
      </div>
      <h2 class="umb-wiz-title">Importação concluída</h2>
      <p class="umb-wiz-sub"><span data-imp-total-done>200</span> contatos processados em <span data-imp-elapsed>1m 23s</span>.</p>
    </div>
    <!-- Banner de erro só quando houver -->
    <div class="alert alert-warning alert-action" data-imp-error-banner style="margin-top:16px;display:none">
      <i class="ph ph-warning alert-icon"></i>
      <div class="alert-body">
        <div class="alert-title"><span data-imp-error-count>0</span> contatos não puderam ser importados</div>
        <div style="font-size:13px;opacity:.9">Baixe o relatório para revisar e tentar novamente.</div>
      </div>
      <button type="button" class="btn btn-text btn-lg" style="color:inherit"><i class="ph ph-download-simple me-1"></i>Baixar relatório</button>
    </div>
  </div>

  <!-- ===== COMPARTILHADO: stat-cards como filtros (§26) ===== -->
  <div class="umb-stat-grid" style="margin-top:20px" role="tablist" aria-label="Filtrar por status">
    <div class="umb-stat-card active" data-imp-filter="all" role="tab" tabindex="0" aria-selected="true">…</div>
    <div class="umb-stat-card"        data-imp-filter="success" role="tab" tabindex="0" aria-selected="false">…</div>
    <div class="umb-stat-card"        data-imp-filter="updated" role="tab" tabindex="0" aria-selected="false">…</div>
    <div class="umb-stat-card"        data-imp-filter="error"   role="tab" tabindex="0" aria-selected="false">…</div>
  </div>

  <!-- ===== COMPARTILHADO: tabela com aria-live (anuncia novas linhas) ===== -->
  <div class="umb-ct-table-wrap" style="margin-top:16px" aria-live="polite">
    <table class="table umb-ct-table">
      <thead>…</thead>
      <tbody data-imp-list><!-- preenchido via JS, mais novo no topo --></tbody>
    </table>
  </div>

  <!-- ===== COMPARTILHADO: empty state ===== -->
  <div data-imp-empty style="display:none;padding:24px 16px;text-align:center;color:var(--umb-text-mid)">
    <i class="ph ph-funnel" style="font-size:24px;display:block;margin-bottom:6px"></i>
    Nenhum item com este status.
  </div>

  <!-- ===== Footer sub-view A (data-subview NO footer — §6.1 §2) ===== -->
  <div class="umb-wiz-footer" data-subview="progress">
    <div class="umb-wiz-footer-left">
      <button class="btn btn-text btn-text-danger btn-lg" onclick="cancelImport()"><i class="ph ph-x me-1"></i>Cancelar importação</button>
    </div>
    <div class="umb-wiz-footer-right">
      <button class="btn btn-outline-primary btn-lg" onclick="runInBackground()"><i class="ph ph-arrow-square-out me-1"></i>Rodar em segundo plano</button>
    </div>
  </div>

  <!-- ===== Footer sub-view B ===== -->
  <div class="umb-wiz-footer" data-subview="done" style="display:none">
    <div class="umb-wiz-footer-left">
      <button class="btn btn-outline-primary btn-lg" onclick="restartOperation()"><i class="ph ph-arrow-clockwise me-1"></i>Nova importação</button>
    </div>
    <div class="umb-wiz-footer-right">
      <button class="btn btn-primary btn-lg" onclick="goToResultList()">Ver contatos importados<i class="ph ph-arrow-right ms-1"></i></button>
    </div>
  </div>
</div>
```

### Componentes do DS reutilizados

| Necessidade | Componente |
|---|---|
| Métrica em tempo real + filtro | `.umb-stat-card` (§23.4 + §26) |
| Barra linear de progresso | `.progress` + `.progress-bar` (Bootstrap, com `--bs-primary` do tema) |
| Spinner inline | `.spinner-border.spinner-border-sm` (Bootstrap) |
| Lista por item | `.table.umb-ct-table` (§7) |
| Status semântico (Criado/Atualizado/Erro) | `.umb-ct-status` com modificadores `.success/.warn/.error` |
| Banner de erro pós-conclusão | `.alert.alert-warning.alert-action` |
| Estado terminal (check verde) | Círculo de fundo `color-mix(var(--bs-success) 15%, transparent)` + `ph-check` |

Zero CSS custom é necessário — tudo já existe no DS.

### Pontos de integração obrigatórios

A tela existe genérica e **deve** expor os seguintes hooks pra o fluxo hospedeiro sobrescrever:

```js
function startProgress(total) { /* dispara o processamento real */ }
function cancelImport()       { /* aborta o processamento (API real) */ }
function runInBackground()    { /* fecha a tela e mostra toast com link de tracking */ }
function restartOperation()   { /* volta ao início do fluxo (ex: gotoScreen('upload')) */ }
function goToResultList()     { /* navega pra lista de itens importados ou próximo passo */ }
```

A tela em si só conhece **estados visuais** — quem decide o destino dos botões é o fluxo hospedeiro (importação isolada vai pra `/contatos`; importação dentro de envio em massa vai pro próximo passo do wizard).

### Comportamentos de UX obrigatórios

1. **Lista cresce do topo pra baixo** (mais novo no topo) — usuário vê o que está acontecendo agora sem precisar scrollar até o fim.
2. **ETA dinâmico** calculado pelo ritmo real (`elapsed / processed × remaining`), não estimativa fixa.
3. **`aria-live="polite"` na tabela** + `role="progressbar"` na barra — anuncia o progresso a screen readers sem interromper.
4. **Pós-conclusão com erros: foco automático no filtro `error`.** Se `error > 0` ao chamar `showDone()`, dispare `setFilter('error')` automaticamente — leva o usuário direto pra ação útil.
5. **Banner de erro condicional** — só aparece quando `error > 0`. Quando 0, nem mostra.
6. **Stepper escondido** durante a execução — não é mais "passo de configuração", é fase distinta. No `renderSteps()`, retorne cedo se `activeKey === 'contacts-importing'` (ou equivalente).
7. **Cleanup do timer** — quando o usuário sair da tela via demo-nav, navegação ou fechar, pare o setInterval. No `gotoScreen(name)`, chame `_impStop()` se `name !== 'contacts-importing'`.

### Estados de status por item

Por convenção, use 3 status semânticos:

| Status | Modificador `.umb-ct-status` | Ícone | Quando |
|---|---|---|---|
| `success` | `.success` | `ph-check` | Item criado/processado com sucesso |
| `updated` | `.warn` | `ph-arrows-clockwise` | Item já existia e foi atualizado (não é erro, mas merece destaque visual) |
| `error` | `.error` | `ph-x` | Item falhou (telefone inválido, campo obrigatório ausente, etc) |

O status "atualizado" merece distinção do "criado" porque o usuário precisa entender o impacto no banco — se ele não esperava atualizações, é um sinal pra revisar a planilha.

### Anti-patterns

```html
<!-- ❌ Errado — stepper visível na tela de execução polui sem agregar -->
<div class="steps-container">
  <div class="step-item done">…Selecionar arquivo</div>
  <div class="step-item active">…Importando</div>
</div>

<!-- ❌ Errado — stat-cards SÓ na sub-view "progress", desaparecem no "done":
     usuário perde a visão geral dos resultados -->
<div data-subview="progress">
  <div class="umb-stat-grid">…</div>
  <table>…</table>
</div>
<div data-subview="done">
  <div class="alert alert-success">200 processados</div>  <!-- sem detalhamento -->
</div>

<!-- ❌ Errado — Segmented redundante com stat-cards (§26) -->
<div class="umb-stat-grid">…</div>
<div class="inset-control">…mesmos contadores…</div>

<!-- ❌ Errado — tabela com max-height + overflow:auto cria scroll interno
     duplicado quando o card já tem sticky footer (§6.1) -->
<div class="umb-ct-table-wrap" style="max-height:380px;overflow:auto">…</div>
```

### Por quê tudo isso

- **Stat-cards compartilhados entre sub-views** porque o usuário não pode "perder a referência" do que aconteceu quando o processo termina rápido (importação de 200 contatos pode levar 5 segundos). Manter os números visíveis no done permite filtrar erros sem fechar a tela.
- **Header diferente por sub-view** (linha de progresso vs check verde + tempo decorrido) porque são fases conceitualmente distintas — "está rolando" vs "terminou". O resto da tela (stats + lista) é a mesma "verdade" sob duas lentes diferentes.
- **Filtro automático em `error`** pós-conclusão porque é o caminho mais útil em 90% dos casos. O usuário que tem erros precisa agir; quem não tem erros nem viu o filtro mudar (já estava vazio).
- **Aria-live na tabela** porque uma operação que adiciona linhas dinamicamente sem aviso pra screen reader é uma operação inacessível.


## 28. Modal vs Página — heurística de container

Decidir entre modal e página é uma escolha de **tipo de container**, não de copy. A escolha errada gera inconsistência com o resto da aplicação e quebra padrões de navegação.

### Heurística

| Tipo de fluxo | Container correto |
|---|---|
| Confirmação destrutiva ("Tem certeza?") | Modal |
| Decisão urgente que bloqueia o app | Modal |
| Flow transiente curto (1–2 telas, sem URL compartilhável) | Modal |
| Item navegável de menu (sidebar, Configurações) | **Página** (com breadcrumb) |
| Fluxo educacional ou de criação de recurso | **Página** (eventualmente com wizard interno) |
| Onboarding / primeira vez | **Página** |

### Regra principal

**Se a ação tem entry point por um item de menu, ela navega — não abre modal.** O DS não tem precedente de item de menu de Configurações que abre modal: todos os itens navegam. Quebrar isso gera dois mundos no mesmo menu (uns navegam, outros sobrepõem) e o usuário perde o modelo mental de "menu = navegação".

### Por quê

- **Modais sobre popups/menus criam stack confuso.** Popup já é uma camada; modal acima dela é uma segunda camada flutuante — visualmente quebra a hierarquia.
- **Páginas têm URL compartilhável; modais não.** Para fluxos importantes (criação de recurso, educação), a URL ser compartilhável vale mais que a "leveza" do modal.
- **Educação merece espaço.** Modais comprimem conteúdo num retângulo; páginas dão respiro pra explicar conceitos sem reduzir.
- **Consistência ganha sobre conveniência.** Um único pattern (item de menu navega) é mais previsível que duas regras conflitantes.

### Quando aparece a tentação de usar modal pra um fluxo de criação

Se o fluxo tem:
- (a) Conteúdo educacional / explicativo
- (b) Múltiplos passos
- (c) Entry point por menu

→ É **página**. Tente colocar isso num modal e você vai duplicar conteúdo, gerar URLs não-compartilháveis, e quebrar o padrão do menu de Configurações.

### Anti-pattern

- ❌ Item "Criar X" do menu de Configurações abrindo modal — quebra padrão do menu.
- ❌ Modal sobre popup — segunda camada confunde hierarquia visual.
- ❌ Confirmação simples virando página — força navegação desnecessária.
- ❌ Ter dois entry points pra mesma feature, um abrindo modal e outro navegando pra página — duplicação de conteúdo + manutenção dobrada.

### Migração

Quando uma feature usa modal mas tem entry point por menu, converta pra página. Mantenha o conteúdo: o markup do modal-content vira o conteúdo do card central da página, geralmente envolto num `.umb-wiz` (§26 do rules.md original — wizards).

## 29. Hierarquia visual proporcional à frequência da ação

**Importância ≠ frequência.** A variável que define o peso visual de uma ação é quão frequentemente o usuário vai usá-la — não quão "estratégica" ela é. Inflar uma ação rara porque ela é importante gera ruído visual e dilui o que realmente é frequente.

### Tabela de calibração

| Frequência esperada | Posicionamento | Estilo recomendado |
|---|---|---|
| Múltiplas vezes por dia | CTA proeminente | `btn btn-primary btn-lg` no topbar/toolbar primário |
| Diariamente / algumas vezes por semana | Toolbar secundária | `btn btn-primary` (Md) ou `btn btn-outline-primary` |
| Semanal / mensal | Junto a outras ações | `btn btn-outline-primary` ou `btn btn-text` (Md) |
| Rara (poucas vezes na vida do usuário) | Junto a ações relacionadas (lupa, filtro) | `btn btn-icon btn-primary btn-sm` em header de seção |

### Casos canônicos

- **"Iniciar nova conversa"** → `btn btn-primary btn-icon btn-lg` na topbar do chat. Frequência: várias vezes por hora.
- **"Adicionar contato"** → `btn btn-primary btn-lg` no toolbar da página de Contatos. Frequência: várias vezes por dia.
- **"Criar nova organização"** → `btn btn-icon btn-primary btn-sm` no header da seção de orgs no popup de perfil (§31). Frequência: poucas vezes na vida do usuário (talvez 1–5x).
- **"Excluir conta"** → `btn btn-text btn-text-danger btn-sm` em settings. Frequência: raríssima.

### Pergunta de calibração

Antes de definir o tamanho/estilo de um botão, pergunte:

> "Esse usuário vai clicar nesse botão **uma vez na vida** ou **todo dia**?"

Se for raro → ação enxuta, colada com ações relacionadas (lupa, filtro, settings de seção). Se for frequente → ação proeminente, com o peso da `btn-primary lg`.

### Por que isso importa

- **Atenção é finita.** Se cada ação clama por destaque, nenhuma se destaca.
- **A "ação rara" infla com ego do PM, não com necessidade do usuário.** Times de produto tendem a inflar ações que internamente são consideradas "estratégicas" (ex: criar segunda org, virar power-user). Pro usuário, isso é uma curiosidade pontual.
- **Ações inflada ensinam comportamento errado.** Botão grande convida exploração — gera lixo no banco (orgs criadas sem propósito, contatos duplicados, etc.).

### Anti-pattern

- ❌ "Criar nova organização" como CTA primário full-width no rodapé do popup de perfil (foi nosso caso anterior — gerou orgs aleatórias).
- ❌ "Convidar amigo" / "Indicar e ganhe" como `btn-primary lg` na home — é rara, deveria ser secundária.
- ❌ "Trocar plano" como botão proeminente no menu — feito 1–2x por ano por usuário.

### Quando inflar é aceitável

- Onboarding ativo (primeira vez): a ação chave do passo pode ser proeminente, mesmo que rara depois.
- Empty states: quando a única ação possível é "criar primeiro X", inflar faz sentido.
- Banner promocional temporário: pode usar peso visual maior por janela limitada de tempo.

## 30. Section header com toggle de busca

Pattern reutilizável pra listas dentro de painéis estreitos (popup, drawer, sidebar) onde uma busca permanentemente visível custaria altura demais. **Lupa colapsada por padrão; ao clicar, título/ações somem e dão lugar a um `input-group-sm` com X de fechar.**

### Quando usar

- Lista dentro de popup/drawer com 5+ itens onde busca é útil mas não principal
- Painéis laterais com listas filtráveis (member picker, tag picker, account switcher)
- Headers de seção dentro de settings/admin com lista grande

### Quando NÃO usar

- Lista é a tela inteira → use `input-group-lg` permanente no toolbar (§4 do rules.md)
- Lista tem ≤4 itens → busca é overengineering
- Lista mobile fullscreen → mobile não tem hover pra "descobrir" a lupa; deixe a busca visível
- Lista crítica onde o usuário SEMPRE filtra antes (ex: contatos com 10k+ entries) → busca permanente

### Markup canônico

```html
<div class="umb-section-head" data-search="closed">
  <span class="umb-section-title">Título da seção</span>
  <div class="umb-section-actions">
    <button class="btn btn-icon btn-text btn-sm"
            onclick="toggleSearch(this)"
            aria-label="Pesquisar"
            data-bs-toggle="tooltip" title="Pesquisar">
      <i class="ph ph-magnifying-glass"></i>
    </button>
    <!-- demais ações de seção (ex: + Novo) -->
  </div>
  <div class="umb-section-search input-group input-group-sm">
    <input type="text" class="form-control" placeholder="Pesquisar..."
           oninput="filterList(this)">
    <span class="input-group-text" onclick="toggleSearch(this)"
          role="button" aria-label="Fechar pesquisa" style="cursor:pointer">
      <i class="ph ph-x"></i>
    </span>
  </div>
</div>
```

### CSS canônico

```css
.umb-section-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; padding: 12px 16px 6px; min-height: 40px;
}
.umb-section-actions { display: flex; align-items: center; gap: 4px; }
.umb-section-search { display: none; flex: 1; }
.umb-section-head[data-search="open"] .umb-section-title,
.umb-section-head[data-search="open"] .umb-section-actions { display: none; }
.umb-section-head[data-search="open"] .umb-section-search { display: flex; }
```

### JS canônico

```js
function toggleSearch(scope) {
  const head = scope.closest('[data-search]');
  if (!head) return;
  const isOpen = head.dataset.search === 'open';
  head.dataset.search = isOpen ? 'closed' : 'open';
  const input = head.querySelector('input');
  if (!isOpen) {
    setTimeout(() => input?.focus(), 50);
  } else if (input) {
    input.value = '';
    // restaurar visibilidade da lista (se filtrada)
    const root = head.closest('[data-list-root]') || head.parentElement;
    root.querySelectorAll('[data-item], .org-card').forEach(el => el.style.display = '');
  }
}
```

### Regras

- **Toggle bidirecional via `data-search`** (`closed` ↔ `open`) no container do header. Não usar classe `.is-open` — atributo data permite seletores CSS limpos.
- **Foco automático** ao abrir (`setTimeout` 50ms pra esperar reflow).
- **Reset do filtro** ao fechar — campo limpo + lista restaurada. Não preservar busca anterior.
- **Botão X dentro do `input-group-text`** (não fora do input) — segue pattern de input-group do DS (§4) com borda no wrapper.
- **Lupa usa `btn-icon btn-text btn-sm`** — não `btn-primary`. É um disclose, não uma CTA.
- **Outras ações de seção** (criar, filtrar) ficam **junto** da lupa dentro de `.umb-section-actions`. Quando a busca abre, o conjunto inteiro some (lupa + ações irmãs).

### Por que esconder ações irmãs ao abrir busca

A lupa, quando aberta, **vira o foco da seção** — o usuário está procurando algo. Manter outras ações (criar nova, filtros) visíveis nesse momento confunde porque competem com a digitação. Uma vez que a busca fecha (X), as ações reaparecem. Isso é coerente com o modelo "uma intenção por vez".

### Anti-pattern

- ❌ Lupa fora do `umb-section-actions`, separada visualmente — quebra o agrupamento visual.
- ❌ Manter botão "+ Novo" visível quando a busca está aberta — duas intenções competindo.
- ❌ Usar `btn-primary` na lupa (a ação principal não é "buscar", é o conteúdo da lista).
- ❌ Não resetar o input ao fechar — usuário abre, fecha, abre de novo, encontra o termo antigo lá.

## 31. .umb-account-popup — popup de perfil com organizações

Componente que vive flutuante sobre o app, acionado pelo avatar da sidebar. Contém: dados da conta, lista de organizações com troca/criação, e logout. Substitui o `.umb-avatar-menu` legado quando há lista de organizações pra exibir.

### Quando usar

- Aplicação tem múltiplas organizações por usuário
- Avatar da sidebar precisa abrir um menu mais rico que o `.umb-avatar-menu` (§12)
- Há ações secundárias de conta (Meu perfil, Assinaturas, Indique e ganhe) que não cabem na sidebar

### Estrutura

Definida no `umbootstrap-design-system.html`. Veja a seção "Account Popup" do DS pra markup, classes e exemplo. Resumo da hierarquia interna:

```
.umb-account-popup
├── .umb-account-popup-head    (avatar + nome — fixo)
├── .umb-account-popup-tabs    (Minha conta / Preferências — fixo)
├── .umb-account-popup-fixed   (itens de conta — fixo)
├── .umb-section-head          (título da seção + ações — fixo, §30)
├── .umb-account-popup-list    (orgs — única área scrollable)
└── .umb-account-popup-foot    (Sair — fixo)
```

### Regras de uso

- **Apenas uma área scrollable** (a lista de orgs). Header, tabs, itens de conta e footer ficam fixos. Esse é o padrão de popup denso — scroll global da popup é confuso.
- **Itens da popup são pills** (`border-radius: 999px`, `min-height: 37px`). Vale tanto pros itens de conta (Meu perfil, etc.) quanto pros cards de organização.
- **Avatar de organização é circular** (24×24, `border-radius: 50%`) com **ícone Phosphor centralizado** dentro — não usar iniciais em letras (lê como "letras formando círculo", não como avatar).
- **Espaçamento de 2px entre itens** consecutivos da lista de orgs (`.org-card + .org-card { margin-top: 2px }`) — separa visualmente sem expandir altura.
- **Linha divisora** entre os itens de conta (Meu perfil, etc.) e a seção de organizações via `border-top: 1px solid var(--umb-border)` no `.umb-section-head`.
- **Ação "criar nova organização"** segue §29: ação rara → `btn-icon btn-primary btn-sm` colado na lupa de busca, dentro de `.umb-section-actions`. **Nunca** como CTA grande no rodapé.
- **Busca da lista** segue §30 — toggle por lupa, troca título por input-group-sm.
- **Botão "Sair"** centralizado, `btn-text-danger btn-lg`, ocupa a largura do footer (`width: 100%`). Não usar `justify-content: flex-start` (default do `.btn` é center).

### Tabs internas

A popup tem duas tabs canônicas: **Minha conta** e **Preferências**. Não adicione uma terceira sem antes considerar se cabe em uma das duas. Tabs em popups estreitas comprimem rapidamente.

#### Aba "Minha conta"
Contém os itens de conta (Meu perfil, Assinaturas e planos, Indique e ganhe) seguidos da seção de organizações (com busca toggle e ação de criar). É a tab default — pane com `data-tab-pane="account"`.

#### Aba "Preferências"
Contém preferências pessoais do usuário, cada uma como um par `<label> + .inset-control--block` (segmented full-width). Pane com `data-tab-pane="prefs"` (`hidden` por default).

Preferências canônicas (3 grupos + 1 link):

| Preferência | Componente | Variantes | Ícones |
|---|---|---|---|
| Reatribuição de chats (com `?` tooltip) | `inset-control--block` (segmented) | Off / Auto / Sempre | `prohibit` / `shuffle` / `arrows-clockwise` |
| **Tema** | `nav nav-pills flex-column` (vertical pills) | Auto / Claro / Escuro / Esmeralda / Bravia | `arrows-clockwise` / `sun` / `moon` / `leaf` / `circles-four` |
| Som de notificação | `inset-control--block` (segmented) | Ativado / Desativado | `speaker-high` / `speaker-slash` |
| **Link**: "Outras preferências pessoais" (escape pra tela completa) | `btn btn-text` | — | `arrow-right` (prefix com `me-1`) |

**Quando usar segmented vs nav-pills**: segmented (`inset-control--block`) cabe quando a preferência tem 2–3 opções binárias mutuamente exclusivas (ligado/desligado, modo simples). `nav-pills` na vertical é melhor quando há **5 ou mais opções**, cada uma com ícone próprio e identidade visual (ex: temas) — fica mais legível como lista vertical do que apertado num segmented horizontal. Para Tema especificamente, sempre use `nav-pills` (5 opções fixas, com `data-theme` + `setTheme()` canônicos do DS).

Toggle de tabs é via `onclick="umbAccountPopupTab(this)"` nos botões `.umb-account-popup-tab` com `data-tab="account|prefs"`. A função global troca a `.active` da tab e o `hidden` da pane correspondente. Sair fica fora das panes — é compartilhado.

### Tamanho e posicionamento

- Largura desktop: **320px** fixa
- Posicionamento desktop: ancorada à sidebar — `left: 60px; bottom: 16px` (alinhada com avatar da sidebar)
- Mobile: largura full bleed com 8px de margem lateral (`left: 8px; right: 8px`)
- **Altura fixa**: `height: min(540px, calc(100vh - 32px))` — não pode ser `max-height`. O motivo: ao alternar entre tabs (Minha conta ↔ Preferências), o conteúdo tem alturas diferentes; com `max-height` a popup encolheria/cresceria a cada toggle e a área de clique mudaria sob o cursor. Altura fixa preserva a área de clique e garante que botões fiquem onde o usuário espera.
- A pane "Minha conta" tem scroll interno na lista de organizações (`.umb-account-popup-list`); a pane "Preferências" deixa espaço vazio na base quando o conteúdo é mais curto que a popup — aceitável.

### Integração com a sidebar — default do template canônico

A partir do commit em que o componente foi adicionado, o `<template id="umb-tpl-sidebar">` do DS **embute o `.umb-account-popup`** dentro do `.umb-avatar-menu` em vez do `.umb-avatar-dropdown` legado. Telas geradas via `data-umb-c="sidebar"` herdam a popup nova automaticamente — sem precisar de configuração adicional.

#### Markup canônico do trigger (já no template do DS)

```html
<div class="umb-avatar-menu">
  <button type="button" class="umb-avatar-trigger"
          aria-expanded="false" aria-haspopup="dialog"
          onclick="umbAccountPopupToggle(this)" title="Perfil">
    <span class="umb-si-avatar">…iniciais…</span>
    <span class="umb-avatar-info" aria-hidden="true">
      <span class="umb-avatar-name">…nome…</span>
      <span class="umb-avatar-email">…email…</span>
    </span>
  </button>
  <div class="umb-account-popup" hidden role="dialog" aria-label="Perfil">
    …conteúdo canônico (head + tabs + panes + foot)…
  </div>
</div>
```

#### Comportamento

- **Toggle por clique no avatar**: `umbAccountPopupToggle(trigger)` alterna `hidden` da popup. Disponível como `window.umbAccountPopupToggle` após o load do DS.
- **Click outside fecha**: handler único no document escuta cliques fora do `.umb-avatar-menu` e fecha qualquer popup aberta.
- **Escape fecha**: tecla Escape fecha qualquer popup aberta.
- **Apenas uma popup visível por vez**: ao abrir uma popup com outra já aberta (sidebar desktop + mobile-header em viewports híbridos), a anterior fecha automaticamente.
- **`aria-expanded`** é sincronizado no trigger pra leitores de tela.

#### CSS de posicionamento

O `.umb-avatar-menu` recebe `position: relative` (substitui o que o Bootstrap dropdown fornecia implicitamente). A popup posiciona-se com `position: absolute; left: 60px; bottom: 16px` — desktop ancorada à direita do trigger, mobile com `left: 8px; right: 8px; bottom: 80px` via media query (§31 mobile section).

#### O `setTheme()` continua sendo a porta única

Tanto o `.theme-option` legado (§12 — dropdown simples) quanto o `nav-link.theme-option` novo (§31 — nav-pills vertical) sincronizam o `.active` ao chamar `setTheme(themeId)`. Se você integra um theme switcher custom em outro lugar, use a mesma função global pra preservar consistência entre todos.

#### Quando cair no §12 em vez do §31

- App single-tenant que **não tem múltiplas organizações** e nunca terá: o `.umb-avatar-dropdown` (§12) é mais leve.
- Telas isoladas/standalone fora do produto principal (landings, demos): pode usar o dropdown simples.

Em todo o resto (produto principal multi-org, settings, painel admin), use §31 — é o que o template canônico do DS já entrega.

### Anti-pattern

- ❌ Múltiplas áreas scrollable na popup — confunde gestos.
- ❌ Iniciais textuais como avatar de organização — usar ícone Phosphor.
- ❌ "Criar nova organização" como CTA primário no rodapé da popup — ação rara não deveria ter esse peso.
- ❌ Adicionar 3ª tab além de Minha conta / Preferências — comprime demais.
- ❌ Botão "Sair" alinhado à esquerda com `justify-content: flex-start` — herda center do `.btn` por default.
- ❌ Logo da Umbler no header da popup — o logo já está na sidebar, repetir é ruído.

## 32. Iterar peso visual de baixo pra cima

Complementa §29 (calibração por frequência) com a **direção** da iteração quando o peso correto da ação é desconhecido.

### O princípio

Quando estiver dimensionando o peso visual de uma ação nova, **comece sempre com o peso mínimo** e só infle se testes mostrarem que usuários não acham. Nunca o contrário. A intuição "comecemos chamativo e diminuímos depois se for demais" gera comportamento errado e lixo no banco.

### Por quê

- **Atenção é assimétrica.** Inflar uma ação primária ENSINA o usuário que ela é importante. Descalibrar depois requer re-treinar — usuários já clicaram, exploraram, geraram dados. Reduzir peso visual depois de gerar lixo (orgs aleatórias, contatos duplicados, templates desnecessários) custa migração, não só CSS.
- **Custo do erro é assimétrico.** Se você começa pequeno e usuários não acham → suporte recebe ticket → você infla. Custo: 1 ciclo de iteração. Se você começa grande e usuários clicam sem contexto → banco enche de lixo, métricas ficam ruidosas, fluxos de cleanup viram débito. Custo: backlog inteiro.
- **Frequência real ≠ frequência percebida pelo time.** PMs e designers tendem a inflar ações que internamente parecem "estratégicas" (criar segunda org, virar power-user, descobrir feature avançada). Pro usuário, isso é uma curiosidade pontual.

### Sequência de iteração canônica (do mínimo ao máximo)

| Nível | Posicionamento | Estilo |
|---|---|---|
| 1 (mínimo) | Item no menu de Configurações | `.umb-settings-item` (linha clicável genérica) |
| 2 | Junto a ações relacionadas (lupa, filtro) | `btn-icon btn-text btn-sm` no header de seção |
| 3 | Junto a ações relacionadas com destaque | `btn-icon btn-primary btn-sm` |
| 4 | Toolbar secundária | `btn btn-outline-primary` (Md) |
| 5 | Toolbar primária | `btn btn-primary` (Md) |
| 6 (máximo) | CTA proeminente | `btn btn-primary btn-lg` |

Toda ação nova **começa no nível 1**. Só sobe se houver evidência empírica (ticket, métrica, teste com usuário) de que o usuário não acha.

### Caso canônico — "Criar nova organização"

Sequência vivida no redesign do fluxo:
- v1: `btn-primary lg` full-width como CTA → gerou orgs aleatórias antes (motivo da remoção original)
- v2: `btn-outline-primary md` → ainda inflado pra ação rara
- v3: `btn-text` → quase certo
- v4: `btn-icon btn-primary btn-sm` no header da seção → pareceu certo
- v5 (final): removido inteiro, só item no menu de Configurações

Se tivéssemos começado em v5 (item no menu), teríamos chegado mais rápido e sem lixo no banco. A intuição "vamos colocar um botão pra ser fácil de achar" parecia razoável a cada passo, mas a evidência prática mostrou que o item no menu era suficiente.

### Anti-pattern

- ❌ "Vamos colocar um botão grande pra teste, depois reduzimos se for demais" — não vai. Usuários já vão ter clicado e gerado dados.
- ❌ "Essa ação é estratégica pra nós, então merece destaque" — frequência > estratégia interna.
- ❌ Inflar uma ação ANTES de ter evidência de que está difícil de achar.

### Quando começar em nível alto é justificado

- **Onboarding ativo** (primeira vez): a única ação possível pode ter peso máximo, mesmo que rara depois.
- **Empty states**: quando não há nada na tela, inflar a ação primária faz sentido.
- **Banner promocional temporário**: peso visual maior por janela limitada.

Em qualquer outro caso, default = nível 1.

## 33. Single entry point para ações raras

Complementa §28 (modal vs página) com a regra sobre **quantidade de entry points** pra uma ação.

### O princípio

Para ações raras (frequência baixa, §29), prefira **um único entry point bem posicionado** a múltiplos "convenientes". A intuição "vamos ter dois caminhos pra facilitar" gera mais problemas que resolve.

### Por quê

- **Múltiplos entry points = múltiplos "como fazer" pra educar.** Se a ação tem um gate educacional (modal/página explicativa), você acaba duplicando conteúdo entre os caminhos. Manutenção dobra: copy, layout, regras de negócio.
- **Inconsistência de pattern.** Cada entry point tende a virar um pattern diferente (popup vs menu vs sidebar vs header) e usuários ficam confusos sobre "qual é o caminho oficial".
- **Cliques sem contexto.** Quando o entry point está colado num lugar de uso frequente (como popup de perfil), usuários clicam por curiosidade, sem o contexto educacional. Isso gera lixo no banco — orgs aleatórias, recursos vazios, configurações que não fazem sentido pro usuário.
- **Buscabilidade > onipresença.** Se a ação é rara, ela não precisa estar à mão a todo momento. Precisa estar **descobrível** quando o usuário tem a intenção. Um item bem nomeado em Configurações cumpre isso.

### Caso canônico — fluxo de criar organização

- **Tentativa anterior**: dois entry points — popup de perfil (`+` no header da seção) + item no menu de Configurações.
- **Resultado**: popup gerava orgs aleatórias (clientes clicavam sem ler o modal), conteúdo educacional vivia em duas páginas (modal sobre popup vs página standalone em Configurações), padrão de navegação inconsistente (popup abria modal, menu navegava).
- **Solução**: um único entry point — item "Criar organização" no menu de Configurações. Sem botão na popup. Páginia educacional única.

### Heurística de decisão

Pergunta antes de adicionar um segundo entry point:

> Esse usuário, com o segundo entry point disponível, vai clicar **mais consciente** ou **menos consciente** do que pelo primeiro?

Se "menos consciente" — não adicione. Se "igual" — não adicione. Se "mais consciente" (raro) — adicione.

### Anti-pattern

- ❌ Adicionar um botão de criação na popup de perfil porque "fica acessível durante o uso normal".
- ❌ Mesmo conteúdo educacional duplicado em dois caminhos — modal pra um entry, página pro outro.
- ❌ Atalho na sidebar pra ação que já existe em Configurações.

### Exceção — ações de alta frequência

Pra ações de alta frequência (§29 nível 5–6), múltiplos entry points fazem sentido. Ex: "Iniciar nova conversa" pode aparecer no topbar do chat E na home E em uma página de contato. Mas mesmo aí, **o pattern visual deve ser igual** entre os entry points (sempre `btn-primary lg` por exemplo).

## 34. Reusar componentes do DS carrega o wrapper

Complementa §0 (Regra Mestre — Só componentes do DS) com a regra de **escopo do que copiar** quando reaproveitar um pattern de outro template.

### O princípio

Quando reproduzir um componente/seção de outro template do DS (ex: settings list do template-4 dentro de outro fluxo), **copie o bloco completo** — incluindo o wrapper externo (card, page-inner, shell-content). Não tente extrair só o "miolo" do componente.

### Por quê

- **Wrappers carregam decisões de layout que não estão no componente.** Padding, border-radius, background, max-width, posicionamento — essas propriedades vivem no wrapper, não na lista/card interna. Copiar só o conteúdo perde tudo isso e gera bugs visuais sutis (sem fundo, sem padding, sem largura controlada).
- **Wrappers carregam decisões de hierarquia.** O `<div class="card p-4">` que envolve um `<ul>` no desktop existe pra dar peso visual de "card de conteúdo". Sem ele, a lista vira "tabela solta no canvas" — visualmente quebra a hierarquia.
- **Não há um "componente isolado" puro no DS.** Cada peça é projetada para viver dentro de seu wrapper canônico. Listas vivem em cards. Cards vivem em umb-page-inner. umb-page-inner vive em umb-shell-content.

### Caso canônico

**Bug observado**: copiei `<ul class="umb-settings-list">` do `template-4-mobile.html` pra dentro do `<main class="umb-mobile-content">` de um protótipo. Esqueci o `<div class="card p-3" style="border-radius:12px">` que envolve no template original.

Resultado: lista renderizou direto no fundo da página (`--umb-bg-primary`), sem contraste, sem padding, parecendo "quebrada".

Correção: envolveu a `<ul>` com o card wrapper canônico.

### Sequência canônica de copiar uma seção

1. Identifique o componente principal que você quer (ex: `.umb-settings-list`).
2. **Suba na árvore HTML** até encontrar a primeira tag de layout (`.card`, `.umb-page-inner`, `.umb-shell-content`).
3. Copie do wrapper de layout pra dentro — não do componente pra dentro.
4. Cole no destino mantendo a hierarquia.

### Anti-pattern

- ❌ Copiar só `<ul class="umb-settings-list">` sem o `<div class="card">` envolvente — perde fundo, padding, radius.
- ❌ Copiar `<table class="table">` sem o `<div class="table-responsive">` envolvente — perde scroll horizontal em mobile.
- ❌ Copiar `<div class="umb-conv-item">` sem o `<div class="umb-conv-list">` envolvente — perde max-width e o spacing entre items.
- ❌ "Vou copiar só o que eu preciso e adicionar minha própria div" — você está reinventando o wrapper. Use o canônico.

### Como detectar que faltou wrapper

Sinais visuais ao redimensionar/inspecionar:
- Conteúdo aparenta "vazado" (sem margem das bordas da tela)
- Sem fundo de card (lista renderiza direto sobre body bg)
- Padding inconsistente comparado a outras telas similares
- Border-radius da tela ausente ou diferente do padrão

Em todos esses casos, suba a hierarquia do template original e adicione o wrapper que faltou.

## 35. Validar HTML balance após edits programáticos

Workflow de validação obrigatório após qualquer edição programática (script Python, sed, regex find-replace) em arquivos HTML do DS ou do prototype.

### O princípio

**Toda edição programática que altera HTML deve ser seguida de uma validação automática de balanceamento de tags.** Sem isso, scripts que falham silenciosamente em casos de borda deixam o HTML quebrado em formas que renderizam **mas com bugs sutis** (conteúdo órfão, divs aninhadas erradas, escape de containers).

### Por quê

- **HTML mal-balanceado renderiza.** Browsers são tolerantes — uma `<div>` órfã não quebra o parsing, só estraga o layout. Bugs do tipo "view duplicada", "elemento aparece fora de qualquer container", "demo-view não esconde quando deveria" são quase sempre causados por `</div>` a mais ou a menos.
- **Falhas silenciosas em scripts são comuns.** Substituições por regex/string match podem encontrar 0 ocorrências (não substitui nada), múltiplas (substitui mais que esperado), ou casos parciais (parte da árvore HTML cortada). Sem validação, esses casos passam.
- **Diff visual no browser é caro.** Reproduzir o bug no browser, identificar a causa, voltar pro código, corrigir, repetir — gasta minutos por iteração. Validação automática gasta segundos e evita o ciclo.

### Validação canônica

Após cada substituição em massa, rodar:

```python
# Conta de tags
opens = len(re.findall(r'<div\b', body))
closes = body.count('</div>')
print(f"<div>: {opens} opens vs {closes} closes (diff: {opens - closes})")
assert opens == closes, "div imbalance!"

# Balanceamento por bloco-raiz (depth deve voltar a 0 em cada um)
for n in [1, 2, 3, 4]:  # ou outros identificadores de bloco
    pat = rf'<div class="demo-view( is-active)?" data-view="{n}">'
    m = re.search(pat, body)
    if not m: continue
    start = m.end(); depth = 1; pos = start
    while depth > 0 and pos < len(body):
        no = body.find('<div', pos); nc = body.find('</div>', pos)
        if nc == -1: break
        if no != -1 and no < nc:
            depth += 1; pos = no + 4
        else:
            depth -= 1; pos = nc + 6
    assert depth == 0, f"View {n}: depth final = {depth} (deveria ser 0)"
```

Adapte os identificadores de bloco-raiz para o contexto (demo-view, section, template, etc.).

### Quando rodar

- Após qualquer **substituição multi-linha** (>3 linhas afetadas).
- Após qualquer edição que **moveu blocos inteiros** de lugar (cortar e colar via script).
- Após qualquer **find-and-replace de selectors HTML** (ex: trocar `<template id="X">` por outra coisa).
- **Antes** de gerar o arquivo final consumido pelo usuário.
- **Antes** de commit — `assert` no script garante que falha grita.

### Sinais de quebra que essa validação pega

- `<div>` opens > `</div>` closes → tag não fechou (bloco órfão se estende até o fim do body).
- `<div>` opens < `</div>` closes → tag fechou cedo demais (conteúdo "vazou" pra fora do container).
- Bloco-raiz com depth ≠ 0 → conteúdo de um bloco está dentro de outro indevidamente.

### Caso canônico vivido

Substituição de Tela 1 em um protótipo deixou 103 linhas de uma Tela 2 antiga **fora de qualquer demo-view** (no nível root do body). HTML válido, parser feliz, mas:
- Diff de divs: `+2` (sinal de alarme imediato)
- Bloco-raiz da Tela 2 fechou em depth 0 corretamente, mas existia conteúdo flutuante adicional fora dela
- Bug visual: ao alternar pra Tela 2, o conteúdo órfão renderizava embaixo (ele não tinha `display:none` aplicado porque não estava dentro de nenhuma demo-view)

A validação `opens != closes` teria pegado isso em segundos. Sem ela, gastei vários ciclos depurando no browser.

### Anti-pattern

- ❌ Confiar que a substituição "deve ter funcionado" sem validar.
- ❌ Validar só pelo conteúdo visível (abrir no browser) — bugs estruturais não aparecem visualmente até alguém alternar de view ou redimensionar.
- ❌ Pular validação porque "é só uma mudança pequena" — pequenas mudanças com regex são onde mais erros acontecem (anchors imprecisos, indents diferentes).


## 36. Alert — estrutura canônica

A partir do redesign de abr/2026, o componente `.alert` segue uma estrutura uniforme: ícone num círculo colorido (cor do botão sólido do tipo) + corpo (título + descrição opcional + ações) + botão de fechar opcional.

### Markup canônico

```html
<!-- Compact (sem descrição) — uma linha só -->
<div class="alert alert-danger alert-compact">
  <i class="ph-fill ph-x-circle alert-icon-circle"></i>
  <div class="alert-title">Alert title</div>
  <div class="alert-actions">
    <button class="btn btn-danger btn-sm">Button</button>
    <button class="btn btn-outline-danger btn-sm">Button</button>
  </div>
  <button class="alert-close" aria-label="Fechar"><i class="ph ph-x"></i></button>
</div>

<!-- Com descrição — stacked -->
<div class="alert alert-success">
  <i class="ph-fill ph-check-circle alert-icon-circle"></i>
  <div class="alert-body">
    <div class="alert-title">Alert title</div>
    <div class="alert-desc">Texto descritivo.</div>
    <div class="alert-actions">
      <button class="btn btn-success btn-sm">Button</button>
      <button class="btn btn-outline-success btn-sm">Button</button>
    </div>
  </div>
  <button class="alert-close" aria-label="Fechar"><i class="ph ph-x"></i></button>
</div>
```

### Tipos × ícones canônicos (Phosphor weight: fill)

O glyph fill **já é uma bolinha preenchida** com o símbolo recortado dentro — não precisa de wrapper com background. A cor brand é aplicada direto no ícone via `color:`.

| Tipo | Classe modifier | Ícone (Phosphor fill) | Cor aplicada |
|---|---|---|---|
| Error | `.alert-danger` | `ph-fill ph-x-circle` | `var(--bs-danger)` |
| Info | `.alert-info` | `ph-fill ph-info` | `var(--bs-info)` |
| Success | `.alert-success` | `ph-fill ph-check-circle` | `var(--bs-success)` |
| Warning | `.alert-warning` | `ph-fill ph-warning-circle` | `var(--bs-warning)` |

> **Pré-requisito**: o stylesheet `https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css` precisa estar carregado no `<head>`. Já é dependência padrão do DS desde o redesign de abr/2026 (junto com `regular` e `bold`).

### Variantes ortogonais

- `.alert-compact` — colapsa para uma linha só. Use quando NÃO houver descrição. As ações ficam à direita via `margin-left:auto`.
- `.alert-banner` — bg mais saturado (mistura `var(--bs-{type})` 14% com `var(--umb-card-bg)`) **e cantos retos** (`border-radius: 0`). Use em layouts onde o banner ocupa **100% da largura do container pai**, encostado nas laterais (ex: faixa fixa no topo da tela, faixa entre header e conteúdo, dentro de um drawer/modal full-width). Não use o banner em contextos com padding lateral — os cantos retos só fazem sentido quando o componente está realmente flush com as bordas do container. Compatível com `.alert-compact`.

### Hierarquia das ações

Sempre 2 botões no máximo: o primeiro **sólido** (`btn-{type}`) é a ação primária; o segundo **outlined** (`btn-outline-{type}`) é a alternativa/cancelar. Use `btn-sm`. Nunca inverta a ordem nem use `btn-text` aqui — o alerta carrega ações relevantes, não secundárias.

### Cores de texto

Título e descrição usam **cores de body** (`--umb-text-primary` e `--umb-text-mid`), **não** a cor brand do tipo. A cor brand fica concentrada no círculo do ícone e nos botões — isso evita a "wallpaper de cor" que acontece quando texto + bg + buttons são todos do mesmo matiz.

### Backward compat

A classe legada `.alert-icon` (ícone plano sem círculo) continua funcionando para componentes existentes (ex: `.umb-chat-pinned`, banner de erro pós-import). **Implementações novas** devem usar `.alert-icon-circle`. Se for migrar uma área, substitua o `<i class="ph ... alert-icon">` por `<span class="alert-icon-circle"><i class="ph-bold ph-...">...</i></span>` — o resto da estrutura (`.alert-body`, `.alert-title`) já bate.

### Anti-patterns

- ❌ Texto da descrição usando a cor brand do tipo (`--umb-alert-{type}-color`) — fica saturado demais. Use `--umb-text-mid`.
- ❌ Botão sólido como ação secundária — quebra a hierarquia. O sólido é a ação primária; o outlined é a secundária.
- ❌ Mais de 2 botões na linha de ações — se precisar de mais, é sinal que o alerta está fazendo muito. Considere drawer ou modal.
- ❌ Voltar pro padrão antigo de `<span class="alert-icon-circle"><i class="ph-bold...">…</i></span>` (wrapper + ícone) — o canônico agora é o glyph fill direto. O wrapper com bg só faz sentido se você precisa de uma cor que NÃO existe na palette Phosphor fill (caso raro).
- ❌ Composição inline com `style="flex-direction:column;align-items:flex-start"` — esse era o workaround antigo. Agora use `.alert-body` (já é coluna) e o título/descrição já vêm na ordem certa.
