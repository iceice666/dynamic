import { useTranslation } from '$/i18n';
import { author } from '../../../dynamic.config';
import VisitCounter from './VisitCounter';
import withStrictMode from '$/components/withStrictMode';

const linkClass =
  'text-muted hover:text-accent text-xs no-underline transition-colors duration-150';

function SiteFooter() {
  const { t, locale } = useTranslation();

  const year = new Date().getFullYear();
  const copyrightText = t('footer_copyright')
    .replace('{year}', String(year))
    .replace('{name}', author.name);

  function handleClearCookies() {
    if (!window.confirm(t('footer_clear_cookies_confirm'))) return;

    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="site-footer">
      <VisitCounter />
      <hr className="border-border" />
      <div className="flex flex-col gap-1.5 px-4 py-3">
        {/* Copyright & License */}
        <span className="text-muted text-xs">
          {copyrightText}
          {' · '}
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
        <span className="text-muted/60 text-[10px]">
          {t('footer_powered_by')}{' '}
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
          {locale === 'zh-tw' ? ' 驅動' : ''}
        </span>
      </div>
    </div>
  );
}

export default withStrictMode(SiteFooter);
