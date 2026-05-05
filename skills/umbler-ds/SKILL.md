---
name: umbler-ds
description: |
  ⚠️ ROUTER OBRIGATÓRIO — esta skill SEMPRE pergunta V1 ou V2 ANTES de gerar qualquer coisa. Gera telas, fluxos e componentes do Umbler Talk em duas stacks: V1 (Bootstrap 5.3 + HTML, paridade com produção atual) ou V2 (Next.js 14 + React + Tailwind + @umbler/ui, stack futura). Use SEMPRE que o usuário pedir pra criar/ajustar/recriar uma tela, protótipo, fluxo ou componente que deva seguir o padrão visual da Umbler. Acione em qualquer combinação de "tela", "protótipo", "fluxo", "componente", "página", "interface", "UI" com qualquer uma destas referências: "DS Umbler", "design system Umbler", "Umbootstrap", "Umbler Talk", "@umbler/ui", "JSX Umbler", "React Umbler", "stack V1", "stack V2", ou simplesmente "DS"/"design system" quando o contexto for Umbler. Também acione com "crie uma tela", "monte uma tela", "gere o HTML", "gere o JSX", "faça o protótipo", "ajuste esta tela", "recrie esta tela", "transforme este screenshot em tela". Não use para tarefas genéricas de HTML/CSS sem vínculo com a Umbler.
---

# 🛑 STOP — LEIA ESTA SEÇÃO PRIMEIRO

## ⚠️ PASSO 0 (BLOQUEANTE) — Pergunte V1 ou V2 ANTES de qualquer outra coisa

**Esta é a regra mais importante desta skill. Não pule sob nenhuma hipótese.**

Quando esta skill é ativada, sua **PRIMEIRA AÇÃO TEM QUE SER** chamar o tool `AskUserQuestion` perguntando qual stack o usuário quer:

- ❌ NÃO faça análise da tela ainda
- ❌ NÃO pergunte sobre tipo de tela, tema, estados, layout, conteúdo
- ❌ NÃO leia references ainda
- ❌ NÃO escreva nem uma linha de código
- ❌ NÃO faça preâmbulo tipo "Vou te ajudar a criar..."
- ✅ APENAS chame `AskUserQuestion` com as opções V1/V2 abaixo

**Pergunta exata a fazer:**

> Antes de começar, qual stack você quer usar pra esta tela?

**Opções (header do question: "Stack"):**

1. **V2 — React/Next/JSX (recomendado pra novos builds)**
   Description: Next.js 14 + React 18 + Tailwind 3 + Radix UI + `@umbler/ui` (proprietary). Output: arquivo `.tsx` com imports tipados de `@umbler/ui` e `@umbler/widgets`. Quando escolher: telas novas, refatorações pra produção React, ou time de eng no novo stack. Vantagem: componentes tipados, TanStack Query + zod + RHF integrados, DX moderna.

2. **V1 — HTML/Bootstrap (paridade com produção atual)**
   Description: Bootstrap 5.3 + HTML single-file + CSS embutido + Phosphor Icons web. Output: arquivo `.html` com shell desktop + mobile responsivo. Quando escolher: telas que vão entrar na app atual em produção (Umbler Talk hoje), protótipos pra validação antes de migrar pro React, paridade visual com features já no ar. Vantagem: drop-in nas páginas existentes.

**Aguarde a resposta. SÓ DEPOIS que o usuário responder, prossiga pra Seção 2 (V2) ou Seção 3 (V1).**

### Única exceção — atalho explícito do usuário

Você pode pular o `AskUserQuestion` SOMENTE se o usuário **explicitamente** mencionou a stack na mensagem que ativou a skill:

| Mencionou | Pula direto pra |
|---|---|
| "React", "JSX", "Next", "@umbler/ui", "stack V2", "novo stack" | V2 (Seção 2) |
| "HTML", "Bootstrap", "stack V1", "produção atual", ".html" | V1 (Seção 3) |

**Em qualquer ambiguidade, pergunta.** "crie uma tela" sem qualificador → pergunta. "tela em React Umbler" → V2 direto.

### Por que isso importa

V1 e V2 produzem outputs DIFERENTES (`.html` vs `.tsx`), em locais DIFERENTES (single-file vs `apps/web/app/...`), com workflows DIFERENTES (clone do GitHub vs references locais). Errar a stack significa entregar um arquivo no formato errado pro time errado — perda total de trabalho. **Por isso a pergunta vem PRIMEIRO, sempre.**

---

## 1. Visão geral

Suporta duas stacks com identidade visual 100% compartilhada (mesmos 4 temas, tokens, tipografia):

