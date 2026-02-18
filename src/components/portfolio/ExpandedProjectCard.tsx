import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { type ProjectData } from './ProjectCard';

interface ExpandedProjectCardProps {
  project: ProjectData;
  onClose: () => void;
  onViewGallery: (project: ProjectData, startIndex: number) => void;
}

const ExpandedProjectCard = ({ project, onClose, onViewGallery }: ExpandedProjectCardProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = project.images.length > 1;

  const next = () => setImgIndex(i => (i + 1) % project.images.length);
  const prev = () => setImgIndex(i => (i - 1 + project.images.length) % project.images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'hsl(0 0% 0% / 0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{
          backgroundColor: 'hsl(0 0% 6%)',
          border: '1px solid hsl(0 0% 14%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            backgroundColor: 'hsl(0 0% 0% / 0.6)',
            color: 'hsl(0 0% 80%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <X size={18} />
        </button>

        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
          <img
            src={project.images[imgIndex]}
            alt={`${project.title} ${imgIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-200"
                style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)', color: 'hsl(0 0% 100%)' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-200"
                style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)', color: 'hsl(0 0% 100%)' }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className="w-2 h-2 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: i === imgIndex ? 'hsl(45 100% 60%)' : 'hsl(0 0% 100% / 0.4)',
                      transform: i === imgIndex ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Category tag */}
          <span
            className="absolute top-4 left-4 px-4 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase"
            style={{
              backgroundColor: 'hsl(45 100% 60% / 0.9)',
              color: 'hsl(0 0% 4%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Main info */}
            <div className="md:col-span-2">
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-2"
                style={{ color: 'hsl(0 0% 92%)' }}
              >
                {project.title}
              </h2>
              <p className="text-sm font-medium mb-6" style={{ color: 'hsl(45 100% 60%)' }}>
                {project.client}
              </p>
              <p
                className="text-sm md:text-base leading-relaxed mb-8"
                style={{ color: 'hsl(0 0% 50%)' }}
              >
                {project.description}
              </p>

              {/* Thumbnails */}
              {project.images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className="w-20 h-14 rounded-md overflow-hidden transition-all duration-200"
                      style={{
                        border: i === imgIndex
                          ? '2px solid hsl(45 100% 60%)'
                          : '2px solid hsl(0 0% 14%)',
                        opacity: i === imgIndex ? 1 : 0.6,
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tools */}
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-3"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  Tools Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map(tool => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide"
                      style={{
                        backgroundColor: 'hsl(0 0% 10%)',
                        color: 'hsl(0 0% 60%)',
                        border: '1px solid hsl(0 0% 16%)',
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpandedProjectCard;
