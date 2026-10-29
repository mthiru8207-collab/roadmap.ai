import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, HelpCircle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenAuth,
}) => {
  const { user, isDemoMode, isSupabaseConnected } = useAuth();
  const { stats, activeRoadmap, activeDayNumber } = useLearning();
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'INDEX // WELCOME';
    if (path === '/dashboard') return 'OVERVIEW // FIELD DESK';
    if (path === '/setup') return 'ARCHITECT // CAREER PATH SETUP';
    if (path === '/roadmap') return 'ROUTE // COMPLETE CURRICULUM';
    if (path.startsWith('/lesson')) return `DAILY LESSON // DAY ${activeDayNumber}`;
    if (path.startsWith('/quiz')) return `DAILY QUIZ // 70% THRESHOLD`;
    if (path === '/assessment') return 'ASSESSMENT // WEEKLY CHECKPOINT';
    if (path === '/progress') return 'RECORDS // ACTIVITY & MASTERY';
    if (path === '/roadmaps') return 'ARCHIVE // SAVED ROADMAPS';
    if (path === '/settings') return 'SYSTEM // CONFIG & STORAGE';
    return 'ROADMAP/AI';
  };

  return (
    <header className="h-16 px-4 lg:px-8 border-b border-stone dark:border-[#282D36] bg-[#F7F6F2] dark:bg-[#0E1012] backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors">
      {/* Left title & hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink hover:bg-stone-light dark:hover:bg-dark-subtle lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono tracking-wider text-graphite dark:text-dark-muted uppercase font-semibold">
            {getBreadcrumb()}
          </span>

          {activeRoadmap && location.pathname !== '/' && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-ink-light dark:text-dark-muted border-l border-stone dark:border-dark-border pl-3 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
              {activeRoadmap.jobTitle}
            </span>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Visual Theme Switcher */}
        <ThemeToggle />

        {/* Workspace Storage & Cloud Status Badge */}
        <Link
          to="/settings"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card text-ink dark:text-dark-ink text-[11px] font-mono hover:border-vermilion/50 transition-colors"
          title={isSupabaseConnected ? 'Connected to Supabase PostgreSQL' : 'Operating in 100% persistent Local Workspace. Click to configure cloud sync.'}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-sage-dark' : 'bg-vermilion'}`} />
          <span className="font-bold text-ink dark:text-dark-ink">{isSupabaseConnected ? 'POSTGRES SYNC' : 'LOCAL WORKSPACE'}</span>
          <span className="text-graphite dark:text-dark-muted text-[10px] hidden sm:inline">
            {isSupabaseConnected ? '(Live)' : '(Persistent)'}
          </span>
        </Link>

        {/* Quick Quiz launcher */}
        <Link
          to={`/quiz/${activeDayNumber}`}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-subtle dark:hover:bg-dark-subtle text-xs font-mono font-medium text-ink dark:text-dark-ink transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-vermilion" />
          <span>QUIZ 0{activeDayNumber}</span>
        </Link>

        {/* Quick Lesson launcher */}
        <Link
          to={`/lesson/${activeDayNumber}`}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-ink hover:bg-ink-soft dark:bg-vermilion dark:hover:bg-vermilion-dark text-paper dark:text-white text-xs font-mono font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-vermilion dark:text-white" />
          <span>DAY 0{activeDayNumber}</span>
        </Link>

        {/* Auth / Profile trigger */}
        {user ? (
          <Link
            to="/settings"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-stone dark:border-[#282D36] bg-white dark:bg-dark-card hover:bg-paper-subtle dark:hover:bg-dark-subtle cursor-pointer transition-colors"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded bg-stone dark:bg-dark-surface flex items-center justify-center text-[10px] font-mono font-bold text-ink dark:text-dark-ink">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-ink dark:text-dark-ink hidden md:inline-block">
              {user.name}
            </span>
          </Link>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded border border-stone dark:border-[#282D36] bg-white dark:bg-dark-card hover:bg-paper-tint dark:hover:bg-dark-subtle text-xs font-semibold text-ink dark:text-dark-ink transition-colors cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
