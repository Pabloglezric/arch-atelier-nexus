import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import AuthForm from '@/components/auth/AuthForm';
import Navigation from '@/components/Navigation';
import { Cuboid, Layers, Newspaper, BookOpen, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: Cuboid,
    title: 'Revit Families & Templates',
    description: 'Download production-ready Revit families and project templates for your practice.',
  },
  {
    icon: Layers,
    title: 'Interactive 3D Models',
    description: 'Explore parametric pavilions, twisting towers, and holographic oceans in real-time.',
  },
  {
    icon: Newspaper,
    title: 'Newsletter & Updates',
    description: 'Stay current with architectural news, project insights, and industry trends.',
  },
  {
    icon: BookOpen,
    title: 'Growing Resource Library',
    description: 'Access an expanding collection of tools, guides, and design resources.',
  },
];

const Auth = () => {
  const { user, loading } = useAuth();
  const { isClassic } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className={`min-h-screen ${isClassic ? 'bg-[#f5f0e8]' : 'bg-black'}`}>
      <Navigation />
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Marketing / Benefits Column */}
          <div className="space-y-8">
            <div>
              <h1
                className="text-3xl md:text-4xl font-display font-bold leading-tight"
                style={{ color: isClassic ? '#1a1612' : 'hsl(45, 100%, 60%)' }}
              >
                Unlock the full
                <br />
                experience
              </h1>
              <p
                className="mt-3 text-base md:text-lg leading-relaxed"
                style={{ color: isClassic ? '#1a1612cc' : 'hsla(45, 100%, 60%, 0.6)' }}
              >
                Create a free account to access exclusive architectural tools,
                interactive models, and curated industry updates.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4 items-start">
                  <div
                    className="mt-1 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: isClassic ? '#8B1A1A14' : 'hsla(45, 100%, 60%, 0.1)',
                      border: isClassic ? '1px solid #8B1A1A30' : '1px solid hsla(45, 100%, 60%, 0.15)',
                    }}
                  >
                    <b.icon
                      className="w-5 h-5"
                      style={{ color: isClassic ? '#8B1A1A' : 'hsl(45, 100%, 60%)' }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: isClassic ? '#1a1612' : 'hsl(45, 100%, 60%)' }}
                    >
                      {b.title}
                    </h3>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: isClassic ? '#1a1612aa' : 'hsla(45, 100%, 60%, 0.5)' }}
                    >
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{ color: isClassic ? '#8B1A1A' : 'hsla(45, 100%, 60%, 0.4)' }}
            >
              <ArrowRight className="w-3 h-3" />
              Free forever — no credit card required
            </div>
          </div>

          {/* Auth Form Column */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="text-center mb-8">
              <h2
                className="text-2xl font-display font-bold"
                style={{ color: isClassic ? '#1a1612' : 'hsl(45, 100%, 60%)' }}
              >
                Welcome
              </h2>
              <p
                className="text-sm mt-2"
                style={{ color: isClassic ? '#1a161280' : 'hsla(45, 100%, 60%, 0.5)' }}
              >
                Sign in or create an account
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
