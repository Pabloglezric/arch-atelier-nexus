import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import ArchEvolutionCTA from '@/components/ArchEvolutionCTA';
import { Heart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

import inspGallery1 from '@/assets/insp-gallery-1.png';
import inspGallery2 from '@/assets/insp-gallery-2.png';
import inspShellPavilion from '@/assets/insp-shell-pavilion.png';
import inspTowerBalconies from '@/assets/insp-tower-balconies.png';
import inspTimberComplex from '@/assets/insp-timber-complex.png';
import inspOrganicSpa from '@/assets/insp-organic-spa.png';
import inspWarmInterior from '@/assets/insp-warm-interior.png';

interface InspirationItem {
  id: string;
  title: string;
  image: string;
  height: number;
}

const placeholderItems: InspirationItem[] = [
  { id: 'insp-1', title: 'Waterfront Gallery Pavilion', image: inspGallery1, height: 800 },
  { id: 'insp-2', title: 'Shell Form Meditation Chapel', image: inspShellPavilion, height: 900 },
  { id: 'insp-3', title: 'Harbour Museum Hall', image: inspGallery2, height: 700 },
  { id: 'insp-4', title: 'Tensile Canopy Tower', image: inspTowerBalconies, height: 800 },
  { id: 'insp-5', title: 'Organic Timber Community Centre', image: inspTimberComplex, height: 750 },
  { id: 'insp-6', title: 'Biomorphic Spa Interior', image: inspOrganicSpa, height: 800 },
  { id: 'insp-7', title: 'Warm Minimalist Living', image: inspWarmInterior, height: 750 },
];

const getVotes = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem('inspiration-votes') || '{}');
  } catch { return {}; }
};

const getLiked = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('inspiration-liked') || '[]');
  } catch { return []; }
};

