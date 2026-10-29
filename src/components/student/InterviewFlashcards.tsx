import React, { useState, useEffect } from 'react';
import { DailyLesson } from '../../types';
import { RotateCw, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Sparkles, Check, Bookmark, BookOpen } from 'lucide-react';

interface InterviewFlashcardsProps {
  lesson: DailyLesson;
  className?: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  tip?: string;
}

export const InterviewFlashcards: React.FC<InterviewFlashcardsProps> = ({ lesson, className = '' }) => {
  // Generate cards from lesson content
  const cards: Flashcard[] = React.useMemo(() => {
    const list: Flashcard[] = [];

    // Card 1: Core Concept Interview Question
    list.push({
      id: `${lesson.id}-fc1`,
      category: 'System Architecture',
      question: `How would you explain the core mechanism of ${lesson.title} to an engineering hiring manager?`,
      answer: lesson.summary || `It is a foundational paradigm designed to establish predictable state flow, clean separation of concerns, and high testability across production components.`,
      tip: 'Focus on business value, system reliability, and failure modes rather than just syntax.',
    });

    // Card 2: Primary Objective Verification
    if (lesson.objectives && lesson.objectives.length > 0) {
      list.push({
        id: `${lesson.id}-fc2`,
        category: 'Technical Competency',
        question: `Explain how you implement: "${lesson.objectives[0]}" in a production codebase.`,
        answer: lesson.keyTakeaways?.[0] || `By defining clear contractual interfaces, adhering to immutable data patterns, and verifying behavior with end-to-end integration assertions.`,
        tip: 'Mention error boundaries and telemetry/logging.',
      });
    }

    // Card 3: Code/Pattern Nuance
    if (lesson.codeSnippet) {
      list.push({
        id: `${lesson.id}-fc3`,
        category: 'Practical Engineering',
        question: `In ${lesson.codeSnippet.language || 'modern development'}, what are the typical performance or concurrency considerations for ${lesson.title}?`,
        answer: lesson.keyTakeaways?.[1] || `Pay close attention to memory allocations in tight loops, asynchronous non-blocking I/O execution, and deterministic error propagation.`,
        tip: 'Always quantify time and space complexity (e.g. O(1) vs O(N)).',
      });
    }

    // Card 4: Traps & Trade-offs
    list.push({
      id: `${lesson.id}-fc4`,
      category: 'Trade-offs & Edge Cases',
      question: `What is the biggest trade-off or drawback when choosing ${lesson.title} over alternatives?`,
      answer: lesson.keyTakeaways?.[2] || `Increased initial abstraction overhead and architectural complexity. It requires strict team conventions to avoid leaky abstractions.`,
      tip: 'Senior candidates always discuss trade-offs, not just pros.',
    });

    return list;
  }, [lesson]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredMap, setMasteredMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`roadmap_ai_flashcards_${lesson.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex, lesson.id]);

  const currentCard = cards[currentIndex] || cards[0];
  const isMastered = Boolean(masteredMap[currentCard?.id]);

  const handleToggleMastered = () => {
    const updated = { ...masteredMap, [currentCard.id]: !isMastered };
    setMasteredMap(updated);
    try {
      localStorage.setItem(`roadmap_ai_flashcards_${lesson.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const masteredCount = Object.values(masteredMap).filter(Boolean).length;

  return (
    <div className={`p-6 rounded-lg border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-light dark:border-[#20242E] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-vermilion" />
          <span className="font-mono text-xs uppercase tracking-wider text-ink dark:text-[#F0F2F5] font-bold">
            Day {lesson.dayNumber} Interview Flashcards
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-graphite dark:text-[#8A929E]">
            Card <span className="font-bold text-ink dark:text-[#F0F2F5]">{currentIndex + 1}</span> of {cards.length}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-light dark:bg-emerald-950/40 text-sage-dark dark:text-emerald-300 border border-sage/30 dark:border-emerald-800">
            {masteredCount}/{cards.length} Mastered
          </span>
        </div>
      </div>

      {/* The 3D Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer group relative min-h-[220px] rounded-md border border-stone dark:border-[#222630] bg-paper dark:bg-[#0E1013] p-6 flex flex-col justify-between transition-all hover:border-vermilion/60 shadow-xs select-none"
      >
        {/* Top Card Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-[#16181C] border border-stone dark:border-[#262A32] text-vermilion uppercase tracking-wider">
            {isFlipped ? 'ANSWER & ARCHITECTURE' : currentCard.category}
          </span>
          <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E] flex items-center gap-1">
            <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500 text-vermilion" />
            <span>Click to flip</span>
          </span>
        </div>

        {/* Card Body */}
        <div className="py-4">
          {!isFlipped ? (
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-graphite dark:text-dark-muted uppercase font-semibold">
                INTERVIEW PROMPT:
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ink dark:text-dark-ink leading-snug">
                {currentCard.question}
              </h3>
            </div>
          ) : (
            <div className="space-y-2.5 animate-fade-in">
              <div className="text-[11px] font-mono text-sage-dark dark:text-sage uppercase font-semibold">
                MODEL TECHNICAL RESPONSE:
              </div>
              <p className="text-xs sm:text-sm text-ink dark:text-dark-ink leading-relaxed font-sans">
                {currentCard.answer}
              </p>
              {currentCard.tip && (
                <div className="pt-2 text-[11px] font-mono text-graphite dark:text-dark-muted border-t border-stone-light dark:border-dark-border flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-vermilion shrink-0" />
                  <span>Interview Tip: {currentCard.tip}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer status */}
        <div className="pt-2 border-t border-stone-light dark:border-dark-border flex items-center justify-between text-[11px] font-mono">
          <span className="text-graphite dark:text-dark-muted">
            {isFlipped ? 'STATUS: REVIEWING MODEL ANSWER' : 'TEST YOUR RECALL BEFORE FLIPPING'}
          </span>
          {isMastered && (
            <span className="text-sage-dark dark:text-sage font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Mastered
            </span>
          )}
        </div>
      </div>

      {/* Navigation & Mastery Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-tint dark:hover:bg-dark-surface text-ink dark:text-dark-ink transition-colors"
            title="Previous card"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-tint dark:hover:bg-dark-surface text-ink dark:text-dark-ink transition-colors"
            title="Next card"
            aria-label="Next card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMastered}
            className={`px-3.5 py-2 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              isMastered
                ? 'bg-sage-light dark:bg-sage/20 text-sage-dark dark:text-sage border border-sage'
                : 'border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:border-sage text-graphite dark:text-dark-muted hover:text-ink'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMastered ? 'Marked Mastered' : 'Mark as Mastered'}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded bg-ink dark:bg-dark-ink hover:bg-ink-soft dark:hover:bg-white text-paper dark:text-dark-bg text-xs font-mono font-bold transition-colors"
          >
            Next Card &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

