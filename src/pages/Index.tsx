import Navigation from '@/components/Navigation';
import Hero from '@/components/ui/animated-shader-hero';
import PortfolioGrid from '@/components/PortfolioGrid';
import SocialLinks from '@/components/SocialLinks';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero
        tagline="BIM | Parametric Design | RIBA Stages 3–4"
        headline={{
          line1: "Architectural",
          line2: "Innovation"
        }}
        subtitle=""
        manifesto="Every structure begins with a single point of light — a vision that cuts through the noise with precision and purpose. What you see here is not decoration. It is intention. The same clarity that guides these trajectories across space is what drives every parametric model, every construction detail, every BIM workflow I deliver. Fast. Deliberate. Leaving nothing to chance."
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
