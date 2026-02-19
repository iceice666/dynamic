import { useTranslation } from '$/i18n';
import { author } from '../../../dynamic.config';
import { setMysteryUnlocked } from '$/stores/mystery';
import VisitCounter from './VisitCounter';
import withStrictMode from '$/components/withStrictMode';

const linkClass =
  'text-muted hover:text-accent text-xs no-underline transition-colors duration-150';

function SiteFooter() {
  const { t } = useTranslation();

  const year = new Date().getFullYear();
  const copyrightText = t('footer_copyright')
    .replace('{year}', String(year))
    .replace('{name}', author.name);

  function handleClearCookies() {
    if (!window.confirm(t('footer_clear_cookies_confirm'))) return;

    setMysteryUnlocked(false); // Explicitly lock the mystery feature

    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="site-footer">
      <hr className="border-border" />
      <div className="flex flex-col gap-1.5 px-4 py-3">
        {/* Visit counter */}
        <VisitCounter />

        {/* Copyright */}
        <span className="text-muted text-xs">{copyrightText}</span>

        {/* License */}
        <span className="text-muted text-xs">
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener"
            className={linkClass}
          >
            {t('footer_license')}
          </a>
        </span>

        {/* Links row */}
        <div className="text-muted flex flex-wrap items-center gap-x-1 text-xs">
          <a href="/rss.xml" className={linkClass}>
            {t('footer_rss')}
          </a>
          <span aria-hidden="true">·</span>
          <a href="/sitemap-index.xml" className={linkClass}>
            {t('footer_sitemap')}
          </a>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={handleClearCookies}
            className={`${linkClass} cursor-pointer border-none bg-transparent p-0 text-left`}
          >
            {t('footer_clear_cookies')}
          </button>
        </div>

        {/* Powered by */}
        {(() => {
          const [poweredByPrefix, poweredBySuffix] = t('footer_powered_by').split('{tools}');
          return (
            <span className="text-muted/60 text-[10px]">
              {poweredByPrefix}
              <a href="https://astro.build/" target="_blank" rel="noopener" className={linkClass}>
                Astro
              </a>
              {' & '}
              <a
                href="https://github.com/iceice666/dynamic"
                target="_blank"
                rel="noopener"
                className={linkClass}
              >
                Dynamic
              </a>
              {' @ '}
              <a
                href={`https://github.com/iceice666/dynamic/commit/${__GIT_HASH__}`}
                target="_blank"
                rel="noopener"
                className={linkClass}
              >
                {__GIT_HASH__}
              </a>
              {poweredBySuffix}
            </span>
          );
        })()}
      </div>
    </div>
  );
}

export default withStrictMode(SiteFooter);
