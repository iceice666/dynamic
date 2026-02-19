import { useState, useEffect } from 'react';
import { ui, type Locale, type UIKey } from './ui';

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    function update() {
      const lang = document.documentElement.dataset.lang;
      setLocale(lang === 'zh-tw' ? 'zh-tw' : 'en');
    }
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributeFilter: ['data-lang'] });
    return () => observer.disconnect();
  }, []);

  return locale;
}

export function useTranslation() {
  const locale = useLocale();
  function t(key: UIKey): string {
    return ui[locale][key];
  }
  return { locale, t };
}
