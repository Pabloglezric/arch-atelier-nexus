import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const ArchEvolutionCTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-px mb-20 origin-left"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14 rounded-xl group/cta transition-all duration-500"
          style={{
            backgroundColor: 'hsl(0 0% 5%)',
            border: '1px solid hsl(45 100% 60% / 0.15)',
            boxShadow: '0 0 60px hsl(45 100% 60% / 0.04)',
          }}
          whileHover={{
            boxShadow: '0 0 80px hsl(45, 100%, 60%, 0.08)',
            borderColor: 'hsl(45, 100%, 60%, 0.25)',
          }}
        >
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3"
              style={{ color: 'hsl(45 100% 60% / 0.6)' }}
            >
              ArchEvolution.World
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-display text-xl md:text-2xl font-bold mb-3"
              style={{ color: 'hsl(0 0% 92%)' }}
            >
              AI-powered tools for the AEC industry.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm leading-relaxed max-w-lg"
              style={{ color: 'hsl(0 0% 45%)' }}
            >
              ArchEvolution is a growing platform helping architects and designers harness
              AI-powered workflows — with tutorials, courses, and community resources designed to
              future-proof your practice.
            </motion.p>
          </div>

          <motion.a
            href="https://archevolution.world/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsl(45, 100%, 60%, 0.25)' }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 rounded-full px-8 py-3.5 text-sm font-semibold flex items-center gap-2 transition-colors duration-300"
            style={{
              backgroundColor: 'hsl(45 100% 60%)',
              color: 'hsl(0 0% 4%)',
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Visit ArchEvolution
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchEvolutionCTA;
