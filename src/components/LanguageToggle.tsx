import { useState, useEffect, memo } from 'react';
import { Globe } from 'lucide-react';
import type { Locale } from '../i18n/ui';

const STORAGE_KEY = 'dynamic:lang';

function LanguageToggle() {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh-tw') setLocaleState('zh-tw');
  }, []);

  function toggle() {
    const next: Locale = locale === 'en' ? 'zh-tw' : 'en';
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next === 'zh-tw' ? 'zh-TW' : 'en';
  }

  const label = locale === 'en' ? '中文' : 'English';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch language to ${locale === 'en' ? 'Chinese' : 'English'}`}
      lang={locale === 'en' ? 'zh-TW' : 'en'}
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
    >
      <Globe size={18} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default memo(LanguageToggle);
