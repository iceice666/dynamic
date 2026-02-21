import { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';
import type { Locale } from './ui';
import { locales } from './ui';

export function useLocaleSwitch() {
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  useEffect(() => {
    if (!pendingLocale) return;

    // Detect the current locale prefix and swap/remove it
    const { pathname, search, hash } = window.location;
    const segments = pathname.split('/').filter(Boolean);

    const hasLocalePrefix = (locales as readonly string[]).includes(segments[0]);
    const baseSegments = hasLocalePrefix ? segments.slice(1) : segments;

    const newPath =
      pendingLocale === 'en'
        ? `/${baseSegments.join('/')}`
        : `/${pendingLocale}/${baseSegments.join('/')}`;

    // trailingSlash: 'always' is correctly set, so enforce it
    const newPathWithTrailing = newPath.endsWith('/') ? newPath : `${newPath}/`;
    const finalUrl = `${newPathWithTrailing === '//' ? '/' : newPathWithTrailing}${search}${hash}`;

    navigate(finalUrl);
  }, [pendingLocale]);

  return { selectLocale: setPendingLocale };
}
