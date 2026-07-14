import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIAssistantCard({ title = 'AI Guide', children, className = '', onClose, streaming = false }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border border-aiblue/20 bg-gradient-to-br from-aiblue/5 via-white/80 to-indigo-500/5 dark:from-slate-900/40 dark:via-slate-900/95 dark:to-slate-950/40 dark:border-slate-800/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(59,130,246,0.08)]',
      className
    )}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-aiblue/8 rounded-full blur-3xl animate-glow-pulse" />
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
              {streaming && (
                <span className="absolute inset-0 rounded-xl bg-aiblue animate-ping opacity-20" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-navy">{title}</h3>
              <p className="text-xs text-muted-foreground">AI-powered guidance</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="text-sm text-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}