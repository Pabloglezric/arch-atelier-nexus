import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import Navigation from '@/components/Navigation';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold" style={{ color: 'hsl(45, 100%, 60%)' }}>
              Welcome
            </h1>
            <p className="text-sm mt-2" style={{ color: 'hsla(45, 100%, 60%, 0.5)' }}>
              Sign in or create an account
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
