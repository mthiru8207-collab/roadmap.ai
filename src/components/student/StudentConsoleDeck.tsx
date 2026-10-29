import React, { useEffect, useState } from 'react';
import { BookOpen, Sparkles, Bookmark, FileText, ChevronRight, LayoutGrid, Rows } from 'lucide-react';

export type StudentTab = 'lesson' | 'tutor' | 'flashcards' | 'notes';

interface StudentConsoleDeckProps {
  activeTab: StudentTab;
  onSelectTab: (tab: StudentTab) => void;
  dayNumber: number;
  totalDays?: number;
  roleTitle?: string;
  stageName?: string;
  className?: string;
}

export const StudentConsoleDeck: React.FC<StudentConsoleDeckProps> = ({
  activeTab,
  onSelectTab,
  dayNumber,
  totalDays = 28,
  roleTitle = 'Engineering Track',
  stageName = 'Foundation',
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'expanded' | 'compact'>(() => {
    try {
      return (localStorage.getItem('roadmap_deck_view_mode') as 'expanded' | 'compact') || 'expanded';
    } catch {
      return 'expanded';
    }
  });

  const toggleViewMode = () => {
    const next = viewMode === 'expanded' ? 'compact' : 'expanded';
    setViewMode(next);
    try {
      localStorage.setItem('roadmap_deck_view_mode', next);
    } catch {
      // ignore
    }
  };

  // Support numeric hotkeys [1], [2], [3], [4] when not typing in inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === '1') onSelectTab('lesson');
      if (e.key === '2') onSelectTab('tutor');
      if (e.key === '3') onSelectTab('flashcards');
      if (e.key === '4') onSelectTab('notes');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTab]);

  const stations: {
    id: StudentTab;
    num: string;
    keyLabel: string;
    title: string;
    subtitle: string;
    tag: string;
    icon: React.FC<{ className?: string }>;
    isLive?: boolean;
  }[] = [
    {
      id: 'lesson',
      num: '01',
      keyLabel: '1',
      title: 'Lecture & Code Lab',
      subtitle: 'Reading, Video & Live Code Review',
      tag: 'CORE CURRICULUM',
      icon: BookOpen,
    },
    {
      id: 'tutor',
      num: '02',
      keyLabel: '2',
      title: '1-on-1 AI Tutor',
      subtitle: 'NVIDIA NIM Neural Mentor',
      tag: 'NVIDIA 11B LIVE',
      icon: Sparkles,
      isLive: true,
    },
    {
      id: 'flashcards',
      num: '03',
      keyLabel: '3',
      title: 'Interview Flashcards',
      subtitle: '4 3D Active Recall Cards',
      tag: 'INTERVIEW DRILL',
      icon: Bookmark,
    },
    {
      id: 'notes',
      num: '04',
      keyLabel: '4',
      title: 'Notes & Deliverable',
      subtitle: 'Markdown & GitHub Portfolio Link',
      tag: 'PORTFOLIO LOG',
      icon: FileText,
    },
  ];

  const progressPercent = Math.round((dayNumber / totalDays) * 100);

  return (
    <div className={`p-3.5 sm:p-4 rounded-lg border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-3 ${className}`}>
      {/* Top Architectural Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-stone-light dark:border-[#20242E] gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-vermilion" />
          <span className="font-bold text-ink dark:text-[#F0F2F5] uppercase tracking-wider text-[11px]">
            STUDENT CONSOLE DECK // 4 WORKSTATIONS
          </span>
          <span className="hidden md:inline text-graphite dark:text-[#8A929E] text-[10px] border-l border-stone dark:border-[#20242E] pl-2">
            {roleTitle} &bull; {stageName}
          </span>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto text-[11px]">
          <div className="flex items-center gap-1.5 text-graphite dark:text-[#8A929E]">
            <span>PROGRESS:</span>
            <span className="font-bold text-ink dark:text-[#F0F2F5]">
              DAY {dayNumber < 10 ? `0${dayNumber}` : dayNumber} OF {totalDays}
            </span>
            <span className="text-vermilion font-bold">({progressPercent}%)</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-graphite dark:text-[#8A929E] bg-paper-tint dark:bg-[#181B22] px-2 py-0.5 rounded border border-stone-light dark:border-[#242832]">
            <span>SWITCH:</span>
            <span className="font-bold text-ink dark:text-[#F0F2F5]">KEYS [1]–[4]</span>
          </div>

          {/* View Mode Toggle: Expanded vs Compact */}
          <button
            onClick={toggleViewMode}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-stone-light dark:border-[#282D36] bg-paper-subtle dark:bg-[#181B22] hover:border-vermilion text-[10px] font-mono text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            title={viewMode === 'expanded' ? 'Switch to Compact Bar view' : 'Switch to Expanded Deck view'}
          >
            {viewMode === 'expanded' ? (
              <>
                <Rows className="w-3 h-3 text-vermilion" />
                <span className="hidden sm:inline">Compact Bar</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3 h-3 text-vermilion" />
                <span className="hidden sm:inline">Cockpit Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode 1: Compact Tactical Strip (matches Image 3) */}
      {viewMode === 'compact' ? (
        <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-md bg-paper-tint/60 dark:bg-[#16181C] border border-stone dark:border-[#282D36]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {stations.map((st) => {
              const Icon = st.icon;
              const isActive = activeTab === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectTab(st.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono font-medium transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-ink dark:bg-vermilion text-paper dark:text-white border-ink dark:border-vermilion font-bold shadow-xs'
                      : 'bg-white dark:bg-[#121418] text-graphite-dark dark:text-[#8A929E] border-stone dark:border-[#242832] hover:border-vermilion hover:text-ink dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-vermilion dark:text-white' : 'text-graphite'}`} />
                  <span>
                    {st.num} // {st.title}
                  </span>
                  {st.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-graphite dark:text-[#8A929E] px-2 font-semibold">
            DAY {dayNumber < 10 ? `0${dayNumber}` : dayNumber} OF {totalDays}
          </div>
        </div>
      ) : (
        /* Mode 2: 4 Connected Workstation Tiles (matches Image 4) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {stations.map((st) => {
            const Icon = st.icon;
            const isActive = activeTab === st.id;

            return (
              <button
                key={st.id}
                onClick={() => onSelectTab(st.id)}
                className={`p-3.5 rounded-md text-left transition-all relative border flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? 'bg-paper-tint dark:bg-[#181A20] border-vermilion shadow-subtle ring-1 ring-vermilion/50'
                    : 'bg-paper-subtle/50 dark:bg-[#0E1013] border-stone dark:border-[#222630] hover:border-graphite/40 dark:hover:border-[#333846] hover:bg-paper-tint dark:hover:bg-[#15171C]'
                }`}
              >
                {/* Active Laser Line on Top */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-vermilion rounded-t" />
                )}

                {/* Station Masthead */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'bg-ink dark:bg-vermilion text-paper dark:text-white font-extrabold'
                          : 'bg-stone dark:bg-[#1C2028] text-graphite dark:text-[#8A929E] group-hover:text-ink dark:group-hover:text-white'
                      }`}
                    >
                      {st.num}
                    </span>

                    <span
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                        st.isLive
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : isActive
                          ? 'text-vermilion'
                          : 'text-graphite dark:text-[#8A929E]'
                      }`}
                    >
                      {st.isLive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      <span>{st.tag}</span>
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      isActive
                        ? 'border-vermilion/30 text-vermilion bg-white dark:bg-[#0E1013] font-bold'
                        : 'border-transparent text-graphite-light dark:text-[#555D6B] group-hover:text-graphite'
                    }`}
                  >
                    [{st.keyLabel}]
                  </span>
                </div>

                {/* Station Title & Icon */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 transition-colors shrink-0 ${
                        isActive
                          ? 'text-vermilion'
                          : 'text-graphite dark:text-[#8A929E] group-hover:text-ink dark:group-hover:text-white'
                      }`}
                    />
                    <h4
                      className={`text-xs font-bold tracking-tight truncate ${
                        isActive
                          ? 'text-ink dark:text-[#F0F2F5]'
                          : 'text-ink-light dark:text-[#B0B6C0] group-hover:text-ink dark:group-hover:text-white'
                      }`}
                    >
                      {st.title}
                    </h4>
                  </div>

                  <p className="text-[11px] text-graphite dark:text-[#8A929E] line-clamp-1 leading-snug">
                    {st.subtitle}
                  </p>
                </div>

                {/* Bottom active state footnote */}
                <div className="mt-2.5 pt-2 border-t border-stone-light/60 dark:border-[#20242E] flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={`transition-colors font-semibold ${
                      isActive
                        ? 'text-vermilion'
                        : 'text-graphite-light dark:text-[#606876] group-hover:text-graphite'
                    }`}
                  >
                    {isActive ? '● ACTIVE WORKSPACE' : 'ACTIVATE STATION'}
                  </span>
                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${
                      isActive
                        ? 'text-vermilion translate-x-0.5'
                        : 'text-graphite dark:text-[#606876] group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
