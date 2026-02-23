import React, { useEffect, useRef, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'a';
}

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '',
  style,
  as = 'div',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isClassic } = useTheme();

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty('--x', e.clientX.toFixed(2));
      cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
      cardRef.current.style.setProperty('--y', e.clientY.toFixed(2));
      cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const Tag = as as any;

  return (
    <Tag
      ref={cardRef}
      data-glow
      data-glow-theme={isClassic ? 'classic' : 'disruptive'}
      className={`glow-card ${className}`}
      style={style}
    >
      <div data-glow aria-hidden="true" className="glow-card__outer" />
      {children}
    </Tag>
  );
};

export { GlowCard };
