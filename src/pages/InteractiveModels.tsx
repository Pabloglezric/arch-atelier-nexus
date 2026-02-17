import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, X, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ArchEvolutionCTA from '@/components/ArchEvolutionCTA';
import { PaperDesignBackground } from '@/components/ui/neon-dither';
import { defaultParams, type PavilionParams } from '@/components/3d/ParametricPavilion';

const ParametricPavilion = lazy(() => import('@/components/3d/ParametricPavilion'));
const PavilionControls = lazy(() => import('@/components/3d/PavilionControls'));

interface ModelSlot {
  label: string;
  description: string;
  hasModel: boolean;
}

const modelSlots: ModelSlot[] = [
  { label: 'Parametric Pavilion Simulation', description: 'Interactive parametric brick wall with dynamic sun cycle', hasModel: true },
  { label: 'Model Viewer 2', description: 'Section cut or MEP overlay — glTF / Three.js embed', hasModel: false },
  { label: 'Model Viewer 3', description: 'Context model or site plan — glTF / Three.js embed', hasModel: false },
];

// Reduced params for card preview (smaller grid = better perf)
const previewParams: PavilionParams = {
  ...defaultParams,
  brickCountX: 30,
  brickCountY: 18,
  animate: true,
  speed: 0.5,
};

const InteractiveModels = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [pavilionParams, setPavilionParams] = useState<PavilionParams>({ ...defaultParams });

  const openModel = (index: number) => {
    if (modelSlots[index].hasModel) {
      setExpandedIndex(index);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModel = () => {
    setExpandedIndex(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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

        {/* Model slots */}
        <section className="px-6 pb-24">
          <div className="container mx-auto max-w-6xl space-y-8">
            {modelSlots.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className={`relative aspect-[16/9] rounded-xl overflow-hidden ${item.hasModel ? 'cursor-pointer group' : ''}`}
                style={{
                  backgroundColor: 'hsl(0 0% 5%)',
                  border: '1px solid hsl(0 0% 12%)',
                  transition: 'border-color 0.3s',
                }}
                onClick={() => openModel(idx)}
                onMouseEnter={(e) => {
                  if (item.hasModel) (e.currentTarget as HTMLElement).style.borderColor = 'hsl(45, 100%, 60%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'hsl(0, 0%, 12%)';
                }}
              >
                {/* Live 3D preview for models that have one */}
                {item.hasModel && idx === 0 ? (
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(45 100% 60% / 0.5)' }} />
                      </div>
                    }
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      <ParametricPavilion params={previewParams} interactive={false} />
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: 'hsl(0 0% 0% / 0.5)' }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'hsl(45 100% 60% / 0.2)', border: '1px solid hsl(45 100% 60% / 0.4)' }}
                        >
                          <Box size={24} strokeWidth={1.5} style={{ color: 'hsl(45 100% 60%)' }} />
                        </div>
                        <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'hsl(45 100% 60%)' }}>
                          Click to interact
                        </span>
                      </div>
                    </div>
                  </Suspense>
                ) : (
                  <>
                    {/* Grid pattern for empty slots */}
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
                        style={{ backgroundColor: 'hsl(45 100% 60% / 0.06)', border: '1px solid hsl(45 100% 60% / 0.15)' }}
                      >
                        <Box size={28} strokeWidth={1.2} style={{ color: 'hsl(45 100% 60% / 0.4)' }} />
                      </div>
                      <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'hsl(0 0% 30%)' }}>
                        {item.description}
                      </span>
                      <span className="text-[10px] tracking-wide" style={{ color: 'hsl(0 0% 22%)' }}>
                        Drop model files here to preview
                      </span>
                    </div>
                  </>
                )}

                {/* Label bar at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-5 py-3"
                  style={{ background: 'linear-gradient(transparent, hsl(0 0% 0% / 0.8))' }}
                >
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'hsl(45 100% 60%)' }}>
                    {item.label}
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

        <ArchEvolutionCTA />
      </div>

      {/* Expanded fullscreen 3D viewer */}
      <AnimatePresence>
        {expandedIndex !== null && modelSlots[expandedIndex].hasModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'hsl(0 0% 0%)' }}
          >
            {/* Close button */}
            <button
              onClick={closeModel}
              className="absolute top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: 'hsl(0 0% 0% / 0.6)',
                color: 'hsl(0 0% 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid hsl(0 0% 20%)',
              }}
            >
              <X size={16} />
              <span className="text-xs font-medium tracking-wider uppercase">ESC</span>
            </button>

            {/* Title */}
            <div
              className="absolute top-5 left-5 z-50 px-5 py-2.5 rounded-full"
              style={{
                backgroundColor: 'hsl(0 0% 0% / 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid hsl(0 0% 20%)',
              }}
            >
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'hsl(45 100% 60%)' }}>
                {modelSlots[expandedIndex].label}
              </span>
            </div>

            {/* Controls panel */}
            <div className="absolute top-16 right-5 z-50">
              <Suspense fallback={null}>
                <PavilionControls params={pavilionParams} onChange={setPavilionParams} />
              </Suspense>
            </div>

            {/* 3D Canvas */}
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'hsl(0 0% 2%)' }}>
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin" style={{ color: 'hsl(45 100% 60%)' }} />
                    <span className="text-sm" style={{ color: 'hsl(0 0% 40%)' }}>Loading 3D scene…</span>
                  </div>
                </div>
              }
            >
              <ParametricPavilion className="w-full h-full" params={pavilionParams} interactive={true} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveModels;
