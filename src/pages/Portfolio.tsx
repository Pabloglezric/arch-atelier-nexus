import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import PortfolioGrid from '@/components/PortfolioGrid';

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-primary">
                Portfolio
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive showcase of architectural innovations spanning residential, commercial, and conceptual projects
              </p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <PortfolioGrid />
      </main>
    </div>
  );
};

export default Portfolio;