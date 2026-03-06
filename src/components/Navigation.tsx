import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Youtube, Users, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import UserMenu from '@/components/auth/UserMenu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isClassic } = useTheme();
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useAdmin(user?.id);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allNavItems = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Portfolio',
    path: '/portfolio'
  }, {
    name: 'Interactive Models',
    path: '/interactive-models',
    disruptiveOnly: true
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
  const navItems = allNavItems.filter(item => !item.disruptiveOnly || !isClassic);

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

          {/* Auth Section — pinned right */}
          <div className="hidden md:flex items-center absolute right-0">
            {!loading && (
              user ? (
                <UserMenu email={user.email || ''} isAdmin={isAdmin} onSignOut={signOut} />
              ) : (
                <Button asChild variant="ghost" size="sm" style={{ color: 'hsl(45, 100%, 60%)' }}>
                  <Link to="/auth" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button — pinned left */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden absolute left-0"
            style={{ color: isClassic ? '#1a1612' : 'white' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" style={{ color: isClassic ? '#1a1612' : 'white' }} />
            ) : (
              <motion.div
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3 }}
              >
                <Menu className="h-6 w-6" style={{ color: isClassic ? '#1a1612' : 'white' }} />
              </motion.div>
            )}
          </Button>

          {/* Mobile Auth — pinned right */}
          <div className="md:hidden absolute right-0">
            {!loading && (
              user ? (
                <UserMenu email={user.email || ''} isAdmin={isAdmin} onSignOut={signOut} />
              ) : (
                <Button asChild variant="ghost" size="sm" style={{ color: 'hsl(45, 100%, 60%)' }}>
                  <Link to="/auth"><LogIn className="h-5 w-5" /></Link>
                </Button>
              )
            )}
          </div>
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
                {navItems.map((item) => <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`font-medium transition-smooth`} style={{ color: location.pathname === item.path ? '#8B1A1A' : (isClassic ? '#1a1612' : 'white') }}>
                    {item.name}
                  </Link>)}
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </nav>;
};
export default Navigation;
