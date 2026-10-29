import React, { useState, useMemo } from 'react';
import { DailyLesson, LearningStage } from '../../types';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  BookOpen,
  Award,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface InteractiveRoadmapAtlasProps {
  stages: LearningStage[];
  activeDayNumber: number;
  completedLessonIds: string[];
  isQuizUnlocked: (dayNumber: number) => boolean;
  onSelectLesson: (lesson: DailyLesson) => void;
  className?: string;
}

export const InteractiveRoadmapAtlas: React.FC<InteractiveRoadmapAtlasProps> = ({
  stages,
  activeDayNumber,
  completedLessonIds,
  isQuizUnlocked,
  onSelectLesson,
  className = '',
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<number | 'all'>('all');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Flatten all lessons across stages
  const allLessons = useMemo(() => {
    const list: (DailyLesson & { stageIndex: number; stageName: string })[] = [];
    stages.forEach((stage, sIdx) => {
      stage.lessons.forEach((l: DailyLesson) => {
        list.push({
          ...l,
          stageIndex: sIdx + 1,
          stageName: stage.title,
        });
      });
    });
    return list;
  }, [stages]);

  // Filter lessons based on stage selection
  const visibleLessons = useMemo(() => {
    if (selectedStageFilter === 'all') return allLessons;
    return allLessons.filter(l => l.stageIndex === selectedStageFilter);
  }, [allLessons, selectedStageFilter]);

  // Stage theme colors for visual subway/circuit lines
  const stageAccents = [
    { name: 'Stage 1: Foundations', color: '#879584', lineHex: '#879584', badge: 'W01–02' },
    { name: 'Stage 2: Core Engineering', color: '#3B82F6', lineHex: '#3B82F6', badge: 'W03–04' },
    { name: 'Stage 3: Advanced Systems', color: '#8B5CF6', lineHex: '#8B5CF6', badge: 'W05–06' },
    { name: 'Stage 4: Industry Capstone', color: '#F04B35', lineHex: '#F04B35', badge: 'W07–08' },
  ];

  return (
    <div className={`p-4 sm:p-6 rounded-xl border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-6 ${className}`}>
      {/* Upper Atlas Telemetry & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-light dark:border-[#20242E] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-vermilion animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-ink dark:text-[#F0F2F5] font-bold">
              PLATE 02 // INTERACTIVE CAREER TRAJECTORY ATLAS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-paper-tint dark:bg-[#1C2028] text-graphite dark:text-[#8A929E] border border-stone dark:border-[#282D38]">
              28 CONNECTED NODES
            </span>
          </div>
          <p className="text-xs text-graphite dark:text-[#8A929E] mt-1 font-sans">
            Click any day node along the trajectory circuit to inspect learning objectives, prerequisites, and practical deliverables.
          </p>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedStageFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
              selectedStageFilter === 'all'
                ? 'bg-ink dark:bg-vermilion text-white dark:text-white border-ink dark:border-vermilion shadow-xs'
                : 'bg-paper-tint dark:bg-[#181B22] text-graphite dark:text-[#8A929E] border-stone dark:border-[#262A34] hover:border-ink hover:text-ink dark:hover:text-white'
            }`}
          >
            All 28 Days Circuit
          </button>

          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setSelectedStageFilter(num)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                selectedStageFilter === num
                  ? 'bg-ink dark:bg-vermilion text-white dark:text-white border-ink dark:border-vermilion shadow-xs'
                  : 'bg-paper-tint dark:bg-[#181B22] text-graphite dark:text-[#8A929E] border-stone dark:border-[#262A34] hover:border-ink hover:text-ink dark:hover:text-white'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: stageAccents[num - 1]?.color || '#F04B35' }}
              />
              <span>Stage 0{num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Circuit Subway Route Map */}
      <div className="p-4 sm:p-6 rounded-lg bg-paper dark:bg-[#0A0B0E] border border-stone-light dark:border-[#1E222A] overflow-x-auto relative">
        {/* Technical Watermark */}
        <div className="absolute top-3 right-4 text-[10px] font-mono text-graphite/40 dark:text-[#454C58] select-none pointer-events-none">
          LAT 47°22'N // SWISS ATLAS PROJECTION // VOL 2026
        </div>

        {/* 4 Stages Progression Tracks */}
        <div className="min-w-[840px] space-y-8 py-2">
          {stages
            .filter((_, idx) => selectedStageFilter === 'all' || selectedStageFilter === idx + 1)
            .map((stage, stageIdx) => {
              const actualStageNumber = selectedStageFilter === 'all' ? stageIdx + 1 : Number(selectedStageFilter);
              const accent = stageAccents[actualStageNumber - 1] || stageAccents[0];
              const stageCompleted = stage.lessons.every((l: DailyLesson) => completedLessonIds.includes(l.id));

              return (
                <div key={stage.id} className="space-y-3 relative">
                  {/* Stage Header Line */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                        style={{ backgroundColor: accent.color }}
                      >
                        {actualStageNumber}
                      </div>
                      <span className="font-mono text-xs font-bold text-ink dark:text-[#F0F2F5] tracking-wide uppercase">
                        STAGE 0{actualStageNumber}: {stage.title}
                      </span>
                      <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E]">
                        ({stage.lessons.length} DAYS &bull; {stage.estimatedWeeks} WEEKS)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      {stageCompleted && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> STAGE VERIFIED
                        </span>
                      )}
                      <span className="text-graphite dark:text-[#8A929E] bg-white dark:bg-[#16181C] px-2 py-0.5 rounded border border-stone-light dark:border-[#242832]">
                        CHECKPOINT: DAY {actualStageNumber * 7}
                      </span>
                    </div>
                  </div>

                  {/* Subway Transit Arterial Track with 7 Nodes */}
                  <div className="relative pt-2 pb-4">
                    {/* Underlying Connecting Arterial Line */}
                    <div className="absolute top-[28px] left-6 right-6 h-1 bg-stone dark:bg-[#20242E] z-0 rounded" />
                    
                    {/* Active connecting line for verified lessons */}
                    <div
                      className="absolute top-[28px] left-6 h-1 z-0 rounded transition-all duration-500"
                      style={{
                        backgroundColor: accent.color,
                        width: `${
                          (stage.lessons.filter((l: DailyLesson) => completedLessonIds.includes(l.id)).length /
                            stage.lessons.length) *
                          100
                        }%`,
                      }}
                    />

                    {/* The 7 Day Nodes */}
                    <div className="grid grid-cols-7 gap-2 relative z-10">
                      {stage.lessons.map((lesson: DailyLesson, lIdx: number) => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        const isCurrent = lesson.dayNumber === activeDayNumber;
                        const isCheckpoint = lesson.dayNumber % 7 === 0;
                        const isHovered = hoveredDay === lesson.dayNumber;
                        const unlockedQuiz = isQuizUnlocked(lesson.dayNumber);

                        return (
                          <div
                            key={lesson.id}
                            onMouseEnter={() => setHoveredDay(lesson.dayNumber)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => onSelectLesson(lesson)}
                            className="cursor-pointer group flex flex-col items-center text-center select-none"
                          >
                            {/* The Interactive Node Ring */}
                            <div className="relative mb-2">
                              {/* Pulsing ring for active lesson */}
                              {isCurrent && (
                                <span className="absolute -inset-1.5 rounded-full bg-vermilion/20 dark:bg-vermilion/30 animate-ping" />
                              )}

                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 border-2 relative ${
                                  isCurrent
                                    ? 'bg-vermilion text-white border-white dark:border-[#121418] shadow-md scale-110 ring-2 ring-vermilion'
                                    : isDone
                                    ? 'bg-emerald-500 text-white border-white dark:border-[#121418] shadow-xs hover:scale-105'
                                    : isCheckpoint
                                    ? 'bg-white dark:bg-[#1A1D24] text-vermilion border-vermilion shadow-xs hover:scale-105'
                                    : 'bg-white dark:bg-[#16181C] text-ink dark:text-[#F0F2F5] border-stone dark:border-[#2C313C] hover:border-vermilion hover:scale-105'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <span>{lesson.dayNumber < 10 ? `0${lesson.dayNumber}` : lesson.dayNumber}</span>
                                )}

                                {/* Lock icon if upcoming quiz is strictly locked */}
                                {!unlockedQuiz && !isDone && (
                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-[#121418] border border-stone dark:border-[#242832] flex items-center justify-center">
                                    <Lock className="w-2 h-2 text-vermilion" />
                                  </span>
                                )}

                                {/* Checkpoint milestone flag */}
                                {isCheckpoint && !isDone && (
                                  <span className="absolute -top-1.5 -right-1 w-3.5 h-3.5 rounded-full bg-vermilion text-white flex items-center justify-center text-[8px] font-extrabold">
                                    ★
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Node Metadata & Day Title */}
                            <div className="w-full px-1">
                              <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E] block">
                                DAY {lesson.dayNumber}
                              </span>
                              <h5 className="text-[11px] font-semibold text-ink dark:text-[#F0F2F5] truncate group-hover:text-vermilion transition-colors leading-tight mt-0.5">
                                {lesson.title}
                              </h5>
                              <span className="text-[9px] font-mono text-graphite-light dark:text-[#6A7280] block mt-0.5">
                                {lesson.estimatedMinutes}m &bull; {isDone ? 'Passed' : isCurrent ? 'Resume' : 'Open'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Final Destination Pinnacle Banner: Day 28 Job Ready */}
        <div className="mt-6 p-4 rounded-lg bg-white dark:bg-[#121418] border border-vermilion/40 dark:border-vermilion/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-vermilion text-white flex items-center justify-center shadow-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-vermilion font-extrabold">
                  DESTINATION // 04: INDUSTRY READY AT DAY 28
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  FINAL PINNACLE
                </span>
              </div>
              <p className="text-xs text-graphite dark:text-[#8A929E] mt-0.5">
                Completing the 4 milestone assessments and stage capstones certifies technical competency for production interviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <span className="text-graphite dark:text-[#8A929E]">CEILING:</span>
            <span className="font-bold text-ink dark:text-[#F0F2F5] bg-paper-tint dark:bg-[#1A1D24] px-2.5 py-1 rounded border border-stone-light dark:border-[#262A34]">
              70% PASS DISCIPLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

