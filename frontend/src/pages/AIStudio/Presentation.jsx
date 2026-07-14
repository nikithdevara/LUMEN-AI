import React, { useState } from 'react';
import { Presentation as PresentationIcon, Tv, BookOpen } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function PresentationGenerator() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [topic, setTopic] = useState('Recognizing Human Trafficking Indicators');
  const [slidesCount, setSlidesCount] = useState(5);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.generatePresentation({
        topic: topic,
        slides_count: parseInt(slidesCount) || 5
      });
      setOutput(data);
    } catch (err) {
      // Handled by Workspace toast
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    }
  };

  const inputPanel = (
    <>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Presentation Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Number of Slides</label>
        <input
          type="number"
          min="3"
          max="12"
          value={slidesCount}
          onChange={(e) => setSlidesCount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-5">
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20">
        <h4 className="font-heading font-extrabold text-lg text-navy dark:text-white leading-tight">{output.title}</h4>
        <p className="text-xs text-slate-400 mt-1">Total Slides: {slidesCount} | Topic: {topic}</p>
      </div>

      {/* Agenda */}
      <div className="glass-card p-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Agenda Overview</p>
        <div className="flex flex-wrap gap-2">
          {(output.agenda || []).map((item, i) => (
            <span key={i} className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-500">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Slides list */}
      <div className="space-y-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Slide Structure Breakdowns</p>
        
        {(output.slides || []).map((slide) => (
          <div key={slide.slide_number} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h5 className="font-heading font-bold text-sm text-navy dark:text-white">
                Slide {slide.slide_number}: {slide.title}
              </h5>
              <Tv className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Bullets */}
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Slide Bullets</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {(slide.bullets || []).map((b, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300">{b}</li>
                ))}
              </ul>
            </div>

            {/* Speaker Notes & Visuals */}
            <div className="grid md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-slate-400" /> Speaker Notes
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{slide.speaker_notes}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Visual Suggestions</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{slide.visual_suggestions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="AI Presentation Generator"
      description="Create visual slide outlines, speaker narration notes, and graphic design suggestions."
      icon={PresentationIcon}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
