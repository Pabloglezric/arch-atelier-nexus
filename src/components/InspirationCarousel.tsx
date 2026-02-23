import { Carousel } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

import inspGallery1 from '@/assets/insp-gallery-1.png';
import inspGallery2 from '@/assets/insp-gallery-2.png';
import inspShellPavilion from '@/assets/insp-shell-pavilion.png';
import inspTowerBalconies from '@/assets/insp-tower-balconies.png';
import inspTimberComplex from '@/assets/insp-timber-complex.png';
import inspOrganicSpa from '@/assets/insp-organic-spa.png';
import inspWarmInterior from '@/assets/insp-warm-interior.png';

const slideData = [
  { title: 'Waterfront Gallery Pavilion', button: 'View Gallery', src: inspGallery1 },
  { title: 'Shell Form Meditation Chapel', button: 'View Gallery', src: inspShellPavilion },
  { title: 'Harbour Museum Hall', button: 'View Gallery', src: inspGallery2 },
  { title: 'Tensile Canopy Tower', button: 'View Gallery', src: inspTowerBalconies },
  { title: 'Organic Timber Community Centre', button: 'View Gallery', src: inspTimberComplex },
  { title: 'Biomorphic Spa Interior', button: 'View Gallery', src: inspOrganicSpa },
  { title: 'Warm Minimalist Living', button: 'View Gallery', src: inspWarmInterior },
];

const InspirationCarousel = () => {
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: 'hsl(0 0% 0% / 0.6)' }}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'hsl(0 0% 92%)' }}
          >
            Design Inspiration
          </h2>
          <p className="text-sm" style={{ color: 'hsl(0 0% 50%)' }}>
            A curated collection of architectural visions and spatial explorations
          </p>
        </div>
        <Carousel slides={slideData} />
      </div>
    </section>
  );
};

export default InspirationCarousel;
