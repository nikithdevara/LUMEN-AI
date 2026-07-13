import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNav from './FloatingNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 transition-colors duration-300">
      <FloatingNav />
      <main className="pt-24 pb-12">
        <Outlet />
      </main>
    </div>
  );
}