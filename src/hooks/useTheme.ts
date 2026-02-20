import { useSyncExternalStore } from 'react';

const getTheme = () => document.documentElement.getAttribute('data-theme') || 'classic';

const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'classic');
  return { theme, isClassic: theme === 'classic' };
};
