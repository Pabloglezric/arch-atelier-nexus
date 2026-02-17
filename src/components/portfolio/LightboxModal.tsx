import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProjectData } from './ProjectCard';

interface LightboxModalProps {
  project: ProjectData | null;
  imageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const LightboxModal = ({ project, imageIndex, onClose, onNext, onPrev }: LightboxModalProps) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'hsl(0 0% 0% / 0.92)' }}
        onClick={onClose}
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
          {/* Image */}
          <div className="relative w-full aspect-video">
            <AnimatePresence mode="wait">
              <motion.img
                key={imageIndex}
                src={project.images[imageIndex]}
                alt={`${project.title} ${imageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {project.images.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: 'hsl(0 0% 0% / 0.5)', color: 'hsl(0 0% 100%)', backdropFilter: 'blur(8px)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: 'hsl(0 0% 0% / 0.5)', color: 'hsl(0 0% 100%)', backdropFilter: 'blur(8px)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)', color: 'hsl(0 0% 80%)', backdropFilter: 'blur(8px)' }}
            >
              {imageIndex + 1} / {project.images.length}
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'hsl(0 0% 0% / 0.5)', color: 'hsl(0 0% 100%)', backdropFilter: 'blur(8px)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Info */}
          <div className="p-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: 'hsl(45 100% 60%)' }}>
              {project.title}
            </h2>
            <p className="text-sm font-medium mb-4" style={{ color: 'hsl(0 0% 60%)' }}>
              {project.client}
            </p>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'hsl(0 0% 55%)' }}>
              {project.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LightboxModal;
