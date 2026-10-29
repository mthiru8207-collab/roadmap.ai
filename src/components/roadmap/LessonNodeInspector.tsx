import React, { useEffect } from 'react';
import { DailyLesson } from '../../types';
import { Link } from 'react-router-dom';
import {
  X,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Video,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

interface LessonNodeInspectorProps {
  lesson: DailyLesson | null;
  onClose: () => void;
  isCompleted: boolean;
  isQuizUnlocked: boolean;
}

export const LessonNodeInspector: React.FC<LessonNodeInspectorProps> = ({
  lesson,
  onClose,
  isCompleted,
  isQuizUnlocked,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 dark:bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#121418] border border-stone dark:border-[#282D38] rounded-xl max-w-xl w-full shadow-elevation overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-5 border-b border-stone-light dark:border-[#20242E] flex items-center justify-between bg-paper-tint/50 dark:bg-[#16181D]">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded bg-ink dark:bg-vermilion text-white font-mono text-xs font-bold flex items-center justify-center">
              {lesson.dayNumber < 10 ? `0${lesson.dayNumber}` : lesson.dayNumber}
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-vermilion font-bold block">
                {lesson.stageName || `STAGE 0${Math.ceil(lesson.dayNumber / 7)}`} &bull; DAY {lesson.dayNumber}
              </span>
              <h3 className="font-serif text-lg font-bold text-ink dark:text-[#F0F2F5] leading-snug">
                {lesson.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-stone/20 dark:hover:bg-[#20242E] text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inspector Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded border border-stone-light dark:border-[#222630] bg-paper dark:bg-[#0E1013] space-y-1">
              <span className="text-[10px] text-graphite dark:text-[#7A8290] block">READING TIME</span>
              <span className="font-bold text-ink dark:text-[#F0F2F5] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-vermilion" />
                {lesson.estimatedMinutes} mins
              </span>
            </div>

            <div className="p-3 rounded border border-stone-light dark:border-[#222630] bg-paper dark:bg-[#0E1013] space-y-1">
              <span className="text-[10px] text-graphite dark:text-[#7A8290] block">CURRICULUM</span>
              <span className="font-bold text-ink dark:text-[#F0F2F5] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-sage-dark dark:text-emerald-400" />
                Open Access
              </span>
            </div>

            <div className="p-3 rounded border border-stone-light dark:border-[#222630] bg-paper dark:bg-[#0E1013] space-y-1">
              <span className="text-[10px] text-graphite dark:text-[#7A8290] block">QUIZ STATUS</span>
              <span
                className={`font-bold text-[11px] truncate flex items-center gap-1 ${
                  isQuizUnlocked
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-vermilion'
                }`}
              >
                {isQuizUnlocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {isQuizUnlocked ? 'Unlocked' : `Requires Day ${lesson.dayNumber - 1}`}
              </span>
            </div>
          </div>

          {/* Lesson Overview / Summary */}
          {lesson.summary && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E] uppercase font-bold tracking-wider">
                CORE MENTAL MODEL:
              </span>
              <p className="text-xs text-ink dark:text-[#D4D8E0] leading-relaxed">
                {lesson.summary}
              </p>
            </div>
          )}

          {/* Key Objectives */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="p-4 rounded border border-stone-light dark:border-[#222630] bg-paper-tint/40 dark:bg-[#14161B] space-y-2">
              <span className="text-[10px] font-mono text-vermilion font-bold uppercase tracking-wider block">
                LEARNING OBJECTIVES FOR DAY {lesson.dayNumber}:
              </span>
              <ul className="space-y-1.5 text-xs text-ink dark:text-[#F0F2F5]">
                {lesson.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-vermilion font-mono font-bold mt-0.5">&bull;</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Video Lecture / Code Playground Available indicator */}
          <div className="flex items-center gap-4 text-xs font-mono text-graphite dark:text-[#8A929E] pt-1">
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-vermilion" />
              <span>YouTube Masterclass Embedded</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-sage-dark dark:text-emerald-400" />
              <span>Interactive Code Lab</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-stone-light dark:border-[#20242E] bg-paper-tint/30 dark:bg-[#16181D] flex items-center justify-between gap-3">
          <Link
            to={`/quiz/${lesson.dayNumber}`}
            onClick={onClose}
            className="px-4 py-2.5 rounded border border-stone dark:border-[#282D38] bg-white dark:bg-[#121418] hover:bg-paper-tint dark:hover:bg-[#1C2028] text-xs font-mono font-bold text-ink dark:text-[#F0F2F5] transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-vermilion" />
            <span>Daily Quiz</span>
          </Link>

          <Link
            to={`/lesson/${lesson.dayNumber}`}
            onClick={onClose}
            className="px-6 py-2.5 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-subtle transition-all"
          >
            <span>Launch Day {lesson.dayNumber} Lesson & Lab</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

