import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/spotlight-card';

const principles = [
  {
    title: 'Precision',
    description:
      'Every deliverable is exact. Coordinates, classifications, dimensions — nothing approximated.',
  },
  {
    title: 'Intelligence',
    description:
      'BIM is only as valuable as the decisions it enables. I model for the people who make those decisions.',
  },
  {
    title: 'Permanence',
    description:
      "I don't deliver files. I deliver systems — processes, standards, and documentation that outlive the project.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const ThreePointsSection = () => {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight"
            style={{ color: 'hsl(0 0% 92%)' }}
          >
            Three points define a plane.
            <br />
            <span style={{ color: 'hsl(45 100% 60%)' }}>Three principles define the work.</span>
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            In geometry, three non-collinear points are the minimum required to define a flat surface
            — a foundation, a floor, a ceiling. Nothing more is needed. Nothing is missing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <GlowCard
                className="p-8 rounded-lg text-center h-full"
                style={{
                  backgroundColor: 'hsl(0 0% 6%)',
                  border: '1px solid hsl(0 0% 12%)',
                  borderTopWidth: '2px',
                  borderTopColor: 'hsl(45 100% 60% / 0.5)',
                }}
              >
                <h3
                  className="font-display text-lg font-semibold mb-3"
                  style={{ color: 'hsl(45 100% 60%)' }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
                  {p.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreePointsSection;
