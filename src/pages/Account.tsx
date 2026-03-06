import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-32 pb-16 px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-display font-bold mb-8" style={{ color: 'hsl(45, 100%, 60%)' }}>Account Settings</h1>
        <div className="p-6 rounded-lg border border-amber-500/20 bg-black/50">
          <p className="text-sm mb-4" style={{ color: 'hsla(45, 100%, 60%, 0.7)' }}>{user?.email}</p>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          ) : (
            <div className="flex items-center gap-3">
              <Switch checked={subscribed} onCheckedChange={toggleSubscription} />
              <Label style={{ color: 'hsl(45, 100%, 60%)' }}>Newsletter subscription</Label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
