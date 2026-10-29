import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  RotateCcw,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Award,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';
import { WeakTopicItem } from '../../types';

export const RevisionRoom: React.FC = () => {
  const { weakTopics, markWeakTopicMastered } = useLearning();
  const unmastered = weakTopics.filter(w => !w.mastered);
  const mastered = weakTopics.filter(w => w.mastered);

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    unmastered[0]?.id || weakTopics[0]?.id || ''
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Drill answers state
  const [drillAnswers, setDrillAnswers] = useState<Record<string, number>>({});
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);

  const activeItem: WeakTopicItem | undefined = weakTopics.find(w => w.id === selectedTopicId);

  const handleSelectDrill = (qId: string, optIdx: number) => {
    if (drillSubmitted) return;
    setDrillAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleTopicChange = (id: string) => {
    setSelectedTopicId(id);
    setShowHint(false);
    setShowSolution(false);
    setDrillAnswers({});
    setDrillSubmitted(false);
  };

  const handleMasteryClick = (topicId: string) => {
    markWeakTopicMastered(topicId);
  };

  if (weakTopics.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl border border-dark-border text-center max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Learning Deficits Detected</h3>
        <p className="text-xs text-slate-400">
          All your quiz and assessment scores meet or exceed the 70% passing threshold. If you ever score below 70%, targeted revision exercises will automatically appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Sidebar: Weak Topics List */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Revision Subjects
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {unmastered.length} Active
          </span>
        </div>

        {/* Unmastered list */}
        <div className="space-y-2">
          {unmastered.map(item => {
            const isSelected = item.id === selectedTopicId;
            return (
              <button
                key={item.id}
                onClick={() => handleTopicChange(item.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500 shadow-sm'
                    : 'bg-dark-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white truncate">{item.topic}</span>
                  <span className="text-[10px] uppercase font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 shrink-0">
                    Needs Review
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Source: {item.sourceType === 'quiz' ? `Day ${item.sourceDayOrWeek} Quiz` : `Week ${item.sourceDayOrWeek} Assessment`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mastered list (archived) */}
        {mastered.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Mastered Topics ({mastered.length})
            </span>
            <div className="space-y-2">
              {mastered.map(item => {
                const isSelected = item.id === selectedTopicId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTopicChange(item.id)}
                    className={`w-full p-3 rounded-xl border text-left opacity-75 hover:opacity-100 transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40'
                        : 'bg-dark-surface border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">{item.topic}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-3.5 rounded-xl bg-[#0F1626] border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <span className="text-slate-200 font-semibold block mb-0.5">Non-Blocking Architecture</span>
          Lessons are never locked due to low scores. Revision is always recommended but strictly self-paced.
        </div>
      </div>

      {/* Main Revision Hub for Selected Topic */}
      <div className="lg:col-span-8 space-y-6">
        {activeItem ? (
          <>
            {/* Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F1628] via-[#141F36] to-[#10172A] border border-[#23314F]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Targeted Revision
                </span>
                {activeItem.mastered ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Mastered
                  </span>
                ) : (
                  <button
                    onClick={() => handleMasteryClick(activeItem.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Mastered</span>
                  </button>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {activeItem.topic}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Detected from {activeItem.sourceType === 'quiz' ? `Day ${activeItem.sourceDayOrWeek} daily quiz` : `Week ${activeItem.sourceDayOrWeek} assessment`}.
              </p>
            </div>

            {/* 1. Simplified First-Principles Explanation */}
            <div className="glass-card p-6 rounded-2xl border border-dark-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>1. Simplified Core Explanation</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {activeItem.simplifiedExplanation}
              </p>
            </div>

            {/* 2. Mental Model Analogy */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>2. Intuitive Mental Model Analogy</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed italic">
                "{activeItem.analogy}"
              </p>
            </div>

            {/* 3. Interactive Practice Exercise */}
            <div className="glass-card p-6 rounded-2xl border border-dark-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Practice Exercise</span>
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-200 font-medium">
                {activeItem.practiceExercise.prompt}
              </p>

              {/* Toggle Hint */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-400" />
                  <span>{showHint ? 'Hide Hint' : 'View Hint'}</span>
                </button>

                {showHint && (
                  <div className="p-3 rounded-xl bg-[#101728] border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-brand-400">Hint: </span>
                    {activeItem.practiceExercise.hint}
                  </div>
                )}
              </div>

              {/* Toggle Solution */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {showSolution ? 'Hide Solution Breakdown' : 'Reveal Solution Breakdown'}
                </button>

                {showSolution && (
                  <div className="mt-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                    <span className="font-bold text-emerald-300 block mb-1">Solution & Analysis:</span>
                    {activeItem.practiceExercise.solution}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Diagnostic Drill Quiz */}
            {activeItem.drillQuestions && activeItem.drillQuestions.length > 0 && (
              <div className="glass-card p-6 rounded-2xl border border-dark-border space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>4. Diagnostic Drill Questions</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeItem.drillQuestions.length} Questions
                  </span>
                </div>

                <div className="space-y-5">
                  {activeItem.drillQuestions.map((q, qIdx) => {
                    const selected = drillAnswers[q.id];
                    const isSubmitted = drillSubmitted;
                    const isCorrect = selected === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="space-y-3 p-4 rounded-xl bg-[#101728] border border-slate-800">
                        <span className="text-xs font-bold text-white block">
                          Q{qIdx + 1}: {q.question}
                        </span>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selected === optIdx;
                            let style = 'bg-[#0B101C] border-slate-800 text-slate-300';

                            if (isSubmitted) {
                              if (optIdx === q.correctAnswerIndex) {
                                style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                              } else if (isSelected && !isCorrect) {
                                style = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                              }
                            } else if (isSelected) {
                              style = 'bg-brand-500/20 border-brand-500 text-white font-medium';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={drillSubmitted}
                                onClick={() => handleSelectDrill(q.id, optIdx)}
                                className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${style}`}
                              >
                                <span>{opt}</span>
                                {isSubmitted && optIdx === q.correctAnswerIndex && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {isSubmitted && (
                          <div className="p-3 rounded-lg bg-[#080C14] border border-slate-800 text-[11px] text-slate-300">
                            <span className="font-semibold text-brand-300">Rationale: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!drillSubmitted ? (
                  <button
                    onClick={() => setDrillSubmitted(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Check Drill Answers
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDrillSubmitted(false);
                      setDrillAnswers({});
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
                  >
                    Reset Diagnostic Drill
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="glass-card p-8 rounded-2xl border border-dark-border text-center text-slate-400 text-xs">
            Select a topic on the left to begin targeted revision.
          </div>
        )}
      </div>
    </div>
  );
};
