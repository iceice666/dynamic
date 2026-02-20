import React, { useState, useEffect, useRef } from 'react';
import { navigate } from 'astro:transitions/client';
import { Languages, ChevronDown } from 'lucide-react';
import withStrictMode from '$/components/withStrictMode';

const COOKIE_KEY = 'dynamic:article-lang';

const LANG_LABELS: Record<string, string> = {
  en: 'English',
  'zh-tw': '中文',
};

function langLabel(lang: string): string {
  return LANG_LABELS[lang] ?? lang.toUpperCase();
}

interface Props {
  available: { lang: string }[];
  currentLang: string;
}

function ArticleLangSelector({ available, currentLang }: Props) {
  const [open, setOpen] = useState(false);
  const [pendingLang, setPendingLang] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pendingLang) return;
    document.cookie = `${COOKIE_KEY}=${pendingLang};max-age=31536000;path=/;SameSite=Lax`;
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    navigate(url.toString());
  }, [pendingLang]);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted hover:text-foreground flex items-center gap-1.5 text-sm transition-colors duration-150"
      >
        <Languages size={15} aria-hidden="true" />
        <span>{langLabel(currentLang)}</span>
        <ChevronDown
          size={12}
          aria-hidden="true"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms',
          }}
        />
      </button>
      {open && (
        <div className="bg-background border-border absolute top-full right-0 z-10 mt-1 min-w-24 overflow-hidden rounded border shadow-md">
          {available.map(({ lang }) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setOpen(false);
                setPendingLang(lang);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors duration-100 ${
                currentLang === lang
                  ? 'text-accent font-medium'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {langLabel(lang)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default withStrictMode(ArticleLangSelector);
