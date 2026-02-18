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
