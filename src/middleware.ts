import { defineMiddleware } from 'astro:middleware';
import { locales, defaultLocale, type Locale } from '$/i18n/ui';

export const onRequest = defineMiddleware(({ locals, cookies }, next) => {
  const stored = cookies.get('dynamic:lang')?.value;
  locals.locale = (locales as readonly string[]).includes(stored ?? '')
    ? (stored as Locale)
    : defaultLocale;
  return next();
});
