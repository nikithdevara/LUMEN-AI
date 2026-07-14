import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, Library, User, Menu, X, Bell, Sparkles } from 'lucide-react';
import GlassContainer from './GlassContainer';
import NavItem from './NavItem';
import SearchControl from './SearchControl';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import LumenLogo from '../LumenLogo';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Workspace', path: '/workspace', icon: LayoutDashboard },
  { label: 'Learn', path: '/recommendations', icon: Lightbulb },
  { label: 'AI Studio', path: '/ai-studio', icon: Sparkles },
  { label: 'Resources', path: '/resources', icon: Library },
  { label: 'Profile', path: '/profile', icon: User }
];

export default function FloatingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <GlassContainer className="animate-fade-in">
        {/* Left Side: Brand Logo */}
        <Link
          to="/workspace"
          className="flex items-center gap-2 pl-1 select-none group transform active:scale-95 transition-transform"
        >
          <LumenLogo size={30} showText={false} />
          <span className="font-heading font-extrabold text-base tracking-tight text-navy dark:text-white sm:block hidden">
            LUMEN<span className="text-aiblue">AI</span>
          </span>
        </Link>

        {/* Center: Desktop Nav Navigation Items */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/30 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 rounded-2xl px-1.5 py-1 backdrop-blur-md">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              label={item.label}
              path={item.path}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Right Side: Quick Action Utilities */}
        <div className="flex items-center gap-2">
          {/* Desktop Only Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <SearchControl />
            
            {/* Soft Notification Bell Indicator */}
            <button
              className="p-2 rounded-xl text-slate-500 hover:text-navy dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all transform active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            
            <ThemeToggle />
          </div>

          <div className="w-[1px] h-5 bg-slate-200/50 dark:bg-white/10 hidden sm:block" />

          {/* User Profile Avatar Dropdown */}
          <div className="hidden sm:block">
            <UserMenu />
          </div>

          {/* Mobile Actions Menu Wrapper */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <SearchControl />
            <ThemeToggle />
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-navy dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all transform active:scale-95"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </GlassContainer>

      {/* Mobile Drawer Overlay panel */}
      {mobileOpen && (
        <div className="md:hidden fixed top-24 left-4 right-4 z-40 glass rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-2xl p-4 animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all transform active:scale-[0.98]',
                    active
                      ? 'bg-navy text-white shadow-md dark:bg-white/10 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="h-[1px] bg-slate-200/50 dark:bg-white/10 my-2" />
            
            {/* Sign Out CTA in mobile menu */}
            <UserMenu />
          </div>
        </div>
      )}
    </>
  );
}
