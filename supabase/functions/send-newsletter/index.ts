import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.96.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    // Verify user with their token
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = claimsData.claims.sub;

    // Use service role to check admin and fetch subscribers
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check admin role
    const { data: roleData } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { subject, content } = await req.json();
    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Fetch active subscribers
    const { data: subscribers, error: subError } = await adminClient
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError) throw subError;
    if (!subscribers?.length) {
      return new Response(JSON.stringify({ sent: 0, failed: 0, message: 'No active subscribers' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let sent = 0;
    let failed = 0;

    // Send in batches of 50
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const emails = batch.map(s => s.email);

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ArchEvolution <admin@archevolution.world>',
            to: emails,
            subject,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #d4a017; border-bottom: 1px solid #d4a01733; padding-bottom: 16px;">${subject}</h1>
              <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${content}</div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
              <p style="color: #999; font-size: 12px;">You received this because you subscribed to the ArchEvolution newsletter.</p>
            </div>`,
          }),
        });

        if (res.ok) {
          sent += emails.length;
        } else {
          failed += emails.length;
        }
      } catch {
        failed += batch.length;
      }
    }

    // Log newsletter
    await adminClient.from('newsletters').insert({
      subject,
      content,
      sent_by: userId,
      recipient_count: sent,
    });

    return new Response(JSON.stringify({ sent, failed }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
