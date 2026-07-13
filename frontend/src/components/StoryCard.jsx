import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Building2, Hotel, Users, Globe, Bus, Shield, Heart, Eye, Network } from 'lucide-react';
import ProgressBar from './ProgressBar';

const iconMap = {
  Sparkles, Building2, Hotel, Users, Globe, Bus, Shield, Heart, Eye, Network
};

const accentMap = {
  aiblue: { bg: 'bg-aiblue/5', icon: 'bg-aiblue/10 text-aiblue', bar: 'ai', text: 'text-aiblue' },
  gold: { bg: 'bg-gold/5', icon: 'bg-gold/15 text-gold-dark', bar: 'gold', text: 'text-gold-dark' },
  success: { bg: 'bg-success/5', icon: 'bg-success/10 text-success', bar: 'success', text: 'text-success' },
  navy: { bg: 'bg-navy/5', icon: 'bg-navy/10 text-navy', bar: 'navy', text: 'text-navy' }
};

export default function StoryCard({ experience, progress, onClick }) {
  const accent = accentMap[experience.accent_color] || accentMap.aiblue;
  const Icon = iconMap[experience.icon] || Sparkles;
  const progressPercent = progress?.progress_percent || 0;
  const status = progress?.status || 'not_started';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(30,58,95,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(30,58,95,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 cursor-pointer',
        'bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl'
      )}
    >
      <div className="relative h-28 overflow-hidden">
        {experience.cover_image ? (
          <img src={experience.cover_image} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className={cn('w-full h-full', accent.bg)} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
        <div className={cn('absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md', accent.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {status === 'completed' && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg bg-success/90 text-white backdrop-blur-md">
            Completed
          </span>
        )}
        {status === 'in_progress' && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg bg-aiblue/90 text-white backdrop-blur-md">
            In Progress
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className={cn('font-semibold', accent.text)}>{experience.category}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>{experience.difficulty_level}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>{experience.duration_minutes} min</span>
        </div>
        <h3 className="font-heading font-bold text-foreground text-lg mb-1.5 group-hover:text-aiblue transition-colors line-clamp-1">{experience.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{experience.description}</p>
        {progressPercent > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{status === 'completed' ? 'Completed' : 'Progress'}</span>
              <span className={cn('font-semibold', accent.text)}>{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} color={accent.bar} />
          </div>
        )}
      </div>
    </div>
  );
}