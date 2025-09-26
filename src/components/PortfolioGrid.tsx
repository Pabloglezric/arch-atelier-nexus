import { motion } from 'framer-motion';
import { FocusCards } from '@/components/ui/focus-cards';

interface Project {
  id: number;
  title: string;
  category: string;
  year: number;
  description: string;
  image: string;
  tags: string[];
  type: 'residential' | 'commercial' | 'conceptual' | 'urban';
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern Residential Complex",
    category: "Residential Architecture",
    year: 2024,
    description: "A sustainable housing development featuring innovative green building techniques and community-focused design.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center",
    tags: ["Sustainable", "Community", "Modern"],
    type: "residential"
  },
  {
    id: 2,
    title: "Corporate Headquarters",
    category: "Commercial Design",
    year: 2023,
    description: "A cutting-edge office building that redefines workplace environments with flexible spaces and natural lighting.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=center",
    tags: ["Corporate", "Innovation", "Flexible"],
    type: "commercial"
  },
  {
    id: 3,
    title: "Urban Cultural Center",
    category: "Public Architecture",
    year: 2024,
    description: "An interactive cultural hub designed to bring communities together through art, education, and social engagement.",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=600&fit=crop&crop=center",
    tags: ["Cultural", "Community", "Interactive"],
    type: "urban"
  },
  {
    id: 4,
    title: "Future Living Concept",
    category: "Conceptual Design",
    year: 2024,
    description: "Exploring the future of living spaces through adaptive architecture and smart home integration.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop&crop=center",
    tags: ["Future", "Smart Home", "Adaptive"],
    type: "conceptual"
  },
  {
    id: 5,
    title: "Eco-Resort Development",
    category: "Hospitality Design",
    year: 2023,
    description: "A luxury eco-resort that seamlessly integrates with the natural landscape while providing modern amenities.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center",
    tags: ["Eco-Friendly", "Luxury", "Nature"],
    type: "commercial"
  },
  {
    id: 6,
    title: "Urban Regeneration Project",
    category: "Urban Planning",
    year: 2024,
    description: "Transforming underutilized urban spaces into vibrant, mixed-use developments that enhance city life.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&crop=center",
    tags: ["Urban", "Regeneration", "Mixed-Use"],
    type: "urban"
  }
];

const focusCards = projects.map(project => ({
  title: project.title,
  src: project.image
}));

const PortfolioGrid = () => {

  return (
    <section id="portfolio" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-primary">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our diverse portfolio of architectural innovations, from residential complexes to urban developments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FocusCards cards={focusCards} />
        </motion.div>

      </div>
    </section>
  );
};

export default PortfolioGrid;