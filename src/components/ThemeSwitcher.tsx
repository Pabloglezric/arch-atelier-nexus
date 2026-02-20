import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'disruptive' | 'classic'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('site-theme') as 'disruptive' | 'classic') || 'disruptive';
    }
    return 'disruptive';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);
  }, [theme]);

  const isDisruptive = theme === 'disruptive';

  return (
    <div className="fixed top-4 right-4 z-[9999] flex rounded-full overflow-hidden border border-white/20 shadow-lg backdrop-blur-md">
      <button
        onClick={() => setTheme('classic')}
        className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-mono transition-all duration-300 ${
          isDisruptive
            ? 'bg-white text-[#1a1612] hover:bg-white/90 cursor-pointer'
            : 'bg-white/10 text-white/40 cursor-default'
        }`}
        disabled={!isDisruptive}
      >
        Classic
      </button>
      <button
        onClick={() => setTheme('disruptive')}
        className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-mono transition-all duration-300 ${
          !isDisruptive
            ? 'bg-[#1a1612] text-[hsl(45,100%,60%)] hover:bg-[#1a1612]/90 cursor-pointer'
            : 'bg-white/10 text-white/40 cursor-default'
        }`}
        disabled={isDisruptive}
      >
        Disruptive
      </button>
    </div>
  );
};

export default ThemeSwitcher;
