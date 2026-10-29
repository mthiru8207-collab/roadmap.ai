import React, { useState, useEffect } from 'react';
import {
  Shield,
  Database,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User,
  Sliders,
  Sparkles,
  Info,
  Server,
  Download,
  Sun,
  Moon,
  Monitor,
  Palette,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { useTheme } from '../context/ThemeContext';
import { saveSupabaseCredentials, clearSupabaseCredentials, getSupabaseCredentials } from '../lib/supabase';
import { getApiBaseUrl } from '../lib/apiConfig';

export const SettingsPage: React.FC = () => {
  const { user, isDemoMode, toggleDemoMode, isSupabaseConnected, signOut } = useAuth();
  const { resetAllProgress, activeRoadmap, stats } = useLearning();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const currentCreds = getSupabaseCredentials();
  const [sbUrlInput, setSbUrlInput] = useState(currentCreds.url);
  const [sbKeyInput, setSbKeyInput] = useState(currentCreds.anonKey);
  const [saveCredSuccess, setSaveCredSuccess] = useState(false);

  const handleSaveSbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbUrlInput || !sbKeyInput) {
      alert('Please provide both the Supabase URL and Anon Public Key.');
      return;
    }
    const ok = saveSupabaseCredentials(sbUrlInput, sbKeyInput);
    if (ok) {
      setSaveCredSuccess(true);
    }
  };

  const handleClearSbConfig = () => {
    if (confirm('Disconnect Supabase credentials and revert to local browser storage?')) {
      clearSupabaseCredentials();
    }
  };

  const [studyGoal, setStudyGoal] = useState('1h');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [serverHealth, setServerHealth] = useState<{
    checked: boolean;
    online: boolean;
    nvidiaConfigured: boolean;
    nvidiaModel: string;
    geminiConfigured: boolean;
  }>({
    checked: false,
    online: false,
    nvidiaConfigured: false,
    nvidiaModel: '',
    geminiConfigured: false,
  });

  useEffect(() => {
    // Probe backend server health
    fetch(`${getApiBaseUrl()}/api/health`)
      .then(res => res.json())
      .then(data => {
        setServerHealth({
          checked: true,
          online: data.status === 'healthy',
          nvidiaConfigured: Boolean(data.nvidiaConfigured),
          nvidiaModel: data.nvidiaModel || 'meta/llama-3.2-11b-vision-instruct',
          geminiConfigured: Boolean(data.geminiConfigured),
        });
      })
      .catch(() => {
        setServerHealth({
          checked: true,
          online: false,
          nvidiaConfigured: false,
          nvidiaModel: '',
          geminiConfigured: false,
        });
      });
  }, []);

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all learning progress, quizzes, and assessment records?')) {
      resetAllProgress();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportData = () => {
    const backup = {
      roadmap: activeRoadmap,
      stats,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-stone dark:border-dark-border pb-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-vermilion font-bold mb-1">
          SYSTEM CONFIGURATION // SPECIFICATION
        </div>
        <h1 className="text-3xl font-serif text-ink dark:text-dark-ink tracking-tight">Platform Settings</h1>
        <p className="text-xs sm:text-sm text-graphite dark:text-dark-muted mt-1 max-w-xl">
          Manage local demo mode, visual themes, Supabase cloud sync credentials, AI endpoint connectivity, and persistent storage.
        </p>
      </div>

      {/* Appearance & Editorial Visual Mode */}
      <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded border border-stone dark:border-dark-border shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-light dark:border-dark-border pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-vermilion" />
            <div>
              <h2 className="text-base font-serif font-bold text-ink dark:text-dark-ink">
                Appearance & Visual Theme
              </h2>
              <p className="text-xs text-graphite dark:text-dark-muted">Switch between high-contrast daylight paper and night obsidian field notes.</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded text-xs font-mono font-bold border bg-paper-tint dark:bg-dark-surface text-ink dark:text-dark-ink border-stone dark:border-dark-border self-start sm:self-auto">
            CURRENT: {theme === 'system' ? `SYSTEM (${resolvedTheme.toUpperCase()})` : theme.toUpperCase()}
          </span>
        </div>

        {/* 3 Interactive Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Paper White */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`text-left p-4 rounded border transition-all relative ${
              theme === 'light'
                ? 'border-vermilion bg-vermilion-light/40 dark:bg-vermilion/10 shadow-subtle ring-1 ring-vermilion'
                : 'border-stone dark:border-dark-border hover:border-graphite/40 dark:hover:border-dark-muted bg-paper-subtle/30 dark:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded bg-[#F7F6F2] border border-[#E7E5DE] flex items-center justify-center text-amber-600 shadow-xs">
                <Sun className="w-4 h-4" />
              </div>
              {theme === 'light' && (
                <span className="text-[10px] font-mono font-bold text-vermilion bg-white dark:bg-dark-card px-2 py-0.5 rounded border border-vermilion/30">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-serif font-bold text-sm text-ink dark:text-dark-ink mb-1">
              Paper White
            </div>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              Archival cream canvas with Swiss editorial typography and vermilion highlights. Optimal for daytime learning.
            </p>
          </button>

          {/* Obsidian Night */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`text-left p-4 rounded border transition-all relative ${
              theme === 'dark'
                ? 'border-vermilion bg-vermilion-light/40 dark:bg-vermilion/10 shadow-subtle ring-1 ring-vermilion'
                : 'border-stone dark:border-dark-border hover:border-graphite/40 dark:hover:border-dark-muted bg-paper-subtle/30 dark:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded bg-[#121315] border border-[#2C3035] flex items-center justify-center text-vermilion shadow-xs">
                <Moon className="w-4 h-4" />
              </div>
              {theme === 'dark' && (
                <span className="text-[10px] font-mono font-bold text-vermilion bg-white dark:bg-dark-card px-2 py-0.5 rounded border border-vermilion/30">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-serif font-bold text-sm text-ink dark:text-dark-ink mb-1">
              Obsidian Night
            </div>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              Deep charcoal field notebook with warm cream text and dark stone borders. Eliminates glare during night coding.
            </p>
          </button>

          {/* System Sync */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`text-left p-4 rounded border transition-all relative ${
              theme === 'system'
                ? 'border-vermilion bg-vermilion-light/40 dark:bg-vermilion/10 shadow-subtle ring-1 ring-vermilion'
                : 'border-stone dark:border-dark-border hover:border-graphite/40 dark:hover:border-dark-muted bg-paper-subtle/30 dark:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded bg-stone-light dark:bg-dark-surface border border-stone dark:border-dark-border flex items-center justify-center text-sage-dark shadow-xs">
                <Monitor className="w-4 h-4" />
              </div>
              {theme === 'system' && (
                <span className="text-[10px] font-mono font-bold text-vermilion bg-white dark:bg-dark-card px-2 py-0.5 rounded border border-vermilion/30">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-serif font-bold text-sm text-ink dark:text-dark-ink mb-1">
              System Sync
            </div>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              Dynamically mirrors your operating system color scheme changes between day and night without manual switching.
            </p>
          </button>
        </div>
      </div>

      {/* Honest Demo Mode & Supabase Status Panel */}
      <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded border border-stone dark:border-dark-border shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-light dark:border-dark-border pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-vermilion" />
            <div>
              <h2 className="text-base font-serif font-bold text-ink dark:text-dark-ink">
                Persistence & Authentication Layer
              </h2>
              <p className="text-xs text-graphite dark:text-dark-muted">PostgreSQL via Supabase or deterministic local browser storage.</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded text-xs font-mono font-bold border self-start sm:self-auto ${
              isSupabaseConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-paper-tint dark:bg-dark-surface text-ink dark:text-dark-ink border-stone dark:border-dark-border'
            }`}
          >
            {isSupabaseConnected ? 'CONNECTED // SUPABASE POSTGRES' : 'LOCAL WORKSPACE // OFFLINE READY'}
          </span>
        </div>

        {/* Local Storage Architecture Note */}
        <div className="p-4 rounded bg-paper-tint dark:bg-dark-surface border border-stone-light dark:border-dark-border text-xs text-graphite-dark dark:text-dark-muted space-y-1.5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink dark:text-dark-ink font-bold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-vermilion" />
            <span>Supabase Cloud Sync & Local Workspace Architecture</span>
          </div>
          <p className="leading-relaxed">
            RoadmapAI operates as a resilient local-first instrument with optional full cloud replication. When Supabase credentials are configured, your accounts (including Google OAuth), roadmaps, lesson records, quiz attempts, and study analytics replicate live to your Supabase PostgreSQL cluster using Row-Level Security (<code className="font-mono text-[10px] bg-white dark:bg-dark-card px-1 py-0.5 rounded border border-stone dark:border-dark-border">supabase/schema.sql</code>).
          </p>
        </div>

        {/* Interactive Supabase Configuration Form */}
        <form onSubmit={handleSaveSbConfig} className="p-5 rounded border border-stone dark:border-dark-border bg-paper-subtle/40 dark:bg-dark-surface space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-stone-light dark:border-dark-border pb-2">
            <span className="font-bold text-ink dark:text-dark-ink text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-vermilion" />
              Supabase Connection Parameters
            </span>
            {isSupabaseConnected && (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Database Replicating
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-graphite dark:text-dark-muted text-[10px] uppercase font-bold block">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={sbUrlInput}
                onChange={(e) => setSbUrlInput(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full px-3 py-2 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border text-ink dark:text-dark-ink font-mono text-xs focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div className="space-y-1">
              <label className="text-graphite dark:text-dark-muted text-[10px] uppercase font-bold block">
                Anon Public Key (client safe)
              </label>
              <input
                type="password"
                value={sbKeyInput}
                onChange={(e) => setSbKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border text-ink dark:text-dark-ink font-mono text-xs focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Save & Connect Supabase
              </button>

              {isSupabaseConnected && (
                <button
                  type="button"
                  onClick={handleClearSbConfig}
                  className="px-3 py-2 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-tint text-graphite dark:text-dark-muted text-xs font-mono transition-colors cursor-pointer"
                >
                  Disconnect & Use Local Storage
                </button>
              )}
            </div>

            {saveCredSuccess && (
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved & Reloading session...
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Backend & NVIDIA AI Connectivity */}
      <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded border border-stone dark:border-dark-border shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-light dark:border-dark-border pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-vermilion" />
            <div>
              <h2 className="text-base font-serif font-bold text-ink dark:text-dark-ink">
                NVIDIA NIM AI Architecture Engine
              </h2>
              <p className="text-xs text-graphite dark:text-dark-muted">High-throughput TensorRT-LLM cloud inference proxy.</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded text-xs font-mono font-bold border shrink-0 ${
              serverHealth.nvidiaConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-paper-tint dark:bg-dark-surface text-graphite dark:text-dark-muted border-stone dark:border-dark-border'
            }`}
          >
            {serverHealth.nvidiaConfigured ? 'NVIDIA AI ACTIVE & VAULTED' : 'LOCAL SYNTHESIS ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded border border-stone dark:border-dark-border bg-paper-subtle/50 dark:bg-dark-surface space-y-1">
            <span className="text-[10px] text-graphite dark:text-dark-muted block">API PROVIDER</span>
            <span className="font-bold text-ink dark:text-dark-ink block">
              {serverHealth.nvidiaConfigured ? 'NVIDIA Cloud NIM (Active)' : 'Autonomous Client Synthesizer'}
            </span>
          </div>
          <div className="p-4 rounded border border-stone dark:border-dark-border bg-paper-subtle/50 dark:bg-dark-surface space-y-1">
            <span className="text-[10px] text-graphite dark:text-dark-muted block">ACTIVE MODEL</span>
            <span className="font-bold text-vermilion truncate block">
              {serverHealth.nvidiaModel || 'meta/llama-3.2-90b-vision-instruct'}
            </span>
          </div>
          <div className="p-4 rounded border border-stone dark:border-dark-border bg-paper-subtle/50 dark:bg-dark-surface space-y-1">
            <span className="text-[10px] text-graphite dark:text-dark-muted block">SECURITY BOUNDARY</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
              Server-Side Vaulted (.env)
            </span>
          </div>
        </div>

        <div className="p-4 rounded bg-paper-tint/60 dark:bg-dark-surface border border-stone dark:border-dark-border text-xs text-graphite dark:text-dark-muted space-y-1">
          <span className="font-mono text-[10px] text-ink dark:text-dark-ink font-bold uppercase block">
            ACTIVE AI CAPABILITIES
          </span>
          <p className="text-[11px] leading-relaxed">
            NVIDIA NIM powers live multi-stage curriculum generation, real-time code reviews for practical exercises, and adaptive weak-topic question formulation. API secrets remain strictly isolated on the backend server.
          </p>
        </div>
      </div>

      {/* Data Management & Export Panel */}
      <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded border border-stone dark:border-dark-border shadow-subtle space-y-6">
        <div className="border-b border-stone-light dark:border-dark-border pb-4">
          <h2 className="text-base font-serif font-bold text-ink dark:text-dark-ink">
            Data Ledger Management
          </h2>
          <p className="text-xs text-graphite dark:text-dark-muted">Export your learning records or reset progress back to baseline.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-tint dark:hover:bg-dark-subtle text-xs font-semibold text-ink dark:text-dark-ink flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-graphite dark:text-dark-muted" />
            <span>Export Progress JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded border border-vermilion/40 bg-white dark:bg-dark-card hover:bg-vermilion-light dark:hover:bg-vermilion/10 text-xs font-semibold text-vermilion flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-vermilion" />
            <span>Reset All Progress & Quizzes</span>
          </button>

          {resetSuccess && (
            <span className="text-xs font-mono text-sage-dark dark:text-sage font-bold animate-fade-in">
              &check; Progress successfully reset
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
