import { useState } from 'react';
import withStrictMode from '$/components/withStrictMode';
import type { Draft } from '$/utils/drafts';

interface PostEditorProps {
  draft: Draft;
}

const inputClass =
  'border-border bg-background text-foreground focus:border-accent w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors';

function PostEditor({ draft }: PostEditorProps) {
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description ?? '');
  const [category, setCategory] = useState(draft.category ?? '');
  const [tags, setTags] = useState(draft.tags.join(', '));
  const [lang, setLang] = useState(draft.lang);
  const [body, setBody] = useState(draft.body);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function currentFields() {
    return {
      title,
      description: description || undefined,
      category: category || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      lang,
      body,
    };
  }

  async function persistDraft(): Promise<boolean> {
    const res = await fetch(`/api/admin/drafts/${draft.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentFields()),
    });
    return res.ok;
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    const ok = await persistDraft();
    setStatus(ok ? 'Draft saved.' : 'Failed to save draft.');
    setSaving(false);
  }

  async function handlePublish() {
    if (!title.trim()) {
      setStatus('Title is required to publish.');
      return;
    }
    setPublishing(true);
    setStatus(null);
    try {
      const saved = await persistDraft();
      if (!saved) throw new Error('Failed to save draft before publishing.');

      const res = await fetch('/api/admin/publish/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draft.id }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Publish failed');

      setStatus(`Published! Live at ${data.url} (deploy takes a minute).`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to publish.');
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this draft? This cannot be undone.')) return;
    await fetch(`/api/admin/drafts/${draft.id}/`, { method: 'DELETE' });
    window.location.href = '/admin/';
  }

  const busy = saving || publishing;

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
        className={`${inputClass} text-lg font-semibold`}
      />

      <textarea
        placeholder="Description (optional — auto-extracted from body if left blank)"
        value={description}
        onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
        className={inputClass}
        rows={2}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory((e.target as HTMLInputElement).value)}
          className={inputClass}
        />
        <select
          value={lang}
          onChange={(e) => setLang((e.target as HTMLSelectElement).value)}
          className={inputClass}
        >
          <option value="en">English</option>
          <option value="zh-tw">繁體中文</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags((e.target as HTMLInputElement).value)}
        className={inputClass}
      />

      <textarea
        placeholder="Write your post in Markdown…"
        value={body}
        onChange={(e) => setBody((e.target as HTMLTextAreaElement).value)}
        className={`${inputClass} font-mono`}
        rows={20}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="border-border hover:bg-muted/50 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={busy}
          className="bg-accent text-accent-fg rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50"
        >
          {publishing ? 'Publishing…' : 'Publish'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="text-muted hover:text-foreground ml-auto text-sm underline disabled:opacity-50"
        >
          Delete draft
        </button>
      </div>

      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}

export default withStrictMode(PostEditor);
