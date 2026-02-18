import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import ProjectCard, { type ProjectData } from '@/components/portfolio/ProjectCard';
import ExpandedProjectCard from '@/components/portfolio/ExpandedProjectCard';
import LightboxModal from '@/components/portfolio/LightboxModal';
import CapabilitiesSection from '@/components/portfolio/CapabilitiesSection';
import ArchEvolutionCTA from '@/components/ArchEvolutionCTA';

// Project images
import sportsDirectStoreFront from '@/assets/01_Sports_Direct_StoreFront.png';
import jlrMunich from '@/assets/02_JLR_Statement_Munich.png';
import jlrMunich1 from '@/assets/jlr-munich-1.jpg';
import jlrMunich2 from '@/assets/jlr-munich-2.jpg';
import jlrMunich3 from '@/assets/jlr-munich-3.jpg';
import leedsCityCollege from '@/assets/03_Leeds_City_College.png';
import leedsCityCollege1 from '@/assets/leeds-city-college-1.png';
import leedsCityCollege2 from '@/assets/leeds-city-college-2.png';
import constructionDetails1 from '@/assets/04_Construction_Details_Redesign.png';
import constructionDetails2 from '@/assets/04_Construction_Details_Redesign_2.png';
import leedsGeneralInfirmary from '@/assets/05_Leeds_General_Infirmary.png';
import lgiContextBuildings from '@/assets/06_LGI_Context_Buildings.png';
import lgmhDetached from '@/assets/07_LGMH_Detached_Enfield.png';
import hardyFisher from '@/assets/08_Hardy_Fisher_Data_Centre.png';
import amazonWarehouse from '@/assets/09_Amazon_Warehouse_Leeds.png';
import grosvenorHouse from '@/assets/10_Grosvenor_House_Wakefield.png';
import metroCentre from '@/assets/11_MetroCentre_Newcastle.png';
import northHorsham from '@/assets/12_North_Horsham_Residential.png';

// Extension images
import ext01Original from '@/assets/13_Extension_01_Original.jpg';
import ext02NewWorktop from '@/assets/13_Extension_02_New_Worktop.jpg';
import ext03NewWorktop from '@/assets/13_Extension_03_New_Worktop.jpg';
import ext04Extension from '@/assets/13_Extension_04_Extension.jpg';
import ext05Finished from '@/assets/13_Extension_05_Finished.jpg';
import ext06Finished from '@/assets/13_Extension_06_Finished.jpg';
import ext07Finished from '@/assets/13_Extension_07_Finished.jpg';
import ext08Finished from '@/assets/13_Extension_08_Finished.jpg';

const categories = [
  'All',
  'Extensions',
  'BIM Models',
  'Construction Details',
  'Retail',
  'Healthcare',
  'Residential',
  'Data & Industrial',
];