- **V1**: Bootstrap 5.3 + HTML — produção atual
- **V2**: Next.js 14 + React + Tailwind + `@umbler/ui` — stack futura

**Workflow geral:**
1. Pergunta V1/V2 (Passo 0 acima — BLOQUEANTE)
2. Lê references da stack escolhida
3. Faz QA do pedido (perguntas de detalhe específicas, se necessário)
4. Gera o arquivo
5. Devolve link `computer://` pro user abrir

---

## 2. Branch V2 — React/Next/JSX

Só execute esta seção depois que o usuário escolheu V2 no Passo 0.

### 2.1. Bootstrap — sempre clone o repo V2 fresh

Igual ao V1: o repo no GitHub é a ÚNICA fonte da verdade. Antes de qualquer trabalho V2, rode:

```bash
rm -rf /tmp/umbler-design-v2-repo
git clone --depth 1 https://github.com/pricardodesigner/umbler-design-v2.git /tmp/umbler-design-v2-repo
```

`--depth 1` é obrigatório (sem histórico). Sempre delete antes de clonar pra garantir versão fresca.

#### Por que clonar e não ler o que vem no plugin?

Arquitetura "install once, always latest" — quando o DS V2 evolui (novo primitive, regra atualizada, exemplo novo), o repo `umbler-design-v2` recebe push. **Próxima execução da skill já vê a mudança**, sem precisar reinstalar o plugin. Isso garante que toda tela gerada use a versão mais atual do DS.

#### Política em caso de falha

Se `git clone` falhar (rede, repo, 404, etc.):
1. **NÃO** caia em cópias locais. O repo é a verdade.
2. Pare e avise o usuário com a causa específica, pedindo verificação: se o repo tem commit em `main`, se os arquivos estão lá, se `github.com` está no allowlist.
3. Só prossiga após confirmação explícita.

### 2.2. Leia o DESIGN_SYSTEM.md do clone

```
Read /tmp/umbler-design-v2-repo/DESIGN_SYSTEM.md
```

**Esse é o ÚNICO arquivo de referência V2** — single source of truth. Tem tokens (109 vars × 4 temas), catálogo de 30+ componentes, regras §0–§29, patterns canônicos (list-screen + form-screen), arquitetura de propagação.

A skill NUNCA deve buscar references em outros lugares (não há mais `component-catalog.md`, `rules.md` ou `examples/*.md` separados — tudo está consolidado em `DESIGN_SYSTEM.md`).

### 2.3. Princípios não-negociáveis (V2)

1. **Composição sobre criação** — antes de markup custom, pergunte: já existe componente em `@umbler/ui` ou widget em `@umbler/widgets`?
2. **Tokens nunca hex** — use `var(--bs-*)` ou `var(--umb-*)` via Tailwind arbitrário (`bg-[color:var(--umb-card-bg)]`)
3. **`size="lg"` por default** — Button, Input, InputGroup, Combobox, DatePicker nascem `size="lg"` (regra DS §2)
4. **font-weight 400** em chips/abas/pills/segmented (Badge, Tabs variant=pill, etc.)
5. **Widgets > primitives** quando possível — `<ContactSearchField>`, `<ContactRegisterForm>` etc. trazem TanStack Query + zod já integrados
6. **Tema é responsabilidade do consumidor** — NUNCA hard-code `data-bs-theme` em markup gerado
7. **Mobile-first** — toda Table tem contraparte `RecordList` em mobile (§19.1)

### 2.4. Estrutura padrão de uma tela V2

```tsx
"use client";

import { useState } from "react";
import {
  Shell, ShellSidebar, ShellMain, ShellHeader, ShellContent, ShellPageInner,
  Button,
  // ...todos os imports juntos
} from "@umbler/ui";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export default function Page() {
  return (
    <Shell>
      <ShellSidebar>{/* nav canônico */}</ShellSidebar>
      <ShellMain>
        <ShellHeader>{/* breadcrumb + ações primárias */}</ShellHeader>
        <ShellContent>
          <ShellPageInner>{/* conteúdo */}</ShellPageInner>
        </ShellContent>
      </ShellMain>
    </Shell>
  );
}
```

### 2.5. Output — onde salvar

Por default, salve em:
```
apps/web/app/{kebab-name}/page.tsx   # página Next.js
```

Para componentes reutilizáveis específicos da app:
```
apps/web/components/{PascalName}.tsx
```

Se o componente fizer sentido como widget conectado (TanStack/RHF):
```
packages/widgets/src/components/{PascalName}.tsx
```

