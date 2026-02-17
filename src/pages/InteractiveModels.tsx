import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import Navigation from '@/components/Navigation';

const InteractiveModels = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const orbs = [
        { x: Math.sin(time * 0.7) * 0.3 + 0.2, y: Math.cos(time * 0.5) * 0.3 + 0.3, r: 800, color: 'hsla(45, 80%, 50%, 0.18)' },
        { x: Math.cos(time * 0.4) * 0.3 + 0.7, y: Math.sin(time * 0.6) * 0.3 + 0.5, r: 650, color: 'hsla(35, 70%, 40%, 0.14)' },
      ];

      for (const orb of orbs) {
        const gradient = ctx.createRadialGradient(
          orb.x * canvas.width, orb.y * canvas.height, 0,
          orb.x * canvas.width, orb.y * canvas.height, orb.r
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const placeholders = [
    { label: 'Model Viewer 1', description: 'Primary BIM model — glTF / Three.js embed' },
    { label: 'Model Viewer 2', description: 'Section cut or MEP overlay' },
    { label: 'Model Viewer 3', description: 'Context model or site plan' },
  ];

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <Navigation />

        {/* Header */}
        <section className="pt-28 pb-16 px-6">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-5xl md:text-7xl font-bold mb-6"
              style={{ color: 'hsl(45 100% 60%)' }}
            >
              Interactive Models
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'hsl(0 0% 55%)' }}
            >
              Explore BIM deliverables in 3D — rotate, section, and inspect models directly in your browser.
            </motion.p>
          </div>
        </section>

        {/* Model placeholders */}
        <section className="px-6 pb-24">
          <div className="container mx-auto max-w-6xl space-y-8">
            {placeholders.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className="relative aspect-[16/9] rounded-xl overflow-hidden"
                style={{
                  backgroundColor: 'hsl(0 0% 5%)',
                  border: '1px solid hsl(0 0% 12%)',
                }}
              >
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'hsl(45 100% 60% / 0.06)',
                      border: '1px solid hsl(45 100% 60% / 0.15)',
                    }}
                  >
                    <Box size={28} strokeWidth={1.2} style={{ color: 'hsl(45 100% 60% / 0.4)' }} />
                  </div>
                  <span
                    className="text-xs font-medium tracking-wider uppercase"
                    style={{ color: 'hsl(0 0% 30%)' }}
                  >
                    {item.description}
                  </span>
                  <span
                    className="text-[10px] tracking-wide"
                    style={{ color: 'hsl(0 0% 22%)' }}
                  >
                    Drop model files here to preview
                  </span>
                </div>

                {/* Corner accents */}
                {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6`}>
                    <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: 'hsl(45 100% 60% / 0.2)' }} />
                    <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundColor: 'hsl(45 100% 60% / 0.2)' }} />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InteractiveModels;
