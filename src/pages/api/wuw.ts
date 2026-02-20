import type { APIRoute } from 'astro';

// --- Token cache (in-memory, per-process) ---
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

/**
 * Obtain a JWT token from Umami's login endpoint.
 * Caches the token in memory and refreshes when it nears expiry.
 */
async function getAuthToken(
  apiUrl: string,
  username: string,
  password: string
): Promise<string | null> {
  if (!username || !password) {
    console.warn('[wuw] No UMAMI_USERNAME / UMAMI_PASSWORD configured — cannot authenticate');
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const apiBase = apiUrl.replace(/\/+$/, '');
  const loginUrl = `${apiBase}/api/auth/login`;

  try {
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[wuw] Login failed (${res.status}): ${errText}`);
      cachedToken = null;
      return null;
    }

    const data = await res.json();
    cachedToken = data.token;
    // Umami JWT tokens typically expire in 24 hours; cache for 23 hours
    tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
    return cachedToken;
  } catch (err) {
    console.error('[wuw] Login fetch failed:', err);
    cachedToken = null;
    return null;
  }
}

/**
 * Build the Authorization / API-key headers for an Umami API request.
 */
async function buildAuthHeaders(
  apiUrl: string,
  apiKey: string,
  username: string,
  password: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (apiKey) {
    // Umami Cloud path
    headers['x-umami-api-key'] = apiKey;
  } else {
    // Self-hosted path — login for a JWT
    const token = await getAuthToken(apiUrl, username, password);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const {
    UMAMI_API_URL: apiUrl = '',
    UMAMI_WEBSITE_ID: websiteId = '',
    UMAMI_API_KEY: apiKey = '',
    UMAMI_USERNAME: username = '',
    UMAMI_PASSWORD: password = '',
  } = locals.runtime.env;

  // Strip query params from path — Umami stores paths without them
  const rawPath = url.searchParams.get('path') ?? undefined;
  const path = rawPath ? rawPath.split('?')[0] : undefined;

  if (!apiUrl || !websiteId) {
    console.error('[wuw] Umami not configured (missing apiUrl or websiteId)');
    return new Response(JSON.stringify({ error: 'Umami not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const startAt = 0;
  const endAt = Date.now();
  const apiBase = apiUrl.replace(/\/+$/, '');
  const headers = await buildAuthHeaders(apiUrl, apiKey, username, password);

  async function fetchWithRetry(targetUrl: string): Promise<Response> {
    let res = await fetch(targetUrl, { headers });
    if (res.status === 401 && cachedToken) {
      cachedToken = null;
      tokenExpiresAt = 0;
      const freshHeaders = await buildAuthHeaders(apiUrl, apiKey, username, password);
      res = await fetch(targetUrl, { headers: freshHeaders });
    }
    return res;
  }

  const cacheHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
  };

  try {
    if (path) {
      // Per-URL pageviews: use the pageviews endpoint which reliably filters by URL.
      // The stats endpoint's url filter is unreliable across Umami versions.
      const params = new URLSearchParams({
        startAt: String(startAt),
        endAt: String(endAt),
        unit: 'year',
        timezone: 'UTC',
        url: path,
      });
      const pageviewsUrl = `${apiBase}/api/websites/${websiteId}/pageviews?${params}`;
      const res = await fetchWithRetry(pageviewsUrl);

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[wuw] Upstream error body: ${errText}`);
        return new Response(JSON.stringify({ error: 'Upstream error', status: res.status }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await res.json();
      const total = (data.pageviews as { x: string; y: number }[]).reduce(
        (sum, entry) => sum + entry.y,
        0
      );
      return new Response(JSON.stringify({ pageviews: total, visitors: 0, visits: 0 }), {
        status: 200,
        headers: cacheHeaders,
      });
    } else {
      // Site-wide stats (used by VisitCounter)
      const params = new URLSearchParams({
        startAt: String(startAt),
        endAt: String(endAt),
      });
      const statsUrl = `${apiBase}/api/websites/${websiteId}/stats?${params}`;
      const res = await fetchWithRetry(statsUrl);

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[wuw] Upstream error body: ${errText}`);
        return new Response(JSON.stringify({ error: 'Upstream error', status: res.status }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await res.json();
      const result = {
        pageviews: data.pageviews ?? 0,
        visitors: data.visitors ?? 0,
        visits: data.visits ?? 0,
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: cacheHeaders,
      });
    }
  } catch (err) {
    console.error('[wuw] Fetch failed:', err);
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
