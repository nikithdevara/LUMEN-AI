import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const getInitials = () => {
    if (!user) return 'U';
    const emailStr = user.email || '';
    return emailStr.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center justify-center rounded-full hover:ring-2 hover:ring-navy/20 dark:hover:ring-white/20 transition-all duration-300 transform active:scale-95"
          aria-label="User menu"
        >
          <Avatar className="w-8 h-8 border border-slate-200/50 dark:border-white/10 shadow-sm">
            <AvatarFallback className="bg-navy/10 text-navy dark:bg-white/10 dark:text-white text-xs font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 glass border border-slate-200/50 dark:border-white/10 shadow-xl rounded-2xl p-1.5 mt-2 animate-fade-in"
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-semibold text-navy dark:text-white truncate">
              {user?.full_name || user?.email || 'Active Trainee'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {user?.email || 'lumen@lumen.ai'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-white/10" />
        
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            My Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Performance Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-white/10" />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/5 cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
