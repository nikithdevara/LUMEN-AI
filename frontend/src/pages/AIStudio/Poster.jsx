import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function PosterGenerator() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [campaignName, setCampaignName] = useState('Safety First Campaign');
  const [posterType, setPosterType] = useState('College Campaign');
  const [tone, setTone] = useState('Professional');
  const [colors, setColors] = useState('Vibrant Red and Navy');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.generatePoster({
        campaign_name: campaignName,
        poster_type: posterType
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
      navigator.clipboard.writeText(
        `Headline: ${output.headline}\nSubtitle: ${output.subtitle}\nCTA: ${output.cta}\nImage Prompt: ${output.image_prompt}`
      );
    }
  };

  const inputPanel = (
    <>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Campaign Name</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Poster Type</label>
        <select
          value={posterType}
          onChange={(e) => setPosterType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {['College Campaign', 'School Campaign', 'NGO Campaign', 'Hotel Awareness', 'Community Event', 'Social Awareness'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tone</label>
        <input
          type="text"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Color Palette Preferences</label>
        <input
          type="text"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-4">
      {/* Poster Preview */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Live layout breakdown</p>
        <h4 className="font-heading font-extrabold text-xl text-navy dark:text-white leading-tight">{output.headline}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{output.subtitle}</p>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-aiblue uppercase tracking-wider">{output.cta}</span>
        </div>
      </div>

      {/* Details list */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Typography</p>
          <p className="text-xs text-navy dark:text-white mt-1">Header: {output.typography?.header_font || 'Outfit'}</p>
          <p className="text-xs text-slate-500 mt-0.5">Body: {output.typography?.body_font || 'Inter'}</p>
        </div>

        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Colors Suggested</p>
          <div className="flex items-center gap-1.5 mt-2">
            {(output.color_palette || []).map((c, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border border-slate-200/50"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Prompt */}
      <div className="glass-card p-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Graphic/Illustration Prompt</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          {output.image_prompt}
        </p>
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="AI Poster Generator"
      description="Design headlines, typography, color palettes, and descriptive prompts to create awareness posters."
      icon={ImageIcon}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
