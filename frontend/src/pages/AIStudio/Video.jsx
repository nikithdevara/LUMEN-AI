import React, { useState } from 'react';
import { Video as VideoIcon, Film, Music } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function VideoScriptGenerator() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [topic, setTopic] = useState('Recognizing Signs of Coercion in Public Centers');
  const [formatType, setFormatType] = useState('Short Reel');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.generateVideo({
        topic: topic,
        format_type: formatType
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
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Video Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Video Format</label>
        <select
          value={formatType}
          onChange={(e) => setFormatType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {['Short Reel', 'Workshop Video', 'Public Awareness Video'].map(format => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-5">
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20">
        <h4 className="font-heading font-extrabold text-lg text-navy dark:text-white leading-tight">{output.video_title}</h4>
        <p className="text-xs text-slate-400 mt-1">Format: {output.format} | Topic: {topic}</p>
      </div>

      {/* Narrative Summary */}
      <div className="glass-card p-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Narrative Summary</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{output.narrative_summary}</p>
      </div>

      {/* Storyboard list */}
      <div className="space-y-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Storyboard scenes</p>
        
        {(output.storyboard || []).map((scene) => (
          <div key={scene.scene_number} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h5 className="font-heading font-bold text-xs text-navy dark:text-white">
                Scene {scene.scene_number}
              </h5>
              <Film className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Visual Description */}
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Visual Prompt</p>
              <p className="text-xs text-slate-500 leading-relaxed italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {scene.visual_description}
              </p>
            </div>

            {/* Audio Notes & Narration */}
            <div className="grid md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Voiceover / Narration</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{scene.narration}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Music className="w-3 h-3 text-slate-400" /> Audio & Sound Effects
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{scene.audio_notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA closing details */}
      <div className="glass-card p-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Call to Action (Closing)</p>
        <p className="text-xs text-navy dark:text-white font-semibold">{output.call_to_action}</p>
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="AI Video Script Generator"
      description="Create video storyboards, narration lines, sound effects logs, and visual instructions."
      icon={VideoIcon}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
