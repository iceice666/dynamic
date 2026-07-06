import { atom } from 'nanostores';

const STORAGE_KEY = 'dynamic:mystery-unlocked';

export const $mysteryUnlocked = atom<boolean>(false);

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    $mysteryUnlocked.set(stored === 'true');
  } catch {
    // Safari "Block all cookies" throws SecurityError; fall back to locked.
  }
}

export function setMysteryUnlocked(unlocked: boolean) {
  $mysteryUnlocked.set(unlocked);
  try {
    localStorage.setItem(STORAGE_KEY, String(unlocked));
  } catch {
    // Persistence is optional; keep the in-memory unlocked state.
  }
}
