import { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';
import type { Locale } from './ui';

const STORAGE_KEY = 'dynamic:lang';
const COOKIE_KEY = 'dynamic:lang';

export function useLocaleSwitch() {
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  useEffect(() => {
    if (!pendingLocale) return;
    document.cookie = `${COOKIE_KEY}=${pendingLocale};max-age=31536000;path=/;SameSite=Lax`;
    localStorage.setItem(STORAGE_KEY, pendingLocale);
    navigate(location.href);
  }, [pendingLocale]);

  return { selectLocale: setPendingLocale };
}
