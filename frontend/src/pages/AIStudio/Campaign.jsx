import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function CampaignGenerator() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [topic, setTopic] = useState('Spotting Hospitality Indicators');
  const [audience, setAudience] = useState('Hotel Front Desk & Cleaning Staff');
  const [location, setLocation] = useState('Metro Area Hospitality Districts');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.generateCampaign({
        topic: topic,
        target_audience: audience,
        location: location
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
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Campaign Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Audience</label>
        <input
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-5">
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20">
        <h4 className="font-heading font-extrabold text-lg text-navy dark:text-white leading-tight">{output.campaign_name}</h4>
        <p className="text-xs text-slate-400 mt-1">Focus Area: {topic} | Location: {location}</p>
      </div>

      {/* Objectives & Impact */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Campaign Objectives</p>
          <ul className="list-disc pl-4 space-y-1">
            {(output.objectives || []).map((obj, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-300">{obj}</li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Expected Impact</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{output.expected_impact}</p>
        </div>
      </div>

      {/* Timeline Checkpoints */}
      <div className="glass-card p-5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Timeline & Execution Roadmap</p>
        <div className="space-y-3">
          {(output.timeline || []).map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-xs font-bold text-aiblue dark:text-primary whitespace-nowrap bg-aiblue/5 dark:bg-white/5 px-2.5 py-0.5 rounded-lg h-fit">
                Checkpoint {idx + 1}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Plan & Assets */}
      <div className="glass-card p-5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Community Workshop Outline</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          {output.workshop_plan}
        </p>
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="AI Campaign Generator"
      description="Create multi-week prevention programs, workshops, checklists, and local event outlines."
      icon={Flag}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
