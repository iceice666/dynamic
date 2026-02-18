import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useTranslation } from '$/i18n/useLocale';
import { fetchUmamiStats, formatCount, type UmamiStats } from '$/utils/umami';

export default function ArticleViewCount({ path }: { path: string }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/visit-count?path=${encodeURIComponent(path)}`);
        if (!res.ok) throw new Error('non-ok');
        const data: Stats = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (error) return null;

  return (
    <span className="text-muted flex items-center gap-1 text-xs">
      <Eye size={12} aria-hidden="true" />
      {stats ? (
        <span>
          <span className="text-foreground font-medium">
            {formatCount(stats.pageviews, locale)}
          </span>{' '}
          {t('article_views')}
        </span>
      ) : (
        <span className="bg-muted-bg h-3 w-12 animate-pulse rounded" aria-hidden="true" />
      )}
    </span>
  );
}