const projects: ProjectData[] = [
  {
    id: 13,
    title: 'Kitchen & Living Room Extension',
    client: 'Private Client',
    description: 'Complete kitchen redesign and living room extension featuring a dynamic entertainment centre with 180 degrees of view. The project transformed the original layout into an open-plan living space with premium finishes, quartz worktops, and full-height glazing connecting interior and exterior.',
    category: 'Extensions',
    tools: ['Design', 'Project Management'],
    images: [ext01Original, ext02NewWorktop, ext03NewWorktop, ext04Extension, ext05Finished, ext06Finished, ext07Finished, ext08Finished],
    date: 'May 2025',
  },
  {
    id: 1,
    title: 'Sports Direct',
    client: 'Frasers Group',
    description: 'Full architectural and fit-out BIM model developed to LOD400 for a flagship Sports Direct store conversion. Coordinated across structural, M&E, and retail design teams. Delivered to contractor standard — buildable without interpretation.',
    category: 'Retail',
    tools: ['Revit', 'Enscape'],
    images: [sportsDirectStoreFront],
  },
  {
    id: 2,
    title: 'JLR Statement Munich',
    client: 'Jaguar Land Rover',
    description: 'Architectural proposal to RIBA Stage 3 for a premium Jaguar Land Rover dealership in Munich. Parametric façade development and brand-compliant spatial design delivered under a compressed timeline.',
    category: 'BIM Models',
    tools: ['Revit', 'Enscape', 'Photoshop'],
    images: [jlrMunich, jlrMunich1, jlrMunich2, jlrMunich3],
  },
  {
    id: 3,
    title: 'Leeds City College',
    client: 'WYCC',
    description: 'Existing building captured via 3D laser scan and converted into a precise Revit model for renovation design. Eliminated the survey-to-drawing gap that typically adds 3–4 weeks to renovation programmes.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [leedsCityCollege, leedsCityCollege1, leedsCityCollege2],
  },
  {
    id: 4,
    title: 'Construction Details Redesign',
    client: 'Legal & General',
    description: 'Complete redesign of a 60+ detail library with intelligent BIM keynotes linked to the model — eliminating the annotation duplication that causes specification conflicts on site.',
    category: 'Construction Details',
    tools: ['Inventor', 'Revit'],
    images: [constructionDetails1, constructionDetails2],
  },
  {
    id: 5,
    title: 'Leeds General Infirmary',
    client: 'NHS',
    description: 'Full LOD400 model for a live NHS hospital under renovation. Every element traceable, classified, and coordinated across structural, M&E, and architectural disciplines — ready for hard-FM data handover.',
    category: 'Healthcare',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [leedsGeneralInfirmary],
  },
  {
    id: 6,
    title: 'LGI Context Buildings',
    client: 'NHS',
    description: 'Surrounding building stock modelled for planning and shadow analysis. Calibrated to OS data and used as the massing base for the LGI hospital masterplan.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [lgiContextBuildings],
  },
  {
    id: 7,
    title: 'LGMH Detached Enfield',
    client: 'Legal & General',
    description: 'Structural and architectural redesign that identified £50,000 in cost savings per residential unit through early BIM coordination — before groundworks began.',
    category: 'Residential',
    tools: ['Revit'],
    images: [lgmhDetached],
  },
  {
    id: 8,
    title: 'Hardy Fisher Data Centre Leeds',
    client: 'Hardy Fisher',
    description: 'Full MEP and structural model derived from point cloud scan. Every pipe, cable tray, and structural element coordinated in 3D before work began. Zero tolerance for error in mission-critical infrastructure.',
    category: 'Data & Industrial',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [hardyFisher],
  },
  {
    id: 9,
    title: 'Amazon Warehouse Leeds LBA8',
    client: 'Amazon',
    description: 'Survey and BIM documentation for one of Amazon\'s UK logistics hubs. Accuracy in the survey model directly impacted planning approval and building control sign-off timelines.',
    category: 'Data & Industrial',
    tools: ['ReCap', 'Revit', 'Enscape'],
    images: [amazonWarehouse],
  },
  {
    id: 10,
    title: 'Grosvenor House Wakefield',
    client: 'Private Client',
    description: 'Renovation BIM for a heritage building — balancing conservation requirements with modern performance standards. Model used for structural assessment, services coordination, and planning submission.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit'],
    images: [grosvenorHouse],
  },
  {
    id: 11,
    title: 'MetroCentre Newcastle',
    client: 'Frasers Group',
    description: 'Millimetre-precise floor finish scheduling across a large-format retail environment. Multiple zones, tight tolerances, complex transitions — all resolved in BIM before the floor layers were ordered.',
    category: 'BIM Models',
    tools: ['ReCap', 'Revit'],
    images: [metroCentre],
  },
  {
    id: 12,
    title: 'North Horsham Residential',
    client: 'Legal & General',
    description: 'BIM-led redesign of a residential scheme to reduce construction cost without compromising planning consent. Structural rationalisation and material substitution delivered as a coordinated package.',
    category: 'Residential',
    tools: ['Revit', 'Enscape'],
    images: [northHorsham],
  },
];

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxProject, setLightboxProject] = useState<ProjectData | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [expandedProject, setExpandedProject] = useState<ProjectData | null>(null);

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

  const expandProject = (project: ProjectData) => {
    setExpandedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeExpanded = () => {
    setExpandedProject(null);
    document.body.style.overflow = '';
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

      const pixelSize = 6;
      const offscreen = document.createElement('canvas');
      const smallW = Math.ceil(canvas.width / pixelSize);
      const smallH = Math.ceil(canvas.height / pixelSize);
      offscreen.width = smallW;
      offscreen.height = smallH;
      const offCtx = offscreen.getContext('2d')!;
      offCtx.clearRect(0, 0, smallW, smallH);

      const orbs = [
        { x: Math.sin(time * 0.7) * 0.3 + 0.2, y: Math.cos(time * 0.5) * 0.3 + 0.3, r: 900 / pixelSize, color: 'hsla(45, 90%, 55%, 0.45)' },
        { x: Math.cos(time * 0.4) * 0.3 + 0.7, y: Math.sin(time * 0.6) * 0.3 + 0.5, r: 750 / pixelSize, color: 'hsla(35, 80%, 45%, 0.35)' },
        { x: Math.sin(time * 0.8 + 2) * 0.4 + 0.5, y: Math.cos(time * 0.3 + 1) * 0.4 + 0.7, r: 1000 / pixelSize, color: 'hsla(50, 70%, 50%, 0.30)' },
        { x: Math.cos(time * 0.5 + 3) * 0.3 + 0.4, y: Math.sin(time * 0.7 + 2) * 0.3 + 0.2, r: 600 / pixelSize, color: 'hsla(40, 85%, 50%, 0.28)' },
      ];

      for (const orb of orbs) {
        const gradient = offCtx.createRadialGradient(
          orb.x * smallW, orb.y * smallH, 0,
          orb.x * smallW, orb.y * smallH, orb.r
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');
        offCtx.fillStyle = gradient;
        offCtx.fillRect(0, 0, smallW, smallH);
      }

      const sweepX = (Math.sin(time * 0.2) * 0.5 + 0.5) * smallW;
      const sweepGrad = offCtx.createLinearGradient(sweepX - 50, 0, sweepX + 50, smallH);
      sweepGrad.addColorStop(0, 'transparent');
      sweepGrad.addColorStop(0.5, 'hsla(45, 100%, 60%, 0.22)');
      sweepGrad.addColorStop(1, 'transparent');
      offCtx.fillStyle = sweepGrad;
      offCtx.fillRect(0, 0, smallW, smallH);

      // Bayer 4x4 dithering
      const bayerMatrix = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5],
      ];
      const imageData = offCtx.getImageData(0, 0, smallW, smallH);
      const data = imageData.data;
      for (let y = 0; y < smallH; y++) {
        for (let x = 0; x < smallW; x++) {
          const idx = (y * smallW + x) * 4;
          const a = data[idx + 3];
          if (a === 0) continue;
          const threshold = (bayerMatrix[y % 4][x % 4] / 16) * 255;
          const brightness = (data[idx] * 0.3 + data[idx + 1] * 0.59 + data[idx + 2] * 0.11);
          if (brightness < threshold * 0.4) {
            data[idx + 3] = 0;
          }
        }
      }
      offCtx.putImageData(imageData, 0, 0);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);

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

      <SEOHead
        title="Portfolio - BIM Projects & Architectural Documentation | Juan Pablo Gonzalez Ricardez"
        description="Explore BIM projects modelled to LOD400 across retail, healthcare, residential, and industrial sectors. Revit, ReCap, and Enscape deliverables at RIBA Stages 3-4."
        keywords="BIM portfolio, Revit models, LOD400, architectural documentation, point cloud to BIM, construction details, RIBA Stage 3, RIBA Stage 4"
        canonicalPath="/portfolio"
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
              Each project here was delivered under live construction pressure — real clients, real deadlines, real consequences for error. These are not concept studies. These are production-grade deliverables built to UK standards.
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
            <motion.div layout className={`grid gap-6 ${
              activeFilter === 'Extensions' 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              <AnimatePresence mode="popLayout">
                {filtered.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewGallery={openGallery}
                    onExpand={expandProject}
                    isLargeCard={activeFilter === 'Extensions'}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <CapabilitiesSection />
        <ArchEvolutionCTA />
      </div>

      {/* Expanded Project */}
      <AnimatePresence>
        {expandedProject && (
          <ExpandedProjectCard
            project={expandedProject}
            onClose={closeExpanded}
            onViewGallery={openGallery}
          />
        )}
      </AnimatePresence>

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
