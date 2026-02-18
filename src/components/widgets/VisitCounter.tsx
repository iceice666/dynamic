import { useEffect, useState } from 'react';
import { Eye, Users } from 'lucide-react';
import { useTranslation } from '$/i18n/useLocale';
import { fetchUmamiStats, formatCount, type UmamiStats } from '$/utils/umami';

export default function VisitCounter({ path }: { path?: string } = {}) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const apiPath = path
          ? `/api/visit-count?path=${encodeURIComponent(path)}`
          : '/api/visit-count';
        const res = await fetch(apiPath);
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

  // Don't render anything if there's an error (e.g. umami not configured)
  if (error) return null;

  return (
    <div className="px-4 py-3">
      <div className="label-uppercase mb-2">{t('widget_visits_label')}</div>
      <div className="flex flex-col gap-1.5">
        <div className="text-muted flex items-center gap-1.5 text-xs">
          <Eye size={12} aria-hidden="true" className="shrink-0" />
          {stats ? (
            <span>
              <span className="text-foreground font-medium">
                {formatCount(stats.pageviews, locale)}
              </span>{' '}
              {t('widget_visits_pageviews')}
            </span>
          ) : (
            <span className="bg-muted-bg h-3 w-16 animate-pulse rounded" aria-hidden="true" />
          )}
        </div>
        <div className="text-muted flex items-center gap-1.5 text-xs">
          <Users size={12} aria-hidden="true" className="shrink-0" />
          {stats ? (
            <span>
              <span className="text-foreground font-medium">
                {formatCount(stats.visitors, locale)}
              </span>{' '}
              {t('widget_visits_visitors')}
            </span>
          ) : (
            <span className="bg-muted-bg h-3 w-16 animate-pulse rounded" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
