import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import withStrictMode from '$/components/withStrictMode';
import { useTranslation, getLocaleLink, type Locale } from '$/i18n';

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

function stripTrailingHashtagTagLine(body: string): string {
  const withoutTrailingWhitespace = body.replace(/\s+$/g, '');
  const lines = withoutTrailingWhitespace.split(/\r?\n/);

  let lastIndex = lines.length - 1;
  while (lastIndex >= 0 && lines[lastIndex]!.trim() === '') lastIndex--;
  if (lastIndex < 0) return '';

  const lastLine = lines[lastIndex]!.trim();
  if (!/^(#\w+\s*)+$/.test(lastLine)) return lines.join('\n');

  lines.splice(lastIndex, 1);
  while (lines.length > 0 && lines[lines.length - 1]!.trim() === '') lines.pop();
  return lines.join('\n');
}

function getPostPreviewMarkdown(body: string): string {
  const cleaned = stripTrailingHashtagTagLine(body).trim();
  if (!cleaned) return '';

  const blankLineMatch = cleaned.match(/\r?\n\s*\r?\n/);
  let preview = blankLineMatch?.index != null ? cleaned.slice(0, blankLineMatch.index) : cleaned;

  if (preview.length > 500) preview = `${preview.slice(0, 500).trimEnd()}...`;
  return preview;
}

function SearchPage() {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
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
              {Object.values(
                results.reduce(
                  (acc, item) => {
                    if (item.type === 'post') {
                      acc[`post-${item.slug}`] = [item];
                    } else {
                      const key = `article-${item.slug}`;
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(item);
                    }
                    return acc;
                  },
                  {} as Record<string, SearchItem[]>
                )
              ).map((group) => {
                const first = group[0]!;
                if (first.type === 'post') {
                  return <PostResult key={`post-${first.slug}`} item={first} setQuery={setQuery} />;
                }
                return (
                  <ArticleResultGroup
                    key={`article-${first.slug}`}
                    group={group}
                    setQuery={setQuery}
                  />
                );
              })}
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
        <p className="text-muted m-0 text-center text-sm">{t('search_tag_hint')}</p>
      )}
    </div>
  );
}

function ArticleResultGroup({
  group,
  setQuery,
}: {
  group: SearchItem[];
  setQuery: (q: string) => void;
}) {
  const { t, locale } = useTranslation();
  const [showTranslations, setShowTranslations] = useState(false);

  // Fallback to 'en' or the first available item if exact lang not found
  const primaryItem =
    group.find((item) => (item.lang || 'en') === locale) ||
    group.find((item) => (item.lang || 'en') === 'en') ||
    group[0]!;

  const otherTranslations = group.filter((item) => item !== primaryItem);

  return (
    <article className="card flex flex-col gap-2">
      <div className="label-uppercase flex flex-wrap items-center gap-1.5">
        <span>
          {t('article_label')}
          {primaryItem.categoryName && ` \u00b7 ${primaryItem.categoryName}`}
        </span>
        {primaryItem.lang && primaryItem.lang !== 'en' && (
          <span className="border-border rounded border px-1 py-0.5 text-[0.6rem] font-semibold tracking-wider uppercase opacity-60">
            {primaryItem.lang}
          </span>
        )}
      </div>
      <h2 className="m-0 text-[1.0625rem] leading-[1.3] font-bold">
        <a
          href={getLocaleLink(
            `/articles/${primaryItem.slug}`,
            (primaryItem.lang === 'zh-tw' ? 'zh-tw' : 'en') as Locale
          )}
          className="link-accent"
        >
          {primaryItem.title}
        </a>
      </h2>
      {primaryItem.description && (
        <p className="excerpt text-muted m-0 overflow-hidden text-sm leading-normal">
          {primaryItem.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {primaryItem.tags.map((tag) => (
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
        <time className="text-muted text-xs" dateTime={primaryItem.publishedAt}>
          {formatDate(primaryItem.publishedAt)}
        </time>
      </div>

      {otherTranslations.length > 0 && (
        <div className="border-border/50 mt-2 border-t pt-2">
          <button
            type="button"
            onClick={() => setShowTranslations(!showTranslations)}
            className="text-muted hover:text-foreground flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-xs transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${showTranslations ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            {otherTranslations.length} {showTranslations ? 'Hide' : 'Other'} translation
            {otherTranslations.length > 1 ? 's' : ''}
          </button>

          {showTranslations && (
            <div className="border-border/50 mt-2 flex flex-col gap-2 border-l-2 pl-4">
              {otherTranslations.map((trans) => (
                <div key={trans.lang} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    {trans.lang && trans.lang !== 'en' && (
                      <span className="border-border rounded border px-1 py-px text-[0.55rem] font-semibold tracking-wider uppercase opacity-60">
                        {trans.lang}
                      </span>
                    )}
                    <a
                      href={getLocaleLink(
                        `/articles/${trans.slug}`,
                        (trans.lang === 'zh-tw' ? 'zh-tw' : 'en') as Locale
                      )}
                      className="link-accent text-sm font-medium"
                    >
                      {trans.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function PostResult({ item, setQuery }: { item: SearchItem; setQuery: (q: string) => void }) {
  const { t } = useTranslation();
  const previewMarkdown = getPostPreviewMarkdown(item.body);
  const out = marked.parse(previewMarkdown, { breaks: true });
  const previewHtml = typeof out === 'string' ? out : null;

  const postPath = `/posts/${item.slug}/`;

  return (
    <article className="card relative">
      <a
        href={postPath}
        className="absolute inset-0 rounded-[inherit]"
        aria-label={t('post_label')}
      ></a>
      <div className="label-uppercase flex flex-wrap items-center gap-1.5">
        <span>{t('post_label')}</span>
      </div>
      {previewHtml ? (
        <div
          className="prose prose-sm text-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : (
        <div className="text-foreground max-w-none text-sm">{previewMarkdown}</div>
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

export default withStrictMode(SearchPage);
