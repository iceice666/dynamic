import type { APIRoute } from 'astro';
import { umami } from '../../../dynamic.config';

export const GET: APIRoute = async ({ url }) => {
  if (!umami.apiUrl || !umami.websiteId) {
    return new Response(JSON.stringify({ error: 'Umami not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const path = url.searchParams.get('path') ?? undefined;

  // Fetch stats from the beginning of time to now
  const startAt = 0;
  const endAt = Date.now();

  const params = new URLSearchParams({
    startAt: String(startAt),
    endAt: String(endAt),
    ...(path ? { url: path } : {}),
  });

  const apiUrl = `${umami.apiUrl}/api/websites/${umami.websiteId}/stats?${params}`;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (umami.apiKey) {
    headers['x-umami-api-key'] = umami.apiKey;
  }

  try {
    const res = await fetch(apiUrl, { headers });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Upstream error', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    // Return only what the widget needs
    const result = {
      pageviews: data.pageviews?.value ?? 0,
      visitors: data.visitors?.value ?? 0,
      visits: data.visits?.value ?? 0,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes on the CDN edge
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
