import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizAttempt, QuizQuestion } from '../../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import { getRequiredCorrectCount } from '../../lib/scoring';

interface QuizResultsProps {
  attempt: QuizAttempt;
  questions: QuizQuestion[];
  onRetry: () => void;
  onNextLesson: () => void;
  onOpenRevision: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  attempt,
  questions,
  onRetry,
  onNextLesson,
  onOpenRevision,
}) => {
  const { score, totalQuestions, percentage, passed, submittedAnswers, weakTopics } = attempt;
  const requiredCount = getRequiredCorrectCount(totalQuestions); // 4 for 5 questions

  useEffect(() => {
    if (passed) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F04B35', '#20211F', '#879584', '#CFCBC2'],
      });
    }
  }, [passed]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Result Status Banner */}
      <div
        className={`p-6 sm:p-8 rounded border text-center shadow-subtle ${
          passed
            ? 'bg-paper-tint border-stone'
            : 'bg-vermilion-light/50 border-vermilion/30'
        }`}
      >
        <div className="space-y-3">
          <div
            className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border font-mono font-bold ${
              passed
                ? 'bg-sage-light text-sage-dark border-sage'
                : 'bg-white text-vermilion border-vermilion/40'
            }`}
          >
            {passed ? <Award className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                passed
                  ? 'bg-sage-light text-sage-dark border-sage'
                  : 'bg-white text-vermilion border-vermilion/30'
              }`}
            >
              {passed ? 'MILESTONE VERIFIED' : 'REVISION RECOMMENDED'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-ink mt-2">
              {score} / {totalQuestions} Correct ({percentage}%)
            </h2>
            <p className="text-xs text-graphite-dark mt-1.5 max-w-md mx-auto leading-relaxed">
              Passing threshold is 70% ({requiredCount} of {totalQuestions} required).{' '}
              {passed
                ? 'You demonstrated solid comprehension of today’s technical concepts.'
                : 'Scored below 70%. Targeted review has been prepared. Your next lesson remains accessible.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded border border-stone bg-white hover:bg-paper-tint text-xs font-semibold text-ink flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>

            {!passed && weakTopics.length > 0 && (
              <button
                onClick={onOpenRevision}
                className="px-4 py-2 rounded bg-vermilion hover:bg-vermilion-dark text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-subtle"
              >
                <span>Study Weak Topics</span>
              </button>
            )}

            <button
              onClick={onNextLesson}
              className="px-5 py-2 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center gap-2 transition-colors shadow-subtle"
            >
              <span>Continue to Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
            </button>
          </div>
        </div>
      </div>

      {/* Weak Topics Diagnostic Pill */}
      {weakTopics.length > 0 && (
        <div className="p-4 rounded bg-white border border-vermilion/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-vermilion shrink-0" />
            <div>
              <span className="font-semibold text-ink">Topics for reinforcement: </span>
              <span className="font-mono text-vermilion font-semibold">
                {weakTopics.join(', ')}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenRevision}
            className="text-[11px] font-mono font-bold text-vermilion hover:underline shrink-0"
          >
            REVIEW &rarr;
          </button>
        </div>
      )}

      {/* Item-by-item Feedback Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone pb-2">
          <h3 className="font-serif text-lg text-ink font-medium">Evaluation Breakdown</h3>
          <span className="text-[11px] font-mono text-graphite uppercase">
            AUDIT KEY &bull; TRUSTED LOGIC
          </span>
        </div>

        {questions.map((q, idx) => {
          const userAnswer = submittedAnswers[idx];
          const isCorrect = userAnswer === q.correctAnswerIndex;

          return (
            <div
              key={q.id || idx}
              className={`p-5 rounded border bg-white space-y-3 ${
                isCorrect ? 'border-stone' : 'border-vermilion/40 bg-vermilion-light/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect ? 'bg-sage-light text-sage-dark' : 'bg-vermilion-light text-vermilion'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-ink">
                    Question 0{idx + 1}
                  </span>
                  {q.topicTag && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-tint text-graphite">
                      {q.topicTag}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold ${
                    isCorrect ? 'text-sage-dark' : 'text-vermilion'
                  }`}
                >
                  {isCorrect ? 'CORRECT' : 'MISSED'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-ink pl-7">
                {q.question}
              </p>

              {/* Options status */}
              <div className="pl-7 space-y-1.5 text-xs">
                {q.options.map((opt, optIdx) => {
                  const wasSelected = userAnswer === optIdx;
                  const isAnswerKey = q.correctAnswerIndex === optIdx;

                  let rowStyle = 'text-graphite';
                  if (isAnswerKey) rowStyle = 'text-sage-dark font-bold';
                  if (wasSelected && !isCorrect) rowStyle = 'text-vermilion line-through font-semibold';

                  return (
                    <div key={optIdx} className={`flex items-center gap-2 ${rowStyle}`}>
                      <span className="font-mono text-[10px]">
                        [{String.fromCharCode(65 + optIdx)}]
                      </span>
                      <span>{opt}</span>
                      {isAnswerKey && (
                        <span className="text-[10px] font-mono font-bold text-sage-dark ml-1">
                          (Correct Answer)
                        </span>
                      )}
                      {wasSelected && !isCorrect && (
                        <span className="text-[10px] font-mono text-vermilion ml-1">
                          (Your selection)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Note */}
              <div className="ml-7 p-3 rounded bg-paper-tint/70 border border-stone-light text-xs text-graphite-dark leading-relaxed">
                <strong className="text-ink font-semibold">Field Explanation: </strong>
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
