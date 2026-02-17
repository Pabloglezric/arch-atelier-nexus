import { motion } from 'framer-motion';
import { Layers, GitBranch, FileText, Cpu, Sparkles, Box } from 'lucide-react';

const capabilities = [
  {
    icon: Layers,
    title: 'Parametric Family Creation',
    description: 'Custom Revit families built with embedded parameters for rapid design iteration and catalogue-ready output.',
  },
  {
    icon: GitBranch,
    title: 'BIM Coordination',
    description: 'End-to-end model management across RIBA Stages 3 & 4 — from spatial planning to construction-ready packages.',
  },
  {
    icon: FileText,
    title: 'Construction Documentation',
    description: 'Precise technical drawings with smart keynotes, schedules, and specification links for regulatory approval.',
  },
  {
    icon: Cpu,
    title: 'Computational Design Workflows',
    description: 'Algorithmic modelling with Grasshopper and Dynamo for performance-driven geometry and façade systems.',
  },
  {
    icon: Sparkles,
    title: 'AI-Assisted Design Tools',
    description: 'Leveraging machine learning for generative layouts, environmental analysis, and design optimisation.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const CapabilitiesSection = () => {
  return (
    <section className="px-6 pb-32">
      <div className="container mx-auto max-w-6xl">
        {/* Section divider */}
        <div className="flex items-center gap-6 mb-20">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.3), transparent)' }} />
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-semibold tracking-[0.3em] uppercase"
            style={{ color: 'hsl(45 100% 60% / 0.6)' }}
          >
            What I Do
          </motion.span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.3), transparent)' }} />
        </div>

        {/* Section header */}
        <div className="mb-16 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'hsl(0 0% 92%)' }}
          >
            Capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-base md:text-lg leading-relaxed"
            style={{ color: 'hsl(0 0% 45%)' }}
          >
            A focused toolkit spanning parametric modelling, BIM coordination, and computational design — each refined through delivery on complex, real-world projects.
          </motion.p>
        </div>

        {/* Capability cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px mb-24" style={{ backgroundColor: 'hsl(45 100% 60% / 0.08)' }}>
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group p-8 md:p-10 flex flex-col transition-colors duration-500"
              style={{ backgroundColor: 'hsl(0 0% 4%)' }}
              whileHover={{ backgroundColor: 'hsl(0 0% 6%)' }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                style={{
                  backgroundColor: 'hsl(45 100% 60% / 0.08)',
                  border: '1px solid hsl(45 100% 60% / 0.15)',
                }}
              >
                <cap.icon
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: 'hsl(45 100% 60%)' }}
                />
              </div>
              <h3
                className="font-display text-lg font-semibold mb-3"
                style={{ color: 'hsl(0 0% 88%)' }}
              >
                {cap.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'hsl(0 0% 42%)' }}
              >
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Models subsection */}
        <div>
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.2), transparent)' }} />
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-semibold tracking-[0.3em] uppercase"
              style={{ color: 'hsl(45 100% 60% / 0.5)' }}
            >
              Coming Soon
            </motion.span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.2), transparent)' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h3
              className="font-display text-2xl md:text-3xl font-bold mb-4"
              style={{ color: 'hsl(0 0% 88%)' }}
            >
              Interactive Models
            </h3>
            <p
              className="text-sm md:text-base max-w-xl mx-auto"
              style={{ color: 'hsl(0 0% 42%)' }}
            >
              Explore BIM deliverables in 3D — rotate, section, and inspect models directly in your browser.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[16/9] max-w-4xl mx-auto rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'hsl(0 0% 5%)',
              border: '1px solid hsl(0 0% 12%)',
            }}
          >
            {/* Placeholder grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'hsl(45 100% 60% / 0.06)',
                  border: '1px solid hsl(45 100% 60% / 0.15)',
                }}
              >
                <Box size={28} strokeWidth={1.2} style={{ color: 'hsl(45 100% 60% / 0.4)' }} />
              </div>
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: 'hsl(0 0% 30%)' }}
              >
                3D Viewer — glTF / Three.js embed
              </span>
              <span
                className="text-[10px] tracking-wide"
                style={{ color: 'hsl(0 0% 22%)' }}
              >
                Drop model files here to preview
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
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
