---
name: umbler-ds
description: |
  Gera telas, fluxos e componentes HTML usando o Umbootstrap Design System — o DS proprietário da Umbler Talk baseado em Bootstrap 5.3. Use esta skill SEMPRE que o usuário pedir para criar/ajustar/recriar uma tela, protótipo, fluxo ou componente que deva seguir o padrão visual da Umbler. Acione em qualquer combinação de "tela", "protótipo", "fluxo", "componente", "página", "interface", "UI" com qualquer uma destas referências à Umbler: "DS da Umbler", "design system da Umbler", "design da Umbler", "estilo da Umbler", "estilo de design da Umbler", "estilo Umbler", "estilo do Umbler Talk", "padrão visual da Umbler", "identidade visual da Umbler", "Umbler DS", "Umbler Design", "Umbootstrap", "Umbler Talk", ou simplesmente "DS"/"design system" quando o contexto for Umbler. Também acione com "crie uma tela", "monte uma tela", "gere o HTML", "faça o protótipo", "ajuste esta tela", "recrie esta tela", "transforme este screenshot em tela", ou quando o usuário enviar uma URL/screenshot de uma tela para ser recriada com componentes do DS. Não use para tarefas genéricas de HTML/CSS sem vínculo com a Umbler.
---

# Umbler Design System — Skill

Esta skill gera HTML production-ready usando o Umbootstrap DS (Umbler Talk, Bootstrap 5.3). Toda tela, componente ou fluxo deve seguir rigorosamente os tokens, componentes e regras documentados no DS.

> **Arquitetura "install once, always latest"**: este SKILL.md é apenas um bootstrap. TUDO — o arquivo-mestre do DS, as regras de implementação, exemplos e qualquer referência futura — vive no repositório GitHub e é baixado fresco a cada execução. Não há conteúdo relevante no bundle local do plugin além deste arquivo. **Nunca** leia `references/*` do folder da skill instalada — sempre do clone.

## 1. Bootstrap — sempre clone o repo primeiro

O repo `pricardodesigner/umbler-ds` é a ÚNICA fonte da verdade. Rode antes de qualquer trabalho:

```bash
rm -rf /tmp/umbler-ds-repo
git clone --depth 1 https://github.com/pricardodesigner/umbler-ds.git /tmp/umbler-ds-repo
```

Usar `git clone --depth 1` é obrigatório (evita histórico). Sempre delete antes de clonar, pra garantir versão fresca.

### Por que não `curl`/`WebFetch`?

Os hosts `raw.githubusercontent.com`, `codeload.github.com` e redirects `github.com/.../raw/...` são bloqueados pelo proxy do sandbox Cowork (403). Só `git clone` direto em `github.com` funciona.

### Política em caso de falha

Se `git clone` falhar (rede, repo, 404, etc.):
1. **NÃO** caia em cópias locais nem em `references/*` do bundle.
2. Pare e avise o usuário com a causa específica, pedindo pra verificar: se o repo tem commit em `main`, se os arquivos estão lá, e se `github.com` está no allowlist.
3. Só prossiga após confirmação explícita do usuário.

## 2. Arquivos no repo clonado

Após o `git clone`, estes são os arquivos que a skill **deve** ler:

| Caminho | Conteúdo |
|---|---|
| `/tmp/umbler-ds-repo/design-system/umbootstrap-design-system.html` | Arquivo-mestre do DS (tokens CSS, classes de componentes, temas, templates shell/mobile) |
| `/tmp/umbler-ds-repo/design-system/rules.md` | Todas as regras de implementação (leitura obrigatória antes de gerar código) |
| `/tmp/umbler-ds-repo/design-system/tokens.css` + `components.css` | Tokens e componentes extraídos (usados pela landing; a fonte completa continua no HTML-mestre) |
| `/tmp/umbler-ds-repo/design-system/template-*.html` | Templates de referência (desktop + mobile) |

No futuro, novos arquivos (ex: `design-system/tokens.json`, `design-system/examples/*.html`) podem ser adicionados ao repo — o workflow é sempre "clone + leia o que precisar do clone".

## 3. Workflow de geração

### 3.1. Leia as regras primeiro
```
Read /tmp/umbler-ds-repo/design-system/rules.md
```
As regras cobrem: hierarquia de botões, input-groups, tamanhos, border-radius, espaçamentos, logo, navegação mobile, cores por tema, checkbox/radio/switch, scrollbars, Steps, breakpoints responsivos, e o que NUNCA fazer.

### 3.2. Leia o DS
```
Read /tmp/umbler-ds-repo/design-system/umbootstrap-design-system.html
```
Extraia o bloco `<style>` completo e a estrutura dos templates (shell desktop, mobile, wizard, etc.).

