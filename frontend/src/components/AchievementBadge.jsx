import React from 'react';
import { cn } from '@/lib/utils';
import { Award, BookOpen, Brain, Shield, Heart, Users, Trophy, Target, Star, Zap, Lightbulb } from 'lucide-react';

const iconMap = {
  Award, BookOpen, Brain, Shield, Heart, Users, Trophy, Target, Star, Zap, Lightbulb
};

const colorMap = {
  gold: { grad: 'from-gold/20 to-gold/5', icon: 'from-gold to-gold-dark', text: 'text-gold-dark', border: 'border-gold/30' },
  aiblue: { grad: 'from-aiblue/15 to-indigo-500/5', icon: 'from-aiblue to-indigo-500', text: 'text-aiblue', border: 'border-aiblue/30' },
  success: { grad: 'from-success/15 to-emerald-500/5', icon: 'from-success to-emerald-600', text: 'text-success', border: 'border-success/30' },
  navy: { grad: 'from-navy/10 to-navy/5', icon: 'from-navy to-navy-light', text: 'text-navy', border: 'border-navy/30' }
};

export default function AchievementBadge({ achievement, size = 'md' }) {
  const colors = colorMap[achievement.color] || colorMap.gold;
  const Icon = iconMap[achievement.icon] || Award;
  const earned = achievement.earned;

  const sizeMap = {
    sm: { container: 'p-3', iconWrap: 'w-10 h-10', icon: 'w-5 h-5', title: 'text-xs', desc: 'hidden' },
    md: { container: 'p-4', iconWrap: 'w-12 h-12', icon: 'w-6 h-6', title: 'text-sm', desc: 'text-xs' },
    lg: { container: 'p-5', iconWrap: 'w-14 h-14', icon: 'w-7 h-7', title: 'text-base', desc: 'text-sm' }
  };
  const s = sizeMap[size];

  return (
    <div className={cn(
      'relative rounded-2xl border-2 text-center transition-all',
      earned
        ? cn('bg-gradient-to-br', colors.grad, colors.border, 'shadow-lg dark:shadow-black/30')
        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-60 grayscale',
      s.container
    )}>
      <div className="flex flex-col items-center gap-2">
        <div className={cn(
          'rounded-full flex items-center justify-center bg-gradient-to-br shadow-sm',
          earned ? colors.icon : 'bg-slate-200 dark:bg-white/10',
          s.iconWrap
        )}>
          <Icon className={cn(s.icon, earned ? 'text-white' : 'text-slate-400 dark:text-slate-500')} />
        </div>
        <h4 className={cn('font-heading font-semibold', s.title)}>{achievement.title}</h4>
        {s.desc !== 'hidden' && <p className={cn('text-muted-foreground', s.desc)}>{achievement.description}</p>}
      </div>
    </div>
  );
}