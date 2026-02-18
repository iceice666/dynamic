import React from 'react';
import { locales, localeLabels, useLocale, useLocaleSwitch } from '$/i18n';
import withStrictMode from '$/components/withStrictMode';

function toBcp47(locale: string): string {
  const parts = locale.split('-');
  if (parts.length === 1) return parts[0];
  return `${parts[0]}-${parts[1].toUpperCase()}`;
}

interface LanguageToggleTouchProps {
  className?: string;
}

function LanguageToggleTouch({ className }: LanguageToggleTouchProps) {
  const locale = useLocale();
  const { selectLocale } = useLocaleSwitch();

  return (
    <div className={className}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
          gap: '0.5rem',
        }}
      >
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => selectLocale(loc)}
            lang={toBcp47(loc)}
            aria-pressed={locale === loc}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '3rem',
              borderRadius: '0.5rem',
              border: '1.5px solid',
              borderColor: locale === loc ? 'var(--color-accent)' : 'var(--color-border)',
              background: locale === loc ? 'var(--color-muted-bg)' : 'transparent',
              color: locale === loc ? 'var(--color-foreground)' : 'var(--color-muted)',
              fontSize: '0.9375rem',
              fontWeight: locale === loc ? 600 : 400,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
          >
            {localeLabels[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default withStrictMode(LanguageToggleTouch);
