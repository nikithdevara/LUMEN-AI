import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNavbar from './Navigation/FloatingNavbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <FloatingNavbar />
      <main className="pt-28 pb-12">
        <Outlet />
      </main>
    </div>
  );
}