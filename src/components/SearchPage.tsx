import React, { useEffect, useRef, useState } from 'react';
import withStrictMode from '$/components/withStrictMode';
import { useTranslation } from '$/i18n';

interface SearchItem {
  type: 'article' | 'post';
  slug: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  category: string;
  categoryName: string;
  lang: string;
  body: string;
}

let cachedIndex: SearchItem[] | null = null;

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}

function buildCategoryCounts(index: SearchItem[]) {
  const map = new Map<string, { name: string; count: number }>();
  for (const item of index) {
    if (!item.category) continue;
    const existing = map.get(item.category);
    if (existing) {
      existing.count++;
    } else {
      map.set(item.category, { name: item.categoryName, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}

function buildTagCounts(index: SearchItem[]) {
  const map = new Map<string, number>();
  for (const item of index) {
    for (const tag of item.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

type Tab = 'categories' | 'tags';

function SearchPage() {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize from URL and load index on mount
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q') ?? '';
    if (q) setQuery(q);

    if (cachedIndex) {
      setIndex(cachedIndex);
      setLoading(false);
    } else {
      fetch('/search-index.json')
        .then((r) => r.json())
        .then((data: SearchItem[]) => {
          cachedIndex = data;
          setIndex(data);
          setLoading(false);
        });
    }
  }, []);

  // Re-read ?q= after view transitions
  useEffect(() => {
    const handler = () => {
      const q = new URLSearchParams(window.location.search).get('q') ?? '';
      setQuery(q);
    };
    document.addEventListener('astro:page-load', handler);
    return () => document.removeEventListener('astro:page-load', handler);
  }, []);

  // Sync query to URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    history.replaceState(null, '', url.toString());
  }, [query]);

  // Autofocus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Derive category counts from index (language-agnostic)
  const categoryCounts = buildCategoryCounts(index);

  // Derive tag counts from index (language-agnostic)
  const tagCounts = buildTagCounts(index);

  // Filter results
  const trimmed = query.trim();
  const results = trimmed
    ? index.filter((item) => {
        if (trimmed.startsWith('#')) {
          const tagQuery = trimmed.slice(1).toLowerCase();
          return item.tags.some((t) => t.toLowerCase().includes(tagQuery));
        }
        if (trimmed.startsWith('@')) {
          const catQuery = trimmed.slice(1).toLowerCase();
          return item.category.toLowerCase().includes(catQuery);
        }
        const q = trimmed.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.body.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.categoryName.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-foreground m-0 mb-2 text-2xl font-bold">{t('page_search_heading')}</h1>

      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder={t('search_placeholder')}
        aria-label={t('search_aria')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : trimmed ? (
        results.length > 0 ? (
          <>
            <p className="text-muted m-0 text-sm">
              {results.length} {t('search_results_count')} &ldquo;{trimmed}&rdquo;
            </p>
            <div className="flex flex-col gap-4">
              {results.map((item) =>
                item.type === 'article' ? (
                  <ArticleResult key={`article-${item.slug}`} item={item} setQuery={setQuery} />
                ) : (
                  <PostResult key={`post-${item.slug}`} item={item} setQuery={setQuery} />
                )
              )}
            </div>
          </>
        ) : (
          <div className="text-muted mt-4 text-center text-sm">
            <p>
              {t('search_no_results')} &ldquo;{trimmed}&rdquo;
            </p>
            <p>{t('search_no_results_hint')}</p>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-muted m-0 text-center text-sm">{t('search_tag_hint')}</p>

          {/* Tab buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                activeTab === 'categories'
                  ? 'bg-accent text-white'
                  : 'bg-muted-bg text-muted hover:text-foreground'
              }`}
            >
              {t('page_categories_heading')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tags')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                activeTab === 'tags'
                  ? 'bg-accent text-white'
                  : 'bg-muted-bg text-muted hover:text-foreground'
              }`}
            >
              {t('page_tags_heading')}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'categories' ? (
            <div className="flex flex-col gap-2">
              {categoryCounts.map(({ slug, name, count }) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setQuery(`@${slug}`)}
                  className="border-border bg-background hover:bg-muted-bg flex items-center justify-between rounded-lg border p-3 text-left transition-colors duration-150"
                >
                  <span className="text-foreground text-sm font-medium">{name}</span>
                  <span className="text-muted text-xs">{count}</span>
                </button>
              ))}
              {categoryCounts.length === 0 && (
                <p className="text-muted text-center text-sm">No categories yet.</p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagCounts.map(({ tag, count }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(`#${tag}`)}
                  className="bg-muted-bg text-muted hover:text-foreground hover:bg-accent/10 rounded-full px-3 py-1 text-xs transition-colors duration-150"
                >
                  #{tag} <span className="opacity-60">({count})</span>
                </button>
              ))}
              {tagCounts.length === 0 && (
                <p className="text-muted text-center text-sm">No tags yet.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ArticleResult({ item, setQuery }: { item: SearchItem; setQuery: (q: string) => void }) {
  const { t } = useTranslation();
  return (
    <article className="card">
      <div className="label-uppercase">
        {t('article_label')}
        {item.categoryName && ` \u00b7 ${item.categoryName}`}
      </div>
      <h2 className="m-0 text-[1.0625rem] leading-[1.3] font-bold">
        <a href={`/articles/${item.slug}`} className="link-accent">
          {item.title}
        </a>
      </h2>
      {item.description && (
        <p className="excerpt text-muted m-0 overflow-hidden text-sm leading-normal">
          {item.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(`#${tag}`)}
              className="tag-link cursor-pointer border-none bg-transparent p-0"
            >
              #{tag}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <time className="text-muted text-xs" dateTime={item.publishedAt}>
          {formatDate(item.publishedAt)}
        </time>
      </div>
    </article>
  );
}

function PostResult({ item, setQuery }: { item: SearchItem; setQuery: (q: string) => void }) {
  const { t } = useTranslation();
  return (
    <article className="card">
      <div className="label-uppercase">{t('post_label')}</div>
      <div className="text-foreground max-w-none text-sm">
        {item.body.length >= 500 ? item.body.slice(0, 500) + '...' : item.body}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(`#${tag}`)}
              className="tag-link cursor-pointer border-none bg-transparent p-0"
            >
              #{tag}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <time className="text-muted text-xs" dateTime={item.publishedAt}>
          {formatDate(item.publishedAt)}
        </time>
      </div>
    </article>
  );
}

export default withStrictMode(SearchPage);
