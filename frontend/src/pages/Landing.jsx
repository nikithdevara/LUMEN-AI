import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ArrowRight, Sparkles, BookOpen, Brain, Heart, Shield, Lightbulb, Users, TrendingUp, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import LumenLogo from '@/components/LumenLogo';
import ThemeToggle from '@/components/ThemeToggle';

const roles = [
  { icon: BookOpen, label: 'Students', desc: 'Recognize warning signs and build prevention awareness' },
  { icon: Heart, label: 'Parents', desc: 'Understand risks and have safer conversations' },
  { icon: Shield, label: 'Hotel Staff', desc: 'Learn responsible awareness in hospitality' },
  { icon: Users, label: 'Volunteers', desc: 'Support community awareness initiatives' }
];

const howItWorks = [
  { step: '01', icon: Sparkles, title: 'Choose Your Path', desc: 'Select your role and receive a personalized learning journey tailored to your context and needs.' },
  { step: '02', icon: Brain, title: 'Interactive Scenarios', desc: 'Step into cinematic, AI-guided stories where your choices shape the outcome and deepen understanding.' },
  { step: '03', icon: Lightbulb, title: 'Reflect & Act', desc: 'AI-generated reflections, adaptive knowledge checks, and actionable recommendations guide real-world impact.' }
];

const impacts = [
  { value: '12K+', label: 'Learners empowered' },
  { value: '48', label: 'Interactive scenarios' },
  { value: '94%', label: 'Report greater awareness' },
  { value: '26', label: 'Community partners' }
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStart = () => {
    navigate(isAuthenticated ? '/onboarding' : '/login');
  };

  const handleExplore = () => {
    navigate(isAuthenticated ? '/workspace' : '/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden transition-colors duration-300">
      {/* Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div className="glass rounded-2xl shadow-[0_8px_32px_rgba(30,58,95,0.08)] px-4 py-2.5 flex items-center justify-between">
          <LumenLogo size={32} />
          <div className="hidden md:flex items-center gap-6">
            <a href="#what" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">What is LUMEN?</a>
            <a href="#how" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">How it Works</a>
            <a href="#impact" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={handleStart} className="flex items-center gap-1.5 bg-navy text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy-dark transition-all hover:shadow-lg">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 gradient-hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aiblue/10 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gold/8 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs font-semibold text-navy/80">AI-powered awareness, now live</span>
          </div>

          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-navy mb-6 animate-fade-in-up">
            Illuminate.<br />
            <span className="gradient-text-ai">Understand.</span><br />
            Act.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 text-balance animate-fade-in-delay-1">
            An AI-powered interactive awareness platform that transforms learning into meaningful action.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
            <button onClick={handleStart} className="group flex items-center gap-2 bg-navy text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-navy-dark transition-all hover:shadow-xl hover:-translate-y-0.5">
              Start Experience
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={handleExplore} className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200 text-navy font-semibold px-7 py-3.5 rounded-xl hover:bg-white hover:border-slate-300 transition-all hover:shadow-md">
              Explore Platform
            </button>
          </div>

          {/* Role preview */}
          <div className="mt-20 animate-fade-in-delay-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Built for everyone</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/60 text-sm font-medium text-navy/70 hover:text-navy hover:bg-white/80 transition-all cursor-default">
                    <Icon className="w-4 h-4 text-aiblue" />
                    {role.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What is LUMEN AI */}
      <section id="what" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-aiblue mb-3">What is LUMEN AI?</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-5 text-balance">
                Bringing hidden issues into the light through ethical storytelling
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                LUMEN AI is an interactive awareness and education platform that helps people understand human trafficking dynamics through empathy-driven scenarios, AI-guided reflection, and personalized learning. We replace fear with understanding, and awareness with action.
              </p>
              <div className="space-y-3">
                {['Ethical, human-centered storytelling', 'AI-guided reflection and insights', 'Personalized to your role and context', 'Safe, calm, and hope-driven design'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-aiblue/10 to-gold/10 rounded-3xl blur-2xl" />
              <div className="relative glass-card p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-navy text-sm">AI Learning Companion</h3>
                    <p className="text-xs text-slate-400">Guiding you every step</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                    <p className="text-xs text-slate-400 mb-1">Scenario insight</p>
                    <p className="text-sm text-navy">Notice how isolation from coworkers can be a subtle warning sign. Trust your instincts.</p>
                  </div>
                  <div className="bg-aiblue/5 rounded-xl p-3 border border-aiblue/10">
                    <p className="text-xs text-aiblue mb-1 font-semibold">Reflection prompt</p>
                    <p className="text-sm text-navy">What safe steps could you take if you noticed this pattern?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-aiblue mb-3">How it Works</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy text-balance">An AI-powered learning journey</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group">
                  <div className="glass-card p-7 h-full transition-all duration-300 hover:shadow-[0_16px_48px_rgba(30,58,95,0.1)] hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-heading font-extrabold text-3xl text-slate-100">{step.step}</span>
                    </div>
                    <h3 className="font-heading font-bold text-navy text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-navy p-10 md:p-16">
            <div className="absolute top-0 right-0 w-80 h-80 bg-aiblue/20 rounded-full blur-3xl animate-glow-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float" />
            <div className="relative z-10">
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-gold mb-3">Our Impact</p>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-white text-balance">Awareness that creates real change</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {impacts.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-aiblue mb-3">Resources</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy">A library of trusted knowledge</h2>
            </div>
            <Link to="/login" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-aiblue hover:gap-2.5 transition-all">
              Explore library <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Recognizing Warning Signs', type: 'Guide', desc: 'A practical guide to identifying subtle indicators in everyday environments.' },
              { icon: Shield, title: 'Safety Response Framework', type: 'Article', desc: 'Evidence-based steps for safe, responsible action when something feels wrong.' },
              { icon: Users, title: 'Community Awareness Toolkit', type: 'Resource', desc: 'Everything you need to start meaningful conversations in your community.' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group glass-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-aiblue/10 flex items-center justify-center mb-4 group-hover:bg-aiblue/20 transition-colors">
                    <Icon className="w-5 h-5 text-aiblue" />
                  </div>
                  <span className="text-xs font-semibold text-gold-dark bg-gold/10 px-2 py-0.5 rounded-md">{item.type}</span>
                  <h3 className="font-heading font-semibold text-navy mt-3 mb-1.5 group-hover:text-aiblue transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-aiblue/20 blur-2xl rounded-full animate-glow-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center shadow-xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-navy mb-5 text-balance">Ready to illuminate?</h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">Start your personalized awareness journey today. It only takes a minute to begin.</p>
          <button onClick={handleStart} className="group inline-flex items-center gap-2 bg-navy text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy-dark transition-all hover:shadow-xl hover:-translate-y-0.5">
            Start Experience
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <LumenLogo size={32} />
            <p className="text-sm text-slate-400 text-center max-w-md">
              LUMEN AI — Illuminating awareness through ethical storytelling, AI guidance, and human-centered design.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">© 2026 LUMEN AI</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-300">
              If you or someone you know needs immediate help, contact the National Human Trafficking Hotline: 1-888-373-7888
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}