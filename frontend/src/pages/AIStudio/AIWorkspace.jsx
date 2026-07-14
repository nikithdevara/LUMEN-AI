import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Copy, Check, Download, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AIWorkspace({
  title,
  description,
  icon: Icon,
  generating,
  hasOutput,
  onGenerate,
  onSave,
  onDownload,
  onCopy,
  inputPanel,
  outputPanel
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Generation output has been copied.",
      });
    }
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave();
        toast({
          title: "Saved Successfully",
          description: "Generation draft saved to your workspace.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to save",
          description: err.message || "An unexpected error occurred."
        });
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button
          onClick={() => navigate('/ai-studio')}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-navy dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="w-6 h-6 rounded-lg bg-navy/10 dark:bg-white/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-navy dark:text-white" />
              </div>
            )}
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">AI Studio</span>
          </div>
          <h1 className="font-heading font-bold text-xl text-navy dark:text-white mt-0.5">{title}</h1>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Input Form Panel */}
        <div className="lg:col-span-5 animate-scale-in">
          <div className="glass-card p-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="font-heading font-bold text-sm text-navy dark:text-white mb-1">Configuration</h2>
              <p className="text-xs text-slate-400 mb-6">{description}</p>
              
              <div className="space-y-4">
                {inputPanel}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-navy text-white hover:bg-navy/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90 py-3 rounded-xl font-heading font-semibold text-sm transition-all transform active:scale-[0.98] shadow-md"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing & Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Output Preview Panel */}
        <div className="lg:col-span-7 animate-slide-in-right">
          <div className="glass-card p-6 h-full flex flex-col justify-between min-h-[450px] relative">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-sm text-navy dark:text-white">Workspace Preview</h3>
                
                {/* Actions row */}
                {hasOutput && (
                  <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 rounded-xl p-0.5">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-colors"
                      title="Copy Output"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {onDownload && (
                      <button
                        onClick={onDownload}
                        className="p-2 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onSave && (
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="p-2 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-colors"
                        title="Save Draft"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {generating ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-aiblue/20 blur-xl rounded-full animate-glow-pulse" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  </div>
                  <p className="text-sm font-heading font-semibold text-navy dark:text-white animate-pulse">LUMEN AI is thinking...</p>
                  <p className="text-xs text-aiblue dark:text-primary font-semibold mt-2.5 mb-1 bg-aiblue/5 dark:bg-primary/10 px-3 py-1 rounded-full border border-aiblue/10 dark:border-primary/10 inline-block animate-pulse">
                    Estimated time: 5-8 seconds
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">Connecting to Google Gemini 2.5 Pro to compile guidelines and design templates.</p>
                </div>
              ) : hasOutput ? (
                <div className="space-y-4 animate-fade-in">
                  {outputPanel}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-28 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm font-heading font-semibold text-navy dark:text-white">Workspace Empty</p>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-xs">Fill out the prompt configurations on the left to generate content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
