import { atom } from 'nanostores';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'dynamic:theme';
const ACCENT_HUE_KEY = 'dynamic:accent-hue';
const RAINBOW_MODE_KEY = 'dynamic:rainbow-mode';
const RAINBOW_SPEED_KEY = 'dynamic:rainbow-speed';

export function getRainbowDuration(speed: number): number {
  return 60 - (speed / 100) * 58;
}

// ── Atoms ──────────────────────────────────────────────────────────────────

export const $theme = atom<Theme>('system');
export const $hue = atom<number>(255);
export const $rainbow = atom<boolean>(false);
export const $speed = atom<number>(20);
export const $systemDark = atom<boolean>(false);

// ── Setters (persist to localStorage) ─────────────────────────────────────

export function setTheme(t: Theme) {
  $theme.set(t);
  localStorage.setItem(STORAGE_KEY, t);
}

export function setHue(h: number) {
  const clamped = Math.max(0, Math.min(360, h));
  $hue.set(clamped);
  localStorage.setItem(ACCENT_HUE_KEY, String(clamped));
}

export function setRainbow(enabled: boolean) {
  $rainbow.set(enabled);
  localStorage.setItem(RAINBOW_MODE_KEY, String(enabled));
}

export function setSpeed(s: number) {
  const clamped = Math.max(1, Math.min(100, s));
  $speed.set(clamped);
  localStorage.setItem(RAINBOW_SPEED_KEY, String(clamped));
}

// ── Bootstrap (client-side only) ──────────────────────────────────────────

if (typeof window !== 'undefined') {
  // Load persisted values
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    $theme.set(storedTheme);
  }
  const storedHue = localStorage.getItem(ACCENT_HUE_KEY);
  if (storedHue) {
    const parsed = parseInt(storedHue, 10);
    if (!isNaN(parsed)) $hue.set(parsed);
  }
  $rainbow.set(localStorage.getItem(RAINBOW_MODE_KEY) === 'true');
  const storedSpeed = localStorage.getItem(RAINBOW_SPEED_KEY);
  if (storedSpeed) {
    const parsed = parseInt(storedSpeed, 10);
    if (!isNaN(parsed)) $speed.set(parsed);
  }
  $systemDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Listen for OS dark-mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    $systemDark.set(e.matches);
  });

  // Apply dark class whenever theme or systemDark changes
  function applyDark() {
    const isDark = $theme.get() === 'dark' || ($theme.get() === 'system' && $systemDark.get());
    document.documentElement.classList.toggle('dark', isDark);
  }
  $theme.subscribe(applyDark);
  $systemDark.subscribe(applyDark);

  // Apply accent hue CSS variable
  $hue.subscribe((h) => {
    if (!$rainbow.get()) {
      document.documentElement.style.setProperty('--accent-hue', String(h));
    }
  });

  // Apply rainbow animation
  function applyRainbow() {
    const root = document.documentElement;
    if ($rainbow.get()) {
      const duration = getRainbowDuration($speed.get());
      root.style.setProperty('--rainbow-duration', `${duration}s`);
      root.classList.add('rainbow-active');
    } else {
      root.classList.remove('rainbow-active');
      root.style.setProperty('--accent-hue', String($hue.get()));
    }
  }
  $rainbow.subscribe(applyRainbow);
  $speed.subscribe(applyRainbow);
}
