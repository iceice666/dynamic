/** In-progress post drafts, stored in a Cloudflare KV namespace until published. */
import type { env as workersEnv } from 'cloudflare:workers';

type DraftStore = typeof workersEnv.DRAFTS;
export interface Draft {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  lang: string;
  body: string;
  updatedAt: string; // ISO timestamp
}

const KEY_PREFIX = 'draft:';

export async function listDrafts(kv: DraftStore): Promise<Draft[]> {
  const { keys } = await kv.list({ prefix: KEY_PREFIX });
  const drafts = await Promise.all(keys.map((k) => kv.get<Draft>(k.name, 'json')));
  return drafts
    .filter((d): d is Draft => d !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getDraft(kv: DraftStore, id: string): Promise<Draft | null> {
  return kv.get<Draft>(KEY_PREFIX + id, 'json');
}

export async function saveDraft(kv: DraftStore, draft: Draft): Promise<void> {
  await kv.put(KEY_PREFIX + draft.id, JSON.stringify(draft));
}

export async function deleteDraft(kv: DraftStore, id: string): Promise<void> {
  await kv.delete(KEY_PREFIX + id);
}

export async function createDraft(kv: DraftStore): Promise<Draft> {
  const draft: Draft = {
    id: crypto.randomUUID(),
    title: '',
    tags: [],
    lang: 'en',
    body: '',
    updatedAt: new Date().toISOString(),
  };
  await saveDraft(kv, draft);
  return draft;
}
