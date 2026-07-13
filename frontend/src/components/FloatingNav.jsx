import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, Lightbulb, Library, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import LumenLogo from './LumenLogo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { label: 'Workspace', path: '/workspace', icon: LayoutDashboard },
  { label: 'Resources', path: '/resources', icon: Library },
  { label: 'Recommendations', path: '/recommendations', icon: Lightbulb },
  { label: 'Profile', path: '/profile', icon: User }
];

export default function FloatingNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
        <div className="glass rounded-2xl shadow-[0_8px_32px_rgba(30,58,95,0.08)] px-2 py-2 flex items-center justify-between">
          <Link to="/workspace" className="flex items-center gap-2 pl-2">
            <LumenLogo size={28} showText={false} />
            <span className="font-heading font-bold text-navy hidden sm:block">LUMEN<span className="gradient-text-ai"> AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-navy text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-navy'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:flex" />
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-500 hover:text-destructive hover:bg-destructive/5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-navy" /> : <Menu className="w-5 h-5 text-navy" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl shadow-lg p-3 animate-fade-in">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Theme</span>
              <ThemeToggle />
            </div>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1',
                    active ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100/80'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}