### 3.3. Entenda o pedido
- **Nova tela/fluxo**: "crie a tela de configurações do agente de IA"
- **Ajuste de tela existente**: usuário envia screenshot/URL + descreve mudanças
- **Componente isolado**: "crie o componente de tabela de créditos"

Para screenshots: recrie o mais próximo possível da referência visual, mas **sempre** usando componentes do DS (nunca recrie visuais do zero ignorando o DS).

### 3.4. Gere HTML single-file

Toda tela é um único arquivo HTML com o CSS do DS embutido no `<style>` e segue a estrutura:

```html
<!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="dark">
<head>
  <!-- Fonts, Bootstrap 5.3, Phosphor Icons (seção "Dependências externas" abaixo) -->
  <style>
    /* COPIAR TODO o bloco <style> do DS */
  </style>
</head>
<body>
  <!-- Shell desktop — visível em viewport ≥ 768px -->
  <div class="umb-shell d-none d-md-flex">
    <nav class="umb-shell-sidebar" data-umb-c="sidebar" data-active="..."></nav>
    <div class="umb-shell-main">
      <header class="umb-shell-header" data-umb-c="header" data-breadcrumb="..."></header>
      <div class="umb-shell-content"><div class="umb-page-inner"><!-- conteúdo --></div></div>
    </div>
  </div>

  <!-- Shell mobile — visível em viewport < 768px -->
  <div class="umb-mobile-shell d-md-none">
    <header class="umb-mobile-header" data-umb-c="mobile-header" data-title="..."></header>
    <main class="umb-mobile-content"><!-- conteúdo mobile --></main>
    <nav class="umb-bottom-nav" data-umb-c="bottom-nav" data-active="..."></nav>
  </div>
</body>
</html>
```

A regra de **responsividade no mesmo HTML** (§19 do rules.md) é obrigatória — não entregue telas como dois arquivos separados desktop/mobile.

### 3.5. Dados reais via MCP `umbler-talk-api` (opcional)

Este plugin embute um MCP server `umbler-talk-api` que expõe endpoints do Umbler Talk (contatos, conversas, agentes). Quando o usuário pedir protótipos com dados reais — ex: "monte a tela de atendimento com as últimas 10 conversas da minha conta" — chame as ferramentas do MCP antes de gerar o HTML e popule os componentes com os dados retornados. Se o MCP não estiver configurado (sem token), siga com mock data e avise o usuário.

### 3.6. Aprenda e proponha atualizações ao DS

Quando o usuário iterar sobre um novo fluxo até aprovar uma versão final:

1. **Pergunte**: "Esse padrão ficou no ponto. Quer que eu adicione este componente/regra ao DS?"
2. Se confirmar:
   - **Edite** `design-system/umbootstrap-design-system.html` no repo local do usuário adicionando o componente/padrão
   - **Edite** `design-system/rules.md` documentando a nova regra
   - Propague pros `design-system/template-*.html` se o bloco CSS afetado for duplicado neles
   - **Commit + push** — assim todos os usuários da skill recebem a atualização na próxima execução, sem reinstalar

Essa é a promessa da arquitetura "install once, always latest".

## 4. Temas

4 temas via `data-bs-theme`:
| Atributo | Nome | Fonte |
|---|---|---|
| `dark` | Escuro | Poppins |
| `light` | Claro | Poppins |
| `emerald` | Esmeralda | Plus Jakarta Sans |
| `dark-emerald` | Bravia | Plus Jakarta Sans |

Sempre use `var(--umb-*)` — nunca cores hex hardcoded.

## 5. Dependências externas (CDN)

Toda tela gerada inclui no `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

## 6. Checklist final

Antes de entregar HTML:

- [ ] `git clone` do repo rodou com sucesso nesta execução
- [ ] `design-system/rules.md` foi lido antes de gerar código
- [ ] Tela tem shell desktop + shell mobile no mesmo HTML com toggle responsivo (§19 do rules.md)
- [ ] Todos os tokens de cor vêm de `var(--umb-*)` (zero hex hardcoded)
- [ ] Botões seguem hierarquia (Text, Outlined, Primary) — §1 do rules.md
- [ ] Tamanhos uniformes (Sm/Md/Lg) — §2 do rules.md
- [ ] Input-groups usam wrapper approach — §4 do rules.md
- [ ] Tabs e steps têm `my-4` — §6 do rules.md
- [ ] Logo Umbler Talk respeita as regras de header/sidebar/tema — §8 do rules.md
- [ ] Phosphor Icons (`ph ph-*`) para todos os ícones
- [ ] 100% compatível com Bootstrap 5.3
- [ ] Se o usuário pediu dados reais, o MCP `umbler-talk-api` foi consultado (ou mock + aviso)
