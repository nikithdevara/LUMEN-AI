import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, Award, CheckCircle2, Play, Bookmark, TrendingUp, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import ProgressBar from '@/components/ProgressBar';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completed_stories_count: 0,
    in_progress_stories_count: 0,
    saved_resources_count: 0,
    achievements_count: 0,
    overall_progress_percentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await db.dashboard.getStats();
        setStats(res);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Learner';
  const firstName = userName.charAt(0).toUpperCase() + userName.slice(1).split(' ')[0];

  // Visual chart data representing completed items vs remaining items
  const chartData = [
    { name: 'Completed', value: stats.completed_stories_count, color: '#10B981' },
    { name: 'In Progress', value: stats.in_progress_stories_count, color: '#3B82F6' },
    { name: 'Reflections', value: stats.saved_resources_count, color: '#F59E0B' },
    { name: 'Badges', value: stats.achievements_count, color: '#1E3A5F' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy">Performance Dashboard</h1>
        </div>
        <p className="text-slate-500 max-w-xl">Deep dive into your learning telemetry, track quiz grades, course completions, and milestones.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-delay-1">
        {[
          { label: 'Completed', value: stats.completed_stories_count, icon: CheckCircle2, color: 'success' },
          { label: 'In Progress', value: stats.in_progress_stories_count, icon: Play, color: 'aiblue' },
          { label: 'Reflections', value: stats.saved_resources_count, icon: Bookmark, color: 'gold' },
          { label: 'Achievements', value: stats.achievements_count, icon: Award, color: 'navy' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colorMap = {
            success: 'bg-success/10 text-success dark:bg-success/20',
            aiblue: 'bg-aiblue/10 text-aiblue dark:bg-primary/20 dark:text-primary',
            gold: 'bg-gold/15 text-gold-dark dark:bg-gold/25',
            navy: 'bg-navy/10 text-navy dark:bg-slate-800 dark:text-white'
          };
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-heading font-extrabold text-2xl text-navy">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6 animate-fade-in-delay-2">
        {/* Visual telemetry bar chart */}
        <div className="md:col-span-2 glass-card p-6">
          <h3 className="font-heading font-bold text-sm text-navy mb-6">Learning Analytics Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid rgba(226, 232, 240, 0.5)', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }} 
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course progress index card */}
        <div className="md:col-span-1 glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-navy mb-4">Overall Completion Progress</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Track how close you are to completing the overall learning journey for your track.
            </p>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="font-heading font-extrabold text-4xl text-navy">{stats.overall_progress_percentage}%</span>
              <span className="text-xs text-slate-400 font-medium">complete</span>
            </div>
            <ProgressBar value={stats.overall_progress_percentage} className="h-2 mb-2" />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-navy mb-2">Latest Milestones</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Account Created</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className={stats.overall_progress_percentage > 0 ? "w-3.5 h-3.5 text-success" : "w-3.5 h-3.5 text-slate-200"} />
                <span>Track Selection Finished</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className={stats.completed_stories_count > 0 ? "w-3.5 h-3.5 text-success" : "w-3.5 h-3.5 text-slate-200"} />
                <span>First Course Scenario Completed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
