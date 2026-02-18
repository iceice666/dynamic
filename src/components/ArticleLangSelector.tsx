import React, { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { useLocale } from '$/i18n';
import withStrictMode from '$/components/withStrictMode';

// Human-readable labels for known locales
const LANG_LABELS: Record<string, string> = {
  en: 'English',
  'zh-tw': '中文',
};

function langLabel(lang: string): string {
  return LANG_LABELS[lang] ?? lang.toUpperCase();
}

interface Props {
  available: { lang: string }[];
}

function ArticleLangSelector({ available }: Props) {
  const locale = useLocale();
  const [pendingLang, setPendingLang] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingLang) return;
    document.cookie = `dynamic:lang=${pendingLang};max-age=31536000;path=/;SameSite=Lax`;
    localStorage.setItem('dynamic:lang', pendingLang);
    navigate(location.href);
  }, [pendingLang]);

  function switchLang(lang: string) {
    setPendingLang(lang);
  }

  return (
    <div className="not-prose mb-4 flex gap-2">
      {available.map(({ lang }) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLang(lang)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 ${
            locale === lang
              ? 'bg-accent text-white'
              : 'bg-muted-bg text-muted hover:text-foreground'
          }`}
        >
          {langLabel(lang)}
        </button>
      ))}
    </div>
  );
}

export default withStrictMode(ArticleLangSelector);
