const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

import { GraduationCap, Heart, Hotel, Users, ArrowRight, Check, Sparkles } from 'lucide-react';
import LumenLogo from '@/components/LumenLogo';

const roles = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    description: 'Learn how to recognize hidden warning signs and understand prevention.',
    accent: 'aiblue',
    gradient: 'from-aiblue to-indigo-500'
  },
  {
    id: 'parent',
    icon: Heart,
    title: 'Parent',
    description: 'Understand risks and have safer conversations with your family.',
    accent: 'gold',
    gradient: 'from-gold to-gold-dark'
  },
  {
    id: 'hotel_staff',
    icon: Hotel,
    title: 'Hotel Staff',
    description: 'Learn responsible awareness practices in hospitality environments.',
    accent: 'success',
    gradient: 'from-success to-emerald-600'
  },
  {
    id: 'volunteer',
    icon: Users,
    title: 'Volunteer',
    description: 'Support community awareness initiatives with confidence.',
    accent: 'navy',
    gradient: 'from-navy to-navy-light'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = (roleId) => {
    setSelected(roleId);
  };

  const handleContinue = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await db.auth.updateMe({ onboarding_role: selected });
      navigate('/workspace');
    } catch {
      navigate('/workspace');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 gradient-hero">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aiblue/8 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/6 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto">
        <div className="flex justify-center mb-10 animate-fade-in">
          <LumenLogo size={40} />
        </div>

        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-aiblue" />
            <span className="text-xs font-semibold text-navy/80">Personalized setup</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-navy mb-4 text-balance">
            Who are you today?
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            We'll tailor your learning journey to your role and context.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roles.map((role, i) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleSelect(role.id)}
                className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 animate-fade-in-up ${
                  isSelected
                    ? 'border-transparent bg-white shadow-xl scale-[1.02]'
                    : 'border-white/50 bg-white/60 backdrop-blur-xl hover:bg-white/80 hover:shadow-md hover:-translate-y-1'
                }`}
                style={{ animationDelay: `${0.15 + i * 0.1}s`, opacity: 0 }}
              >
                {isSelected && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-[0.03]`} />
                )}
                {isSelected && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                  isSelected ? `bg-gradient-to-br ${role.gradient} shadow-lg` : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <h3 className="font-heading font-bold text-lg text-navy mb-1">{role.title}</h3>
                <p className="text-sm text-slate-500">{role.description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3 animate-fade-in-delay-3">
          <button
            onClick={handleContinue}
            disabled={!selected || saving}
            className={`group flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl transition-all ${
              selected
                ? 'bg-navy text-white hover:bg-navy-dark hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Setting up...' : 'Continue to Workspace'}
            {selected && !saving && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
          <button onClick={() => navigate('/workspace')} className="text-sm text-slate-400 hover:text-navy transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}