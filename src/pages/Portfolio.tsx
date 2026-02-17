import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ProjectCard, { type ProjectData } from '@/components/portfolio/ProjectCard';
import LightboxModal from '@/components/portfolio/LightboxModal';
import leedsCityCollege1 from '@/assets/leeds-city-college-1.png';
import leedsCityCollege2 from '@/assets/leeds-city-college-2.png';
import jlrMunich1 from '@/assets/jlr-munich-1.jpg';
import jlrMunich2 from '@/assets/jlr-munich-2.jpg';
import jlrMunich3 from '@/assets/jlr-munich-3.jpg';

const categories = [
  'All',
  'BIM Models',
  'Construction Details',
  'Retail',
  'Healthcare',
  'Residential',
  'Data & Industrial',
];

const projects: ProjectData[] = [
  {
    id: 1,
    title: 'Sports Direct',
    client: 'Frasers Group',
    description: 'Store front design and zoning plan proposal modelled to LOD400.',
    category: 'Retail',
    tools: ['Revit', 'Enscape'],
    images: [],
  },
  {
    id: 2,
    title: 'JLR Statement Munich',
    client: 'Jaguar Land Rover',
    description: 'Ground floor and first floor car dealership proposal, Munich Germany.',
    category: 'BIM Models',
    tools: ['Revit', 'Enscape', 'Photoshop'],
    images: [jlrMunich1, jlrMunich2, jlrMunich3],
  },
  {
    id: 3,
    title: 'Leeds City College',
    client: 'WYCC',
    description: 'Modelled from Point Cloud Data and topographical survey for college renovation, LOD400.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [leedsCityCollege1, leedsCityCollege2],
  },
  {
    id: 4,
    title: 'Construction Details Redesign',
    client: 'Legal & General',
    description: 'Over 60 redesigned construction details using smart BIM keynotes linked to Excel, enabling NHBC approval.',
    category: 'Construction Details',
    tools: ['Inventor', 'Revit'],
    images: [],
  },
  {
    id: 5,
    title: 'Leeds General Infirmary',
    client: 'NHS',
    description: 'Full hospital BIM model from Point Cloud Data for renovation project, LOD400.',
    category: 'Healthcare',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [],
  },
  {
    id: 6,
    title: 'LGI Context Buildings',
    client: 'NHS',
    description: 'Context model for LGI Jubilee Wing renovation — LOD100 to LOD200.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [],
  },
  {
    id: 7,
    title: 'LGMH Detached Enfield',
    client: 'Legal & General',
    description: 'Proposed detached house type compliant with NHBC regulations for higher-tier finishes catalogue.',
    category: 'Residential',
    tools: ['Revit'],
    images: [],
  },
  {
    id: 8,
    title: 'Hardy Fisher Data Centre Leeds',
    client: 'Hardy Fisher',
    description: 'MEP and structural BIM model from Point Cloud Data, LOD400.',
    category: 'Data & Industrial',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [],
  },
  {
    id: 9,
    title: 'Amazon Warehouse Leeds LBA8',
    client: 'Amazon',
    description: 'Building control survey model after construction modifications, LOD400.',
    category: 'Data & Industrial',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [],
  },
  {
    id: 10,
    title: 'Grosvenor House Wakefield',
    client: 'Private Client',
    description: 'Renovation BIM model from Point Cloud Data, LOD400.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit'],
    images: [],
  },
  {
    id: 11,
    title: 'MetroCentre Newcastle',
    client: 'Frasers Group',
    description: 'Renovation works support including floor finish scheduling to 10mm precision.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit'],
    images: [],
  },
  {
    id: 12,
    title: 'North Horsham Residential',
    client: 'Legal & General',
    description: 'Apartment building redesign achieving £50K cost saving per unit without reducing habitable space.',
    category: 'Residential',
    tools: ['Revit', 'Enscape'],
    images: [],
  },
];

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxProject, setLightboxProject] = useState<ProjectData | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  const openGallery = (project: ProjectData, startIndex: number) => {
    setLightboxProject(project);
    setLightboxIndex(startIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setLightboxProject(null);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (lightboxProject) setLightboxIndex(i => (i + 1) % lightboxProject.images.length);
  };
  const prevImage = () => {
    if (lightboxProject) setLightboxIndex(i => (i - 1 + lightboxProject.images.length) % lightboxProject.images.length);
  };

  // Animated gradient background
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
        { x: Math.sin(time * 0.8 + 2) * 0.4 + 0.5, y: Math.cos(time * 0.3 + 1) * 0.4 + 0.7, r: 900, color: 'hsla(50, 60%, 45%, 0.12)' },
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

      const sweepX = (Math.sin(time * 0.2) * 0.5 + 0.5) * canvas.width;
      const sweepGrad = ctx.createLinearGradient(sweepX - 300, 0, sweepX + 300, canvas.height);
      sweepGrad.addColorStop(0, 'transparent');
      sweepGrad.addColorStop(0.5, 'hsla(45, 100%, 60%, 0.08)');
      sweepGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: activeFilter === cat ? 'hsl(45 100% 60%)' : 'transparent',
                    color: activeFilter === cat ? 'hsl(0 0% 4%)' : 'hsl(0 0% 50%)',
                    border: activeFilter === cat ? '1px solid hsl(45 100% 60%)' : '1px solid hsl(0 0% 18%)',
                  }}
                >
                  {cat}
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
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewGallery={openGallery}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxProject && (
          <LightboxModal
            project={lightboxProject}
            imageIndex={lightboxIndex}
            onClose={closeGallery}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