### 2.6. Loop de aprendizado (V2)

Quando o usuário iterar sobre um padrão novo até aprovar:
1. Pergunte: "Esse padrão ficou no ponto. Quer adicionar ao DS V2 como primitive/widget reutilizável?"
2. Se sim:
   - Crie em `packages/ui/src/components/` (ou `widgets/`) no clone local do user
   - Exporte do `packages/ui/src/index.ts`
   - **Atualize `DESIGN_SYSTEM.md`** (catálogo + rules se há convenção nova)
   - Crie demo em `apps/web/components/{Wave}Demo.tsx` + Section em `apps/web/app/page.tsx`
   - Sugira ao user: `git add` + `commit` + `push` no repo `umbler-design-v2` — próxima execução da skill já vê a mudança automaticamente (arquitetura "install once, always latest")

### 2.7. Checklist final (V2)

- [ ] `git clone` do repo `umbler-design-v2` rodou com sucesso nesta execução
- [ ] `/tmp/umbler-design-v2-repo/DESIGN_SYSTEM.md` foi lido nesta sessão
- [ ] Imports todos vêm de `@umbler/ui` / `@umbler/widgets` (zero HTML inline reinventando primitive)
- [ ] `size="lg"` em todos os Button/Input/InputGroup/Combobox/DatePicker
- [ ] Tokens via `var(--bs-*)` / `var(--umb-*)` — zero hex
- [ ] Phosphor sempre `/dist/ssr`
- [ ] `"use client"` no topo se há hooks/eventos
- [ ] Mobile RecordList em paralelo a Table (§19.1)
- [ ] Forms com Field + Label + (Input ou specialized field)
- [ ] Confirmações destrutivas via Dialog variant=danger
- [ ] Toast pra feedback assíncrono (success/error/promise)
- [ ] Path do output declarado + link `computer://`

---

## 3. Branch V1 — HTML/Bootstrap

Só execute esta seção depois que o usuário escolheu V1 no Passo 0. Mantém a arquitetura "install once, always latest" — DS e regras vêm do GitHub a cada execução.

### 3.1. Bootstrap — sempre clone o repo

```bash
rm -rf /tmp/umbler-ds-repo
git clone --depth 1 https://github.com/pricardodesigner/umbler-ds.git /tmp/umbler-ds-repo
```

`--depth 1` é obrigatório (sem histórico). Sempre delete antes de clonar.

#### Por que não `curl`/`WebFetch`?
`raw.githubusercontent.com`, `codeload.github.com` e redirects do GitHub são bloqueados pelo proxy (403). Só `git clone` direto em `github.com` funciona.

#### Política em caso de falha
Se `git clone` falhar:
1. NÃO caia em cópias locais nem em arquivos do bundle.
2. Pare e avise o usuário com a causa específica, pedindo verificação: se o repo tem commit em `main`, se os arquivos estão lá, se `github.com` está no allowlist.
3. Só prossiga após confirmação explícita.

### 3.2. Arquivos no repo clonado

| Caminho | Conteúdo |
|---|---|
| `/tmp/umbler-ds-repo/design-system/umbootstrap-design-system.html` | Arquivo-mestre (tokens CSS, classes de componentes, temas, templates) |
| `/tmp/umbler-ds-repo/design-system/rules.md` | Regras de implementação (leitura obrigatória) |
| `/tmp/umbler-ds-repo/design-system/tokens.css` + `components.css` | Tokens e componentes extraídos |
| `/tmp/umbler-ds-repo/design-system/template-*.html` | Templates desktop + mobile |

### 3.3. Workflow V1

```
1. Read /tmp/umbler-ds-repo/design-system/rules.md
2. Read /tmp/umbler-ds-repo/design-system/umbootstrap-design-system.html
3. Entenda o pedido (texto, screenshot, HTML colado, URL)
4. Gere HTML single-file com shell desktop + shell mobile no MESMO arquivo (§19)
```

### 3.4. Estrutura padrão da tela V1

```html
<!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="dark">
<head>
  <!-- Fonts, Bootstrap 5.3, Phosphor Icons (ver §3.6) -->
  <style>
    /* COPIAR TODO o bloco <style> do DS */
  </style>
</head>
<body>
  <!-- Shell desktop — viewport ≥768px -->
  <div class="umb-shell d-none d-md-flex">
    <nav class="umb-shell-sidebar" data-umb-c="sidebar"></nav>
    <div class="umb-shell-main">
      <header class="umb-shell-header" data-umb-c="header"></header>
      <div class="umb-shell-content">
        <div class="umb-page-inner"><!-- conteúdo --></div>
      </div>
    </div>
  </div>

  <!-- Shell mobile — viewport <768px -->
  <div class="umb-mobile-shell d-md-none">
    <header class="umb-mobile-header" data-umb-c="mobile-header"></header>
    <main class="umb-mobile-content"><!-- conteúdo mobile --></main>
    <nav class="umb-bottom-nav" data-umb-c="bottom-nav"></nav>
  </div>
</body>
</html>
```

