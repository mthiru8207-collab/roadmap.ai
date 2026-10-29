import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Award,
  FolderGit2,
  Settings,
  X,
  TrendingUp,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export type ActivePage =
  | 'landing'
  | 'setup'
  | 'dashboard'
  | 'roadmap'
  | 'lesson'
  | 'quiz'
  | 'assessment'
  | 'revision'
  | 'progress'
  | 'roadmaps'
  | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { stats, activeRoadmap, activeDayNumber } = useLearning();
  const { isSupabaseConnected } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      num: '01',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/roadmap',
      num: '02',
      label: 'My Roadmap',
      icon: Compass,
    },
    {
      to: `/lesson/${activeDayNumber}`,
      num: '03',
      label: "Today's Lesson",
      icon: BookOpen,
      meta: `D${activeDayNumber}`,
    },
    {
      to: '/assessment',
      num: '04',
      label: 'Assessments',
      icon: Award,
    },
    {
      to: '/progress',
      num: '05',
      label: 'Progress & Stats',
      icon: TrendingUp,
    },
    {
      to: '/roadmaps',
      num: '06',
      label: 'Saved Roadmaps',
      icon: FolderGit2,
    },
    {
      to: '/settings',
      num: '07',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 dark:bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-paper dark:bg-dark-bg border-r border-stone dark:border-dark-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Editorial Masthead / Header */}
        <div className="h-16 px-6 border-b border-stone dark:border-dark-border flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={onCloseMobile}
          >
            <div className="w-7 h-7 rounded border border-ink/20 dark:border-dark-border bg-paper-tint dark:bg-dark-card flex items-center justify-center text-ink dark:text-dark-ink font-mono font-bold text-xs group-hover:border-vermilion group-hover:text-vermilion transition-colors">
              R/A
            </div>
            <div className="flex items-baseline">
              <span className="font-bold text-base text-ink dark:text-dark-ink tracking-tight font-sans">
                roadmap<span className="text-vermilion font-serif italic text-lg">/ai</span>
              </span>
            </div>
          </NavLink>

          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Track Metadata Badge */}
        {activeRoadmap && (
          <div className="p-4 mx-4 my-3 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border">
            <div className="text-[10px] font-mono uppercase tracking-wider text-graphite dark:text-dark-muted mb-1 flex items-center justify-between">
              <span>ACTIVE CURRICULUM</span>
              <span className="text-vermilion font-bold">28 DAYS</span>
            </div>
            <div className="font-serif font-bold text-sm text-ink dark:text-dark-ink truncate">
              {activeRoadmap.jobTitle}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-graphite dark:text-dark-muted pt-2 border-t border-stone-light dark:border-dark-border">
              <span>DAY {activeDayNumber} OF 28</span>
              <span className="text-ink dark:text-dark-ink font-semibold">
                {Math.round((activeDayNumber / 28) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to.startsWith('/lesson') && location.pathname.startsWith('/lesson'));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-white dark:bg-dark-card border border-stone dark:border-dark-border text-ink dark:text-dark-ink shadow-subtle'
                    : 'text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink hover:bg-stone/20 dark:hover:bg-dark-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[10px] transition-colors ${
                      isActive ? 'text-vermilion font-bold' : 'text-graphite-light dark:text-dark-muted group-hover:text-graphite'
                    }`}
                  >
                    {item.num}
                  </span>
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-vermilion' : 'text-graphite dark:text-dark-muted group-hover:text-ink dark:group-hover:text-dark-ink'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.meta && (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-light dark:bg-dark-surface text-graphite dark:text-dark-muted">
                    {item.meta}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* New Track Button */}
          <div className="pt-3">
            <NavLink
              to="/setup"
              onClick={onCloseMobile}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold transition-colors shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Design New Path</span>
            </NavLink>
          </div>
        </nav>

        {/* Footer Info & Theme Switcher */}
        <div className="p-4 border-t border-stone dark:border-dark-border bg-paper-tint/60 dark:bg-dark-surface text-[11px] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-graphite dark:text-dark-muted">THEME</span>
            <ThemeToggle variant="compact" />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-graphite dark:text-dark-muted">ENGINE</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSupabaseConnected
                  ? 'bg-sage-light text-sage-dark'
                  : 'bg-white dark:bg-dark-card border border-stone dark:border-dark-border text-ink dark:text-dark-ink'
              }`}
            >
              {isSupabaseConnected ? 'POSTGRES SYNC' : 'LOCAL WORKSPACE'}
            </span>
          </div>

          <div className="text-[10px] font-mono text-graphite-dark dark:text-dark-muted flex items-center justify-between pt-0.5">
            <span>PASS CRITERIA</span>
            <span className="text-vermilion font-bold">70% [CEIL]</span>
          </div>
        </div>
      </aside>
    </>
  );
};
