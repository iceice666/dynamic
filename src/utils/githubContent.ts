/** Commits a file to a GitHub repo via the Contents API — used to publish posts directly to the `publish` branch. */

interface CommitFileParams {
  token: string;
  repo: `${string}/${string}`;
  path: string;
  content: string;
  message: string;
  branch: string;
}

const GITHUB_API = 'https://api.github.com';

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'dynamic-blog-admin',
    Accept: 'application/vnd.github+json',
  };
}

function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

async function getExistingFileSha(
  params: Pick<CommitFileParams, 'token' | 'repo' | 'path' | 'branch'>
): Promise<string | undefined> {
  const res = await fetch(
    `${GITHUB_API}/repos/${params.repo}/contents/${params.path}?ref=${encodeURIComponent(params.branch)}`,
    { headers: authHeaders(params.token) }
  );
  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`Failed to look up existing file (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

/** Create or update a file, committing directly to `branch`. */
export async function commitFile(params: CommitFileParams): Promise<void> {
  const sha = await getExistingFileSha(params);

  const res = await fetch(`${GITHUB_API}/repos/${params.repo}/contents/${params.path}`, {
    method: 'PUT',
    headers: { ...authHeaders(params.token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: params.message,
      content: encodeBase64(params.content),
      branch: params.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub commit failed (${res.status}): ${await res.text()}`);
  }
}
