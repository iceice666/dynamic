import { ui, type Locale, type UIKey } from './ui';

export function useTranslations(locale: Locale) {
  return (key: UIKey): string => {
    return (ui[locale][key] ?? ui['en'][key]) as string;
  };
}

export function getLocaleFromURL(pathname: string): Locale {
  if (pathname.startsWith('/zh-tw')) return 'zh-tw';
  return 'en';
}

export function localePath(path: string, locale: Locale): string {
  if (locale === 'en') return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/zh-tw${normalized}`;
}

export function getAlternateLocaleURL(currentPath: string): string {
  if (currentPath.startsWith('/zh-tw')) {
    // Currently ZH-TW → switch to EN
    const stripped = currentPath.replace(/^\/zh-tw/, '') || '/';
    return stripped;
  }
  // Currently EN → switch to ZH-TW
  return `/zh-tw${currentPath}`;
}
