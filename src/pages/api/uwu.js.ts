import type { APIRoute } from 'astro';
import { umami } from '../../../dynamic.config';

export const GET: APIRoute = async () => {
  if (!umami.scriptProxy || !umami.apiUrl) {
    return new Response('Not found', { status: 404 });
  }

  const scriptUrl = umami.scriptUrl ?? `${umami.apiUrl}/script.js`;

  try {
    const res = await fetch(scriptUrl);
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
