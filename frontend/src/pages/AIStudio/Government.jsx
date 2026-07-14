const db = globalThis.__B44_DB__ || {};

import React, { useState } from 'react';
import { Building2, Phone, Shield, FileText } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function GovernmentResourceEngine() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [region, setRegion] = useState('United States');
  const [role, setRole] = useState('Student');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.recommendGovernment({
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
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Jurisdiction / Country</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">User Role Track</label>
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
      {/* Hotlines */}
      <div className="space-y-3">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Official Helplines</p>
        
        {(output.hotlines || []).map((hotline, idx) => (
          <div key={idx} className="glass-card p-4 flex items-center justify-between border-l-4 border-l-aiblue">
            <div>
              <h5 className="font-heading font-bold text-xs text-navy dark:text-white">{hotline.agency}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Availability: {hotline.hours}</p>
            </div>
            <a
              href={`tel:${hotline.number}`}
              className="flex items-center gap-1.5 bg-aiblue/10 text-aiblue hover:bg-aiblue/20 dark:bg-primary/20 dark:text-primary px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              {hotline.number}
            </a>
          </div>
        ))}
      </div>

      {/* Assistance & Programs */}
      <div className="glass-card p-5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400" /> Welfare & Relief Programs
        </p>
        <div className="space-y-2">
          {(output.assistance_programs || []).map((prog, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              {prog}
            </div>
          ))}
        </div>
      </div>

      {/* Policy Books & Legal Contacts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" /> Guidelines
          </p>
          <ul className="list-disc pl-4 space-y-1">
            {(output.policy_handbooks || []).map((doc, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300">{doc}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Legal/DOJ Contacts</p>
          <ul className="list-disc pl-4 space-y-1">
            {(output.legal_contacts || []).map((contact, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300">{contact}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="Government Resource Engine"
      description="Query federal hotline directories, legal assistance programs, and state policy handbooks."
      icon={Building2}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
