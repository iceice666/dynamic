export { ui, locales, localeLabels, defaultLocale, type Locale, type UIKey } from './ui';
export { useLocale, useTranslation } from './useLocale';
export { useLocaleSwitch } from './useLocaleSwitch';

import { ui, type Locale, type UIKey } from './ui';

/** Returns the translation string for the given locale and key */
export function t(locale: Locale, key: UIKey): string {
  return ui[locale][key];
}

/** Returns a single aria-label string for the given locale and key */
export function i18nAriaLabel(locale: Locale, key: UIKey): string {
  return ui[locale][key];
}

/** Given a base path and a locale, generates the localized URL string */
export function getLocaleLink(path: string, locale: Locale): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  let link = locale === 'en' ? normalizedPath : `/${locale}${normalizedPath}`;

  // ensure trailing slash but avoid double slashes
  if (link.length > 1 && !link.endsWith('/')) {
    link = `${link}/`;
  }

  // Clean up any double slashes that might have accidentally formed
  return link.replace(/\/{2,}/g, '/');
}
