# Umbler Design

Plugin para Claude Code / Cowork que combina:

1. **Skill `umbler-ds`** — gera telas, componentes e fluxos em HTML seguindo o Umbootstrap Design System da Umbler Talk (Bootstrap 5.3).
2. **MCP server `umbler-talk-api`** — expõe endpoints do Umbler Talk (contatos, conversas, agentes, canais) como ferramentas que o Claude pode chamar durante a geração de telas ou investigações.

## Instalação

```bash
# a partir do arquivo empacotado
claude plugin install ./umbler-design.plugin
```

Ou, em modo dev, adicionando o diretório diretamente:

```bash
claude plugin install /caminho/para/umbler-talk-plugin
```

## Configuração

Antes de usar o MCP `umbler-talk-api`, gere um token da API no Umbler Talk
(https://app-utalk.umbler.com/api/docs/index.html) e exponha-o como variável
de ambiente no shell que roda o Claude Code/Cowork:

```bash
export UMBLER_TOKEN="seu-token-aqui"
# opcional — sobrescreve a URL base
export UMBLER_API_BASE="https://app-utalk.umbler.com/api/v1"
```

Sem o `UMBLER_TOKEN`, a skill `umbler-ds` continua funcionando normalmente
(gera telas com mock data), mas as ferramentas do MCP falharão com mensagem
clara pedindo o token.

## O que este plugin faz

### Skill `umbler-ds`

Acionada por qualquer pedido tipo _"crie a tela de X"_, _"ajuste esta tela"_,
_"gere o HTML de Y usando o DS"_. Toda execução começa com `git clone` fresco
do repo público `pricardodesigner/umbler-ds`, lê `references/rules.md` e
`umbootstrap-design-system.html`, e gera HTML single-file com shell desktop +
shell mobile responsivo no mesmo arquivo.

Arquitetura **install once, always latest**: o bundle do plugin contém apenas
o `SKILL.md` bootstrap; DS e regras vêm do GitHub a cada execução, então uma
atualização do DS é instantaneamente propagada para todos os instalados.

### MCP `umbler-talk-api`

Ferramentas disponíveis (todas autenticadas com `UMBLER_TOKEN`, baseadas no
OpenAPI 3.0.4 oficial em `https://app-utalk.umbler.com/api/docs/docs.json`):

| Ferramenta              | Descrição                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| `get_me`                | Membro logado + organizações (descobre `organizationId`)                 |
| `list_contacts`         | Lista contatos (busca, filtros por estado/tags, paginação)               |
| `get_contact`           | Detalhe completo de um contato                                           |
| `find_contact_by_phone` | Busca contato por telefone E.164                                         |
| `list_chats`            | Lista chats com filtros por estado, setor, tags, canal, agente           |
| `get_chat`              | Detalhe de um chat (opcional: incluir N mensagens recentes)              |
| `get_chat_messages`     | Mensagens de um chat com paginação relativa por timestamp                |
| `list_channels`         | Lista canais (WhatsApp Broker/Cloud/Gupshup, Instagram, Email, Widget)   |
| `get_channel`           | Detalhe de um canal                                                      |
| `list_sectors`          | Lista setores (filas/departamentos)                                      |
| `list_online_members`   | Lista agentes/membros online                                             |
| `list_tags`             | Lista tags da organização                                                |
| `send_message`          | Envia mensagem em um chat existente (multipart/form-data)                |
| `send_template_message` | Envia HSM/template do WhatsApp (`ToPhone`/`FromPhone`/`TemplateId`/`Params`) |

> **Resolução automática de `organizationId`**: se você não passar
> `organization_id`, o servidor faz uma chamada a `/members/me/` na primeira
> requisição e cacheia a primeira organização do membro logado.

## Estrutura do repositório

```
umbler-talk-plugin/
├── .claude-plugin/
│   └── plugin.json              # Manifesto do plugin
├── .mcp.json                    # Declaração do MCP server
├── skills/
│   └── umbler-ds/
│       └── SKILL.md             # Bootstrap que clona o repo com o DS
├── servers/
│   └── umbler-talk-mcp/
│       ├── package.json
│       └── src/
│           └── index.js         # MCP stdio server (Node.js 18+)
└── README.md
```

## Desenvolvimento

```bash
cd servers/umbler-talk-mcp
npm install
UMBLER_TOKEN="..." node src/index.js   # sanity check (stdio — vai ficar esperando input)
```

Para empacotar como arquivo `.plugin`:

```bash
cd umbler-talk-plugin
zip -r ../umbler-design.plugin . -x "*.DS_Store" -x "**/node_modules/*"
```

## Licença

Uso interno Umbler.
