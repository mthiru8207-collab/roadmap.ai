import React, { useState, useEffect } from 'react';
import { DailyLesson } from '../../types';
import { FileText, Download, Check, ExternalLink, Github, Code, Sparkles, Save } from 'lucide-react';

interface LessonNotesDrawerProps {
  lesson: DailyLesson;
  className?: string;
}

export const LessonNotesDrawer: React.FC<LessonNotesDrawerProps> = ({ lesson, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'cheatsheet'>('notes');
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(`roadmap_ai_notes_${lesson.id}`) || '';
    } catch {
      return '';
    }
  });

  const [repoUrl, setRepoUrl] = useState(() => {
    try {
      return localStorage.getItem(`roadmap_ai_repo_${lesson.id}`) || '';
    } catch {
      return '';
    }
  });

  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`roadmap_ai_notes_${lesson.id}`) || '';
      setNotes(saved);
      const savedRepo = localStorage.getItem(`roadmap_ai_repo_${lesson.id}`) || '';
      setRepoUrl(savedRepo);
    } catch {
      // ignore
    }
  }, [lesson.id]);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    try {
      localStorage.setItem(`roadmap_ai_notes_${lesson.id}`, val);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleRepoChange = (val: string) => {
    setRepoUrl(val);
    try {
      localStorage.setItem(`roadmap_ai_repo_${lesson.id}`, val);
    } catch {
      // ignore
    }
  };

  const handleExportMarkdown = () => {
    const mdContent = `# Day ${lesson.dayNumber}: ${lesson.title}
*Curriculum Track: ${lesson.title}*

## Objectives
${lesson.objectives?.map((o) => `- ${o}`).join('\n') || 'N/A'}

## Key Takeaways
${lesson.keyTakeaways?.map((k) => `- ${k}`).join('\n') || 'N/A'}

## Student Technical Notes
${notes || 'No student notes recorded yet.'}

${repoUrl ? `\n## Practical Project Deliverable\n- Repository / Demo: ${repoUrl}\n` : ''}

---
*Exported from RoadmapAI • The Personal Learning Instrument*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Day-${String(lesson.dayNumber).padStart(2, '0')}-${lesson.title.replace(/\s+/g, '-').toLowerCase()}-notes.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-6 rounded-lg border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-5 ${className}`}>
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-light dark:border-[#20242E] pb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded border border-stone dark:border-[#242832] bg-paper-tint dark:bg-[#16181D]">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-[#20242E] shadow-xs text-ink dark:text-[#F0F2F5] font-bold'
                  : 'text-graphite dark:text-[#8A929E] hover:text-ink'
              }`}
            >
              My Study Notes
            </button>
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                activeTab === 'cheatsheet'
                  ? 'bg-white dark:bg-[#20242E] shadow-xs text-ink dark:text-[#F0F2F5] font-bold'
                  : 'text-graphite dark:text-[#8A929E] hover:text-ink'
              }`}
            >
              Key Cheat Sheet
            </button>
          </div>

          {savedStatus && (
            <span className="text-[10px] font-mono text-sage-dark dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <Check className="w-3 h-3" /> Auto-saved
            </span>
          )}
        </div>

        <button
          onClick={handleExportMarkdown}
          className="px-3 py-1.5 rounded border border-stone dark:border-[#242832] bg-white dark:bg-[#16181C] hover:bg-paper-tint dark:hover:bg-[#1E222A] text-xs font-mono font-medium text-ink dark:text-[#F0F2F5] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          title="Download formatted markdown notes"
        >
          <Download className="w-3.5 h-3.5 text-graphite dark:text-[#8A929E]" />
          <span>Export Notes .md</span>
        </button>
      </div>

      {activeTab === 'notes' ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={`Jot down your questions, key mental models, or code commands for Day ${lesson.dayNumber}...\nNotes auto-save locally.`}
            rows={8}
            className="w-full p-3.5 rounded-md border border-stone dark:border-[#242832] bg-paper dark:bg-[#0A0B0D] text-ink dark:text-[#F0F2F5] text-xs font-mono leading-relaxed focus:outline-hidden focus:border-vermilion transition-colors resize-y"
          />

          {/* Practical Project Submission Link */}
          <div className="p-4 rounded-md border border-stone-light dark:border-[#222630] bg-paper-tint/40 dark:bg-[#14161B] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-vermilion" />
                <span className="text-xs font-mono uppercase tracking-wider text-ink dark:text-[#F0F2F5] font-bold">
                  Practical Deliverable / Project URL
                </span>
              </div>
              <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E]">PORTFOLIO TRACKER</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => handleRepoChange(e.target.value)}
                placeholder="https://github.com/username/project-day-01 or demo link"
                className="flex-1 px-3 py-2 text-xs rounded border border-stone dark:border-[#242832] bg-white dark:bg-[#0E1013] text-ink dark:text-[#F0F2F5] focus:outline-hidden focus:border-vermilion transition-colors font-mono"
              />
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded border border-stone dark:border-[#242832] bg-white dark:bg-[#16181C] hover:bg-paper-tint text-ink dark:text-[#F0F2F5]"
                  title="Open submission"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Cheat Sheet Tab */
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-paper dark:bg-[#0A0B0D] border border-stone-light dark:border-[#222630] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-vermilion font-bold">
              <span>{lesson.title} // QUICK COMMANDS & SYNTAX</span>
              <span className="text-graphite dark:text-[#8A929E] text-[10px]">VERIFIED REFERENCE</span>
            </div>

            {lesson.codeSnippet ? (
              <pre className="p-3 rounded bg-white dark:bg-[#121418] border border-stone-light dark:border-[#222630] text-xs font-mono overflow-x-auto text-ink dark:text-[#F0F2F5]">
                <code>{lesson.codeSnippet.code}</code>
              </pre>
            ) : (
              <p className="text-xs text-graphite dark:text-[#8A929E]">
                No code snippet attached to this unit.
              </p>
            )}

            <div className="pt-2 border-t border-stone-light dark:border-[#20242E] space-y-1.5">
              <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E] uppercase font-bold">
                CORE PRINCIPLES TO MEMORIZE:
              </span>
              <ul className="text-xs space-y-1 text-ink dark:text-[#F0F2F5] list-disc list-inside">
                {lesson.keyTakeaways?.map((k, i) => (
                  <li key={i}>{k}</li>
                )) || <li>Consistent naming and modular decomposition</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

