const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BookOpen, Shield, Users, Megaphone, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import ResourceDetailDrawer from '@/components/ResourceDetailDrawer';

const categories = [
  { id: 'Learning Resources', icon: BookOpen, accent: 'aiblue', gradient: 'from-aiblue to-indigo-500' },
  { id: 'Safety Guidelines', icon: Shield, accent: 'success', gradient: 'from-success to-emerald-600' },
  { id: 'Community Actions', icon: Users, accent: 'gold', gradient: 'from-gold to-gold-dark' },
  { id: 'Awareness Materials', icon: Megaphone, accent: 'navy', gradient: 'from-navy to-navy-light' }
];

const fallbackRecs = {
  'Learning Resources': [
    { title: 'Understanding the Signs', desc: 'A comprehensive guide to recognizing subtle indicators in everyday environments.', duration: '8 min read', type: 'Guide' },
    { title: 'The Psychology of Exploitation', desc: 'Learn how manipulation and control work, and how to spot the patterns.', duration: '12 min read', type: 'Article' }
  ],
  'Safety Guidelines': [
    { title: 'Safe Response Framework', desc: 'Evidence-based steps for safe, responsible action when something feels wrong.', duration: '6 min read', type: 'Guide' },
    { title: 'Reporting Without Risk', desc: 'How to report concerns while protecting yourself and potential victims.', duration: '5 min read', type: 'Guide' }
  ],
  'Community Actions': [
    { title: 'Starting Awareness Conversations', desc: 'How to talk about awareness with friends, family, and colleagues.', duration: '10 min read', type: 'Resource' },
    { title: 'Building Support Networks', desc: 'Strengthen your community as a protective factor against exploitation.', duration: '7 min read', type: 'Article' }
  ],
  'Awareness Materials': [
    { title: 'Shareable Awareness Graphics', desc: 'Ready-to-share visuals for social media and community spaces.', duration: 'Collection', type: 'Material' },
    { title: 'Workplace Awareness Checklist', desc: 'A practical checklist for maintaining awareness in professional settings.', duration: '4 min read', type: 'Checklist' }
  ]
};

export default function Recommendations() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await db.entities.Resource.list('-created_date', 50);
        setResources(res || []);
      } catch {
        // ignore
      }
      setLoading(false);
    };
    load();
  }, []);

  const getRecsForCategory = (category) => {
    const filtered = resources.filter(r => r.category === category);
    return filtered.length > 0 ? filtered.slice(0, 2) : fallbackRecs[category];
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/15 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
          <span className="text-xs font-semibold text-gold-dark">Personalized for you</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy mb-3 text-balance">
          Your recommended next steps
        </h1>
        <p className="text-slate-500 max-w-xl">
          Based on your learning journey, here are curated resources and actions to deepen your awareness and create impact.
        </p>
      </div>

      {/* Category sections */}
      <div className="space-y-8 animate-fade-in-delay-1">
        {categories.map((cat, catIdx) => {
          const Icon = cat.icon;
          const recs = getRecsForCategory(cat.id);
          return (
            <div key={cat.id} className="animate-fade-in-up" style={{ animationDelay: `${0.15 + catIdx * 0.1}s`, opacity: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-heading font-bold text-lg text-navy">{cat.id}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {recs.map((rec, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedResource({
                        ...rec,
                        category: cat.id
                      });
                      setDrawerOpen(true);
                    }}
                    className="group glass-card p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        cat.accent === 'aiblue' ? 'text-aiblue bg-aiblue/10' :
                        cat.accent === 'success' ? 'text-success bg-success/10' :
                        cat.accent === 'gold' ? 'text-gold-dark bg-gold/10' :
                        'text-navy bg-navy/10'
                      }`}>
                        {rec.type || 'Guide'}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-aiblue transition-colors" />
                    </div>
                    <h3 className="font-heading font-semibold text-navy mb-1.5 group-hover:text-aiblue transition-colors">{rec.title}</h3>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{rec.desc || rec.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{rec.duration || '5 min read'}</span>
                      <span className="text-xs font-semibold text-aiblue group-hover:gap-1.5 flex items-center gap-1 transition-all">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Drawer overlay pane */}
      <ResourceDetailDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        resource={selectedResource} 
      />
    </div>
  );
}