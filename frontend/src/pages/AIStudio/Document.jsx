import React, { useState } from 'react';
import { FileText, Award } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function DocumentGenerator() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);

  // Form states
  const [docType, setDocType] = useState('Volunteer Handbook');
  const [topic, setTopic] = useState('Recognizing and Reporting Exploitation Indicators');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.generateDocument({
        document_type: docType,
        topic: topic
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
      navigator.clipboard.writeText(output.markdown_content || output.title);
    }
  };

  const inputPanel = (
    <>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {['Awareness Guide', 'Report', 'Workshop Manual', 'Volunteer Handbook', 'Workshop Guide'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Document Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-5">
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20">
        <h4 className="font-heading font-extrabold text-lg text-navy dark:text-white leading-tight">{output.title}</h4>
        <p className="text-xs text-slate-400 mt-1">Author: {output.metadata?.author || 'LUMEN AI'} | Version: {output.metadata?.version || '1.0'}</p>
      </div>

      {/* Sections overview */}
      <div className="glass-card p-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Sections Summary</p>
        <div className="space-y-2">
          {(output.structured_sections || []).map((section, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-navy dark:text-white">{section.header}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {(section.summary_bullets || []).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Document markdown content body */}
      <div className="glass-card p-5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Markdown Content</p>
        <pre className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 overflow-x-auto max-h-96">
          {output.markdown_content}
        </pre>
      </div>
    </div>
  );

  return (
    <AIWorkspace
      title="AI Document Generator"
      description="Write policies, educational brochures, training booklets, and first-responder guidelines in structured Markdown."
      icon={FileText}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
