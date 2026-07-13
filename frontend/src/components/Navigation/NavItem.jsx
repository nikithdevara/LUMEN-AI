import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function NavItem({ label, path, icon: Icon }) {
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <Link
      to={path}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform active:scale-95 group overflow-hidden',
        active
          ? 'text-navy dark:text-white font-semibold'
          : 'text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white'
      )}
    >
      {/* Background active/hover pill */}
      <span
        className={cn(
          'absolute inset-0 rounded-xl transition-all duration-300 -z-10',
          active
            ? 'bg-navy/10 dark:bg-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)] border border-navy/5 dark:border-white/10'
            : 'bg-transparent group-hover:bg-slate-100/50 dark:group-hover:bg-white/5 opacity-0 group-hover:opacity-100'
        )}
      />
      
      {Icon && (
        <Icon
          className={cn(
            'w-4 h-4 transition-transform duration-300 group-hover:scale-110',
            active
              ? 'text-navy dark:text-aiblue'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-navy dark:group-hover:text-white'
          )}
        />
      )}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
