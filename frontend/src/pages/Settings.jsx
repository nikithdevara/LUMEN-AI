import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { Settings as SettingsIcon, Bell, Eye, Moon, ShieldAlert, Loader2, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const config = await db.settings.get();
        setDarkMode(config.dark_mode);
        setNotifications(config.email_notifications);
        setProfileVisible(config.profile_visible);
        // Sync theme context with fetched settings
        setTheme(config.dark_mode ? 'dark' : 'light');
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [setTheme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        dark_mode: darkMode,
        email_notifications: notifications,
        profile_visible: profileVisible
      };
      await db.settings.update(payload);
      
      // Update global theme context
      setTheme(darkMode ? 'dark' : 'light');

      toast({
        title: "Settings Saved",
        description: "Your configurations have been successfully updated.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: err.message || "An unexpected error occurred."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy">Settings</h1>
        </div>
        <p className="text-slate-500 max-w-xl">Configure your user account, themes, notification triggers, and profile visibility settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 animate-fade-in-delay-1">
        {/* Left column: Quick Profile Info Card */}
        <div className="md:col-span-1">
          <div className="glass-card p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-aiblue/5 rounded-full blur-2xl" />
            <h3 className="font-heading font-bold text-sm text-navy mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">User Name</p>
                <p className="text-sm font-semibold text-navy mt-0.5">{user?.full_name || 'Anonymous User'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</p>
                <p className="text-sm text-slate-500 truncate mt-0.5">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Track</p>
                <p className="text-xs font-semibold px-2 py-0.5 rounded bg-aiblue/10 text-aiblue dark:bg-primary/20 dark:text-primary inline-block mt-1 uppercase">
                  {user?.onboarding_role || 'student'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Toggles and preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 divide-y divide-slate-100 dark:divide-slate-800">
            {/* Dark Mode Theme toggle */}
            <div className="flex items-center justify-between pb-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-navy">Dark Theme</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle interface styling into dark color modes.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-aiblue" />
              </label>
            </div>

            {/* Email notifications Toggle */}
            <div className="flex items-center justify-between py-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-navy">Notifications</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Receive summary updates and milestone achievements emails.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-aiblue" />
              </label>
            </div>

            {/* Profile Visibility Toggle */}
            <div className="flex items-center justify-between pt-5">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-navy">Public Profile</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Allow other learners and mentors to search for your badges.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileVisible}
                  onChange={(e) => setProfileVisible(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-aiblue" />
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-navy text-white hover:bg-navy/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90 px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all transform active:scale-98 shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
