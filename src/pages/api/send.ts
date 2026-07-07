import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { umami } from '#/dynamic.config';

const FORWARDED_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'referer',
  'user-agent',
] as const;

function buildForwardHeaders(request: Request): Headers {
  const headers = new Headers();

  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const clientIp = request.headers.get('cf-connecting-ip');
  if (clientIp) headers.set('x-forwarded-for', clientIp);

  return headers;
}

async function proxySend(request: Request): Promise<Response> {
  const apiUrl = env.UMAMI_API_URL ?? '';

  if (!umami.scriptProxy || !apiUrl) {
    return new Response('Not found', { status: 404 });
  }

  const targetUrl = `${apiUrl.replace(/\/+$/, '')}/api/send`;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: buildForwardHeaders(request),
      body: request.body,
      redirect: 'manual',
    });

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (err) {
    console.error('[umami-send] Proxy failed:', err);
    return new Response('Fetch failed', { status: 502 });
  }
}

export const OPTIONS: APIRoute = async () =>
  new Response(null, {
    status: 204,
    headers: {
      Allow: 'OPTIONS, POST',
      'Cache-Control': 'no-store',
    },
  });

export const POST: APIRoute = async ({ request }) => proxySend(request);
