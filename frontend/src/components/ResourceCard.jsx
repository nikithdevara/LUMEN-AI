import React from 'react';
import { BookOpen, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeColors = {
  'Article': 'bg-aiblue/10 text-aiblue',
  'Guide': 'bg-gold/15 text-gold-dark',
  'Video': 'bg-purple-100 text-purple-600',
  'Awareness Material': 'bg-success/10 text-success'
};

export default function ResourceCard({ resource, onClick }) {
  const typeColor = typeColors[resource.type] || typeColors['Article'];

  return (
    <div
      onClick={onClick}
      className="group bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(30,58,95,0.06)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(30,58,95,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      {resource.cover_image && (
        <div className="relative h-32 overflow-hidden">
          <img src={resource.cover_image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
          <span className={cn('absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md', typeColor)}>
            {resource.type}
          </span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="font-medium text-navy/70">{resource.category}</span>
          {resource.duration && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resource.duration}</span>
            </>
          )}
        </div>
        <h3 className="font-heading font-semibold text-foreground mb-1.5 group-hover:text-aiblue transition-colors line-clamp-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{resource.description}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex gap-1.5">
            {resource.tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-md">{tag}</span>
            ))}
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-aiblue transition-colors" />
        </div>
      </div>
    </div>
  );
}