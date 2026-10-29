import React, { useState } from 'react';
import { DailyLesson, QuizAttempt } from '../../types';
import { HelpCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { QuizResults } from './QuizResults';
import { getRequiredCorrectCount } from '../../lib/scoring';

interface QuizRunnerProps {
  lesson: DailyLesson;
  onNextLesson: () => void;
  onOpenRevision: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  lesson,
  onNextLesson,
  onOpenRevision,
}) => {
  const { submitDailyQuiz } = useLearning();
  const questions = lesson.quizQuestions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttempt | null>(null);

  const currentQ = questions[currentIdx];
  const answeredCount = answers.filter(a => a !== -1).length;
  const isAllAnswered = answeredCount === questions.length;
  const requiredToPass = getRequiredCorrectCount(questions.length); // Math.ceil(5 * 0.70) = 4

  const handleSelectOption = (optIdx: number) => {
    const updated = [...answers];
    updated[currentIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (!isAllAnswered) {
      if (!confirm(`You have answered ${answeredCount} of ${questions.length} questions. Submit quiz anyway?`)) {
        return;
      }
    }
    const { attempt } = submitDailyQuiz(lesson, answers);
    setSubmittedAttempt(attempt);
  };

  const handleRetry = () => {
    setSubmittedAttempt(null);
    setAnswers(new Array(questions.length).fill(-1));
    setCurrentIdx(0);
  };

  if (submittedAttempt) {
    return (
      <QuizResults
        attempt={submittedAttempt}
        questions={questions}
        onRetry={handleRetry}
        onNextLesson={onNextLesson}
        onOpenRevision={onOpenRevision}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Masthead */}
      <div className="bg-white p-6 rounded border border-stone shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded bg-paper-tint text-vermilion border border-stone">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-serif font-bold text-ink tracking-tight">
                Daily Comprehension Quiz &bull; Day 0{lesson.dayNumber}
              </h2>
              <p className="text-[11px] font-mono text-graphite">
                Passing threshold: 70% ({requiredToPass} of {questions.length} correct required)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-paper-tint border border-stone text-ink">
            {answeredCount} / {questions.length} Answered
          </span>
        </div>

        {/* Step indicator tabs */}
        <div className="flex items-center gap-2">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== -1;
            const isCurrent = currentIdx === idx;

            return (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`flex-1 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                  isCurrent
                    ? 'bg-ink text-paper border-ink shadow-subtle'
                    : isAnswered
                    ? 'bg-sage-light text-sage-dark border-sage/40'
                    : 'bg-paper text-graphite border-stone hover:text-ink'
                }`}
              >
                Q0{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Canvas */}
      <div className="bg-white p-6 sm:p-8 rounded border border-stone shadow-subtle space-y-6">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-graphite uppercase mb-2">
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span className="text-vermilion font-semibold">{currentQ.topicTag || 'Core Concept'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif text-ink font-semibold leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = answers[currentIdx] === optIdx;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
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

        {/* Navigation / Submit bar */}
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
              <span>Submit Evaluation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
