import { atom } from 'nanostores';

const STORAGE_KEY = 'dynamic:mystery-unlocked';

export const $mysteryUnlocked = atom<boolean>(false);

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY);
  $mysteryUnlocked.set(stored === 'true');
}

export function setMysteryUnlocked(unlocked: boolean) {
  $mysteryUnlocked.set(unlocked);
  localStorage.setItem(STORAGE_KEY, String(unlocked));
}
