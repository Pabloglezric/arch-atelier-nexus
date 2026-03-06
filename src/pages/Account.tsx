import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();
  const { isClassic } = useTheme();
  const { toast } = useToast();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const fg = isClassic ? '#1a1612' : 'hsl(45, 100%, 60%)';
  const fgMuted = isClassic ? '#1a1612aa' : 'hsla(45, 100%, 60%, 0.7)';
  const borderColor = isClassic ? '#1a161220' : 'hsla(45, 100%, 60%, 0.13)';

  useEffect(() => {
    if (!user) return;
    supabase
      .from('newsletter_subscribers')
      .select('is_active')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setSubscribed(data?.is_active ?? false);
        setLoading(false);
      });
  }, [user]);

  const toggleSubscription = async (checked: boolean) => {
    if (!user) return;
    setSubscribed(checked);

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('newsletter_subscribers').update({ is_active: checked }).eq('user_id', user.id);
    } else {
      await supabase.from('newsletter_subscribers').insert({ user_id: user.id, email: user.email! });
    }

    toast({ title: checked ? 'Subscribed!' : 'Unsubscribed', description: checked ? 'You will receive newsletters.' : 'You will no longer receive newsletters.' });
  };

  return (
    <div className={`min-h-screen ${isClassic ? 'bg-[#f5f0e8]' : 'bg-black'}`}>
      <Navigation />
      <div className="pt-32 pb-16 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-display font-bold mb-8" style={{ color: fg }}>Account Settings</h1>
        <div
          className="p-6 rounded-lg"
          style={{ border: `1px solid ${borderColor}`, background: isClassic ? '#fff' : 'rgba(0,0,0,0.5)' }}
        >
          <p className="text-sm mb-4" style={{ color: fgMuted }}>{user?.email}</p>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: fg }} />
          ) : (
            <div className="flex items-center gap-3">
              <Switch checked={subscribed} onCheckedChange={toggleSubscription} />
              <Label style={{ color: fg }}>Newsletter subscription</Label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
