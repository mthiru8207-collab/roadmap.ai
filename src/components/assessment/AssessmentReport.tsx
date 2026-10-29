import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WeeklyAssessmentAttempt } from '../../types';
import { Award, AlertTriangle, RotateCcw, ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';
import { getRequiredCorrectCount } from '../../lib/scoring';

interface AssessmentReportProps {
  attempt: WeeklyAssessmentAttempt;
  onRetry: () => void;
  onContinue: () => void;
  onOpenRevision: () => void;
}

export const AssessmentReport: React.FC<AssessmentReportProps> = ({
  attempt,
  onRetry,
  onContinue,
  onOpenRevision,
}) => {
  const { weekNumber, score, totalQuestions, percentage, passed, topicBreakdown, weakTopics } = attempt;
  const requiredCount = getRequiredCorrectCount(totalQuestions); // Math.ceil(total * 0.70)

  useEffect(() => {
    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F04B35', '#20211F', '#879584'],
      });
    }
  }, [passed]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div
        className={`p-6 sm:p-8 rounded border text-center shadow-subtle ${
          passed
            ? 'bg-paper-tint border-stone'
            : 'bg-vermilion-light/50 border-vermilion/30'
        }`}
      >
        <div className="space-y-3">
          <div
            className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center border font-mono font-bold ${
              passed
                ? 'bg-sage-light text-sage-dark border-sage'
                : 'bg-white text-vermilion border-vermilion/40'
            }`}
          >
            {passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <div>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                passed
                  ? 'bg-sage-light text-sage-dark border-sage'
                  : 'bg-white text-vermilion border-vermilion/30'
              }`}
            >
              WEEK {weekNumber} EVALUATION &bull; {passed ? 'PASSED 70%' : 'REVISION RECOMMENDED'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-ink mt-2">
              {score} / {totalQuestions} Correct ({percentage}%)
            </h2>
            <p className="text-xs text-graphite-dark mt-1.5 max-w-lg mx-auto leading-relaxed">
              Passing threshold: 70% ({requiredCount} of {totalQuestions} required).{' '}
              {passed
                ? `Commendable work. You have demonstrated rigorous mastery of the Week ${weekNumber} curriculum.`
                : `You scored below the 70% threshold. Weak topics have been logged for targeted review. Your next lessons remain unlocked.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded border border-stone bg-white hover:bg-paper-tint text-xs font-semibold text-ink flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Assessment</span>
            </button>

            {weakTopics.length > 0 && (
              <button
                onClick={onOpenRevision}
                className="px-4 py-2 rounded bg-vermilion hover:bg-vermilion-dark text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-subtle"
              >
                <span>Revise {weakTopics.length} Weak Topics</span>
              </button>
            )}

            <button
              onClick={onContinue}
              className="px-5 py-2 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center gap-2 transition-colors shadow-subtle"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
            </button>
          </div>
        </div>
      </div>

      {/* Topic-by-Topic Performance Report */}
      <div className="bg-white p-6 rounded border border-stone shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-stone-light pb-3">
          <div>
            <h3 className="font-serif text-lg text-ink font-medium">Topic-by-Topic Performance</h3>
            <p className="text-xs text-graphite">Calculated strictly across tested questions.</p>
          </div>
          <span className="text-[10px] font-mono text-graphite uppercase">70% THRESHOLD</span>
        </div>

        <div className="space-y-3">
          {topicBreakdown.map(tb => (
            <div
              key={tb.topic}
              className="p-3.5 rounded border border-stone-light bg-paper-tint/40 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-ink">{tb.topic}</span>
                  {tb.needsRevision && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vermilion-light text-vermilion font-bold">
                      REVISE
                    </span>
                  )}
                </div>
                <div className="w-full bg-stone-light h-1.5 rounded-full overflow-hidden max-w-md">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tb.needsRevision ? 'bg-vermilion' : 'bg-sage-dark'
                    }`}
                    style={{ width: `${tb.percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono text-xs font-bold text-ink">
                  {tb.correct} / {tb.total} ({tb.percentage}%)
                </div>
                <div className="text-[10px] font-mono text-graphite">
                  {tb.needsRevision ? 'Below 70%' : 'Proficient'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
