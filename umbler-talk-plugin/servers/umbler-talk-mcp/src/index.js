#!/usr/bin/env node
/**
 * umbler-talk-mcp
 * -----------------------------------------------------------------------------
 * MCP server que expõe endpoints do Umbler Talk como ferramentas.
 *
 * Baseado no OpenAPI 3.0.4 oficial em:
 *   https://app-utalk.umbler.com/api/docs/docs.json
 *
 * Auth: token estático via header `Authorization: Bearer <UMBLER_TOKEN>`.
 * O token é carregado do env `UMBLER_TOKEN` (injetado pelo .mcp.json do plugin).
 *
 * Transporte: stdio (o padrão usado por plugins do Claude Code/Cowork).
 *
 * Quase toda rota exige `organizationId` como query param. As ferramentas:
 *   - aceitam `organization_id` como argumento opcional;
 *   - se não vier, usam a primeira organização retornada por `/members/me/`
 *     (resolvida uma vez e cacheada em memória).
 * -----------------------------------------------------------------------------
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
const UMBLER_TOKEN = process.env.UMBLER_TOKEN || '';
const UMBLER_API_BASE =
  process.env.UMBLER_API_BASE || 'https://app-utalk.umbler.com/api/v1';

function requireToken() {
  if (!UMBLER_TOKEN) {
    throw new Error(
      'UMBLER_TOKEN não configurado. Gere um token em ' +
        'https://app-utalk.umbler.com/api/docs/index.html e exporte-o como ' +
        'variável de ambiente antes de iniciar o Claude Code/Cowork.'
    );
  }
}

async function umblerFetch(path, { method = 'GET', query, body, form } = {}) {
  requireToken();
  // UMBLER_API_BASE já termina com `/v1`; `path` começa com `/`.
  const url = new URL(
    path.replace(/^\//, ''),
    UMBLER_API_BASE.endsWith('/') ? UMBLER_API_BASE : UMBLER_API_BASE + '/'
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v)) {
        for (const item of v) url.searchParams.append(k, String(item));
      } else {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const headers = {
    Authorization: `Bearer ${UMBLER_TOKEN}`,
    Accept: 'application/json',
  };

  let fetchBody;
  if (form) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) {
      if (v === undefined || v === null) continue;
      fd.append(k, v instanceof Blob ? v : String(v));
    }
    fetchBody = fd;
    // NÃO setar Content-Type — o fetch calcula o boundary do multipart.
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers, body: fetchBody });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg =
      typeof data === 'object' && data?.message
        ? data.message
        : `HTTP ${res.status} ${res.statusText}`;
    throw new Error(`Umbler API ${method} ${url.pathname}: ${msg}`);
  }
  return data;
}

// -----------------------------------------------------------------------------
// organizationId resolution
// -----------------------------------------------------------------------------
let cachedOrgId = null;
let cachedMe = null;

async function getMe() {
  if (cachedMe) return cachedMe;
  cachedMe = await umblerFetch('/members/me/');
  return cachedMe;
}

async function resolveOrgId(explicit) {
  if (explicit) return explicit;
  if (cachedOrgId) return cachedOrgId;
  const me = await getMe();
  // O schema retorna um `Member` com lista de organizations. Tentamos caminhos
  // comuns — ajusta aqui se o shape real divergir.
  const orgs =
    me?.organizations ||
    me?.data?.organizations ||
    me?.member?.organizations ||
    [];
  const first = Array.isArray(orgs) ? orgs[0] : null;
  const id = first?.id || first?.organizationId || first?._id;
  if (!id) {
    throw new Error(
      'Não foi possível descobrir organizationId em /members/me/. ' +
        'Passe `organization_id` explicitamente na chamada.'
    );
  }
  cachedOrgId = id;
  return id;
}

// Helper para montar a query base com organizationId resolvido
async function withOrg(query = {}, explicitOrgId) {
  const organizationId = await resolveOrgId(explicitOrgId);
  return { organizationId, ...query };
}

// -----------------------------------------------------------------------------
// Tool definitions
// -----------------------------------------------------------------------------
const tools = [
  // ---------- Bootstrap ----------
  {
    name: 'get_me',
    description:
      'Retorna o membro logado e as organizações às quais ele pertence. ' +
      'Útil como primeira chamada para descobrir o `organizationId` necessário nas demais ferramentas.',
    inputSchema: { type: 'object', properties: {} },
    handler: async () => getMe(),
  },

  // ---------- Contacts ----------
  {
    name: 'list_contacts',
    description:
      'Lista contatos da organização (paginado). Aceita busca textual, filtro por estado e ordenação.',
    inputSchema: {
      type: 'object',
      properties: {
        organization_id: {
          type: 'string',
          description: 'Organização alvo. Se omitido, usa a primeira de /members/me/.',
        },
        query: {
          type: 'string',
          description: 'Termo de busca (nome, telefone, email). Mapeia para `QueryString`.',
        },
        state: {
          type: 'string',
          description: 'Estado do contato (ex: Active, Archived). Mapeia para `State`.',
        },
        order_by: {
          type: 'string',
          description: 'Campo para ordenar (ex: name, createdAtUTC).',
        },
        order: {
          type: 'string',
          enum: ['Asc', 'Desc'],
          description: 'Direção da ordenação.',
        },
        tag_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs de tags para filtrar. Envia junto com `Tags.Rule=Any` por padrão.',
        },
        tags_rule: {
          type: 'string',
          enum: ['Any', 'All', 'None'],
          description: 'Regra de combinação dos `tag_ids`.',
          default: 'Any',
        },
        skip: { type: 'number', default: 0 },
        take: { type: 'number', default: 20 },
      },
    },
    handler: async ({
      organization_id,
      query,
      state,
      order_by,
      order,
      tag_ids,
      tags_rule = 'Any',
      skip = 0,
      take = 20,
    }) => {
      const q = await withOrg(
        {
          QueryString: query,
          State: state,
          OrderBy: order_by,
          Order: order,
          'Tags.Rule': tag_ids && tag_ids.length ? tags_rule : undefined,
          'Tags.Values': tag_ids && tag_ids.length ? tag_ids : undefined,
          Skip: skip,
          Take: take,
        },
        organization_id
      );
      return umblerFetch('/contacts/', { query: q });
    },
  },
  {
    name: 'get_contact',
    description: 'Detalhe completo de um contato (custom fields, notas, tags, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string', description: 'ID do contato.' },
        organization_id: { type: 'string' },
      },
      required: ['contact_id'],
    },
    handler: async ({ contact_id, organization_id }) => {
      const q = await withOrg({}, organization_id);
      return umblerFetch(`/contacts/${encodeURIComponent(contact_id)}/`, { query: q });
    },
  },
  {
    name: 'find_contact_by_phone',
    description: 'Busca um contato por número de telefone (formato E.164, ex: +5551999998888).',
    inputSchema: {
      type: 'object',
      properties: {
        phone_number: { type: 'string', description: 'Número E.164.' },
        organization_id: { type: 'string' },
      },
      required: ['phone_number'],
    },
    handler: async ({ phone_number, organization_id }) => {
      const q = await withOrg({ phoneNumber: phone_number }, organization_id);
      return umblerFetch('/contacts/phone/', { query: q });
    },
  },

  // ---------- Chats ----------
  {
    name: 'list_chats',
    description:
      'Lista conversas (chats) da organização com filtros por estado, setor, tags, canal e agente.',
    inputSchema: {
      type: 'object',
      properties: {
        organization_id: { type: 'string' },
        chat_state: {
          type: 'string',
          description:
            'Estado do chat (ex: Open, Waiting, Closed). Mapeia para `ChatState`.',
        },
        sector_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs de setores para filtrar.',
        },
        sectors_rule: {
          type: 'string',
          enum: ['Any', 'All', 'None'],
          default: 'Any',
        },
        tag_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs de tags para filtrar.',
        },
        tags_rule: {
          type: 'string',
          enum: ['Any', 'All', 'None'],
          default: 'Any',
        },
        channel_id: {
          type: 'string',
          description: 'ID do canal (WhatsApp, Instagram, webchat, email).',
        },
        agent_id: {
          type: 'string',
          description: 'ID do agente responsável.',
        },
        skip: { type: 'number', default: 0 },
        take: { type: 'number', default: 20 },
      },
    },
    handler: async ({
      organization_id,
      chat_state,
      sector_ids,
      sectors_rule = 'Any',
      tag_ids,
      tags_rule = 'Any',
      channel_id,
      agent_id,
      skip = 0,
      take = 20,
    }) => {
      const q = await withOrg(
        {
          ChatState: chat_state,
          'Sectors.Rule': sector_ids && sector_ids.length ? sectors_rule : undefined,
          'Sectors.Values': sector_ids && sector_ids.length ? sector_ids : undefined,
          'Tags.Rule': tag_ids && tag_ids.length ? tags_rule : undefined,
          'Tags.Values': tag_ids && tag_ids.length ? tag_ids : undefined,
          ChannelId: channel_id,
          AssignedMemberId: agent_id,
          Skip: skip,
          Take: take,
        },
        organization_id
      );
      return umblerFetch('/chats/', { query: q });
    },
  },
  {
    name: 'get_chat',
    description: 'Retorna uma conversa pelo ID, opcionalmente com mensagens embutidas.',
    inputSchema: {
      type: 'object',
      properties: {
        chat_id: { type: 'string' },
        include_messages: {
          type: 'number',
          description: 'Quantidade de mensagens recentes para incluir (default 0).',
          default: 0,
        },
        organization_id: { type: 'string' },
      },
      required: ['chat_id'],
    },
    handler: async ({ chat_id, include_messages = 0, organization_id }) => {
      const q = await withOrg({ includeMessages: include_messages }, organization_id);
      return umblerFetch(`/chats/${encodeURIComponent(chat_id)}/`, { query: q });
    },
  },
  {
    name: 'get_chat_messages',
    description:
      'Retorna mensagens de um chat relativas a um timestamp (paginação por janela).',
    inputSchema: {
      type: 'object',
      properties: {
        chat_id: { type: 'string' },
        from_event_utc: {
          type: 'string',
          description: 'ISO UTC do ponto de referência. Default: agora.',
        },
        direction: {
          type: 'string',
          enum: ['TakeBefore', 'TakeAfter'],
          default: 'TakeBefore',
        },
        take: { type: 'number', default: 50 },
        organization_id: { type: 'string' },
      },
      required: ['chat_id'],
    },
    handler: async ({
      chat_id,
      from_event_utc,
      direction = 'TakeBefore',
      take = 50,
      organization_id,
    }) => {
      const q = await withOrg(
        {
          FromEventUTC: from_event_utc || new Date().toISOString(),
          Direction: direction,
          Take: take,
        },
        organization_id
      );
      return umblerFetch(
        `/chats/${encodeURIComponent(chat_id)}/relative-messages/`,
        { query: q }
      );
    },
  },

  // ---------- Channels / Sectors / Members / Tags ----------
  {
    name: 'list_channels',
    description:
      'Lista canais configurados na organização (WhatsApp Broker/Gupshup/CloudAPI, Instagram, WebsiteWidget, Email).',
    inputSchema: {
      type: 'object',
      properties: { organization_id: { type: 'string' } },
    },
    handler: async ({ organization_id }) => {
      const q = await withOrg({}, organization_id);
      return umblerFetch('/channels/', { query: q });
    },
  },
  {
    name: 'get_channel',
    description: 'Detalhe de um canal específico.',
    inputSchema: {
      type: 'object',
      properties: {
        channel_id: { type: 'string' },
        organization_id: { type: 'string' },
      },
      required: ['channel_id'],
    },
    handler: async ({ channel_id, organization_id }) => {
      const q = await withOrg({}, organization_id);
      return umblerFetch(`/channels/${encodeURIComponent(channel_id)}/`, { query: q });
    },
  },
  {
    name: 'list_sectors',
    description: 'Lista setores (filas/departamentos) da organização.',
    inputSchema: {
      type: 'object',
      properties: { organization_id: { type: 'string' } },
    },
    handler: async ({ organization_id }) => {
      const q = await withOrg({}, organization_id);
      return umblerFetch('/sectors/', { query: q });
    },
  },
  {
    name: 'list_online_members',
    description: 'Lista agentes/membros atualmente online.',
    inputSchema: {
      type: 'object',
      properties: { organization_id: { type: 'string' } },
    },
    handler: async ({ organization_id }) => {
      const q = await withOrg({}, organization_id);
      return umblerFetch('/members/online/', { query: q });
    },
  },
  {
    name: 'list_tags',
    description: 'Lista tags (etiquetas) da organização (paginado).',
    inputSchema: {
      type: 'object',
      properties: {
        organization_id: { type: 'string' },
        query: { type: 'string', description: 'Busca textual (queryString).' },
        skip: { type: 'number', default: 0 },
        take: { type: 'number', default: 50 },
      },
    },
    handler: async ({ organization_id, query, skip = 0, take = 50 }) => {
      const q = await withOrg(
        { queryString: query, Skip: skip, Take: take },
        organization_id
      );
      return umblerFetch('/tags/', { query: q });
    },
  },

  // ---------- Messaging (actions) ----------
  {
    name: 'send_message',
    description:
      'Envia uma mensagem em um chat existente. Usa multipart/form-data conforme o endpoint oficial.',
    inputSchema: {
      type: 'object',
      properties: {
        chat_id: { type: 'string' },
        message: { type: 'string', description: 'Texto da mensagem.' },
        organization_id: { type: 'string' },
      },
      required: ['chat_id', 'message'],
    },
    handler: async ({ chat_id, message, organization_id }) => {
      const organizationId = await resolveOrgId(organization_id);
      return umblerFetch('/messages/', {
        method: 'POST',
        form: {
          OrganizationId: organizationId,
          ChatId: chat_id,
          Message: message,
        },
      });
    },
  },
  {
    name: 'send_template_message',
    description:
      'Envia uma mensagem de template (HSM) WhatsApp simplificada. Útil para iniciar ' +
      'conversas fora da janela de 24h. Requer o número de destino (`to_phone`) e o ' +
      'número do canal de origem (`from_phone`) no formato E.164. Os valores do template ' +
      'são passados em `params` na ordem das variáveis do template.',
    inputSchema: {
      type: 'object',
      properties: {
        to_phone: {
          type: 'string',
          description: 'Telefone de destino em E.164 (ex: +5551999998888).',
        },
        from_phone: {
          type: 'string',
          description:
            'Telefone do canal remetente em E.164. Use `list_channels` para descobrir.',
        },
        template_id: { type: 'string', description: 'ID do template aprovado.' },
        params: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Valores ordenados para as variáveis do template. Mapeia para `Params` no payload.',
        },
        contact_name: {
          type: 'string',
          description:
            'Nome do contato (opcional). Se o contato ainda não existir, é criado com este nome.',
        },
        file_id: {
          type: 'string',
          description: 'ID de um arquivo já enviado, caso o template seja de mídia.',
        },
        organization_id: { type: 'string' },
      },
      required: ['to_phone', 'from_phone', 'template_id'],
    },
    handler: async ({
      to_phone,
      from_phone,
      template_id,
      params,
      contact_name,
      file_id,
      organization_id,
    }) => {
      const organizationId = await resolveOrgId(organization_id);
      // Montamos o FormData manualmente para preservar múltiplos valores de `Params`.
      requireToken();
      const fd = new FormData();
      fd.append('OrganizationId', String(organizationId));
      fd.append('ToPhone', String(to_phone));
      fd.append('FromPhone', String(from_phone));
      fd.append('TemplateId', String(template_id));
      if (contact_name) fd.append('ContactName', String(contact_name));
      if (file_id) fd.append('FileId', String(file_id));
      if (Array.isArray(params)) {
        for (const p of params) fd.append('Params', String(p));
      }
      const url = new URL(
        'template-messages/simplified/',
        UMBLER_API_BASE.endsWith('/') ? UMBLER_API_BASE : UMBLER_API_BASE + '/'
      );
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UMBLER_TOKEN}`,
          Accept: 'application/json',
        },
        body: fd,
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) {
        const msg =
          typeof data === 'object' && data?.message
            ? data.message
            : `HTTP ${res.status} ${res.statusText}`;
        throw new Error(`Umbler API POST /template-messages/simplified/: ${msg}`);
      }
      return data;
    },
  },
];

// -----------------------------------------------------------------------------
// MCP server wiring
// -----------------------------------------------------------------------------
const server = new Server(
  { name: 'umbler-talk-api', version: '0.2.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const tool = tools.find((t) => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  try {
    const result = await tool.handler(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: 'text', text: String(err?.message || err) }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
