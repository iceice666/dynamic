import React, { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import type { Locale } from '$/i18n/ui';

const STORAGE_KEY = 'dynamic:lang';
const LANGUAGE_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'zh-tw' as const, label: '中文' },
];

function LanguageToggle() {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh-tw') setLocaleState('zh-tw');
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleOutside(event: PointerEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [open]);

  useEffect(() => {
    document.documentElement.dataset.lang = locale;
    document.documentElement.lang = locale === 'zh-tw' ? 'zh-TW' : 'en';
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    setOpen(false);
  }

  const currentLabel = locale === 'en' ? 'English' : '中文';

  return (
    <div ref={menuRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language: ${currentLabel}`}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: '0.5rem',
          borderRadius: '0.375rem',
          border: 'none',
          background: 'transparent',
          padding: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-muted)',
          cursor: 'pointer',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-foreground)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <Languages size={18} aria-hidden="true" />
        <span>{currentLabel}</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Select language"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 12px 30px oklch(0% 0 0 / 20%)',
            zIndex: 60,
          }}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={locale === option.value}
              onClick={() => setLocale(option.value)}
              lang={option.value === 'zh-tw' ? 'zh-TW' : 'en'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                width: '100%',
                border: 'none',
                background: 'transparent',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.85rem',
                color: locale === option.value ? 'var(--color-foreground)' : 'var(--color-muted)',
                cursor: 'pointer',
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-foreground)';
                e.currentTarget.style.background = 'rgba(127,127,127,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  locale === option.value ? 'var(--color-foreground)' : 'var(--color-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span>{option.label}</span>
              {locale === option.value ? <span aria-hidden="true">•</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default LanguageToggle;
