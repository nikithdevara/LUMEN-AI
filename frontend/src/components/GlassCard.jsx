import React from 'react';
import { cn } from '@/lib/utils';

export default function GlassCard({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(30,58,95,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        hover && 'transition-all duration-300 hover:shadow-[0_16px_48px_rgba(30,58,95,0.1)] dark:hover:shadow-[0_16px_48px_rgba(56,189,248,0.1)] hover:-translate-y-1 hover:border-white/80 dark:hover:border-aiblue-light/30',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}