import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'dynamic:theme';
const ACCENT_HUE_KEY = 'dynamic:accent-hue';
const RAINBOW_MODE_KEY = 'dynamic:rainbow-mode';
const RAINBOW_SPEED_KEY = 'dynamic:rainbow-speed';

export function getRainbowDuration(speed: number): number {
  return 60 - (speed / 100) * 58;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [hue, setHueState] = useState(255);
  const [rainbow, setRainbowState] = useState(false);
  const [speed, setSpeedState] = useState(20);
  const [systemDark, setSystemDark] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored);
    }
    const storedHue = localStorage.getItem(ACCENT_HUE_KEY);
    if (storedHue) {
      const parsed = parseInt(storedHue, 10);
      if (!isNaN(parsed)) setHueState(parsed);
    }
    const storedRainbow = localStorage.getItem(RAINBOW_MODE_KEY) === 'true';
    setRainbowState(storedRainbow);
    const storedSpeed = localStorage.getItem(RAINBOW_SPEED_KEY);
    if (storedSpeed) {
      const parsed = parseInt(storedSpeed, 10);
      if (!isNaN(parsed)) setSpeedState(parsed);
    }
    setSystemDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Apply dark class
  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && systemDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme, systemDark]);

  // Apply accent hue
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-hue', String(hue));
  }, [hue]);

  // Apply rainbow animation
  useEffect(() => {
    const root = document.documentElement;
    if (rainbow) {
      const duration = getRainbowDuration(speed);
      root.style.setProperty('--rainbow-duration', `${duration}s`);
      root.classList.add('rainbow-active');
    } else {
      root.classList.remove('rainbow-active');
      root.style.setProperty('--accent-hue', String(hue));
    }
  }, [rainbow, speed, hue]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  function setHue(h: number) {
    const clamped = Math.max(0, Math.min(360, h));
    setHueState(clamped);
    localStorage.setItem(ACCENT_HUE_KEY, String(clamped));
  }

  function setRainbow(enabled: boolean) {
    setRainbowState(enabled);
    localStorage.setItem(RAINBOW_MODE_KEY, String(enabled));
  }

  function setSpeed(s: number) {
    const clamped = Math.max(1, Math.min(100, s));
    setSpeedState(clamped);
    localStorage.setItem(RAINBOW_SPEED_KEY, String(clamped));
  }

  return { theme, hue, rainbow, speed, systemDark, setTheme, setHue, setRainbow, setSpeed };
}
