import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import Navigation from '@/components/Navigation';

type Category = 'all' | 'technical' | 'parametric' | 'bim' | 'construction';

interface Project {
  id: number;
  title: string;
  description: string;
  category: Category;
  hasFile: boolean;
}

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'technical', label: 'Technical Documentation' },
  { key: 'parametric', label: 'Parametric Design' },
  { key: 'bim', label: 'BIM Models' },
  { key: 'construction', label: 'Construction Details' },
];

const projects: Project[] = [
  { id: 1, title: 'Residential Complex — Stage 3 Package', description: 'Full RIBA Stage 3 technical documentation for a 120-unit residential development.', category: 'technical', hasFile: false },
  { id: 2, title: 'Parametric Façade System', description: 'Algorithmic façade panel system with environmental responsiveness.', category: 'parametric', hasFile: false },
  { id: 3, title: 'Commercial Tower — BIM Model', description: 'LOD 400 Revit model with full MEP coordination and clash detection.', category: 'bim', hasFile: false },
  { id: 4, title: 'Steel Connection Details', description: 'Detailed construction drawings for custom steel-to-concrete connections.', category: 'construction', hasFile: false },
  { id: 5, title: 'Adaptive Roof Structure', description: 'Grasshopper-driven parametric roof with structural optimization.', category: 'parametric', hasFile: false },
  { id: 6, title: 'Mixed-Use Development — Stage 4', description: 'RIBA Stage 4 construction package including specifications and schedules.', category: 'technical', hasFile: false },
];

const categoryLabels: Record<Category, string> = {
  all: 'All',
  technical: 'Technical Documentation',
  parametric: 'Parametric Design',
  bim: 'BIM Models',
  construction: 'Construction Details',
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState<Category>('all');

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
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
            Selected Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'hsl(0 0% 55%)' }}
          >
            Technical precision meets design intent — RIBA Stages 3 &amp; 4 documentation, parametric systems, and BIM workflows delivered at professional standard.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-6 pb-12">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: activeFilter === cat.key ? 'hsl(45 100% 60%)' : 'transparent',
                  color: activeFilter === cat.key ? 'hsl(0 0% 4%)' : 'hsl(0 0% 50%)',
                  border: activeFilter === cat.key ? '1px solid hsl(45 100% 60%)' : '1px solid hsl(0 0% 18%)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="px-6 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(project => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="group rounded-lg overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: 'hsl(0 0% 7%)',
                    border: '1px solid hsl(0 0% 12%)',
                  }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'hsl(45 100% 60%)',
                    transition: { duration: 0.25 },
                  }}
                >
                  {/* Image / Placeholder */}
                  <div className="relative aspect-video">
                    {project.hasFile ? (
                      <div className="w-full h-full" style={{ backgroundColor: 'hsl(0 0% 10%)' }} />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-3"
                        style={{
                          backgroundColor: 'hsl(0 0% 5%)',
                          border: '2px dashed hsl(45 100% 60% / 0.3)',
                          margin: '8px',
                          width: 'calc(100% - 16px)',
                          height: 'calc(100% - 16px)',
                          borderRadius: '6px',
                        }}
                      >
                        <Upload size={28} style={{ color: 'hsl(45 100% 60% / 0.5)' }} />
                        <span className="text-xs font-medium" style={{ color: 'hsl(45 100% 60% / 0.5)' }}>
                          Project coming soon
                        </span>
                      </div>
                    )}
                    {/* Category Tag */}
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-semibold tracking-wide uppercase"
                      style={{
                        backgroundColor: 'hsl(45 100% 60% / 0.15)',
                        color: 'hsl(45 100% 60%)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {categoryLabels[project.category]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'hsl(0 0% 92%)' }}>
                      {project.title}
                    </h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
                      {project.description}
                    </p>
                    <div className="flex gap-3">
                      <button
                        className="flex-1 px-4 py-2.5 rounded text-xs font-semibold tracking-wide uppercase transition-colors duration-200"
                        style={{
                          backgroundColor: 'hsl(0 0% 12%)',
                          color: 'hsl(45 100% 60%)',
                          border: '1px solid hsl(0 0% 16%)',
                        }}
                      >
                        View PDF
                      </button>
                      <button
                        className="flex-1 px-4 py-2.5 rounded text-xs font-semibold tracking-wide uppercase transition-colors duration-200"
                        style={{
                          backgroundColor: 'hsl(0 0% 12%)',
                          color: 'hsl(45 100% 60%)',
                          border: '1px solid hsl(0 0% 16%)',
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
