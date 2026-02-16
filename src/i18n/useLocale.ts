import { useSyncExternalStore } from 'react';
import { ui, type Locale, type UIKey } from './ui';

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributeFilter: ['data-lang'] });
  return () => observer.disconnect();
}

function getSnapshot(): Locale {
  const lang = document.documentElement.dataset.lang;
  return lang === 'zh-tw' ? 'zh-tw' : 'en';
}

function getServerSnapshot(): Locale {
  return 'en';
}

/** Reactive locale from `document.documentElement.dataset.lang` */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Reactive locale + type-safe t() function */
export function useTranslation() {
  const locale = useLocale();
  function t(key: UIKey): string {
    return ui[locale][key];
  }
  return { locale, t };
}
