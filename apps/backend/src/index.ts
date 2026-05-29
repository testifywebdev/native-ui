import { Hono, type Context } from 'hono';

type CloudflareBindings = {
  KV: KVNamespace;
  ASSETS: R2Bucket;
};

type RegistryFile = {
  path?: string;
  target?: string;
  content?: string;
  type?: string;
};

type RegistryManifest = {
  $schema?: string;
  name?: string;
  type?: string;
  title?: string;
  description?: string;
  registryDependencies?: string[];
  dependencies?: string[];
  category?: string;
  files?: RegistryFile[];
};

type GraphQLRequest = {
  query?: string;
  variables?: Record<string, unknown>;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

function jsonResponse<T>(payload: GraphQLResponse<T>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

function parseKeyFromQuery(query?: string): string | null {
  if (!query) return null;
  const match = query.match(/registry\s*\(\s*key\s*:\s*(?:\$key|"([^"]+)"|'([^']+)'|([^\s,)]+))\s*\)/i);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

// Helper to parse arrays from raw query strings if variables aren't used
// e.g., registries(keys: ["button", "card"])
function parseKeysFromQuery(query?: string): string[] | null {
  if (!query) return null;
  const match = query.match(/registries\s*\(\s*keys\s*:\s*\[([\s\S]*?)\]\s*\)/i);
  if (!match) return null;
  return match[1]
    .split(',')
    .map(k => k.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

async function readManifest(env: CloudflareBindings, key: string) {
  const raw = await env.KV.get(key, 'text');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RegistryManifest;
  } catch {
    return null;
  }
}

async function listManifests(env: CloudflareBindings) {
  const keys = await env.KV.list();
  const manifests: Array<{ key: string } & RegistryManifest> = [];

  for (const entry of keys.keys) {
    const manifest = await readManifest(env, entry.name);
    if (manifest) {
      manifests.push({ key: entry.name, ...manifest });
    }
  }

  manifests.sort((a, b) => a.key.localeCompare(b.key));
  return manifests;
}

async function handleGraphQL(c: Context<{ Bindings: CloudflareBindings }>) {
  let body: GraphQLRequest = {};

  if (c.req.header('content-type')?.includes('application/json')) {
    body = (await c.req.json().catch(() => ({}))) as GraphQLRequest;
  } else {
    const query = c.req.query('query');
    if (query) {
      body.query = query;
    }
  }

  const query = body.query ?? '';

  if (!query.trim()) {
    return jsonResponse(
      { errors: [{ message: 'Missing GraphQL query' }] },
      400
    );
  }

  // 1. MULTIPLE KEYS: Handle multiple lookup via "registries"
  if (/\bregistries\b/i.test(query)) {
    const variableKeys = Array.isArray(body.variables?.keys) ? body.variables.keys as string[] : null;
    const queryKeys = variableKeys ?? parseKeysFromQuery(query);

    // If specific keys were requested, fetch only those items in parallel
    if (queryKeys && queryKeys.length > 0) {
      const promises = queryKeys.map(async (key) => {
        const manifest = await readManifest(c.env, key);
        return manifest ? { key, ...manifest } : null;
      });
      
      const results = (await Promise.all(promises)).filter(Boolean);
      return jsonResponse({ data: { registries: results } });
    }
    
    // Fallback: If no keys argument provided, return everything (your original list logic)
    const registries = await listManifests(c.env);
    return jsonResponse({ data: { registries } });
  }

  // 2. SINGLE KEY: Handle single lookup via "registry"
  if (/\bregistry\b/i.test(query)) {
    const variableKey = typeof body.variables?.key === 'string' ? body.variables.key : null;
    const queryKey = variableKey ?? parseKeyFromQuery(query);

    if (!queryKey) {
      return jsonResponse(
        { errors: [{ message: 'Missing registry key' }] },
        400
      );
    }

    const manifest = await readManifest(c.env, queryKey);
    if (!manifest) {
      return jsonResponse({ data: { registry: null } });
    }

    return jsonResponse({ data: { registry: { key: queryKey, ...manifest } } });
  }

  return jsonResponse(
    {
      errors: [
        {
          message: 'Unsupported query. Use registry(key: ...), registries(keys: [...]), or registries.',
        },
      ],
    },
    400
  );
}

app.get('/', (c) => c.text('native-ui backend'));
app.options('/graphql', () => new Response(null, { status: 204 }));
app.get('/graphql', handleGraphQL);
app.post('/graphql', handleGraphQL);

export default app;