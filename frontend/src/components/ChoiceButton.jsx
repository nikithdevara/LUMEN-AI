import React from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

export default function ChoiceButton({ label, letter, selected, revealed, isRecommended, onClick, disabled }) {
  const showCorrect = revealed && isRecommended;
  const showIncorrect = revealed && selected && !isRecommended;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300',
        !revealed && !selected && 'border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-aiblue/50 dark:hover:border-aiblue-light/50 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]',
        selected && !revealed && 'border-aiblue bg-aiblue/5 dark:bg-aiblue/10',
        showCorrect && 'border-success bg-success/5 dark:bg-success/10',
        showIncorrect && 'border-destructive/40 bg-destructive/5 dark:bg-destructive/10',
        disabled && !selected && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors',
          !revealed && !selected && 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-aiblue/10 group-hover:text-aiblue',
          selected && !revealed && 'bg-aiblue text-white',
          showCorrect && 'bg-success text-white',
          showIncorrect && 'bg-destructive/80 text-white'
        )}>
          {showCorrect ? <Check className="w-4 h-4" /> : showIncorrect ? <AlertCircle className="w-4 h-4" /> : letter}
        </div>
        <span className="flex-1 text-sm font-medium text-foreground pt-0.5">{label}</span>
        {isRecommended && revealed && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-md">
            <Sparkles className="w-3 h-3" /> Recommended
          </span>
        )}
      </div>
    </button>
  );
}