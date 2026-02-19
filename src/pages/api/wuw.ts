/* eslint-disable no-console */
import type { APIRoute } from 'astro';
import { umami } from '../../../dynamic.config';

// --- Token cache (in-memory, per-process) ---
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

/**
 * Obtain a JWT token from Umami's login endpoint.
 * Caches the token in memory and refreshes when it nears expiry.
 */
async function getAuthToken(): Promise<string | null> {
  // If we already have a valid API key (Umami Cloud), skip login
  if (umami.apiKey) return null; // we'll use x-umami-api-key header instead

  if (!umami.username || !umami.password) {
    console.warn('[wuw] No UMAMI_USERNAME / UMAMI_PASSWORD configured — cannot authenticate');
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const apiBase = umami.apiUrl.replace(/\/+$/, '');
  const loginUrl = `${apiBase}/api/auth/login`;
  // Login request

  try {
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: umami.username,
        password: umami.password,
      }),
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
async function buildAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (umami.apiKey) {
    // Umami Cloud path
    headers['x-umami-api-key'] = umami.apiKey;
  } else {
    // Self-hosted path — login for a JWT
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export const GET: APIRoute = async ({ url }) => {
  const path = url.searchParams.get('path') ?? undefined;
  if (!umami.apiUrl || !umami.websiteId) {
    console.error('[wuw] Umami not configured (missing apiUrl or websiteId)');
    return new Response(JSON.stringify({ error: 'Umami not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Fetch stats from the beginning of time to now
  const startAt = 0;
  const endAt = Date.now();

  const params = new URLSearchParams({
    startAt: String(startAt),
    endAt: String(endAt),
    ...(path ? { url: path } : {}),
  });

  const apiBase = umami.apiUrl.replace(/\/+$/, '');
  const apiUrl = `${apiBase}/api/websites/${umami.websiteId}/stats?${params}`;
  const headers = await buildAuthHeaders();

  try {
    let res = await fetch(apiUrl, { headers });
    // If we got a 401 and are using a cached token, try refreshing once
    if (res.status === 401 && cachedToken) {
      cachedToken = null;
      tokenExpiresAt = 0;
      const freshHeaders = await buildAuthHeaders();
      res = await fetch(apiUrl, { headers: freshHeaders });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[wuw] Upstream error body: ${errText}`);
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
  } catch (err) {
    console.error('[wuw] Fetch failed:', err);
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
