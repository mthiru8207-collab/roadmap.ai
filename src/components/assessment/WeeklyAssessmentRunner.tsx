import React, { useState } from 'react';
import { Award, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { WEEK_1_ASSESSMENT_QUESTIONS } from '../../data/sampleRoadmaps';
import { AssessmentReport } from './AssessmentReport';
import { WeeklyAssessmentAttempt } from '../../types';
import { getRequiredCorrectCount } from '../../lib/scoring';

interface WeeklyAssessmentRunnerProps {
  onContinue: () => void;
  onOpenRevision: () => void;
}

export const WeeklyAssessmentRunner: React.FC<WeeklyAssessmentRunnerProps> = ({
  onContinue,
  onOpenRevision,
}) => {
  const { submitWeeklyAssessment, activeDayNumber } = useLearning();
  const currentWeekNumber = Math.max(1, Math.ceil(activeDayNumber / 7));
  const questions = WEEK_1_ASSESSMENT_QUESTIONS;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [attemptResult, setAttemptResult] = useState<WeeklyAssessmentAttempt | null>(null);

  const currentQ = questions[currentIdx];
  const answeredCount = answers.filter(a => a !== -1).length;
  const isAllAnswered = answeredCount === questions.length;
  const requiredCount = getRequiredCorrectCount(questions.length); // 7 for 10 questions

  const handleSelect = (optIdx: number) => {
    const updated = [...answers];
    updated[currentIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (!isAllAnswered) {
      if (!confirm(`You have completed ${answeredCount} of ${questions.length} questions. Submit assessment?`)) {
        return;
      }
    }
    const { attempt } = submitWeeklyAssessment(currentWeekNumber, answers);
    setAttemptResult(attempt);
  };

  const handleRetry = () => {
    setAttemptResult(null);
    setAnswers(new Array(questions.length).fill(-1));
    setCurrentIdx(0);
  };

  if (attemptResult) {
    return (
      <AssessmentReport
        attempt={attemptResult}
        onRetry={handleRetry}
        onContinue={onContinue}
        onOpenRevision={onOpenRevision}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded border border-stone shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded bg-paper-tint text-vermilion border border-stone">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-serif font-bold text-ink tracking-tight">
                Week 0{currentWeekNumber} Cumulative Checkpoint
              </h2>
              <p className="text-[11px] font-mono text-graphite">
                {questions.length} Comprehensive Problems &bull; 70% Passing Threshold ({requiredCount} of {questions.length} required)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-paper-tint border border-stone text-ink">
            {answeredCount} / {questions.length} Answered
          </span>
        </div>

        {/* Question Pills Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== -1;
            const isCurrent = currentIdx === idx;

            return (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                  isCurrent
                    ? 'bg-ink text-paper border-ink shadow-subtle'
                    : isAnswered
                    ? 'bg-sage-light text-sage-dark border-sage/40'
                    : 'bg-paper text-graphite border-stone hover:text-ink'
                }`}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Box */}
      <div className="bg-white p-6 sm:p-8 rounded border border-stone shadow-subtle space-y-6">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-graphite uppercase mb-2">
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span className="text-vermilion font-semibold">{currentQ.topicTag || 'General'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif text-ink font-semibold leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = answers[currentIdx] === optIdx;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelect(optIdx)}
                className={`w-full p-4 rounded border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-paper-tint border-vermilion ring-1 ring-vermilion/30 text-ink shadow-subtle'
                    : 'bg-white border-stone text-ink-light hover:border-ink/50 hover:text-ink'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-vermilion bg-vermilion text-white'
                      : 'border-stone text-graphite'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span className="leading-relaxed font-sans">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-light flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded border border-stone text-xs font-semibold text-ink hover:bg-paper-tint disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-5 py-2 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Assessment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
