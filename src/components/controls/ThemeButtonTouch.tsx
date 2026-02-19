import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from '$/i18n/useLocale';
import { useStore } from '@nanostores/react';
import {
  $theme,
  $hue,
  $rainbow,
  $speed,
  setTheme,
  setHue,
  setRainbow,
  setSpeed,
  type Theme,
} from '$/stores/theme';
import withStrictMode from '$/components/withStrictMode';

interface ThemeButtonTouchProps {
  className?: string;
}

function ThemeButtonTouch({ className }: ThemeButtonTouchProps) {
  const [mounted, setMounted] = React.useState(false);
  const storeTheme = useStore($theme);
  const hue = useStore($hue);
  const rainbow = useStore($rainbow);
  const speed = useStore($speed);
  const { t } = useTranslation();

  // Use 'system' during hydration to match server
  const theme = mounted ? storeTheme : 'system';

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const modes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('nav_theme_light'), icon: <Sun size={20} /> },
    { value: 'dark', label: t('nav_theme_dark'), icon: <Moon size={20} /> },
    { value: 'system', label: t('nav_theme_system'), icon: <Monitor size={20} /> },
  ];

  return (
    <div className={className}>
      {/* Theme Mode: 3 equal-width tile buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            marginBottom: '0.625rem',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
          }}
        >
          {t('theme_mode_label')}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setTheme(mode.value)}
              aria-pressed={theme === mode.value}
              aria-label={mode.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                minHeight: '3rem',
                borderRadius: '0.5rem',
                border: '1.5px solid',
                borderColor: theme === mode.value ? 'var(--color-accent)' : 'var(--color-border)',
                background: theme === mode.value ? 'var(--color-muted-bg)' : 'transparent',
                color: theme === mode.value ? 'var(--color-foreground)' : 'var(--color-muted)',
                cursor: 'pointer',
                padding: '0.5rem 0.25rem',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              }}
            >
              {mode.icon}
              <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color (hidden when rainbow active) */}
      {!rainbow && (
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              marginBottom: '0.5rem',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}
          >
            {t('theme_accent_label')}
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(parseInt(e.target.value))}
            className="hue-slider"
            style={{ width: '100%' }}
            aria-label="Accent hue"
          />
        </div>
      )}

      {/* Rainbow Mode toggle row */}
      <div style={{ marginBottom: rainbow ? '0.75rem' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}
          >
            {t('theme_rainbow_label')}
          </span>
          <button
            type="button"
            onClick={() => setRainbow(!rainbow)}
            aria-label={rainbow ? 'Disable rainbow mode' : 'Enable rainbow mode'}
            aria-pressed={rainbow}
            style={{
              position: 'relative',
              width: '3rem',
              height: '1.625rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              background: rainbow ? 'var(--color-accent)' : 'var(--color-muted-bg)',
              transition: 'background 0.2s',
              padding: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '0.1875rem',
                left: '0.1875rem',
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 1px 3px oklch(0% 0 0 / 20%)',
                transition: 'transform 0.2s',
                transform: rainbow ? 'translateX(1.375rem)' : 'translateX(0)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Speed slider (only when rainbow on) */}
      {rainbow && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--color-muted)',
              marginBottom: '0.375rem',
            }}
          >
            <span>{t('theme_speed_label')}</span>
            <span>{speed}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="speed-slider"
            style={{ width: '100%' }}
            aria-label="Rainbow speed"
          />
        </div>
      )}
    </div>
  );
}

export default withStrictMode(ThemeButtonTouch);
