import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, Database, Check, Key, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { saveSupabaseCredentials, getSupabaseCredentials, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithDemoUser, isSupabaseConnected } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Supabase Quick Setup Drawer state
  const [showConfigDrawer, setShowConfigDrawer] = useState(!isSupabaseConnected);
  const initialCreds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState(initialCreds.url);
  const [sbKey, setSbKey] = useState(initialCreds.anonKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        setError(res.error);
        if (!isSupabaseConnected) {
          setShowConfigDrawer(true);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Google login failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await signUpWithEmail(email, password, name);
        if (res.error) {
          setError(res.error);
          if (!isSupabaseConnected) setShowConfigDrawer(true);
        } else {
          onClose();
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setError(res.error);
          if (!isSupabaseConnected) setShowConfigDrawer(true);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbUrl || !sbKey) {
      setError('Please provide both your Supabase URL and Anon Public Key.');
      return;
    }
    const ok = saveSupabaseCredentials(sbUrl, sbKey);
    if (ok) {
      setSaveSuccess(true);
      setError(null);
    } else {
      setError('Failed to save Supabase credentials to storage.');
    }
  };

  const handleDemoAccess = () => {
    signInWithDemoUser();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSignUp ? 'Create RoadmapAI Account' : 'Sign In to RoadmapAI'}
      description="Access your personalized career roadmaps and verified learning records across all devices."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Error notification banner */}
        {error && (
          <div className="p-3 rounded bg-vermilion-light dark:bg-vermilion/10 border border-vermilion/30 text-xs text-vermilion flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Supabase Status Pill */}
        <div className="flex items-center justify-between p-2.5 rounded bg-paper-tint dark:bg-dark-surface border border-stone dark:border-dark-border text-xs font-mono">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-vermilion" />
            <span className="font-semibold text-ink dark:text-dark-ink text-[11px]">
              {isSupabaseConnected ? 'SUPABASE POSTGRESQL' : 'LOCAL WORKSPACE ENGINE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${
                isSupabaseConnected
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isSupabaseConnected ? 'Cloud Active' : 'Setup Required'}
            </span>
            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="text-[10px] text-vermilion font-bold underline cursor-pointer"
            >
              {showConfigDrawer ? 'Hide' : 'Config'}
            </button>
          </div>
        </div>

        {/* Supabase Quick Credentials Drawer (expandable) */}
        {showConfigDrawer && (
          <form
            onSubmit={handleSaveCredentials}
            className="p-3.5 rounded-md border border-stone dark:border-dark-border bg-paper-subtle/70 dark:bg-dark-card space-y-2.5 text-xs animate-fade-in"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-light dark:border-dark-border text-[11px] font-mono font-bold text-ink dark:text-dark-ink">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-vermilion" />
                Connect Supabase Database
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-vermilion hover:underline flex items-center gap-0.5 font-normal"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-graphite dark:text-dark-muted font-semibold mb-0.5">
                Project URL
              </label>
              <input
                type="text"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-dark-surface border border-stone dark:border-dark-border text-xs text-ink dark:text-dark-ink placeholder:text-graphite-light font-mono focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-graphite dark:text-dark-muted font-semibold mb-0.5">
                Anon Public Key
              </label>
              <input
                type="password"
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-dark-surface border border-stone dark:border-dark-border text-xs text-ink dark:text-dark-ink placeholder:text-graphite-light font-mono focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-graphite dark:text-dark-muted">
                Runs automatically with <code className="font-mono text-vermilion">schema.sql</code>
              </span>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-vermilion hover:bg-vermilion-dark text-white text-[11px] font-mono font-bold transition-colors cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
            {saveSuccess && (
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Supabase configured! Reloading session...</span>
              </div>
            )}
          </form>
        )}

        {/* 1. Primary Action: Google Authentication */}
        <button
          type="button"
          disabled={googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-tint dark:hover:bg-dark-subtle text-ink dark:text-dark-ink text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-subtle cursor-pointer disabled:opacity-50"
        >
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-light dark:border-dark-border"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-graphite dark:text-dark-muted uppercase tracking-wider">
            or with email & password
          </span>
          <div className="flex-grow border-t border-stone-light dark:border-dark-border"></div>
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-graphite dark:text-dark-muted font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-graphite dark:text-dark-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full pl-9 pr-3 py-2 rounded bg-white dark:bg-dark-surface border border-stone dark:border-dark-border text-xs text-ink dark:text-dark-ink placeholder:text-graphite-light focus:outline-none focus:ring-1 focus:ring-vermilion"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase text-graphite dark:text-dark-muted font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-graphite dark:text-dark-muted absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full pl-9 pr-3 py-2 rounded bg-white dark:bg-dark-surface border border-stone dark:border-dark-border text-xs text-ink dark:text-dark-ink placeholder:text-graphite-light focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-graphite dark:text-dark-muted font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-graphite dark:text-dark-muted absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded bg-white dark:bg-dark-surface border border-stone dark:border-dark-border text-xs text-ink dark:text-dark-ink placeholder:text-graphite-light focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-ink dark:bg-vermilion hover:bg-ink-soft dark:hover:bg-vermilion-dark disabled:opacity-50 text-paper dark:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer"
          >
            <span>{isSignUp ? 'Create Supabase Account' : 'Sign In with Email'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="text-center pt-1 text-xs text-graphite dark:text-dark-muted">
          {isSignUp ? 'Already registered?' : 'Need an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-vermilion font-semibold hover:underline cursor-pointer"
          >
            {isSignUp ? 'Sign In' : 'Create an Account'}
          </button>
        </div>

        {/* 3. Local Workspace Instant Access Escape Hatch */}
        <div className="pt-2 border-t border-stone-light dark:border-dark-border">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2 px-3 rounded border border-stone dark:border-dark-border bg-paper-tint/60 dark:bg-dark-surface hover:bg-paper-tint text-ink dark:text-dark-ink text-[11px] font-mono font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-vermilion" />
            <span>Launch Instant Local Workspace (No Auth Needed)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
