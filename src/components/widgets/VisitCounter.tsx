import { useEffect, useState } from 'react';
import { Eye, Users } from 'lucide-react';
import { useTranslation } from '$/i18n/useLocale';
import { fetchUmamiStats, formatCount, type UmamiStats } from '$/utils/umami';

export default function VisitCounter({ path }: { path?: string } = {}) {
  const { t, locale } = useTranslation();
  const [stats, setStats] = useState<UmamiStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchUmamiStats(path);
      if (!cancelled) {
        if (data) {
          setStats(data);
        } else {
          setError(true);
        }
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
    <div className="text-muted flex flex-wrap items-center gap-3 text-xs">
      <div className="flex items-center gap-1.5">
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
      <div className="flex items-center gap-1.5">
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
  );
}
