import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  if (variant === 'segmented') {
    const options: { id: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'light', label: 'Paper White', icon: Sun },
      { id: 'dark', label: 'Obsidian Night', icon: Moon },
      { id: 'system', label: 'System Sync', icon: Monitor },
    ];

    return (
      <div className={`inline-flex p-1 rounded border border-stone dark:border-dark-border bg-paper-tint/60 dark:bg-dark-surface ${className}`}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                isSelected
                  ? 'bg-white dark:bg-dark-card shadow-subtle text-ink dark:text-dark-ink font-bold border border-stone dark:border-dark-border'
                  : 'text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink hover:bg-stone/30 border border-transparent'
              }`}
              title={`Switch to ${opt.label} theme`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isSelected
                    ? opt.id === 'dark'
                      ? 'text-vermilion'
                      : 'text-amber-500'
                    : 'text-graphite'
                }`}
              />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-tint dark:hover:bg-dark-subtle text-xs font-mono text-ink dark:text-dark-ink transition-colors"
        title={`Active theme: ${theme} (resolved: ${resolvedTheme}). Click to change.`}
        aria-label="Toggle visual theme"
        aria-expanded={dropdownOpen}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-vermilion fill-vermilion/20" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
        )}
        <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-wider">
          {theme === 'system' ? 'AUTO' : resolvedTheme === 'dark' ? 'DARK' : 'LIGHT'}
        </span>
        <ChevronDown className="w-3 h-3 text-graphite dark:text-dark-muted hidden sm:inline" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card shadow-atlas z-50 py-1 text-xs font-mono animate-fade-in">
          <div className="px-3 py-1.5 border-b border-stone dark:border-dark-border text-[9px] uppercase tracking-wider text-graphite dark:text-dark-muted font-bold">
            Appearance // Theme
          </div>

          <button
            onClick={() => {
              setTheme('light');
              setDropdownOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-paper-tint dark:hover:bg-dark-subtle transition-colors ${
              theme === 'light' ? 'font-bold text-ink dark:text-dark-ink bg-paper-tint/50 dark:bg-dark-subtle' : 'text-graphite-dark dark:text-dark-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Paper White</span>
            </div>
            {theme === 'light' && <span className="text-[10px] text-vermilion font-bold">&bull;</span>}
          </button>

          <button
            onClick={() => {
              setTheme('dark');
              setDropdownOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-paper-tint dark:hover:bg-dark-subtle transition-colors ${
              theme === 'dark' ? 'font-bold text-ink dark:text-dark-ink bg-paper-tint/50 dark:bg-dark-subtle' : 'text-graphite-dark dark:text-dark-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-vermilion" />
              <span>Obsidian Dark</span>
            </div>
            {theme === 'dark' && <span className="text-[10px] text-vermilion font-bold">&bull;</span>}
          </button>

          <button
            onClick={() => {
              setTheme('system');
              setDropdownOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-paper-tint dark:hover:bg-dark-subtle transition-colors ${
              theme === 'system' ? 'font-bold text-ink dark:text-dark-ink bg-paper-tint/50 dark:bg-dark-subtle' : 'text-graphite-dark dark:text-dark-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-sage-dark" />
              <span>System Sync</span>
            </div>
            {theme === 'system' && <span className="text-[10px] text-vermilion font-bold">&bull;</span>}
          </button>
        </div>
      )}
    </div>
  );
};

