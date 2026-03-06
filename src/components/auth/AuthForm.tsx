import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const { isClassic } = useTheme();

  // Theme-aware color helpers
  const fg = isClassic ? '#1a1612' : 'hsl(45, 100%, 60%)';
  const fgMuted = isClassic ? '#1a161280' : 'hsla(45, 100%, 60%, 0.6)';
  const fgSoft = isClassic ? '#1a1612aa' : 'hsla(45, 100%, 60%, 0.7)';
  const accent = isClassic ? '#8B1A1A' : 'hsl(45, 100%, 60%)';
  const accentBg = isClassic ? '#8B1A1A' : '#d4a017';
  const accentText = isClassic ? '#fff' : '#000';
  const inputClasses = isClassic
    ? 'bg-white border-[#1a161230] text-[#1a1612] placeholder:text-[#1a161240]'
    : 'bg-black/50 border-amber-500/30 text-white placeholder:text-white/40';
  const tabListBg = isClassic
    ? 'bg-[#1a161210] border border-[#1a161220]'
    : 'bg-black/50 border border-amber-500/20';
  const tabActive = isClassic
    ? 'data-[state=active]:bg-[#8B1A1A] data-[state=active]:text-white text-[#1a161280]'
    : 'data-[state=active]:bg-amber-500 data-[state=active]:text-black text-amber-500/60';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      if (subscribeNewsletter && data.user) {
        await supabase.from('newsletter_subscribers').insert({
          user_id: data.user.id,
          email,
        });
      }

      toast({
        title: 'Check your email',
        description: 'We sent you a verification link to confirm your account.',
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({
        title: 'Check your email',
        description: 'We sent you a password reset link.',
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold" style={{ color: fg }}>Reset Password</h2>
          <p className="text-sm mt-2" style={{ color: fgMuted }}>Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" style={{ color: fg }}>Email</Label>
            <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputClasses} placeholder="you@example.com" />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-semibold"
            style={{ backgroundColor: accentBg, color: accentText }}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
          <Button type="button" variant="link" onClick={() => setShowForgotPassword(false)}
            className="w-full" style={{ color: fgMuted }}>
            Back to Sign In
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${tabListBg}`}>
          <TabsTrigger value="signin" className={tabActive}>Sign In</TabsTrigger>
          <TabsTrigger value="signup" className={tabActive}>Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="space-y-4 mt-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" style={{ color: fg }}>Email</Label>
              <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className={inputClasses} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" style={{ color: fg }}>Password</Label>
              <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className={inputClasses} placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full font-semibold"
              style={{ backgroundColor: accentBg, color: accentText }}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <Button type="button" variant="link" onClick={() => setShowForgotPassword(true)}
              className="w-full" style={{ color: fgMuted }}>
              Forgot Password?
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4 mt-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" style={{ color: fg }}>Full Name</Label>
              <Input id="signup-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                className={inputClasses} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" style={{ color: fg }}>Email</Label>
              <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className={inputClasses} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" style={{ color: fg }}>Password</Label>
              <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className={inputClasses} placeholder="••••••••" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="newsletter" checked={subscribeNewsletter} onCheckedChange={(c) => setSubscribeNewsletter(c === true)}
                className={isClassic
                  ? 'border-[#8B1A1A50] data-[state=checked]:bg-[#8B1A1A] data-[state=checked]:text-white'
                  : 'border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black'
                } />
              <Label htmlFor="newsletter" className="text-sm cursor-pointer" style={{ color: fgSoft }}>
                Subscribe to our newsletter
              </Label>
            </div>
            <Button type="submit" disabled={loading} className="w-full font-semibold"
              style={{ backgroundColor: accentBg, color: accentText }}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
