import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { ExternalLink, Play } from 'lucide-react';
import profilePhoto from '@/assets/jp-profile.jpg';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '12+', label: 'Projects Delivered' },
  { value: 'LOD400', label: 'Standard' },
  { value: '5+', label: 'Industries' },
];

const services = [
  {
    title: 'BIM Modelling & Documentation',
    description:
      'Revit models to LOD400 across residential, commercial, healthcare, and industrial sectors. Full RIBA Stage 3 & 4 packages.',
  },
  {
    title: 'Point Cloud to BIM',
    description:
      'From ReCap scan data to fully coordinated Revit models. Topographical surveys, renovation projects, and building control documentation.',
  },
  {
    title: 'Parametric & Computational Design',
    description:
      'Custom Revit families, smart BIM keynotes linked to Excel schedules, and prefabricated module systems that streamline production across 60+ details.',
  },
  {
    title: 'Visualisation',
    description:
      'Photorealistic renders and walkthroughs using Enscape and Photoshop. Proposal-ready visuals for client approval stages.',
  },
  {
    title: 'AI-Powered Design Tools',
    description:
      'Founder of ArchEvolution, a platform teaching AEC professionals how to integrate AI into their design workflows.',
  },
  {
    title: 'Cost & Design Optimisation',
    description:
      'Proven track record: redesign of North Horsham residential block achieved £50K savings per apartment without reducing habitable area.',
  },
];

const tools = [
  'Autodesk Revit',
  'ReCap',
  'Enscape',
  'Navisworks',
  'BIM 360',
  'AI Design Tools',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const About = () => {
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

      // Draw orbs to small canvas for pixelation
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

      <div className="relative" style={{ zIndex: 1 }}>
        <Navigation />

        {/* ─── Section 1: Hero Statement ─── */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: 'hsl(0 0% 92%)' }}
            >
              I don't just model buildings.
              <br />
              <span style={{ color: 'hsl(45 100% 60%)' }}>I engineer certainty.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-base md:text-lg tracking-wide mb-16"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              Architectural Technologist &nbsp;|&nbsp; BIM Specialist &nbsp;|&nbsp; Associate CIAT &nbsp;|&nbsp; Leeds, UK
            </motion.p>

            {/* Stat cards */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 max-w-[220px] mx-auto sm:mx-0 py-6 px-8 rounded-lg"
                  style={{
                    backgroundColor: 'hsl(45 100% 60% / 0.08)',
                    border: '1px solid hsl(45 100% 60% / 0.2)',
                  }}
                >
                  <p
                    className="font-display text-3xl md:text-4xl font-bold mb-1"
                    style={{ color: 'hsl(45 100% 60%)' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs tracking-widest uppercase" style={{ color: 'hsl(0 0% 50%)' }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 2: Who I Am ─── */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-8 leading-tight"
                style={{ color: 'hsl(0 0% 92%)' }}
              >
                Built on precision.
                <br />
                <span style={{ color: 'hsl(45 100% 60%)' }}>Driven by innovation.</span>
              </h2>
              <div className="space-y-5 text-sm md:text-base leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                <p>
                  I'm Juan Pablo Gonzalez Ricardez, an Architectural Technologist at Niemen Blume in Leeds,
                  specialising in Revit BIM modelling, computational design, and technical documentation across
                  RIBA Stages 3 and 4.
                </p>
                <p>
                  My work spans retail fit-outs for global brands, healthcare infrastructure, residential
                  developments, and industrial-scale buildings — always modelled to LOD400 and always delivered
                  with precision.
                </p>
                <p>
                  What sets me apart is not just technical fluency. It's the ability to see the whole picture —
                  from a point cloud scan to a construction-ready detail, from a parametric family to a
                  client-approved render. I bring a bicultural perspective shaped by architectural practice in
                  both Mexico and the UK, and a relentless drive to push what BIM can do.
                </p>
              </div>
            </motion.div>

            {/* Photo placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="aspect-[4/5] rounded-lg overflow-hidden"
              style={{
                border: '1px solid hsl(45 100% 60% / 0.15)',
              }}
            >
              <img
                src={profilePhoto}
                alt="Juan Pablo Gonzalez Ricardez"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 3: What I Do ─── */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'hsl(0 0% 92%)' }}
              >
                What I Do
              </h2>
              <p className="text-base" style={{ color: 'hsl(0 0% 45%)' }}>
                Specialist services spanning the full BIM lifecycle.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, i) => (
                <motion.div
                  key={svc.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group p-8 rounded-lg transition-colors duration-500"
                  style={{
                    backgroundColor: 'hsl(0 0% 6%)',
                    borderTop: '2px solid hsl(45 100% 60% / 0.4)',
                    border: '1px solid hsl(0 0% 12%)',
                    borderTopColor: 'hsl(45 100% 60% / 0.5)',
                    borderTopWidth: '2px',
                  }}
                >
                  <h3
                    className="font-display text-lg font-semibold mb-3"
                    style={{ color: 'hsl(0 0% 88%)' }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 42%)' }}>
                    {svc.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 4: ArchEvolution CTA ─── */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center p-12 md:p-16 rounded-xl"
              style={{
                backgroundColor: 'hsl(0 0% 5%)',
                border: '1px solid hsl(45 100% 60% / 0.15)',
                boxShadow: '0 0 80px hsl(45 100% 60% / 0.06)',
              }}
            >
              <h2
                className="font-display text-3xl md:text-4xl font-bold mb-6"
                style={{ color: 'hsl(0 0% 92%)' }}
              >
                Beyond the office.
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10"
                style={{ color: 'hsl(0 0% 50%)' }}
              >
                I'm the founder of ArchEvolution — a growing platform helping architects and designers across
                Latin America and the UK harness AI-powered tools for real-world workflows. YouTube tutorials,
                community resources, and courses designed to future-proof your practice.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  className="rounded-full px-8 py-3 text-sm font-semibold"
                  style={{
                    backgroundColor: 'hsl(45 100% 60%)',
                    color: 'hsl(0 0% 4%)',
                  }}
                >
                  <a href="https://archevolution.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit ArchEvolution
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-8 py-3 text-sm font-semibold"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'hsl(45 100% 60%)',
                    border: '1px solid hsl(45 100% 60% / 0.4)',
                  }}
                >
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 5: Tools & Skills ─── */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-[10px] font-semibold tracking-[0.3em] uppercase mb-10"
              style={{ color: 'hsl(45 100% 60% / 0.5)' }}
            >
              Tools & Technologies
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="px-5 py-2.5 rounded-full text-xs font-medium tracking-wide"
                  style={{
                    backgroundColor: 'hsl(0 0% 8%)',
                    color: 'hsl(0 0% 55%)',
                    border: '1px solid hsl(0 0% 14%)',
                  }}
                >
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
};

export default About;
