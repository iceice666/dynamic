export { ui, type Locale, type UIKey } from './ui';
export { useLocale, useTranslation } from './useLocale';

import { ui, type UIKey } from './ui';

/** Returns both locale values for a key (for dual-span rendering in Astro components) */
export function t(key: UIKey): { en: string; 'zh-tw': string } {
  return { en: ui.en[key], 'zh-tw': ui['zh-tw'][key] };
}

/** Returns spread props for i18n-aware aria-label attributes */
export function i18nAriaLabel(key: UIKey): Record<string, string> {
  return {
    'aria-label': ui.en[key],
    'data-aria-en': ui.en[key],
    'data-aria-zh-tw': ui['zh-tw'][key],
  };
}