Responsividade no MESMO HTML (§19 do rules.md) é obrigatória — não entregue dois arquivos separados.

### 3.5. Regra Mestre §0 (V1)

Qualquer input (texto, imagem, HTML, URL) é **expressão de intenção de estrutura**, nunca fonte de código a ser copiado. A implementação usa **só componentes, tokens e regras do DS**. HTML colado: leia a estrutura pra entender intenção e reconstrua 1:1 com componentes do DS — não copie CSS, não copie hex, não recrie classes custom. Exceção: gráfico, logotipo de terceiro, ilustração decorativa — e mesmo aí, custom herda tokens.

### 3.6. Dependências externas (CDN)

Toda tela V1 inclui no `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

### 3.7. Loop de aprendizado (V1)

Quando o usuário iterar sobre um padrão novo até aprovar:
1. Pergunte: "Quer que eu adicione este componente/regra ao DS V1?"
2. Se sim:
   - Edite `design-system/umbootstrap-design-system.html` no repo local
   - Edite `design-system/rules.md` documentando
   - Propague pros `template-*.html` se afetar bloco duplicado
   - Commit + push — todos os usuários recebem na próxima execução

### 3.8. Checklist final (V1)

- [ ] `git clone` rodou com sucesso nesta execução
- [ ] `rules.md` foi lido antes de gerar código
- [ ] Tela tem shell desktop + shell mobile no mesmo HTML (§19)
- [ ] Tokens `var(--umb-*)` — zero hex hardcoded
- [ ] Botões seguem hierarquia (§1)
- [ ] Tamanhos uniformes (§2 — lg default)
- [ ] Input-groups com wrapper approach (§4)
- [ ] Tabs/steps com `my-4` (§6)
- [ ] Logo Umbler Talk respeita header/sidebar (§8)
- [ ] Phosphor Icons (`ph ph-*`) em todos os ícones
- [ ] 100% compatível com Bootstrap 5.3
- [ ] §0: cada elemento da tela tem correspondência 1:1 com componente do DS

---

## 4. Temas — comum a V1 e V2

Ambas as stacks suportam os mesmos 4 temas via `data-bs-theme`:

| Atributo | Nome | Fonte |
|---|---|---|
| `dark` | Escuro | Poppins |
| `light` | Claro | Poppins |
| `emerald` | Esmeralda | Plus Jakarta Sans |
| `dark-emerald` | Bravia | Plus Jakarta Sans |

Em V1, o tema vai no `<html data-bs-theme="...">`. Em V2, o `<ThemeProvider>` no root da app já resolve — geração de tela NUNCA muda o tema dentro do markup.

---

## 5. Dados reais via MCP `umbler-talk-api` (opcional, qualquer stack)

Se o plugin estiver com o MCP `umbler-talk-api` configurado (token `UMBLER_TOKEN` no env), use as ferramentas pra popular telas com dados reais:

- "monte a tela de atendimento com as últimas 10 conversas da minha conta"
- "liste meus contatos com tag VIP"
- "crie um dashboard com os 5 setores e contadores reais"

Se o MCP não estiver configurado, siga com mock data e avise o usuário.

---

## 6. Quando NÃO usar esta skill

- Tarefa de HTML/CSS/JSX genérica sem vínculo com Umbler — não acione
- Geração de assets visuais (imagem, ícone, logo) — fora do escopo
- Edição dos componentes do `@umbler/ui` em si (V2) — chame `skill-creator` ou edite manualmente
- Configuração do próprio plugin/skill — fora do escopo da skill de geração

---

## 🛑 LEMBRETE FINAL

Releia o **PASSO 0** no topo deste arquivo. Se você está prestes a:
- Perguntar ao usuário sobre detalhes da tela (tipo, tema, conteúdo, layout, estados)
- Ler references
- Gerar markup
- Fazer qualquer outra análise

…sem ter feito o `AskUserQuestion` V1/V2 primeiro, **PARE**. Volte e faça a pergunta agora.

A pergunta V1/V2 é sempre o **primeiro tool call** desta skill. Sempre. Sem exceção que não seja o atalho explícito da Seção "Única exceção".