const drawDitheredOrbs = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
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
    const gradient = offCtx.createRadialGradient(orb.x * smallW, orb.y * smallH, 0, orb.x * smallW, orb.y * smallH, orb.r);
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

  const bayerMatrix = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
  const imageData = offCtx.getImageData(0, 0, smallW, smallH);
  const data = imageData.data;
  for (let y = 0; y < smallH; y++) {
    for (let x = 0; x < smallW; x++) {
      const idx = (y * smallW + x) * 4;
      const a = data[idx + 3];
      if (a === 0) continue;
      const threshold = (bayerMatrix[y % 4][x % 4] / 16) * 255;
      const brightness = (data[idx] * 0.3 + data[idx + 1] * 0.59 + data[idx + 2] * 0.11);
      if (brightness < threshold * 0.4) data[idx + 3] = 0;
    }
  }
  offCtx.putImageData(imageData, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Inspiration = () => {
  const { isClassic } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sortByLoved, setSortByLoved] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>(getVotes);
  const [liked, setLiked] = useState<string[]>(getLiked);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = document.documentElement.scrollHeight; };
    resize();
    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);
    const animate = (t: number) => { drawDitheredOrbs(ctx, canvas, t * 0.001); animId = requestAnimationFrame(animate); };
    animId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); resizeObserver.disconnect(); };
  }, []);

  const maxVotes = useMemo(() => Math.max(0, ...Object.values(votes)), [votes]);

  const filteredItems = useMemo(() => {
    const items = [...placeholderItems];
    if (sortByLoved) items.sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0));
    return items;
  }, [sortByLoved, votes]);

  const toggleLike = (id: string) => {
    const isLiked = liked.includes(id);
    const newLiked = isLiked ? liked.filter(l => l !== id) : [...liked, id];
    const newVotes = { ...votes, [id]: (votes[id] || 0) + (isLiked ? -1 : 1) };
    if (newVotes[id]! < 0) newVotes[id] = 0;
    setLiked(newLiked);
    setVotes(newVotes);
    localStorage.setItem('inspiration-liked', JSON.stringify(newLiked));
    localStorage.setItem('inspiration-votes', JSON.stringify(newVotes));
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isClassic ? 'text-[#1a1612]' : 'bg-black text-white'}`}>
      <SEOHead title="Inspiration | ArchEvolution" description="A living archive of ideas, aesthetics, and references that shape the way I think about design, precision, and innovation." />
      {!isClassic && <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />}
      <Navigation />

      <main className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6" style={{ color: isClassic ? '#1a1612' : 'hsl(45, 100%, 60%)' }}>Inspiration</h1>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: isClassic ? '#4a3f35' : 'hsl(45, 10%, 55%)' }}>
              A living archive of ideas, aesthetics, and references that shape the way I think about design, precision, and innovation. Updated constantly.
            </p>
          </motion.div>

          {/* Sort Toggle */}
          <motion.div className="flex justify-center mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <button
              onClick={() => setSortByLoved(!sortByLoved)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${
                sortByLoved
                  ? 'bg-accent text-black border-accent'
                  : 'bg-transparent border-white/20 hover:border-accent/50'
              }`}
              style={!sortByLoved ? { color: 'hsl(45, 10%, 55%)' } : undefined}
            >
              <Heart className="w-3.5 h-3.5" /> Most Loved
            </button>
          </motion.div>

          {/* Masonry Grid */}
          <motion.div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            {filteredItems.map((item, idx) => {
              const isLiked = liked.includes(item.id);
              const voteCount = votes[item.id] || 0;
              const isTop = maxVotes > 0 && voteCount === maxVotes;
              return (
                <motion.div
                  key={item.id}
                  className={`break-inside-avoid rounded-xl overflow-hidden relative group cursor-pointer ${isTop ? 'ring-2 ring-accent/50 shadow-[0_0_20px_-5px_hsl(45,90%,55%,0.3)]' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full block object-cover"
                    loading="lazy"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                    <div className="flex items-end justify-between">
                      <span className="text-white font-semibold text-lg leading-tight">{item.title}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                        className="flex items-center gap-1.5 transition-colors"
                      >
                        <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-accent text-accent' : 'text-white'}`} />
                        <span className={`text-sm font-medium ${isLiked ? 'text-accent' : 'text-white'}`}>{voteCount}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-20">
          <ArchEvolutionCTA />
        </div>

        {/* SEO Text Section */}
        <section className="mt-24 border-t border-white/10 pt-16 pb-8">
          <div className="container mx-auto px-6 max-w-4xl">
            <p className="text-[11px] tracking-[0.3em] uppercase font-semibold text-accent mb-8">
              BIM Consultant · Leeds UK · Latin America · AEC Design
            </p>

            <div className="space-y-5 text-[13px] leading-relaxed" style={{ color: 'hsl(45, 8%, 45%)' }}>
              <p>
                Juan Pablo González is a BIM specialist and architectural technologist based in Leeds, UK, delivering LOD400 Revit models, construction documentation, and digital design strategy across healthcare, retail, industrial, and residential sectors. This inspiration archive reflects the visual and technical references that inform every project — from parametric façade systems and computational design experiments to precision construction details and AI-generated spatial concepts.
              </p>
              <p>
                If you are searching for a BIM consultant in the UK, a Revit specialist for RIBA Stage 3 and 4 documentation, or an architectural technologist experienced in NHS, Amazon, JLR, and Legal &amp; General project environments — this portfolio represents the standard of work you can expect.
              </p>
              <p>
                3Points Consulting provides BIM implementation, digital transformation strategy, and university-level BIM training programmes for architecture schools across Latin America and Spain. For construction firms, property developers, and AEC companies entering the UK market, 3Points bridges the gap between international design ambition and British construction delivery.
              </p>
              <p>
                ArchEvolution is the AI-powered tools platform built on the same foundation — designed for architects and designers in Mexico, Spain, Colombia, Argentina, and the broader Spanish-speaking AEC community who want to integrate computational workflows and AI-assisted design without sacrificing technical precision. The intersection of traditional architectural rigour and emerging technology is not a future ambition. It is the present standard.
              </p>
              <p>
                For project enquiries, BIM consulting, university programme proposals, or ArchEvolution partnerships — contact juanpabloric@hotmail.com or visit the Contact page.
              </p>
            </div>

            {/* Keyword Tags */}
            <div className="flex flex-wrap gap-2 mt-10">
              {[
                'BIM Consultant Leeds', 'Revit Specialist UK', 'LOD400 BIM',
                'Architectural Technologist', 'Point Cloud to BIM', 'RIBA Stage 3 4',
                'BIM for Healthcare', 'BIM for Retail', 'NHS BIM Consultant',
                'Parametric Design UK', 'ArchEvolution', '3Points Consulting',
                'AI Architecture Tools', 'BIM Latin America', 'Consultor BIM England',
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-3 py-1 rounded-full border border-accent/30 text-accent/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Inspiration;
