const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/lib/AuthContext';
import { Award, CheckCircle2, Clock, Bookmark, TrendingUp, Mail, Calendar, ArrowRight } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import AchievementBadge from '@/components/AchievementBadge';
import StoryCard from '@/components/StoryCard';

export default function Profile() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [exps, prog, achs, refs] = await Promise.all([
          db.entities.Experience.list('-order', 20),
          db.entities.UserProgress.list('-updated_date', 50),
          db.entities.Achievement.list('-created_date', 20),
          db.entities.Reflection.list('-created_date', 20)
        ]);
        setExperiences(exps || []);
        setProgress(prog || []);
        setAchievements(achs || []);
        setReflections(refs || []);
      } catch {
        // ignore
      }
      setLoading(false);
    };
    load();
  }, []);

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Learner';
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const completed = progress.filter(p => p.status === 'completed');
  const inProgress = progress.filter(p => p.status === 'in_progress');
  const saved = progress.filter(p => p.saved);
  const earnedAchievements = achievements.filter(a => a.earned);

  const completedExperiences = completed.map(p => ({
    experience: experiences.find(e => e.id === p.experience_id),
    progress: p
  })).filter(item => item.experience);

  const overallProgress = experiences.length > 0
    ? Math.round((completed.length / experiences.length) * 100)
    : 0;

  const joinDate = user?.created_date
    ? new Date(user.created_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Profile header */}
      <div className="glass-card p-8 mb-8 animate-fade-in-up overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-aiblue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy to-aiblue flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="font-heading font-extrabold text-2xl text-white">{initials}</span>
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-extrabold text-2xl text-navy mb-1">{userName}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {joinDate}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="font-heading font-extrabold text-2xl text-navy">{completed.length}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="font-heading font-extrabold text-2xl text-navy">{earnedAchievements.length}</p>
              <p className="text-xs text-slate-400">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-aiblue" />
            <span className="font-heading font-semibold text-navy text-sm">Learning Progress</span>
          </div>
          <span className="font-heading font-bold text-lg text-navy">{overallProgress}%</span>
        </div>
        <ProgressBar value={overallProgress} height="h-3" />
        <p className="text-xs text-slate-400 mt-2">
          {completed.length} of {experiences.length} experiences completed
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Completed experiences */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <h2 className="font-heading font-semibold text-navy text-sm">Completed Experiences</h2>
          </div>
          {completedExperiences.length > 0 ? (
            <div className="space-y-2">
              {completedExperiences.map(({ experience, progress: p }) => (
                <Link key={experience.id} to={`/story/${experience.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate group-hover:text-aiblue transition-colors">{experience.title}</p>
                    <p className="text-xs text-slate-400">{experience.category}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-aiblue transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">No experiences completed yet</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-gold" />
            <h2 className="font-heading font-semibold text-navy text-sm">Achievements</h2>
          </div>
          {earnedAchievements.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {earnedAchievements.map((ach) => (
                <AchievementBadge key={ach.id} achievement={ach} size="sm" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">Complete experiences to earn badges</p>
            </div>
          )}
        </div>

        {/* In progress */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-aiblue" />
            <h2 className="font-heading font-semibold text-navy text-sm">In Progress</h2>
          </div>
          {inProgress.length > 0 ? (
            <div className="space-y-3">
              {inProgress.map((p) => {
                const exp = experiences.find(e => e.id === p.experience_id);
                if (!exp) return null;
                return (
                  <Link key={p.id} to={`/story/${exp.id}`} className="block group">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-sm font-medium text-navy group-hover:text-aiblue transition-colors truncate">{exp.title}</p>
                      <span className="text-xs font-semibold text-aiblue">{p.progress_percent}%</span>
                    </div>
                    <ProgressBar value={p.progress_percent} height="h-1.5" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">No experiences in progress</p>
            </div>
          )}
        </div>

        {/* Saved resources */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-4 h-4 text-aiblue" />
            <h2 className="font-heading font-semibold text-navy text-sm">Saved Resources</h2>
          </div>
          {saved.length > 0 ? (
            <div className="space-y-2">
              {saved.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-aiblue/10 flex items-center justify-center flex-shrink-0">
                    <Bookmark className="w-3.5 h-3.5 text-aiblue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{item.experience_title}</p>
                    <p className="text-xs text-slate-400">{item.progress_percent}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <Bookmark className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">No saved resources yet</p>
              <Link to="/resources" className="inline-block mt-2 text-xs font-semibold text-aiblue hover:text-aiblue-dark transition-colors">
                Browse library →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}