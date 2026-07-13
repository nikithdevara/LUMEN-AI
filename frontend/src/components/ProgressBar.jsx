import React from 'react';
import { cn } from '@/lib/utils';

export default function ProgressBar({ value = 0, className = '', color = 'ai', height = 'h-2' }) {
  const colorMap = {
    ai: 'bg-gradient-to-r from-aiblue to-indigo-500',
    gold: 'bg-gradient-to-r from-gold to-gold-dark',
    success: 'bg-gradient-to-r from-success to-emerald-500',
    navy: 'bg-gradient-to-r from-navy to-navy-light'
  };

  return (
    <div className={cn('w-full bg-slate-200/60 dark:bg-white/10 rounded-full overflow-hidden', height, className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', colorMap[color] || colorMap.ai)}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}