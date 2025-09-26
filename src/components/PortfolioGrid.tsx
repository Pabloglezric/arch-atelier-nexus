import { motion } from 'framer-motion';
import { ExternalLink, Folder, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

const PortfolioGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const getTypeColor = (type: Project['type']) => {
    const colors = {
      residential: 'bg-blue-100 text-blue-800',
      commercial: 'bg-green-100 text-green-800',
      conceptual: 'bg-purple-100 text-purple-800',
      urban: 'bg-orange-100 text-orange-800'
    };
    return colors[type];
  };

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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="group hover:shadow-elegant transition-smooth cursor-pointer h-full">
                <Link to={`/project/${project.id}`}>
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-smooth"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-smooth" />
                      <Badge 
                        className={`absolute top-4 left-4 ${getTypeColor(project.type)}`}
                      >
                        {project.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <h3 className="font-display text-2xl font-semibold mb-2 group-hover:text-accent transition-smooth">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.year}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Folder className="h-4 w-4 mr-1" />
                        View Files
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link to="/portfolio">
              View All Projects
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioGrid;