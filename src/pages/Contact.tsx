import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import { Linkedin, Mail, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ArchEvolutionCTA from '@/components/ArchEvolutionCTA';
import { supabase } from '@/integrations/supabase/client';
import { GlowCard } from '@/components/ui/spotlight-card';

type SubjectOption = 'Project Enquiry' | 'ArchEvolution' | 'General';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const pathways = [
  {
    title: 'Hire Me',
    description: 'Looking for a BIM specialist or Architectural Technologist for your next project? Let\'s talk.',
    button: 'Send a Project Enquiry',
    subject: 'Project Enquiry' as SubjectOption,
  },
  {
    title: 'ArchEvolution',
    description: 'Interested in AI tools for architecture, courses, or collaborations with the ArchEvolution platform?',
    button: 'Get in Touch about ArchEvolution',
    subject: 'ArchEvolution' as SubjectOption,
  },
  {
    title: 'Just Say Hello',
    description: 'Have a question, want to exchange ideas, or just want to connect with someone who loves pushing BIM to its limits?',
    button: 'Say Hello',
    subject: 'General' as SubjectOption,
  },
];

const drawDitheredOrbs = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pixelSize = 6;
  const offscreen = document.createElement('canvas');
  const smallW = Math.ceil(canvas.width / pixelSize);
  const smallH = Math.ceil(canvas.height / pixelSize);
  offscreen.width = smallW;
  offscreen.height = smallH;
  const offCtx = offscreen.getContext('2d')!;
  offCtx.clearRect(0, 0, smallW, smallH);

  const orbs = [
    { x: Math.sin(time * 0.7) * 0.3 + 0.2, y: Math.cos(time * 0.5) * 0.3 + 0.3, r: 900 / pixelSize, color: 'hsla(45, 90%, 55%, 0.45)' },
    { x: Math.cos(time * 0.4) * 0.3 + 0.7, y: Math.sin(time * 0.6) * 0.3 + 0.5, r: 750 / pixelSize, color: 'hsla(35, 80%, 45%, 0.35)' },
    { x: Math.sin(time * 0.8 + 2) * 0.4 + 0.5, y: Math.cos(time * 0.3 + 1) * 0.4 + 0.7, r: 1000 / pixelSize, color: 'hsla(50, 70%, 50%, 0.30)' },
    { x: Math.cos(time * 0.5 + 3) * 0.3 + 0.4, y: Math.sin(time * 0.7 + 2) * 0.3 + 0.2, r: 600 / pixelSize, color: 'hsla(40, 85%, 50%, 0.28)' },
  ];

  for (const orb of orbs) {
    const gradient = offCtx.createRadialGradient(
      orb.x * smallW, orb.y * smallH, 0,
      orb.x * smallW, orb.y * smallH, orb.r
    );
    gradient.addColorStop(0, orb.color);
    gradient.addColorStop(1, 'transparent');
    offCtx.fillStyle = gradient;
    offCtx.fillRect(0, 0, smallW, smallH);
  }

  const sweepX = (Math.sin(time * 0.2) * 0.5 + 0.5) * smallW;
  const sweepGrad = offCtx.createLinearGradient(sweepX - 50, 0, sweepX + 50, smallH);
  sweepGrad.addColorStop(0, 'transparent');
  sweepGrad.addColorStop(0.5, 'hsla(45, 100%, 60%, 0.22)');
  sweepGrad.addColorStop(1, 'transparent');
  offCtx.fillStyle = sweepGrad;
  offCtx.fillRect(0, 0, smallW, smallH);

  // Bayer 4x4 dithering
  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  const imageData = offCtx.getImageData(0, 0, smallW, smallH);
  const data = imageData.data;
  for (let y = 0; y < smallH; y++) {
    for (let x = 0; x < smallW; x++) {
      const idx = (y * smallW + x) * 4;
      const a = data[idx + 3];
      if (a === 0) continue;
      const threshold = (bayerMatrix[y % 4][x % 4] / 16) * 255;
      const brightness = (data[idx] * 0.3 + data[idx + 1] * 0.59 + data[idx + 2] * 0.11);
      if (brightness < threshold * 0.4) {
        data[idx + 3] = 0;
      }
    }
  }
  offCtx.putImageData(imageData, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);
};

const Contact = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [subject, setSubject] = useState<SubjectOption>('General');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.003;
      drawDitheredOrbs(ctx, canvas, time);
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const scrollToForm = (selectedSubject: SubjectOption) => {
    setSubject(selectedSubject);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name: name.trim(), email: email.trim(), subject, message: message.trim() },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Message sent successfully!' });
    } catch (err) {
      console.error('Send error:', err);
      toast({ title: 'Failed to send message. Please try again.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <SEOHead
        title="Contact - Hire a BIM Specialist | Juan Pablo Gonzalez Ricardez"
        description="Get in touch with Juan Pablo Gonzalez Ricardez, BIM Specialist and Architectural Technologist in Leeds. Available for BIM consulting, Revit modelling, and architectural documentation projects."
        keywords="hire BIM specialist, BIM consultant contact, architectural services Leeds, Revit modelling services, BIM freelancer UK"
        canonicalPath="/contact"
      />
      <div className="relative" style={{ zIndex: 1 }}>
        <Navigation />

        {/* ─── Section 1: Opening Statement ─── */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: 'hsl(0 0% 0%)' }}
            >
              Let's build something{' '}
              <span style={{ color: 'hsl(45 100% 60%)' }}>precise.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              Whether you need a BIM consultant, a technical documentation specialist, or want to
              collaborate on an AI-powered design project — I want to hear from you.
            </motion.p>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 2: Lead Pathways ─── */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pathways.map((p, i) => (
                <motion.div
                  key={p.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <GlowCard
                    className="p-8 rounded-lg flex flex-col h-full"
                    style={{
                      backgroundColor: 'hsl(0 0% 6%)',
                      border: '1px solid hsl(0 0% 12%)',
                      borderTopColor: 'hsl(45 100% 60% / 0.5)',
                      borderTopWidth: '2px',
                    }}
                  >
                    <h3
                      className="font-display text-xl font-semibold mb-3"
                      style={{ color: 'hsl(0 0% 88%)' }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'hsl(0 0% 42%)' }}>
                      {p.description}
                    </p>
                    <Button
                      onClick={() => scrollToForm(p.subject)}
                      className="w-full rounded-full text-sm font-semibold py-3"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'hsl(45 100% 60%)',
                        border: '1px solid hsl(45 100% 60% / 0.4)',
                      }}
                    >
                      {p.button}
                    </Button>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 3: Contact Form ─── */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-[680px]" ref={formRef}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-10 md:p-14 rounded-xl"
              style={{
                backgroundColor: 'hsl(0 0% 5%)',
                border: '1px solid hsl(45 100% 60% / 0.15)',
                boxShadow: '0 0 80px hsl(45 100% 60% / 0.04)',
              }}
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: 'hsl(45 100% 60% / 0.1)', border: '1px solid hsl(45 100% 60% / 0.3)' }}
                  >
                    <Send className="h-6 w-6" style={{ color: 'hsl(45 100% 60%)' }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'hsl(0 0% 92%)' }}>
                    Message received.
                  </h3>
                  <p className="text-sm" style={{ color: 'hsl(0 0% 50%)' }}>
                    I'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2
                    className="font-display text-2xl md:text-3xl font-bold mb-2"
                    style={{ color: 'hsl(0 0% 92%)' }}
                  >
                    Get in touch
                  </h2>
                  <p className="text-sm mb-8" style={{ color: 'hsl(0 0% 42%)' }}>
                    Fill in the details below and I'll respond within 48 hours.
                  </p>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors duration-300 focus:ring-1"
                      style={{
                        backgroundColor: 'hsl(0 0% 8%)',
                        color: 'hsl(0 0% 85%)',
                        border: '1px solid hsl(0 0% 14%)',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(45 100% 60% / 0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(0 0% 14%)'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors duration-300"
                      style={{
                        backgroundColor: 'hsl(0 0% 8%)',
                        color: 'hsl(0 0% 85%)',
                        border: '1px solid hsl(0 0% 14%)',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(45 100% 60% / 0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(0 0% 14%)'}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as SubjectOption)}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors duration-300 appearance-none cursor-pointer"
                      style={{
                        backgroundColor: 'hsl(0 0% 8%)',
                        color: 'hsl(0 0% 85%)',
                        border: '1px solid hsl(0 0% 14%)',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(45 100% 60% / 0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(0 0% 14%)'}
                    >
                      <option value="Project Enquiry">Project Enquiry</option>
                      <option value="ArchEvolution">ArchEvolution</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      maxLength={1000}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors duration-300 resize-none"
                      style={{
                        backgroundColor: 'hsl(0 0% 8%)',
                        color: 'hsl(0 0% 85%)',
                        border: '1px solid hsl(0 0% 14%)',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(45 100% 60% / 0.4)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(0 0% 14%)'}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-full py-3 text-sm font-semibold tracking-wide"
                    style={{
                      backgroundColor: 'hsl(45 100% 60%)',
                      color: 'hsl(0 0% 4%)',
                      opacity: sending ? 0.7 : 1,
                    }}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 4: Direct Contact Strip ─── */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0"
            >
              <a
                href="mailto:admin@archevolution.world"
                className="flex items-center gap-2 text-sm transition-colors duration-300 hover:opacity-80"
                style={{ color: 'hsl(0 0% 55%)' }}
              >
                <Mail className="h-4 w-4" style={{ color: 'hsl(45 100% 60%)' }} />
                admin@archevolution.world
              </a>

              <div className="hidden sm:block w-px h-5 mx-8" style={{ backgroundColor: 'hsl(45 100% 60% / 0.3)' }} />

              <span className="flex items-center gap-2 text-sm" style={{ color: 'hsl(0 0% 55%)' }}>
                <MapPin className="h-4 w-4" style={{ color: 'hsl(45 100% 60%)' }} />
                Leeds, United Kingdom
              </span>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="container mx-auto max-w-6xl px-6">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(45 100% 60% / 0.25), transparent)' }} />
        </div>

        {/* ─── Section 5: Social Icons Footer ─── */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <a
                href="https://www.linkedin.com/in/pablo-gonzalez-a1024177/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: '1px solid hsl(0 0% 18%)',
                  color: 'hsl(0 0% 50%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(45 100% 60% / 0.5)';
                  e.currentTarget.style.color = 'hsl(45 100% 60%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(0 0% 18%)';
                  e.currentTarget.style.color = 'hsl(0 0% 50%)';
                }}
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </section>

        <ArchEvolutionCTA />

        <div className="h-16" />
      </div>
    </div>
  );
};

export default Contact;
