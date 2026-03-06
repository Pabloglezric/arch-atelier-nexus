import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Loader2, Send, Eye } from 'lucide-react';

const AdminNewsletter = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({ title: 'Missing fields', description: 'Subject and content are required.', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await supabase.functions.invoke('send-newsletter', {
        body: { subject, content },
      });

      if (res.error) throw res.error;

      const result = res.data;
      toast({
        title: 'Newsletter sent!',
        description: `Sent to ${result.sent} subscriber(s).${result.failed > 0 ? ` ${result.failed} failed.` : ''}`,
      });
      setSubject('');
      setContent('');
      setPreview(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to send newsletter', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-32 pb-16 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8" style={{ color: 'hsl(45, 100%, 60%)' }}>
          Send Newsletter
        </h1>

        {preview ? (
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-amber-500/20 bg-black/50">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'hsl(45, 100%, 60%)' }}>{subject}</h2>
              <div className="whitespace-pre-wrap text-white/80">{content}</div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setPreview(false)} variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                Edit
              </Button>
              <Button onClick={handleSend} disabled={loading} className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send to All Subscribers
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: 'hsl(45, 100%, 60%)' }}>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)}
                className="bg-black/50 border-amber-500/30 text-white" placeholder="Newsletter subject..." />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'hsl(45, 100%, 60%)' }}>Content</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
                className="bg-black/50 border-amber-500/30 text-white" placeholder="Write your newsletter content..." />
            </div>
            <Button onClick={() => setPreview(true)} disabled={!subject.trim() || !content.trim()}
              className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
