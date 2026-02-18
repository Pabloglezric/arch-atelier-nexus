import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';

export interface ProjectData {
  id: number;
  title: string;
  client: string;
  description: string;
  category: string;
  tools: string[];
  images: string[];
  date?: string;
}

interface ProjectCardProps {
  project: ProjectData;
  onViewGallery: (project: ProjectData, startIndex: number) => void;
  onExpand: (project: ProjectData) => void;
  isLargeCard?: boolean;
}

const ProjectCard = ({ project, onViewGallery, onExpand, isLargeCard }: ProjectCardProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const hasImages = project.images.length > 0;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i + 1) % project.images.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i - 1 + project.images.length) % project.images.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="group rounded-lg overflow-hidden flex flex-col cursor-pointer"
      onClick={() => onExpand(project)}
      style={{
        backgroundColor: 'hsl(0 0% 7%)',
        border: '1px solid hsl(0 0% 12%)',
        transition: 'border-color 0.3s, transform 0.3s',
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.25 },
      }}
      onHoverStart={(e) => {
        const el = (e as any).target?.closest?.('.group') as HTMLElement;
        if (el) el.style.borderColor = 'hsl(45 100% 60%)';
      }}
      onHoverEnd={(e) => {
        const el = (e as any).target?.closest?.('.group') as HTMLElement;
        if (el) el.style.borderColor = 'hsl(0 0% 12%)';
      }}
    >
      {/* Image Carousel */}
      <div className="relative aspect-video overflow-hidden">
        {hasImages ? (
          <>
            <img
              src={project.images[imgIndex]}
              alt={`${project.title} ${imgIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
              decoding="async"
              style={{ imageRendering: 'auto' }}
            />
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)', color: 'hsl(0 0% 100%)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)', color: 'hsl(0 0% 100%)' }}
                >
                  <ChevronRight size={16} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: i === imgIndex ? 'hsl(45 100% 60%)' : 'hsl(0 0% 100% / 0.4)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: 'hsl(0 0% 5%)' }}
          >
            <div
              className="flex flex-col items-center justify-center gap-3 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-md"
              style={{ border: '2px dashed hsl(45 100% 60% / 0.3)' }}
            >
              <Upload size={28} style={{ color: 'hsl(45 100% 60% / 0.5)' }} />
              <span className="text-xs font-medium" style={{ color: 'hsl(45 100% 60% / 0.5)' }}>
                Images coming soon
              </span>
            </div>
          </div>
        )}

        {/* Category tag */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-semibold tracking-wider uppercase"
        style={{
            backgroundColor: 'hsl(45 100% 60% / 0.85)',
            color: 'hsl(0 0% 4%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'hsl(0 0% 92%)' }}>
          {project.title}
        </h3>
        <p className="text-xs font-medium mb-3" style={{ color: 'hsl(45 100% 60%)' }}>
          {project.client}
        </p>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'hsl(0 0% 45%)' }}>
          {project.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tools.map(tool => (
            <span
              key={tool}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide"
              style={{
                backgroundColor: 'hsl(0 0% 12%)',
                color: 'hsl(0 0% 55%)',
                border: '1px solid hsl(0 0% 16%)',
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        {project.date && (
          <p className="text-xs font-medium mt-auto" style={{ color: 'hsl(0 0% 40%)' }}>
            {project.date}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
