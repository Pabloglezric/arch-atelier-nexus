import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronLeft, ChevronRight, X } from 'lucide-react';
import leedsCityCollege1 from '@/assets/leeds-city-college-1.png';
import leedsCityCollege2 from '@/assets/leeds-city-college-2.png';
import Navigation from '@/components/Navigation';

type Category = 'all' | 'technical' | 'parametric' | 'bim' | 'construction';

interface Project {
  id: number;
  title: string;
  description: string;
  category: Category;
  hasFile: boolean;
  images?: string[];
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
  { id: 3, title: 'Leeds City College', description: 'Point Cloud Data and Topographical survey data for the College renovation project.\n\nAll the elements within the project are modelled to a LOD400\n\nRendered on Revit + Enscape', category: 'bim', hasFile: true, images: [leedsCityCollege1, leedsCityCollege2] },
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
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  const openProject = (project: Project) => {
    if (project.hasFile && project.images) {
      setExpandedProject(project);
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeProject = () => {
    setExpandedProject(null);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (expandedProject?.images) {
      setCurrentImageIndex(i => (i + 1) % expandedProject.images!.length);
    }
  };

  const prevImage = () => {
    if (expandedProject?.images) {
      setCurrentImageIndex(i => (i - 1 + expandedProject.images!.length) % expandedProject.images!.length);
    }
  };

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
                  className="group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: 'hsl(0 0% 7%)',
                    border: '1px solid hsl(0 0% 12%)',
                  }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'hsl(45 100% 60%)',
                    transition: { duration: 0.25 },
                  }}
                  onClick={() => openProject(project)}
                >
                  {/* Image / Placeholder */}
                  <div className="relative aspect-video overflow-hidden">
                    {project.hasFile && project.images ? (
                      <>
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Title overlay on image */}
                        <div className="absolute top-0 left-0 right-0 p-4">
                          <h3
                            className="font-display text-lg font-bold drop-shadow-lg"
                            style={{ color: 'hsl(0 0% 0%)' }}
                          >
                            {project.title}
                          </h3>
                        </div>
                      </>
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
                      className="absolute top-3 right-3 px-3 py-1 rounded text-xs font-semibold tracking-wide uppercase"
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
                    {/* Only show title below for placeholder cards */}
                    {!project.hasFile && (
                      <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'hsl(0 0% 92%)' }}>
                        {project.title}
                      </h3>
                    )}
                    <p className="text-sm mb-5 leading-relaxed whitespace-pre-line" style={{ color: 'hsl(0 0% 45%)' }}>
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Expanded Project Modal */}
      <AnimatePresence>
        {expandedProject && expandedProject.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'hsl(0 0% 0% / 0.92)' }}
            onClick={closeProject}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-[95vw] max-w-5xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden"
              style={{ backgroundColor: 'hsl(0 0% 7%)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Image area */}
              <div className="relative w-full aspect-video">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={expandedProject.images[currentImageIndex]}
                    alt={`${expandedProject.title} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                </AnimatePresence>

                {/* Navigation arrows */}
                {expandedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor: 'hsl(0 0% 0% / 0.5)',
                        color: 'hsl(0 0% 100%)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor: 'hsl(0 0% 0% / 0.5)',
                        color: 'hsl(0 0% 100%)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image counter */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'hsl(0 0% 0% / 0.6)',
                    color: 'hsl(0 0% 80%)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {currentImageIndex + 1} / {expandedProject.images.length}
                </div>

                {/* Close button */}
                <button
                  onClick={closeProject}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: 'hsl(0 0% 0% / 0.5)',
                    color: 'hsl(0 0% 100%)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Info below image */}
              <div className="p-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: 'hsl(45 100% 60%)' }}>
                  {expandedProject.title}
                </h2>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-line" style={{ color: 'hsl(0 0% 55%)' }}>
                  {expandedProject.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
