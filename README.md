# Umbler DS — Umbootstrap Design System

Fonte da verdade do **Umbootstrap Design System** — o DS proprietário da Umbler Talk, baseado em Bootstrap 5.3.

## Acesse online

Publicado via GitHub Pages:

- **Landing** · <https://pricardodesigner.github.io/umbler-ds/>
- **Design System** (componentes, tokens e templates) · <https://pricardodesigner.github.io/umbler-ds/design-system/>

## Estrutura

Tudo mora em `design-system/`:

- **`design-system/umbootstrap-design-system.html`** — HTML único com todos os tokens, componentes e guidelines do DS (fonte canônica)
- **`design-system/tokens.css`** + **`design-system/components.css`** — tokens e componentes extraídos para reuso
- **`design-system/template-*.html`** — templates de referência (desktop + mobile)
- **`design-system/rules.md`** — regras e padrões escritos
- **`index.html`** — landing que roteia para o DS e para os templates

## Raw URL (consumida pela skill `umbler-ds`)

```
https://raw.githubusercontent.com/pricardodesigner/umbler-ds/main/design-system/umbootstrap-design-system.html
```

A skill Claude `umbler-ds` baixa este arquivo fresco a cada execução — **este repositório é a ÚNICA fonte da verdade**. Cópias locais não devem ser usadas.

## Temas

`dark` · `light` · `emerald` · `dark-emerald` (Bravia)

Todos configurados via `data-bs-theme="…"` no `<html>`.
