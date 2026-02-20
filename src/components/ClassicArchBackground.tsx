import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';

/**
 * Floating 8-bit architectural SVG elements for Classic Mode.
 * Renders parametric grids, wireframe cubes, I-beams, BIM annotations,
 * brick patterns, and truss segments drifting across a parchment backdrop.
 */

interface FloatingElement {
  id: number;
  x: number; // vw
  y: number; // vh
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  type: 'cube' | 'grid' | 'ibeam' | 'dimension' | 'brick' | 'truss' | 'column' | 'arch';
}

const svgElements: Record<FloatingElement['type'], (size: number) => React.ReactNode> = {
  // Isometric wireframe cube
  cube: (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
      {/* Front face */}
      <rect x="4" y="12" width="12" height="12" />
      {/* Top face */}
      <polygon points="4,12 10,6 22,6 16,12" />
      {/* Right face */}
      <polygon points="16,12 22,6 22,18 16,24" />
    </svg>
  ),
  // Parametric facade grid fragment
  grid: (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8">
      {[0, 4, 8, 12, 16, 20, 24, 28].map((x) => (
        <line key={`v${x}`} x1={x + 2} y1="2" x2={x + 2} y2="30" />
      ))}
      {[0, 6, 12, 18, 24].map((y) => (
        <line key={`h${y}`} x1="2" y1={y + 4} x2="30" y2={y + 4} />
      ))}
    </svg>
  ),
  // I-beam cross section
  ibeam: (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="4" width="20" height="4" />
      <rect x="13" y="8" width="6" height="16" />
      <rect x="6" y="24" width="20" height="4" />
    </svg>
  ),
  // BIM dimension line
  dimension: (s) => (
    <svg width={s * 1.5} height={s * 0.5} viewBox="0 0 48 16" fill="none" stroke="currentColor" strokeWidth="0.8">
      <line x1="4" y1="4" x2="4" y2="12" />
      <line x1="44" y1="4" x2="44" y2="12" />
      <line x1="4" y1="8" x2="44" y2="8" />
      {/* Arrowheads */}
      <polyline points="4,8 8,6 8,10" fill="currentColor" stroke="none" />
      <polyline points="44,8 40,6 40,10" fill="currentColor" stroke="none" />
      <text x="24" y="7" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="monospace">3200</text>
    </svg>
  ),
  // Brick pattern fragment
  brick: (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8">
      {[0, 8, 16, 24].map((y, i) => (
        <g key={y}>
          <line x1="2" y1={y + 4} x2="30" y2={y + 4} />
          {[0, 14, 28].map((x) => (
            <line key={x} x1={x + (i % 2 === 0 ? 2 : 9)} y1={y + 4} x2={x + (i % 2 === 0 ? 2 : 9)} y2={y + 12} />
          ))}
        </g>
      ))}
    </svg>
  ),
  // Truss segment
  truss: (s) => (
    <svg width={s * 1.4} height={s * 0.7} viewBox="0 0 44 22" fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="2" y1="20" x2="42" y2="20" />
      <line x1="2" y1="2" x2="42" y2="2" />
      <line x1="2" y1="2" x2="2" y2="20" />
      <line x1="42" y1="2" x2="42" y2="20" />
      <line x1="2" y1="20" x2="14" y2="2" />
      <line x1="14" y1="2" x2="28" y2="20" />
      <line x1="28" y1="20" x2="42" y2="2" />
    </svg>
  ),
  // Structural column
  column: (s) => (
    <svg width={s * 0.6} height={s} viewBox="0 0 20 32" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="3" y="2" width="14" height="3" />
      <rect x="6" y="5" width="8" height="22" />
      <rect x="3" y="27" width="14" height="3" />
      {/* Fluting lines */}
      <line x1="8" y1="5" x2="8" y2="27" strokeWidth="0.5" />
      <line x1="12" y1="5" x2="12" y2="27" strokeWidth="0.5" />
    </svg>
  ),
  // Pointed arch
  arch: (s) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4,30 L4,14 Q4,2 16,2 Q28,2 28,14 L28,30" />
      <line x1="4" y1="30" x2="28" y2="30" />
      {/* Keystone */}
      <rect x="14" y="2" width="4" height="4" strokeWidth="0.6" />
    </svg>
  ),
};

const ClassicArchBackground = () => {
  const { isClassic } = useTheme();

  const elements = useMemo<FloatingElement[]>(() => {
    const types: FloatingElement['type'][] = ['cube', 'grid', 'ibeam', 'dimension', 'brick', 'truss', 'column', 'arch'];
    const items: FloatingElement[] = [];
    // Seeded pseudo-random for deterministic layout
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807 + 0) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        x: rand() * 90 + 5,
        y: rand() * 85 + 5,
        size: 28 + rand() * 20,
        duration: 25 + rand() * 35,
        delay: rand() * -30,
        opacity: 0.06 + rand() * 0.06,
        type: types[i % types.length],
      });
    }
    return items;
  }, []);

  if (!isClassic) return null;

  return (
    <div
      className="classic-arch-bg"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {elements.map((el) => {
        const Renderer = svgElements[el.type];
        return (
          <div
            key={el.id}
            className="classic-arch-float"
            style={{
              position: 'absolute',
              left: `${el.x}%`,
              top: `${el.y}%`,
              opacity: el.opacity,
              color: '#1a1612',
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
            }}
          >
            {Renderer(el.size)}
          </div>
        );
      })}
    </div>
  );
};

export default ClassicArchBackground;
