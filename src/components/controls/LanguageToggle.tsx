import React, { useEffect, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { Languages } from 'lucide-react';
import type { Locale } from '$/i18n/ui';
import { useLocale } from '$/i18n';

const STORAGE_KEY = 'dynamic:lang';
const COOKIE_KEY = 'dynamic:lang';
const LANGUAGE_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'zh-tw' as const, label: '中文' },
];

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
  align?: 'left' | 'right';
}

function LanguageToggle({ className, compact = false, align = 'left' }: LanguageToggleProps) {
  const locale = useLocale();
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Persist locale change and navigate after state update
  useEffect(() => {
    if (!pendingLocale) return;
    document.cookie = `${COOKIE_KEY}=${pendingLocale};max-age=31536000;path=/;SameSite=Lax`;
    localStorage.setItem(STORAGE_KEY, pendingLocale);
    navigate(location.href);
  }, [pendingLocale]);

  function setLocale(next: Locale) {
    setOpen(false);
    setPendingLocale(next);
  }

  const currentLabel = locale === 'en' ? 'English' : '中文';

  return (
    <div ref={menuRef} style={{ position: 'relative', width: '100%' }} className={className}>
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
          justifyContent: compact ? 'center' : 'flex-start',
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
        {!compact && <span>{currentLabel}</span>}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Select language"
          style={{
            position: 'absolute',
            left: align === 'left' ? 0 : 'auto',
            right: align === 'right' ? 0 : 'auto',
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
            width: 'max-content',
            minWidth: '140px',
            marginBottom: '0.25rem',
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

import withStrictMode from '$/components/withStrictMode';
export default withStrictMode(LanguageToggle);
