import { motion } from 'framer-motion';
import { Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SocialLinks = () => {
  const socialPlatforms = [
    {
      name: 'YouTube Channel',
      description: 'Watch architectural tutorials, project walkthroughs, and design insights',
      icon: Youtube,
      href: 'https://youtube.com/@pabloglez100?si=yj1braMcZEBgK8EW',
      color: 'hover:text-red-500',
      bgColor: 'hover:bg-red-50'
    },
    {
      name: 'LinkedIn',
      description: 'Professional insights and architectural industry updates',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/pablo-gonzalez-a1024177/',
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50'
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-primary">
            Connect & Follow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay connected with our growing community and never miss the latest architectural innovations and insights
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          {socialPlatforms.map((platform) => (
            <motion.div key={platform.name} variants={itemVariants}>
              <Card className="group hover:shadow-elegant transition-smooth cursor-pointer h-full">
                <a href={platform.href} target="_blank" rel="noopener noreferrer">
                    <CardHeader className="flex flex-col items-center text-center pb-4">
                     <div className={`inline-flex items-center justify-center p-4 rounded-full bg-muted mb-4 group-hover:scale-110 transition-bounce ${platform.bgColor}`}>
                       <platform.icon className={`h-8 w-8 text-primary transition-smooth ${platform.color}`} />
                     </div>
                     <CardTitle className="text-xl font-semibold group-hover:text-accent transition-smooth">
                       {platform.name}
                     </CardTitle>
                   </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      {platform.description}
                    </CardDescription>
                    <Button 
                      variant="ghost" 
                      className="mt-4 group-hover:bg-accent group-hover:text-accent-foreground transition-smooth"
                    >
                      Follow
                    </Button>
                  </CardContent>
                </a>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-semibold mb-4 text-primary">
              Join Our Newsletter
            </h3>
            <p className="text-muted-foreground mb-6">
              Get weekly updates on new projects, architectural insights, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              />
              <Button size="lg" className="bg-accent hover:bg-accent-glow text-accent-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialLinks;