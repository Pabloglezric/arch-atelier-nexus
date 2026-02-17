import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArchEvolutionCTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Divider */}
        <div
          className="h-px mb-20"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14 rounded-xl"
          style={{
            backgroundColor: 'hsl(0 0% 5%)',
            border: '1px solid hsl(45 100% 60% / 0.15)',
            boxShadow: '0 0 60px hsl(45 100% 60% / 0.04)',
          }}
        >
          <div className="flex-1">
            <p
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3"
              style={{ color: 'hsl(45 100% 60% / 0.6)' }}
            >
              ArchEvolution.World
            </p>
            <h3
              className="font-display text-xl md:text-2xl font-bold mb-3"
              style={{ color: 'hsl(0 0% 92%)' }}
            >
              AI-powered tools for the AEC industry.
            </h3>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'hsl(0 0% 45%)' }}>
              ArchEvolution is a growing platform helping architects and designers harness
              AI-powered workflows — with tutorials, courses, and community resources designed to
              future-proof your practice.
            </p>
          </div>

          <Button
            asChild
            className="shrink-0 rounded-full px-8 py-3 text-sm font-semibold"
            style={{
              backgroundColor: 'hsl(45 100% 60%)',
              color: 'hsl(0 0% 4%)',
            }}
          >
            <a href="https://archevolution.world/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit ArchEvolution
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchEvolutionCTA;
