import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, Image as ImageIcon, Flag, Presentation, FileText, Share2, Video, Heart, Building2, ArrowRight } from 'lucide-react';

const studioTools = [
  {
    id: 'poster',
    title: 'Poster Generator',
    description: 'Design educational awareness posters, headlines, CTAs, layout configurations, and graphic prompts.',
    icon: ImageIcon,
    category: 'Content Generation',
    path: '/ai-studio/poster',
    color: 'from-blue-500/10 to-indigo-500/10 text-indigo-500'
  },
  {
    id: 'campaign',
    title: 'Campaign Generator',
    description: 'Structure comprehensive public awareness campaigns, objectives, timelines, and expected impact metrics.',
    icon: Flag,
    category: 'Planning',
    path: '/ai-studio/campaign',
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500'
  },
  {
    id: 'presentation',
    title: 'Presentation Generator',
    description: 'Generate structured slide layouts, Speaker scripts, visual suggestions, and agenda structures.',
    icon: Presentation,
    category: 'Content Generation',
    path: '/ai-studio/presentation',
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600'
  },
  {
    id: 'document',
    title: 'Document Generator',
    description: 'Generate reports, guidelines, workshop handbooks, and educational booklets in clean Markdown.',
    icon: FileText,
    category: 'Content Generation',
    path: '/ai-studio/document',
    color: 'from-purple-500/10 to-pink-500/10 text-purple-500'
  },
  {
    id: 'social',
    title: 'Social Media Generator',
    description: 'Draft captions, hashtags, content calendars, and slides for Instagram, LinkedIn, Facebook, and X.',
    icon: Share2,
    category: 'Content Generation',
    path: '/ai-studio/social',
    color: 'from-cyan-500/10 to-sky-500/10 text-cyan-500'
  },
  {
    id: 'video',
    title: 'Video Script Generator',
    description: 'Build scripts, narration lines, storyboard breakdowns, and camera notes for shorts, reels, or events.',
    icon: Video,
    category: 'Content Generation',
    path: '/ai-studio/video',
    color: 'from-red-500/10 to-rose-500/10 text-red-500'
  },
  {
    id: 'ngo',
    title: 'NGO Resource Engine',
    description: 'Recommend nearby NGOs, volunteer pipelines, training workshops, and community events.',
    icon: Heart,
    category: 'Resources',
    path: '/ai-studio/ngo',
    color: 'from-pink-500/10 to-rose-500/10 text-pink-500'
  },
  {
    id: 'government',
    title: 'Government Resources',
    description: 'Find official hotlines, state programs, policy handbooks, emergency aid portals, and legal guidelines.',
    icon: Building2,
    category: 'Resources',
    path: '/ai-studio/government',
    color: 'from-slate-500/10 to-zinc-500/10 text-slate-500'
  }
];

export default function AIStudioDashboard() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Content Generation', 'Planning', 'Resources'];

  const filteredTools = studioTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy dark:text-white">AI Content Studio</h1>
        </div>
        <p className="text-slate-500 max-w-xl">Create professional awareness content, timelines, script storyboards, guidelines, and localized resources driven by Google Gemini.</p>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 animate-fade-in-delay-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search awareness tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 dark:focus:ring-white/20 transition-all text-navy dark:text-white"
          />
        </div>

        {/* Category Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-navy text-white dark:bg-white/10 dark:text-white shadow-sm'
                  : 'bg-slate-100/50 dark:bg-white/5 text-slate-500 hover:text-navy dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of tools */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delay-2">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div key={tool.id} className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] active:scale-[0.99] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-navy dark:text-white group-hover:text-aiblue transition-colors">{tool.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tool.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-400 uppercase tracking-wide">
                  {tool.category}
                </span>
                <Link
                  to={tool.path}
                  className="flex items-center gap-1.5 text-xs font-semibold text-navy dark:text-white group-hover:translate-x-1 transition-transform"
                >
                  Launch Tool
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
