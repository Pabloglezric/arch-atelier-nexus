import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PortfolioGrid from '@/components/PortfolioGrid';
import SocialLinks from '@/components/SocialLinks';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <PortfolioGrid />
      <SocialLinks />
    </div>
  );
};

export default Index;
