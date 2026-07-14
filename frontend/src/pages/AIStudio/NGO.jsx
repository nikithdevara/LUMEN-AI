const db = globalThis.__B44_DB__ || {};

import React, { useState } from 'react';
import { Heart, Landmark, Link as LinkIcon, Mail } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function NGOResourceEngine() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [region, setRegion] = useState('New York Metro');
  const [role, setRole] = useState('Volunteer');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.recommendNGO({
        region: region,
        role: role
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
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Region / City</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">User Role Focus</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {['Student', 'Parent', 'Hotel Staff', 'Volunteer'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-5">
      {/* NGOs List */}
      <div className="space-y-3">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recommended NGOs</p>
        
        {(output.ngo_recommendations || []).map((ngo, idx) => (
          <div key={idx} className="glass-card p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-4 h-4 text-pink-500" />
                <h5 className="font-heading font-bold text-sm text-navy dark:text-white">{ngo.name}</h5>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{ngo.focus}</p>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`mailto:${ngo.contact}`}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-navy dark:hover:text-white"
              >
                <Mail className="w-3 h-3" />
                {ngo.contact}
              </a>
              <a
                href={ngo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-navy dark:hover:text-white"
              >
                <LinkIcon className="w-3 h-3" />
                Website
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Volunteer Opportunities */}
      <div className="glass-card p-5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Volunteer Opportunities</p>
        <div className="space-y-3">
          {(output.volunteer_opportunities || []).map((opp, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-navy dark:text-white">{opp.title}</span>
              <span className="text-[10px] text-slate-400">NGO: {opp.ngo}</span>
              <p className="text-xs text-slate-500 mt-1">{opp.role_requirements}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programs and Events */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Awareness Initiatives</p>
          <ul className="list-disc pl-4 space-y-1">
            {(output.awareness_programs || []).map((prog, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300">{prog}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Community Events</p>
          <ul className="list-disc pl-4 space-y-1">
            {(output.community_events || []).map((event, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300">{event}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="NGO Resource Engine"
      description="Connect with regional anti-trafficking agencies, search advocacy roles, and browse community forums."
      icon={Heart}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
