import { defineMiddleware } from 'astro:middleware';
import { locales, defaultLocale, type Locale } from '$/i18n/ui';

export const onRequest = defineMiddleware(({ locals, cookies, url }, next) => {
  // Skip logic for static assets and prerendered service files (like RSS, sitemap)
  // to avoid build-time warnings about header access.
  if (url.pathname.includes('.') && !url.pathname.endsWith('.html')) {
    return next();
  }

  const stored = cookies.get('dynamic:lang')?.value;
  locals.locale = (locales as readonly string[]).includes(stored ?? '')
    ? (stored as Locale)
    : defaultLocale;
  return next();
});
