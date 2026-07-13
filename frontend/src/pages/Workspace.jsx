const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/lib/AuthContext';
import { Sparkles, ArrowRight, TrendingUp, Bookmark, Award, Play, Clock, CheckCircle2, Flame } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import ProgressBar from '@/components/ProgressBar';
import AchievementBadge from '@/components/AchievementBadge';

export default function Workspace() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exps, prog, achs] = await Promise.all([
          db.entities.Experience.list('-order', 20),
          db.entities.UserProgress.list('-updated_date', 50),
          db.entities.Achievement.list('-created_date', 20)
        ]);
        setExperiences(exps || []);
        setProgress(prog || []);
        setAchievements(achs || []);
      } catch {
        // If tables are empty, that's fine
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const userName = user?.full_name || user?.email?.split('@')[0] || 'there';
  const firstName = userName.charAt(0).toUpperCase() + userName.slice(1).split(' ')[0];

  const inProgress = progress.filter(p => p.status === 'in_progress');
  const completed = progress.filter(p => p.status === 'completed');
  const savedResources = progress.filter(p => p.saved);
  const earnedAchievements = achievements.filter(a => a.earned);

  const currentExperience = inProgress[0]
    ? experiences.find(e => e.id === inProgress[0].experience_id)
    : null;
  const currentProgress = inProgress[0];

  const recommended = experiences.filter(e =>
    !progress.some(p => p.experience_id === e.id && p.status === 'completed')
  ).slice(0, 3);

  const overallProgress = experiences.length > 0
    ? Math.round((completed.length / experiences.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Welcome */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-aiblue">Welcome back</span>
          <Flame className="w-4 h-4 text-gold" />
        </div>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy mb-2">
          Continue your learning journey, {firstName}
        </h1>
        <p className="text-slate-500">Pick up where you left off or explore a new scenario.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'success' },
              { label: 'In Progress', value: inProgress.length, icon: Play, color: 'aiblue' },
              { label: 'Saved', value: savedResources.length, icon: Bookmark, color: 'gold' },
              { label: 'Achievements', value: earnedAchievements.length, icon: Award, color: 'navy' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              const colorMap = {
                success: 'bg-success/10 text-success',
                aiblue: 'bg-aiblue/10 text-aiblue',
                gold: 'bg-gold/15 text-gold-dark',
                navy: 'bg-navy/10 text-navy'
              };
              return (
                <div key={stat.label} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.05}s`, opacity: 0 }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-heading font-extrabold text-2xl text-navy">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Overall progress */}
          <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-aiblue" />
                <span className="font-heading font-semibold text-navy text-sm">Overall Learning Progress</span>
              </div>
              <span className="font-heading font-bold text-lg text-navy">{overallProgress}%</span>
            </div>
            <ProgressBar value={overallProgress} height="h-3" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Current experience + recommended */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current experience */}
              {currentExperience ? (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-lg text-navy">Current Experience</h2>
                    <Link to={`/story/${currentExperience.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-aiblue hover:gap-2.5 transition-all">
                      Resume <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <StoryCard
                    experience={currentExperience}
                    progress={currentProgress}
                    onClick={() => window.location.href = `/story/${currentExperience.id}`}
                  />
                </div>
              ) : (
                <div className="glass-card p-8 text-center animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
                  <div className="w-14 h-14 rounded-2xl bg-aiblue/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-aiblue" />
                  </div>
                  <h3 className="font-heading font-semibold text-navy mb-1">Ready to begin?</h3>
                  <p className="text-sm text-slate-500 mb-4">Start your first interactive awareness scenario.</p>
                  {experiences[0] && (
                    <Link to={`/story/${experiences[0].id}`} className="inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy-dark transition-all">
                      Start Experience <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}

              {/* Recommended */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-lg text-navy">Recommended Learning</h2>
                  <span className="text-xs text-slate-400">{recommended.length} new</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommended.map((exp) => {
                    const prog = progress.find(p => p.experience_id === exp.id);
                    return (
                      <StoryCard
                        key={exp.id}
                        experience={exp}
                        progress={prog}
                        onClick={() => window.location.href = `/story/${exp.id}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Achievements + saved */}
            <div className="space-y-6">
              {/* Achievements */}
              <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.45s', opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-gold" />
                  <h2 className="font-heading font-semibold text-sm text-navy">Achievements</h2>
                </div>
                {earnedAchievements.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {earnedAchievements.slice(0, 4).map((ach) => (
                      <AchievementBadge key={ach.id} achievement={ach} size="sm" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                      <Award className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-400">Complete experiences to earn badges</p>
                  </div>
                )}
              </div>

              {/* Saved resources */}
              <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-4 h-4 text-aiblue" />
                  <h2 className="font-heading font-semibold text-sm text-navy">Saved Resources</h2>
                </div>
                {savedResources.length > 0 ? (
                  <div className="space-y-2">
                    {savedResources.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-aiblue/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3.5 h-3.5 text-aiblue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy truncate">{item.experience_title}</p>
                          <p className="text-xs text-slate-400">{item.progress_percent}% complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                      <Bookmark className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-400">No saved resources yet</p>
                  </div>
                )}
                <Link to="/resources" className="block mt-3 text-center text-xs font-semibold text-aiblue hover:text-aiblue-dark transition-colors">
                  Browse library →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}