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
    <div
      className="fixed top-4 right-4 z-[9999] flex overflow-hidden shadow-lg"
      style={{
        borderRadius: isDisruptive ? '9999px' : '0',
        border: isDisruptive ? '1px solid rgba(255,255,255,0.2)' : '2px solid #1a1612',
        backdropFilter: isDisruptive ? 'blur(12px)' : 'none',
      }}
    >
      <button
        onClick={() => setTheme('classic')}
        disabled={!isDisruptive}
        className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: isDisruptive ? '#ffffff' : '#f5f0e8',
          color: isDisruptive ? '#1a1612' : '#6b6054',
          cursor: isDisruptive ? 'pointer' : 'default',
          opacity: isDisruptive ? 1 : 0.5,
        }}
      >
        Classic
      </button>
      <button
        onClick={() => setTheme('disruptive')}
        disabled={isDisruptive}
        className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: !isDisruptive ? '#1a1612' : 'rgba(255,255,255,0.1)',
          color: !isDisruptive ? 'hsl(45, 100%, 60%)' : 'rgba(255,255,255,0.4)',
          cursor: !isDisruptive ? 'pointer' : 'default',
          opacity: !isDisruptive ? 1 : 0.5,
        }}
      >
        Disruptive
      </button>
    </div>
  );
};

export default ThemeSwitcher;
