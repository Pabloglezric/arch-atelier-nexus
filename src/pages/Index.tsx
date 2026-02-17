import Navigation from '@/components/Navigation';
import Hero from '@/components/ui/animated-shader-hero';
import PortfolioGrid from '@/components/PortfolioGrid';
import SocialLinks from '@/components/SocialLinks';
import { Linkedin, Youtube, Github, Instagram } from 'lucide-react';

const Index = () => {
  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Hero
        trustBadge={{
          text: "Trusted by innovative architects and designers",
          icons: ["🏗️", "✨"]
        }}
        tagline="BIM | Parametric Design | RIBA Stages 3–4"
        headline={{
          line1: "Architectural",
          line2: "Innovation"
        }}
        subtitle="Pushing the boundaries of design through cutting-edge architecture, innovative solutions, and immersive digital experiences"
        buttons={{
          primary: {
            text: "Explore Portfolio",
            onClick: scrollToPortfolio
          },
          secondary: {
            text: "Watch Demo",
            onClick: () => console.log('Watch demo clicked')
          }
        }}
        manifesto="Every structure begins with a single point of light — a vision that cuts through the noise with precision and purpose. What you see here is not decoration. It is intention. The same clarity that guides these trajectories across space is what drives every parametric model, every construction detail, every BIM workflow I deliver. Fast. Deliberate. Leaving nothing to chance."
        socialLinks={[
          { href: "https://linkedin.com", label: "LinkedIn", icon: <Linkedin size={18} /> },
          { href: "https://youtube.com", label: "YouTube", icon: <Youtube size={18} /> },
          { href: "https://github.com", label: "GitHub", icon: <Github size={18} /> },
          { href: "https://instagram.com", label: "Instagram", icon: <Instagram size={18} /> },
        ]}
      />
      
      <div className="relative z-10">
        <div className="h-screen"></div>
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navigation />
        </div>
        <PortfolioGrid />
        <SocialLinks />
      </div>
    </div>
  );
};

export default Index;
