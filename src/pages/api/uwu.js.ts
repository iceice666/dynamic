import type { APIRoute } from 'astro';
import { umami } from '#/dynamic.config';

export const GET: APIRoute = async ({ locals }) => {
  const apiUrl = locals.runtime.env.UMAMI_API_URL ?? '';
  const scriptUrl = locals.runtime.env.UMAMI_SCRIPT_URL;

  if (!umami.scriptProxy || !apiUrl) {
    return new Response('Not found', { status: 404 });
  }

  const resolvedUrl = scriptUrl ?? `${apiUrl}/script.js`;

  try {
    const res = await fetch(resolvedUrl);
    if (!res.ok) {
      return new Response('Upstream error', { status: 502 });
    }

    const body = await res.text();
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new Response('Fetch failed', { status: 502 });
  }
};
