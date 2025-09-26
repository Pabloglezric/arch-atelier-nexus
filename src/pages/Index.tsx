import Navigation from '@/components/Navigation';
import Hero from '@/components/ui/animated-shader-hero';
import PortfolioGrid from '@/components/PortfolioGrid';
import SocialLinks from '@/components/SocialLinks';

const Index = () => {
  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Fixed animated background hero */}
      <Hero
        trustBadge={{
          text: "Trusted by innovative architects and designers",
          icons: ["🏗️", "✨"]
        }}
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
            onClick: () => {
              // Add demo functionality here
              console.log('Watch demo clicked');
            }
          }
        }}
      />
      
      {/* Content layer above the hero background */}
      <div className="relative z-10">
        {/* Spacer for initial hero content */}
        <div className="h-screen"></div>
        
        {/* Navigation overlay */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navigation />
        </div>
        
        {/* Main content */}
        <PortfolioGrid />
        <SocialLinks />
      </div>
    </div>
  );
};

export default Index;
