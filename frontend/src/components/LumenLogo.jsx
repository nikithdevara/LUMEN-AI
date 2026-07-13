import React from 'react';

export default function LumenLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="lumenGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="lumenGold" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4B942" />
              <stop offset="1" stopColor="#F0A030" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="9" fill="url(#lumenGrad)" />
          <circle cx="20" cy="20" r="9" fill="url(#lumenGrad)" opacity="0.3" className="animate-glow-pulse" style={{ transformOrigin: 'center' }} />
          <g stroke="url(#lumenGold)" strokeWidth="2.2" strokeLinecap="round">
            <line x1="20" y1="3" x2="20" y2="7" />
            <line x1="20" y1="33" x2="20" y2="37" />
            <line x1="3" y1="20" x2="7" y2="20" />
            <line x1="33" y1="20" x2="37" y2="20" />
            <line x1="8" y1="8" x2="10.5" y2="10.5" />
            <line x1="29.5" y1="29.5" x2="32" y2="32" />
            <line x1="32" y1="8" x2="29.5" y2="10.5" />
            <line x1="10.5" y1="29.5" x2="8" y2="32" />
          </g>
        </svg>
      </div>
      {showText && (
        <span className="font-heading font-bold text-lg tracking-tight text-navy">
          LUMEN<span className="gradient-text-ai"> AI</span>
        </span>
      )}
    </div>
  );
}