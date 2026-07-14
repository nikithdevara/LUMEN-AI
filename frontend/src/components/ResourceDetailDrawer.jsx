import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getResourceContent } from '@/data/resourceContents';
import { cn } from '@/lib/utils';

export default function ResourceDetailDrawer({ isOpen, onClose, resource }) {
  const [completed, setCompleted] = useState(false);

  // Derive rich content based on resource title
  const contentData = resource ? getResourceContent(resource.title) : null;
  const displayTitle = contentData?.title || resource?.title || 'Resource Guide';
  const displayCategory = contentData?.category || resource?.category || 'General';
  const displayDuration = contentData?.readingTime || resource?.duration || '5 min read';
  const displaySubtitle = contentData?.subtitle || resource?.description || '';

  const storageKey = resource ? `lumen_completed_${resource.id || resource.title}` : '';

  useEffect(() => {
    if (storageKey) {
      const isDone = localStorage.getItem(storageKey) === 'true';
      setCompleted(isDone);
    }
  }, [storageKey, isOpen]);

  if (!isOpen || !resource) return null;

  const handleMarkAsComplete = () => {
    if (!completed) {
      localStorage.setItem(storageKey, 'true');
      setCompleted(true);
      
      // Fire celebratory micro-interaction confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#F4B942', '#10B981', '#6366F1']
      });
    } else {
      localStorage.removeItem(storageKey);
      setCompleted(false);
    }
  };

  // Helper function to render paragraph or checklist rows
  const renderParagraph = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('☐') || trimmed.startsWith('-[ ]') || trimmed.startsWith('•')) {
        const cleaned = trimmed.replace(/^(☐|-\[ \]|•)\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-2.5 my-2.5 pl-1.5">
            {trimmed.startsWith('☐') || trimmed.startsWith('-[ ]') ? (
              <input 
                type="checkbox" 
                defaultChecked={completed}
                className="w-4 h-4 rounded border-slate-300 text-aiblue focus:ring-aiblue mt-1 cursor-pointer"
              />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-aiblue dark:bg-primary mt-2 flex-shrink-0" />
            )}
            <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{cleaned}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-navy/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-slate-200/50 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.15)] p-8 overflow-y-auto flex flex-col justify-between animate-slide-in-right h-full">
        
        {/* Main Scrolling Body */}
        <div>
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all transform active:scale-95"
            aria-label="Close reading view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="mt-4 mb-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg text-aiblue bg-aiblue/10 dark:text-primary dark:bg-primary/20">
                {displayCategory}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {displayDuration}
              </span>
              {completed && (
                <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2.5 py-1 rounded-lg font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-navy dark:text-white leading-tight">
              {displayTitle}
            </h2>

            {displaySubtitle && (
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                {displaySubtitle}
              </p>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800 my-6" />

          {/* Detailed Sections */}
          <div className="space-y-6">
            {contentData?.introduction && (
              <p className="text-slate-700 dark:text-slate-200 text-base font-medium leading-relaxed mb-6">
                {contentData.introduction}
              </p>
            )}

            {contentData?.sections?.map((sec, idx) => (
              <div key={idx} className="mt-4">
                <h3 className="font-heading font-bold text-base text-navy dark:text-white mb-2.5 flex items-center gap-2">
                  {sec.heading}
                </h3>
                <div className="text-slate-600 dark:text-slate-300">
                  {renderParagraph(sec.content)}
                </div>
              </div>
            ))}

            {/* If no sections mapped, fallback to card description */}
            {!contentData && (
              <div className="mt-6">
                <h3 className="font-heading font-bold text-base text-navy dark:text-white mb-2.5">
                  About this Resource
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {resource.description || 'This resource offers guidelines, learning tips, and safety instructions related to your role track. Please consult verification hotlines or administrators for direct reporting channels.'}
                </p>
              </div>
            )}
          </div>

          {/* Key Takeaway Highlight Box */}
          {contentData?.takeaway && (
            <div className="bg-aiblue/5 dark:bg-white/5 border border-aiblue/10 dark:border-white/10 rounded-2xl p-5 mt-8 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-navy dark:text-white mb-1">Key Takeaway</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {contentData.takeaway}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 flex-wrap">
          <button
            onClick={handleMarkAsComplete}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-heading font-semibold text-sm transition-all transform active:scale-98 shadow-sm",
              completed
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                : "bg-navy text-white hover:bg-navy/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90"
            )}
          >
            {completed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-success" /> Completed (Toggle to undo)
              </>
            ) : (
              <>
                Mark as Read
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl font-heading font-semibold text-sm text-slate-600 dark:text-slate-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
