import { defineMiddleware } from 'astro:middleware';
import { locales, defaultLocale, type Locale } from '$/i18n/ui';

export const onRequest = defineMiddleware(({ locals, url }, next) => {
  // Skip logic for static assets and prerendered service files (like RSS, sitemap)
  // to avoid build-time warnings about header access.
  if (url.pathname.includes('.') && !url.pathname.endsWith('.html')) {
    return next();
  }

  const segment = url.pathname.split('/')[1];
  const locale = (locales as readonly string[]).includes(segment ?? '')
    ? (segment as Locale)
    : defaultLocale;

  locals.locale = locale;

  return next();
});
