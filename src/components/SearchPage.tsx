import { useEffect, useRef, useState } from 'react';
import { ui } from '../i18n/ui';
import { useLocale } from '../i18n/useLocale';

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

function getInitialQuery(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') ?? '';
}

export default function SearchPage() {
  const locale = useLocale();
  const t = (key: keyof (typeof ui)['en']) => ui[locale][key];

  const [query, setQuery] = useState(getInitialQuery);
  const [index, setIndex] = useState<SearchItem[]>(cachedIndex ?? []);
  const [loading, setLoading] = useState(!cachedIndex);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch index on mount
  useEffect(() => {
    if (cachedIndex) return;
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        cachedIndex = data;
        setIndex(data);
        setLoading(false);
      });
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

  // Filter results
  const trimmed = query.trim();
  const results = trimmed
    ? index.filter((item) => {
        if (item.lang !== locale) return false;
        if (trimmed.startsWith('#')) {
          const tagQuery = trimmed.slice(1).toLowerCase();
          return item.tags.some((t) => t.toLowerCase() === tagQuery);
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
      <h1 className="text-foreground m-0 mb-2 text-2xl font-bold">
        <span data-i18n-en>{ui.en.page_search_heading}</span>
        <span data-i18n-zh-tw>{ui['zh-tw'].page_search_heading}</span>
      </h1>

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
                  <ArticleResult key={`article-${item.slug}`} item={item} />
                ) : (
                  <PostResult key={`post-${item.slug}`} item={item} />
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
        <div className="text-muted mt-4 text-center text-sm">
          <p>{t('search_empty_hint')}</p>
          <p>{t('search_tag_hint')}</p>
        </div>
      )}
    </div>
  );
}

function ArticleResult({ item }: { item: SearchItem }) {
  return (
    <article className="border-border bg-background hover:bg-muted-bg flex flex-col gap-2 rounded-lg border p-4 transition-colors duration-150">
      <div className="text-muted text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
        <span data-i18n-en>{ui.en.article_label}</span>
        <span data-i18n-zh-tw>{ui['zh-tw'].article_label}</span>
        {item.categoryName && ` · ${item.categoryName}`}
      </div>
      <h2 className="m-0 text-[1.0625rem] leading-[1.3] font-bold">
        <a
          href={`/articles/${item.slug}`}
          className="text-foreground hover:text-accent no-underline transition-colors duration-150"
        >
          {item.title}
        </a>
      </h2>
      {item.description && (
        <p className="text-muted m-0 overflow-hidden text-sm leading-normal" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {item.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <a
              key={tag}
              href={`/tags/${tag}`}
              className="text-accent text-xs no-underline transition-opacity duration-150 hover:opacity-75"
            >
              #{tag}
            </a>
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

function PostResult({ item }: { item: SearchItem }) {
  return (
    <article className="border-border bg-background hover:bg-muted-bg flex flex-col gap-2 rounded-lg border p-4 transition-colors duration-150">
      <div className="text-muted text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
        <span data-i18n-en>{ui.en.post_label}</span>
        <span data-i18n-zh-tw>{ui['zh-tw'].post_label}</span>
      </div>
      <div className="text-foreground max-w-none text-sm">
        {item.body.length >= 500 ? item.body + '...' : item.body}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <a
              key={tag}
              href={`/tags/${tag}`}
              className="text-accent text-xs no-underline transition-opacity duration-150 hover:opacity-75"
            >
              #{tag}
            </a>
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
