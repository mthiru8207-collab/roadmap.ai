import React from 'react';
import { CheckCircle2, Circle, ChevronRight, BookOpen, HelpCircle, Award, Sparkles } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ActivePage } from '../common/Sidebar';

interface RoadmapStagesOverviewProps {
  onNavigate: (page: ActivePage) => void;
}

export const RoadmapStagesOverview: React.FC<RoadmapStagesOverviewProps> = ({ onNavigate }) => {
  const { activeRoadmap, completedLessonIds, setActiveDayNumber, activeDayNumber } = useLearning();

  if (!activeRoadmap) return null;

  const handleOpenLesson = (dayNumber: number) => {
    setActiveDayNumber(dayNumber);
    onNavigate('lesson');
  };

  const handleOpenQuiz = (dayNumber: number) => {
    setActiveDayNumber(dayNumber);
    onNavigate('quiz');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Curriculum & Learning Stages</h3>
          <p className="text-xs text-slate-400">Step-by-step roadmap organized by ordered stages and daily lessons</p>
        </div>
      </div>

      <div className="space-y-6">
        {activeRoadmap.stages.map((stage, sIdx) => {
          const totalLessonsInStage = stage.lessons.length;
          const completedInStage = stage.lessons.filter(l => completedLessonIds.includes(l.id)).length;
          const stagePercent = totalLessonsInStage > 0 ? Math.round((completedInStage / totalLessonsInStage) * 100) : 0;

          return (
            <div
              key={stage.id}
              className="glass-card rounded-2xl border border-dark-border overflow-hidden"
            >
              {/* Stage Header */}
              <div className="p-5 border-b border-slate-800/80 bg-[#0F1626]/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Stage {stage.stageNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ~{stage.estimatedWeeks} Weeks
                    </span>
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-white tracking-tight">
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-2xl">{stage.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200">
                      {completedInStage} / {totalLessonsInStage} Days
                    </div>
                    <div className="text-[10px] text-brand-400 font-mono">{stagePercent}% Complete</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-dark-card border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                    {stagePercent}%
                  </div>
                </div>
              </div>

              {/* Topics Pills */}
              <div className="px-5 py-3 bg-[#0A0F1B]/60 border-b border-slate-800/60 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider self-center mr-1">
                  Core Topics:
                </span>
                {stage.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#121A2C] border border-[#1E293B] text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Lessons Grid */}
              <div className="p-4 space-y-2.5">
                {stage.lessons.length > 0 ? (
                  stage.lessons.map(lesson => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isCurrent = activeDayNumber === lesson.dayNumber;
                    const isAssessmentDay = lesson.dayNumber % 7 === 0;

                    return (
                      <div
                        key={lesson.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-brand-500/10 border-brand-500/40 shadow-sm'
                            : isCompleted
                            ? 'bg-[#0E1524]/60 border-slate-800/80 text-slate-300'
                            : 'bg-dark-surface border-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleOpenLesson(lesson.dayNumber)}
                            className="mt-0.5"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                Day {lesson.dayNumber}: {lesson.title.replace(/^Day \d+:\s*/, '')}
                              </span>
                              {isAssessmentDay && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-brand-accent/20 text-purple-300 border border-brand-accent/30 flex items-center gap-1">
                                  <Award className="w-2.5 h-2.5" />
                                  Week Milestone
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {lesson.summary}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => handleOpenLesson(lesson.dayNumber)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#162035] hover:bg-[#1E2C48] border border-slate-700/60 transition-colors flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                            <span>Lesson</span>
                          </button>
                          <button
                            onClick={() => handleOpenQuiz(lesson.dayNumber)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-600/80 hover:bg-brand-600 border border-brand-500/40 transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-brand-200" />
                            <span>Daily Quiz</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl bg-dark-surface/50 border border-slate-800 text-xs text-slate-400 text-center">
                    Subsequent stages will unlock dynamically as you progress through Stage 1.
                  </div>
                )}
              </div>

              {/* Capstone Deliverable Callout */}
              {stage.capstoneProject && (
                <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-r from-brand-900/30 to-brand-accent/20 border border-brand-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Stage Capstone Project: {stage.capstoneProject.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{stage.capstoneProject.description}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                    Capstone Ready
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
