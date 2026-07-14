const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';

import { Search, Filter, BookOpen, Clock, ArrowUpRight, Library, X } from 'lucide-react';
import ResourceCard from '@/components/ResourceCard';
import ResourceDetailDrawer from '@/components/ResourceDetailDrawer';

const types = ['All', 'Article', 'Guide', 'Video', 'Awareness Material'];
const categories = ['All', 'Learning Resources', 'Safety Guidelines', 'Community Actions', 'Awareness Materials'];

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await db.entities.Resource.list('-created_date', 100);
        setResources(res || []);
      } catch {
        // ignore
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = resources.filter(r => {
    const matchesSearch = !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const hasActiveFilters = search || typeFilter !== 'All' || categoryFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
            <Library className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy">Resource Library</h1>
        </div>
        <p className="text-slate-500 max-w-xl">Search and explore trusted articles, guides, videos, and awareness materials.</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources, topics, or tags..."
          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 text-sm text-navy placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-aiblue/30 focus:border-aiblue/30 transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5" /> Type
          </span>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t
                  ? 'bg-navy text-white'
                  : 'bg-white/60 text-slate-500 border border-slate-200 hover:bg-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5" /> Category
          </span>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === c
                  ? 'bg-aiblue text-white'
                  : 'bg-white/60 text-slate-500 border border-slate-200 hover:bg-white'
              }`}
            >
              {c}
            </button>
          ))}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-2 text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400">
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {filtered.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onClick={() => {
                setSelectedResource(resource);
                setDrawerOpen(true);
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-slate-300" />
          </div>
          <h3 className="font-heading font-semibold text-navy mb-1">No resources found</h3>
          <p className="text-sm text-slate-400 mb-4">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm font-semibold text-aiblue hover:text-aiblue-dark transition-colors">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Reader Drawer overlay pane */}
      <ResourceDetailDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        resource={selectedResource} 
      />
    </div>
  );
}