import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (!query) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (!query) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center h-9 rounded-xl border transition-all duration-500 ease-spring-nav overflow-hidden',
        isOpen
          ? 'w-48 sm:w-60 bg-white/10 dark:bg-white/5 border-slate-200/50 dark:border-white/10 px-3'
          : 'w-9 bg-transparent border-transparent justify-center hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer'
      )}
      onClick={() => !isOpen && handleToggle()}
    >
      <button
        onClick={(e) => {
          if (isOpen) {
            e.stopPropagation();
            handleToggle();
          }
        }}
        className="flex items-center justify-center p-1 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search LUMEN AI..."
        className={cn(
          'w-full bg-transparent border-none text-xs text-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 ml-2 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none w-0 ml-0'
        )}
      />

      {isOpen && query && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className="p-1 text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
