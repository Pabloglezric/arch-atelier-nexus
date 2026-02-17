import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { PaperDesignBackground } from '@/components/ui/neon-dither';

const InteractiveModels = () => {
  const placeholders = [
    { label: 'Model Viewer 1', description: 'Primary BIM model — glTF / Three.js embed' },
    { label: 'Model Viewer 2', description: 'Section cut or MEP overlay' },
    { label: 'Model Viewer 3', description: 'Context model or site plan' },
  ];

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <PaperDesignBackground themeMode="dark" intensity={0.85} />

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
