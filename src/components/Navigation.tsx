import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Youtube, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isClassic } = useTheme();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Portfolio',
    path: '/portfolio'
  }, {
    name: 'Interactive Models',
    path: '/interactive-models'
  }, {
    name: 'Inspiration',
    path: '/inspiration'
  }, {
    name: 'About',
    path: '/about'
  }, {
    name: 'Contact',
    path: '/contact'
  }];
  const socialLinks = [{
    icon: Github,
    href: '#',
    label: 'GitHub'
  }, {
    icon: Youtube,
    href: '#',
    label: 'YouTube'
  }, {
    icon: Users,
    href: '#',
    label: 'Skool Community'
  }];
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${isScrolled ? 'glass-effect shadow-elegant' : 'bg-black/30 backdrop-blur-md'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center relative">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => <Link key={item.path} to={item.path} className={`relative font-medium transition-smooth ${location.pathname === item.path ? 'text-accent' : ''}`} style={location.pathname !== item.path ? { color: 'hsla(45, 100%, 60%, 0.6)' } : undefined}>
                {item.name}
                {location.pathname === item.path && <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />}
              </Link>)}
          </div>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((social, index) => <Button key={index} variant="ghost" size="sm" asChild>
                


              </Button>)}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" style={{ color: isClassic ? '#1a1612' : 'white' }} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" style={{ color: isClassic ? '#1a1612' : 'white' }} /> : <Menu className="h-6 w-6" style={{ color: isClassic ? '#1a1612' : 'white' }} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`font-medium transition-smooth ${location.pathname === item.path ? '' : ''}`} style={{ color: location.pathname === item.path ? '#8B1A1A' : (isClassic ? '#1a1612' : 'white') }}>
                    {item.name}
                  </Link>)}
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </nav>;
};
export default Navigation;