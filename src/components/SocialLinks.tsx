import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';

const SocialLinks = () => {
  return (
    <section
      className="py-24 px-6"
      style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)' }}
    >
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'hsl(0 0% 92%)' }}
          >
            Connect & Follow
          </h2>
          <p className="text-sm" style={{ color: 'hsl(0 0% 50%)' }}>
            Stay connected with the latest architectural innovations and insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center"
        >
          <a
            href="https://www.linkedin.com/in/pablo-gonzalez-a1024177/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <GlowCard
              className="flex flex-col items-center gap-4 p-8 rounded-xl transition-all duration-300 group"
              style={{
                backgroundColor: 'hsl(0 0% 6% / 0.6)',
                border: '1px solid hsl(0 0% 14%)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  border: '1px solid hsl(0 0% 18%)',
                  color: 'hsl(0 0% 50%)',
                }}
              >
                <Linkedin className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-base mb-1" style={{ color: 'hsl(0 0% 88%)' }}>
                  LinkedIn
                </p>
                <p className="text-xs" style={{ color: 'hsl(0 0% 45%)' }}>
                  Professional insights and architectural industry updates
                </p>
              </div>
            </GlowCard>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialLinks;
