import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
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

interface ThemeButtonProps {
  className?: string;
  compact?: boolean;
  align?: 'left' | 'right';
}

function ThemeButton({ className, compact = false, align = 'left' }: ThemeButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const storeTheme = useStore($theme);
  const hue = useStore($hue);
  const rainbow = useStore($rainbow);
  const speed = useStore($speed);
  const { t } = useTranslation();

  // Use 'system' during hydration to match server
  const theme = mounted ? storeTheme : 'system';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on click outside
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

  const lightLabel = t('nav_theme_light');
  const darkLabel = t('nav_theme_dark');
  const systemLabel = t('nav_theme_system');
  const modeLabel = t('theme_mode_label');
  const accentLabel = t('theme_accent_label');
  const rainbowLabel = t('theme_rainbow_label');
  const speedLabel = t('theme_speed_label');

  const currentIcon =
    theme === 'light' ? (
      <Sun size={18} />
    ) : theme === 'dark' ? (
      <Moon size={18} />
    ) : (
      <Monitor size={18} />
    );
  const currentLabel = theme === 'light' ? lightLabel : theme === 'dark' ? darkLabel : systemLabel;

  const modes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: lightLabel, icon: <Sun size={16} /> },
    { value: 'dark', label: darkLabel, icon: <Moon size={16} /> },
    { value: 'system', label: systemLabel, icon: <Monitor size={16} /> },
  ];

  return (
    <div ref={menuRef} style={{ position: 'relative' }} className={className}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
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
        aria-label={`Theme: ${currentLabel}`}
      >
        {currentIcon}
        {!compact && <span>{currentLabel}</span>}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          {/* Popover */}
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: align === 'left' ? 0 : 'auto',
              right: align === 'right' ? 0 : 'auto',
              zIndex: 50,
              width: '15rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border)',
              background: 'var(--color-background)',
              padding: '0.75rem',
              boxShadow: '0 4px 16px oklch(0% 0 0 / 12%)',
              marginBottom: '0.25rem',
            }}
          >
            {/* Theme Mode */}
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
                {modeLabel}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {modes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setTheme(mode.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '0.375rem',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer',
                      background: theme === mode.value ? 'var(--color-muted-bg)' : 'transparent',
                      color:
                        theme === mode.value ? 'var(--color-foreground)' : 'var(--color-muted)',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {mode.icon}
                    <span style={{ flex: 1, textAlign: 'left' }}>{mode.label}</span>
                    {theme === mode.value && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <hr
              style={{
                margin: '0.75rem 0',
                border: 'none',
                borderTop: '1px solid var(--color-border)',
              }}
            />

            {/* Accent Color */}
            {!rainbow && (
              <>
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
                    {accentLabel}
                  </div>
                  <div style={{ padding: '0 0.25rem' }}>
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
                </div>
                <hr
                  style={{
                    margin: '0.75rem 0',
                    border: 'none',
                    borderTop: '1px solid var(--color-border)',
                  }}
                />
              </>
            )}

            {/* Rainbow Mode */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                  }}
                >
                  {rainbowLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setRainbow(!rainbow)}
                  style={{
                    position: 'relative',
                    width: '2.25rem',
                    height: '1.25rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    background: rainbow ? 'var(--color-accent)' : 'var(--color-muted-bg)',
                    transition: 'background 0.2s',
                    padding: 0,
                  }}
                  aria-label={rainbow ? 'Disable rainbow mode' : 'Enable rainbow mode'}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.125rem',
                      left: '0.125rem',
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      background: 'white',
                      boxShadow: '0 1px 3px oklch(0% 0 0 / 20%)',
                      transition: 'transform 0.2s',
                      transform: rainbow ? 'translateX(1rem)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {rainbow && (
                <div style={{ padding: '0 0.25rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--color-muted)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span>{speedLabel}</span>
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
          </div>
        </>
      )}
    </div>
  );
}

import withStrictMode from '$/components/withStrictMode';
export default withStrictMode(ThemeButton);
