import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, MapPin, Target } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const ConnectedRouteTimeline: React.FC = () => {
  const { activeRoadmap, stats, activeDayNumber, setActiveDayNumber, weakTopics } = useLearning();

  if (!activeRoadmap) return null;

  const currentStageIndex = Math.min(
    Math.floor((activeDayNumber - 1) / 7),
    activeRoadmap.stages.length - 1
  );

  return (
    <div className="bg-white border border-stone rounded p-6 sm:p-8 shadow-subtle space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-vermilion font-bold">
              SIGNATURE COMPONENT // ATLAS TRAJECTORY
            </span>
            <span className="text-[10px] font-mono text-graphite border-l border-stone pl-2">
              PLATE 04
            </span>
          </div>
          <h3 className="text-xl font-serif text-ink tracking-tight mt-0.5">
            Your learning route
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-graphite">STAGE {currentStageIndex + 1} OF {activeRoadmap.stages.length}</span>
          <Link
            to="/roadmap"
            className="text-vermilion font-semibold hover:underline flex items-center gap-1 text-xs"
          >
            <span>Full Syllabus</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Connected Milestone Timeline */}
      <div className="relative">
        {/* Connecting Line behind milestones */}
        <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-stone z-0">
          <div
            className="h-full bg-ink transition-all duration-700"
            style={{
              width: `${(currentStageIndex / (activeRoadmap.stages.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Milestone Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
          {activeRoadmap.stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;
            const startDay = idx * 7 + 1;
            const endDay = startDay + 6;

            // Check if there are weak topics detected in this stage's domain
            const hasRevisionNeeded =
              isCurrent && weakTopics.length > 0 && !weakTopics.every(w => w.mastered);

            let statusLabel = 'OPEN & READY';
            let statusColor = 'text-ink font-semibold';
            if (isCompleted) {
              statusLabel = 'COMPLETED';
              statusColor = 'text-sage-dark font-bold';
            } else if (hasRevisionNeeded) {
              statusLabel = 'REVISION ACTIVE';
              statusColor = 'text-vermilion font-bold';
            } else if (isCurrent) {
              statusLabel = 'IN PROGRESS';
              statusColor = 'text-vermilion font-bold';
            }

            return (
              <div
                key={stage.id}
                className={`p-4 rounded border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-paper-tint border-vermilion shadow-subtle ring-1 ring-vermilion/20'
                    : isCompleted
                    ? 'bg-white border-stone'
                    : 'bg-white border-stone hover:border-ink/40'
                }`}
              >
                <div>
                  {/* Top status & milestone badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                          isCompleted
                            ? 'bg-ink text-white'
                            : isCurrent
                            ? 'bg-vermilion text-white ring-4 ring-vermilion/15'
                            : 'bg-stone text-graphite-dark'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <span>0{idx + 1}</span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-graphite font-semibold">
                        DAYS {startDay}–{endDay}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono tracking-wider ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Stage Title & Details */}
                  <h4 className="text-sm font-bold text-ink mb-1.5 leading-snug">
                    {stage.title}
                  </h4>
                  <p className="text-xs text-graphite line-clamp-2 mb-3">
                    {stage.description}
                  </p>

                  {/* Key Topics Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {stage.topics.slice(0, 2).map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-white border border-stone text-[10px] font-mono text-ink-light"
                      >
                        {topic}
                      </span>
                    ))}
                    {stage.topics.length > 2 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-graphite">
                        +{stage.topics.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom stage actions */}
                <div className="pt-3 border-t border-stone-light flex items-center justify-between">
                  {isCurrent ? (
                    <Link
                      to={`/lesson/${activeDayNumber}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-vermilion hover:underline"
                    >
                      <span>Continue Day {activeDayNumber}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isCompleted ? (
                    <span className="text-[11px] font-mono text-sage-dark flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Stage Verified</span>
                    </span>
                  ) : (
                    <Link
                      to={`/lesson/${startDay}`}
                      className="text-[11px] font-mono font-semibold text-ink hover:text-vermilion flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Day {startDay < 10 ? `0${startDay}` : startDay}</span>
                      <ArrowRight className="w-3 h-3 text-vermilion" />
                    </Link>
                  )}

                  {stage.capstoneProject && (
                    <span className="text-[10px] font-mono text-graphite uppercase">
                      Capstone
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

