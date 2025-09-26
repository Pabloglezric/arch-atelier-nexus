import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

interface ProjectFile {
  name: string;
  type: 'pdf' | 'dwg' | 'jpg' | '3ds';
  size: string;
  url: string;
}

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock project data - in real app, fetch from API
  const project = {
    id: parseInt(id || '1'),
    title: "Modern Residential Complex",
    category: "Residential Architecture",
    year: 2024,
    location: "San Francisco, CA",
    client: "Urban Living Corp",
    description: "A sustainable housing development featuring innovative green building techniques and community-focused design that redefines urban living.",
    longDescription: `This groundbreaking residential complex represents the future of sustainable urban living. The project incorporates cutting-edge green building technologies, including solar panels, rainwater harvesting systems, and energy-efficient building materials.

The design emphasizes community interaction through shared spaces, rooftop gardens, and flexible common areas that can be adapted for various activities. Each unit is designed with natural lighting optimization and cross-ventilation to reduce energy consumption while enhancing resident comfort.

The project serves as a model for future urban developments, demonstrating how architectural innovation can address housing needs while maintaining environmental responsibility.`,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&crop=center"
    ],
    tags: ["Sustainable", "Community", "Modern", "Energy Efficient"],
    specs: {
      area: "25,000 sq ft",
      units: 48,
      floors: 6,
      parking: "Underground"
    },
    files: [
      { name: "Floor Plans.pdf", type: "pdf", size: "2.4 MB", url: "#" },
      { name: "Elevations.dwg", type: "dwg", size: "1.8 MB", url: "#" },
      { name: "3D Model.3ds", type: "3ds", size: "15.2 MB", url: "#" },
      { name: "Site Plan.pdf", type: "pdf", size: "3.1 MB", url: "#" },
      { name: "Renderings.jpg", type: "jpg", size: "8.7 MB", url: "#" },
      { name: "Specifications.pdf", type: "pdf", size: "1.2 MB", url: "#" }
    ] as ProjectFile[]
  };

  const getFileIcon = (type: ProjectFile['type']) => {
    const icons = {
      pdf: '📄',
      dwg: '📐',
      jpg: '🖼️',
      '3ds': '🧊'
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-6 py-6">
          <Button variant="ghost" asChild>
            <Link to="/portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        <section className="relative h-96 md:h-[60vh] overflow-hidden">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/40" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-primary-foreground"
              >
                <Badge className="mb-4 bg-accent text-accent-foreground">
                  {project.category}
                </Badge>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                  {project.title}
                </h1>
                <p className="text-xl opacity-90 max-w-2xl">
                  {project.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="files">Project Files</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-8">
                    <div className="prose prose-lg max-w-none">
                      <h3 className="font-display text-2xl font-semibold mb-4">Project Description</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {project.longDescription}
                      </p>
                      
                      <h3 className="font-display text-2xl font-semibold mb-4">Key Features</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Sustainable green building design with LEED Platinum certification</li>
                        <li>Community-focused spaces including rooftop gardens and shared amenities</li>
                        <li>Energy-efficient systems reducing carbon footprint by 40%</li>
                        <li>Smart home integration throughout all residential units</li>
                        <li>Underground parking with electric vehicle charging stations</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gallery" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="rounded-lg overflow-hidden shadow-elegant"
                        >
                          <img
                            src={image}
                            alt={`${project.title} view ${index + 1}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-smooth"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="files" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.files.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card className="hover:shadow-elegant transition-smooth">
                            <CardContent className="p-6 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getFileIcon(file.type)}</span>
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-muted-foreground">{file.size}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Completed in {project.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{project.client}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Area:</span>
                      <span>{project.specs.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Units:</span>
                      <span>{project.specs.units}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Floors:</span>
                      <span>{project.specs.floors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parking:</span>
                      <span>{project.specs.parking}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" size="lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Project
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetail;