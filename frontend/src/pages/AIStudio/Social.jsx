import React, { useState } from 'react';
import { Share2, Instagram, Linkedin, Facebook, MessageSquare, Calendar } from 'lucide-react';
import AIWorkspace from './AIWorkspace';

export default function SocialMediaGenerator() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(null);
  const [activePlatform, setActivePlatform] = useState('instagram');

  // Form states
  const [topic, setTopic] = useState('Spotting Human Trafficking Red Flags');
  const [tone, setTone] = useState('informative');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await db.aiStudio.generateSocial({
        topic: topic,
        tone: tone
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
      let copyText = '';
      if (activePlatform === 'instagram') {
        copyText = `Instagram Caption: ${output.instagram?.caption}\nHashtags: ${output.instagram?.hashtags?.join(' ')}`;
      } else if (activePlatform === 'linkedin') {
        copyText = `LinkedIn Post: ${output.linkedin?.post_body}\nHashtags: ${output.linkedin?.hashtags?.join(' ')}`;
      } else if (activePlatform === 'facebook') {
        copyText = `Facebook Post: ${output.facebook?.post_body}\nHashtags: ${output.facebook?.hashtags?.join(' ')}`;
      } else if (activePlatform === 'x') {
        copyText = output.x_posts?.join('\n---\n') || '';
      }
      navigator.clipboard.writeText(copyText);
    }
  };

  const inputPanel = (
    <>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Post Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {['informative', 'urgent', 'empathetic', 'community-focused'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </>
  );

  const outputPanel = output && (
    <div className="space-y-5">
      {/* Platform Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 pb-2">
        {[
          { id: 'instagram', label: 'Instagram', icon: Instagram },
          { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
          { id: 'facebook', label: 'Facebook', icon: Facebook },
          { id: 'x', label: 'X (Twitter)', icon: MessageSquare }
        ].map((plat) => {
          const Icon = plat.icon;
          return (
            <button
              key={plat.id}
              onClick={() => setActivePlatform(plat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activePlatform === plat.id
                  ? 'bg-navy text-white dark:bg-white/10 dark:text-white'
                  : 'text-slate-500 hover:text-navy dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {plat.label}
            </button>
          );
        })}
      </div>

      {/* Selected Platform Output */}
      <div className="glass-card p-5 min-h-[150px]">
        {activePlatform === 'instagram' && output.instagram && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Caption</p>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {output.instagram.caption}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Slide Carousel Content</p>
              <div className="space-y-1">
                {(output.instagram.carousel_slides || []).map((slide, i) => (
                  <p key={i} className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-navy dark:text-white">Slide {i + 1}:</span> {slide}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Hashtags</p>
              <div className="flex flex-wrap gap-1.5">
                {(output.instagram.hashtags || []).map((tag, idx) => (
                  <span key={idx} className="text-xs text-aiblue font-semibold bg-aiblue/5 dark:bg-primary/10 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'linkedin' && output.linkedin && (
          <div className="space-y-3">
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-line">
              {output.linkedin.post_body}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(output.linkedin.hashtags || []).map((tag, idx) => (
                <span key={idx} className="text-xs text-aiblue font-semibold bg-aiblue/5 dark:bg-primary/10 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activePlatform === 'facebook' && output.facebook && (
          <div className="space-y-3">
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-line">
              {output.facebook.post_body}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(output.facebook.hashtags || []).map((tag, idx) => (
                <span key={idx} className="text-xs text-aiblue font-semibold bg-aiblue/5 dark:bg-primary/10 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activePlatform === 'x' && output.x_posts && (
          <div className="space-y-3">
            {(output.x_posts || []).map((post, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{post}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Calendar */}
      {output.content_calendar && (
        <div className="glass-card p-5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Proposed Content Calendar
          </p>
          <div className="space-y-2">
            {(output.content_calendar || []).map((cal, idx) => (
              <div key={idx} className="flex gap-4 items-baseline">
                <span className="text-xs font-bold text-navy dark:text-white min-w-[70px]">{cal.day}</span>
                <span className="text-xs text-slate-500">{cal.theme}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AIWorkspace
      title="AI Social Media Generator"
      description="Create captions, slider carousels, and hashtag list recommendations for Instagram, Facebook, LinkedIn, and X."
      icon={Share2}
      generating={generating}
      hasOutput={!!output}
      onGenerate={handleGenerate}
      onCopy={handleCopy}
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
