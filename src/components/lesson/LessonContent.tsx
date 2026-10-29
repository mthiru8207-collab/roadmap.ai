import React, { useState } from 'react';
import { DailyLesson, PracticalTask } from '../../types';
import { EmbeddedVideoPlayer } from './EmbeddedVideoPlayer';
import { reviewUserCode, CodeReviewResult } from '../../lib/aiEngine';
import {
  Clock,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Bookmark,
  Sparkles,
  Lock,
  Video,
} from 'lucide-react';

interface LessonContentProps {
  lesson: DailyLesson;
  isCompleted: boolean;
  isQuizUnlocked?: boolean;
  highestUnlockedQuizDay?: number;
  onToggleComplete: () => void;
  onOpenQuiz: () => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  isCompleted,
  isQuizUnlocked = true,
  highestUnlockedQuizDay = 1,
  onToggleComplete,
  onOpenQuiz,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<number, boolean>>({});
  const [userCodeInputs, setUserCodeInputs] = useState<Record<string, string>>({});
  const [reviewResults, setReviewResults] = useState<Record<string, CodeReviewResult>>({});
  const [isReviewing, setIsReviewing] = useState<Record<string, boolean>>({});

  const handleRequestReview = async (taskId: string, task: PracticalTask) => {
    const code = userCodeInputs[taskId];
    if (!code || !code.trim()) return;

    setIsReviewing(prev => ({ ...prev, [taskId]: true }));
    try {
      const result = await reviewUserCode({
        userCode: code,
        taskTitle: task.title,
        taskDescription: task.description,
        language: lesson.codeSnippet?.language || 'typescript',
        lessonTopic: lesson.title,
      });
      setReviewResults(prev => ({ ...prev, [taskId]: result }));
    } finally {
      setIsReviewing(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // Resolve YouTube Video Masterclass (from direct videoResource or from resources list)
  const activeVideo =
    lesson.videoResource ||
    (() => {
      const vRes = lesson.resources?.find(
        r =>
          r.type === 'video' ||
          r.youtubeId ||
          (r.url && (r.url.includes('youtube.com') || r.url.includes('youtu.be')))
      );
      if (vRes) {
        const match = vRes.url.match(
          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
        );
        const ytId = vRes.youtubeId || (match ? match[1] : null);
        if (ytId) {
          return {
            youtubeId: ytId,
            title: vRes.title,
            channel: 'Featured Technical Masterclass',
            duration: vRes.duration,
            summary:
              "Stream this expert-guided deep dive to solidify core mental models, real-world patterns, and operational nuances.",
          };
        }
      }
      return null;
    })();

  const handleCopyCode = () => {
    if (lesson.codeSnippet) {
      navigator.clipboard.writeText(lesson.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleChecklistItem = (idx: number) => {
    setCheckedChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <article className="space-y-10">
      {/* Editorial Masthead */}
      <header className="border-b border-stone pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-graphite">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-stone-light font-bold text-ink uppercase">
              {lesson.stageName || 'STAGE 01 // FOUNDATIONS'}
            </span>
            <span className="text-stone-dark">&bull;</span>
            <span className="text-vermilion font-bold">DAY 0{lesson.dayNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-graphite" />
              <span>{lesson.estimatedMinutes} MIN READ & PRACTICE</span>
            </span>
            <button
              onClick={onToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-mono font-semibold transition-colors ${
                isCompleted
                  ? 'bg-sage-light text-sage-dark border-sage'
                  : 'bg-white text-ink border-stone hover:border-ink'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-sage-dark' : 'text-graphite'}`} />
              <span>{isCompleted ? 'COMPLETED' : 'MARK COMPLETE'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink tracking-tight leading-[1.12]">
          {lesson.title}
        </h1>

        <p className="text-base sm:text-lg text-graphite-dark leading-relaxed font-sans font-normal max-w-3xl">
          {lesson.summary}
        </p>
      </header>

      {/* Learning Objectives Strip */}
      <section className="p-6 rounded bg-white border border-stone shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-graphite font-semibold">
          <BookOpen className="w-4 h-4 text-vermilion" />
          <span>Learning Objectives for Day 0{lesson.dayNumber}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {lesson.objectives.map((obj, idx) => (
            <div
              key={idx}
              className="p-3 rounded bg-paper-tint/60 border border-stone-light flex items-start gap-2.5"
            >
              <span className="font-mono text-xs font-bold text-vermilion shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p className="text-xs text-ink leading-relaxed font-medium">{obj}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Technical Publication Body */}
      <section className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-ink-light">
        <div className="space-y-4 font-sans whitespace-pre-line leading-relaxed">
          {lesson.contentMarkdown}
        </div>

        {/* Technical Callout Note */}
        <div className="my-6 p-5 rounded border-l-4 border-l-vermilion bg-white border border-stone shadow-subtle">
          <div className="text-xs font-mono uppercase text-vermilion font-bold mb-1">
            FIELD ARCHITECT NOTE // SPECIFICATION
          </div>
          <p className="text-xs sm:text-sm text-graphite-dark leading-relaxed">
            Ensure you can explain these concepts from first principles without looking at the reference implementation. The 5-question daily quiz evaluates conceptual reasoning, edge-case behavior, and operational syntax.
          </p>
        </div>

        {/* Code Snippet Box */}
        {lesson.codeSnippet && (
          <div className="my-6 rounded border border-stone bg-[#1A1C1E] text-slate-100 overflow-hidden shadow-atlas">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#141517] border-b border-white/10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-vermilion" />
                <span className="uppercase text-slate-300 font-bold">{lesson.codeSnippet.language}</span>
                <span className="text-slate-500">&bull; {lesson.codeSnippet.description}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-slate-200">
              <code>{lesson.codeSnippet.code}</code>
            </pre>
          </div>
        )}
      </section>

      {/* Embedded YouTube Reference Video Masterclass */}
      {activeVideo && (
        <div id="video-lecture">
          <EmbeddedVideoPlayer video={activeVideo} lessonDay={lesson.dayNumber} />
        </div>
      )}

      {/* Practical Exercise Box */}
      {lesson.tasks && lesson.tasks.length > 0 && (
        <section className="p-6 rounded bg-white border border-stone shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-stone-light pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vermilion" />
              <h3 className="font-serif text-lg text-ink font-medium">Practical Exercise</h3>
            </div>
            <span className="font-mono text-[10px] text-graphite uppercase">
              HANDS-ON REPS
            </span>
          </div>

          {lesson.tasks.map((task, tIdx) => (
            <div key={task.id || tIdx} className="space-y-3">
              <h4 className="text-sm font-bold text-ink">{task.title}</h4>
              <p className="text-xs text-graphite leading-relaxed">{task.description}</p>

              {task.instructions && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono text-graphite uppercase font-semibold">
                    Step-by-Step Instructions:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-ink-light font-medium pl-1">
                    {task.instructions.map((inst, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">{inst}</li>
                    ))}
                  </ol>
                </div>
              )}

              {task.solutionSnippet && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-vermilion hover:underline"
                  >
                    <span>{showSolution ? 'Hide Solution Reference' : 'Inspect Solution Reference'}</span>
                    {showSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showSolution && (
                    <div className="mt-2 p-3.5 rounded bg-paper-tint border border-stone text-xs font-mono overflow-x-auto">
                      <pre className="text-ink"><code>{task.solutionSnippet}</code></pre>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Student Code Workspace & NVIDIA AI Reviewer */}
              <div className="pt-3 border-t border-stone-light space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-vermilion" />
                    <span>Your Implementation Workspace</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-vermilion" />
                    <span>NVIDIA AI Active</span>
                  </span>
                </div>

                <textarea
                  value={userCodeInputs[task.id] || ''}
                  onChange={e => setUserCodeInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                  placeholder={`// Paste or write your implementation here to request live architectural critique from NVIDIA AI...\n`}
                  rows={4}
                  className="w-full p-3 rounded border border-stone bg-[#1A1C1E] text-slate-100 font-mono text-xs focus:ring-1 focus:ring-vermilion focus:border-vermilion outline-none transition-all placeholder:text-slate-500"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => handleRequestReview(task.id, task)}
                    disabled={isReviewing[task.id] || !userCodeInputs[task.id]?.trim()}
                    className="px-4 py-2 rounded bg-ink hover:bg-ink-soft disabled:opacity-40 text-paper font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-subtle"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-vermilion" />
                    <span>{isReviewing[task.id] ? 'NVIDIA AI Reviewing...' : 'Review with NVIDIA AI'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-graphite hidden sm:inline">
                    Evaluates correctness, O(N) complexity & edge cases
                  </span>
                </div>

                {/* Live Review Output Card */}
                {reviewResults[task.id] && (
                  <div className="mt-3 p-4 rounded bg-paper-tint border border-stone space-y-3 text-xs font-mono shadow-xs animate-fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-light pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          reviewResults[task.id].passed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {reviewResults[task.id].passed ? 'VERDICT: PASS' : 'VERDICT: REVISE'}
                        </span>
                        <span className="text-ink font-bold">
                          Score: {reviewResults[task.id].score}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-graphite">
                        {reviewResults[task.id].timeComplexity && <span>{reviewResults[task.id].timeComplexity}</span>}
                        {reviewResults[task.id].spaceComplexity && <span> &bull; {reviewResults[task.id].spaceComplexity}</span>}
                      </div>
                    </div>

                    <p className="text-ink font-sans leading-relaxed text-xs">
                      {reviewResults[task.id].review}
                    </p>

                    {reviewResults[task.id].suggestions?.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="text-[10px] font-bold text-graphite uppercase tracking-wider block">
                          Architect Recommendations:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-ink-light font-sans text-xs">
                          {reviewResults[task.id].suggestions.map((sug, sIdx) => (
                            <li key={sIdx}>{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Key Takeaways & Completion Checklist */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Key Takeaways */}
        <div className="p-6 rounded bg-paper-subtle border border-stone space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-graphite font-semibold flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-ink" />
            <span>Key Takeaways</span>
          </div>
          <ul className="space-y-2 text-xs text-ink leading-relaxed">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ink mt-1.5 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Completion Checklist */}
        <div className="p-6 rounded bg-white border border-stone shadow-subtle space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-graphite font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark" />
            <span>Verification Checklist</span>
          </div>
          <div className="space-y-2">
            {[
              'Completed all educational reading sections',
              'Implemented practical exercise instructions',
              'Ready for 5-question comprehension quiz (70% threshold)',
            ].map((item, idx) => {
              const isChecked = Boolean(checkedChecklist[idx]);
              return (
                <label
                  key={idx}
                  onClick={() => toggleChecklistItem(idx)}
                  className="flex items-start gap-2.5 text-xs text-ink cursor-pointer hover:text-ink-soft select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-vermilion focus:ring-vermilion"
                  />
                  <span className={isChecked ? 'line-through text-graphite' : 'font-medium'}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curated Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <section className="p-6 rounded bg-white border border-stone shadow-subtle space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-graphite font-semibold flex items-center justify-between">
            <span>Primary Sources & Validated Documentation</span>
            <span className="text-[10px] font-mono text-graphite">OFFICIAL SPECS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {lesson.resources.map(res => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded border border-stone-light bg-paper-tint/40 hover:bg-paper-tint hover:border-stone text-xs flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="font-semibold text-ink group-hover:text-vermilion transition-colors">
                    {res.title}
                  </div>
                  <div className="text-[10px] font-mono text-graphite uppercase mt-0.5">
                    {res.type} &bull; {res.duration}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-graphite group-hover:text-ink shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Footer Navigation & Quiz Action */}
      <footer className="pt-8 border-t border-stone flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onToggleComplete}
          className={`px-4 py-2.5 rounded border text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            isCompleted
              ? 'bg-sage-light text-sage-dark border-sage'
              : 'bg-white text-ink border-stone hover:bg-paper-tint'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Marked Complete' : 'Mark as Complete'}</span>
        </button>

        {!isQuizUnlocked ? (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-graphite bg-paper-tint px-3 py-2 rounded border border-stone-light">
              <Lock className="w-3.5 h-3.5 text-vermilion" />
              <span>Quiz Locked &bull; Requires Day {lesson.dayNumber - 1} Pass</span>
            </div>
            <button
              onClick={onOpenQuiz}
              className="px-5 py-2.5 rounded bg-ink hover:bg-ink-soft text-paper font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-subtle cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-vermilion" />
              <span>View Unlock Criteria</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenQuiz}
            className="px-7 py-3.5 rounded bg-vermilion hover:bg-vermilion-dark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-subtle transition-all cursor-pointer"
          >
            <span>Mark complete & start quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </article>
  );
};
