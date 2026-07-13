import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function GlassContainer({ children, className = '' }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-spring-nav fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl',
        isScrolled
          ? 'top-3 h-14 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/10 dark:border-white/5 bg-white/10 dark:bg-slate-950/40 backdrop-blur-2xl'
          : 'top-6 h-18 rounded-[2rem] shadow-[0_8px_32px_rgba(30,58,95,0.04)] border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl',
        className
      )}
    >
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 relative">
        {children}
      </div>
    </div>
  );
}
