import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
];

export default function ThemeToggle({ className = '' }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`p-2 rounded-xl border border-transparent hover:border-slate-200/50 dark:hover:border-white/10 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all duration-300 transform active:scale-95 ${className}`}
          aria-label="Toggle theme"
        >
          <CurrentIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-navy dark:group-hover:text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 glass border border-slate-200/50 dark:border-white/10 shadow-xl rounded-2xl p-1.5 mt-2 animate-fade-in"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                active
                  ? 'text-navy dark:text-white bg-slate-100/50 dark:bg-white/5 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50/50 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {opt.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
