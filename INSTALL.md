# Como instalar o plugin Umbler Design

Este plugin dá ao Claude Code a habilidade de gerar telas, fluxos e componentes em HTML já seguindo o Design System da Umbler Talk (Umbootstrap). Serve pra designers, PMs e devs montarem protótipos e specs visuais rápido, sem sair do Claude.

## Pré-requisitos

- **Claude Code** instalado e funcionando. Baixe em [claude.com/download](https://claude.com/download) se ainda não tiver.
- Acesso ao repo público [pricardodesigner/umbler-ds](https://github.com/pricardodesigner/umbler-ds) (o plugin clona ele em tempo de execução).

## Instalação em 2 passos

Abra o Claude Code e rode os comandos abaixo (os `/` são slash commands do Claude, não comandos de shell):

```
/plugin marketplace add pricardodesigner/umbler-ds
```

Isso registra o marketplace interno da Umbler. Depois:

```
/plugin install umbler-design@umbler-ds-marketplace
```

Pronto. O plugin fica ativo em todas as conversas.

## Como usar

Não precisa invocar a skill explicitamente — ela dispara automaticamente quando você pede coisa de tela usando o DS. Exemplos de prompt que funcionam:

- "Monte a tela de configurações do agente de IA usando o DS da Umbler"
- "Crie o protótipo de onboarding seguindo o Umbootstrap"
- "Recria esta tela aqui no estilo Umbler Talk" + screenshot
- "Gera o HTML do componente de tabela de créditos"
- "Faz o fluxo de envio de mensagem em massa (desktop + mobile)"

O Claude vai:
1. Clonar o repo do DS fresh na hora (pega sempre a última versão)
2. Ler `design-system/rules.md` e `design-system/umbootstrap-design-system.html`
3. Gerar HTML single-file com shell desktop + shell mobile responsivo no mesmo arquivo

## Configuração opcional — dados reais do Umbler Talk

O plugin também inclui o MCP `umbler-talk-api`, que deixa o Claude consultar dados reais (contatos, chats, canais, tags) durante a geração.

Para ativar, gere um token em [app-utalk.umbler.com/api/docs](https://app-utalk.umbler.com/api/docs/index.html) e exporte no shell:

```bash
export UMBLER_TOKEN="seu-token-aqui"
```

Coloque esse `export` no seu `~/.zshrc` (ou `~/.bashrc`) pra ficar permanente. Depois reinicie o Claude Code.

**Sem o token**: a skill continua funcionando normalmente com mock data.

**Com o token**: você pode pedir protótipos com dados reais, tipo _"monte a tela de atendimento com as últimas 10 conversas da minha conta"_.

## Como atualizar

O Claude Code puxa o plugin do GitHub toda vez que é iniciado, então atualizações saem automaticamente assim que o `umbler-design` ganhar uma versão nova.

Se quiser forçar a atualização agora:

```
/plugin update umbler-design
```

Importante: o **DS em si** (componentes, tokens, regras) é clonado a cada execução, independente da versão do plugin. Então qualquer mudança no repo chega em todo mundo na próxima geração de tela, sem precisar atualizar nada.

## Como ver o DS online

Antes de pedir a tela, às vezes ajuda olhar o que existe:

- **Landing** · <https://pricardodesigner.github.io/umbler-ds/>
- **Componentes, tokens e templates** · <https://pricardodesigner.github.io/umbler-ds/design-system/>

## Troubleshooting

**"Plugin não dispara quando eu peço a tela"**
→ Cheque se `umbler-design` aparece em `/plugin list`. Se não, reinstale.

**"Erro no git clone do sandbox"**
→ Verifique se `github.com` tá no allowlist de rede da sua conta (Admin settings → Capabilities, pra orgs Team/Enterprise).

**"MCP do Talk falhou"**
→ Confirma que `UMBLER_TOKEN` está exportado. Rode `echo $UMBLER_TOKEN` no terminal onde o Claude está. Se vier vazio, exporta de novo e reinicia o Claude.

**"Tela gerada tá com CSS quebrado"**
→ Abre um issue em <https://github.com/pricardodesigner/umbler-ds/issues> com o prompt que você usou + o HTML gerado.

## Dúvidas

Chama o Paulo (@paulo) no Slack.
