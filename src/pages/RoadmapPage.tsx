import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  MessageSquare,
  Sparkles,
  Clock,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Lock,
  Download,
  Share2,
  Map,
  Activity,
  Award,
  Search,
  Filter,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { DailyLesson } from '../types';
import { InteractiveRoadmapAtlas } from '../components/roadmap/InteractiveRoadmapAtlas';
import { LessonNodeInspector } from '../components/roadmap/LessonNodeInspector';
import { CompetencyRadarHub } from '../components/roadmap/CompetencyRadarHub';

type RoadmapViewMode = 'atlas' | 'matrix' | 'competency';

export const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRoadmap,
    activeDayNumber,
    completedLessonIds,
    isQuizUnlocked,
  } = useLearning();

  const [viewMode, setViewMode] = useState<RoadmapViewMode>('atlas');
  const [selectedInspectorLesson, setSelectedInspectorLesson] = useState<DailyLesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'stage-1': true,
    'stage-2': true,
    'stage-3': true,
    'stage-4': true,
  });

  if (!activeRoadmap) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-white dark:bg-[#121418] border border-stone dark:border-[#242832] rounded-xl shadow-subtle my-12">
        <Compass className="w-8 h-8 text-vermilion mx-auto mb-3" />
        <h2 className="text-xl font-serif text-ink dark:text-[#F0F2F5] mb-2">No Active Roadmap</h2>
        <p className="text-xs text-graphite dark:text-[#8A929E] mb-6">
          Generate a tailored learning roadmap to view the interactive trajectory atlas and stage breakdowns.
        </p>
        <Link
          to="/setup"
          className="px-5 py-2.5 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold transition-colors"
        >
          Design Roadmap
        </Link>
      </div>
    );
  }

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const expandAll = () => {
    const updated: Record<string, boolean> = {};
    activeRoadmap.stages.forEach(s => {
      updated[s.id] = true;
    });
    setExpandedStages(updated);
  };

  const collapseAll = () => {
    const updated: Record<string, boolean> = {};
    activeRoadmap.stages.forEach(s => {
      updated[s.id] = false;
    });
    setExpandedStages(updated);
  };

  const totalLessons = activeRoadmap.stages.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const handleExportBlueprint = () => {
    const exportData = {
      jobTitle: activeRoadmap.jobTitle,
      summary: activeRoadmap.summary,
      skillLevel: activeRoadmap.skillLevel,
      dailyTime: activeRoadmap.dailyTime,
      targetDuration: activeRoadmap.targetDuration,
      stagesCount: activeRoadmap.stages.length,
      totalLessons,
      completedLessons: completedCount,
      progressPercent,
      stages: activeRoadmap.stages.map(s => ({
        stageNumber: s.stageNumber,
        title: s.title,
        description: s.description,
        estimatedWeeks: s.estimatedWeeks,
        topics: s.topics,
        capstoneProject: s.capstoneProject,
        lessons: s.lessons.map(l => ({
          dayNumber: l.dayNumber,
          title: l.title,
          estimatedMinutes: l.estimatedMinutes,
          isCompleted: completedLessonIds.includes(l.id),
        })),
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-${activeRoadmap.jobTitle.replace(/\s+/g, '-').toLowerCase()}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Node Quick Inspector Drawer / Modal */}
      {selectedInspectorLesson && (
        <LessonNodeInspector
          lesson={selectedInspectorLesson}
          onClose={() => setSelectedInspectorLesson(null)}
          isCompleted={completedLessonIds.includes(selectedInspectorLesson.id)}
          isQuizUnlocked={isQuizUnlocked(selectedInspectorLesson.dayNumber)}
        />
      )}

      {/* Hero Editorial Masthead & Trajectory Specifications */}
      <div className="p-6 sm:p-8 rounded-xl border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-graphite dark:text-[#8A929E] border-b border-stone-light dark:border-[#20242E] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-paper-tint dark:bg-[#1A1D24] text-ink dark:text-[#F0F2F5] font-bold uppercase border border-stone dark:border-[#262A34]">
              SWISS CAREER ATLAS // 28-DAY ROUTE
            </span>
            <span className="text-stone-dark dark:text-[#383E4C]">&bull;</span>
            <span className="text-vermilion font-bold uppercase">{activeRoadmap.targetDuration} TIMELINE</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportBlueprint}
              className="flex items-center gap-1.5 px-3 py-1 rounded border border-stone dark:border-[#262A34] bg-white dark:bg-[#16181C] hover:bg-paper-tint dark:hover:bg-[#1E222A] text-xs font-mono font-medium text-ink dark:text-[#F0F2F5] transition-colors"
              title="Download full roadmap JSON blueprint"
            >
              <Download className="w-3.5 h-3.5 text-vermilion" />
              <span>Export Blueprint</span>
            </button>

            <span className="font-mono text-ink dark:text-[#F0F2F5] font-semibold">
              {completedCount} / {totalLessons} COMPLETED ({progressPercent}%)
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink dark:text-[#F0F2F5] tracking-tight">
              {activeRoadmap.jobTitle}
            </h1>
            <p className="text-xs sm:text-sm text-graphite dark:text-[#8A929E] leading-relaxed">
              {activeRoadmap.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to={`/lesson/${activeDayNumber}`}
              className="px-6 py-3 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-subtle transition-all"
            >
              <span>Resume Day {activeDayNumber < 10 ? `0${activeDayNumber}` : activeDayNumber} Lesson & Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/setup"
              className="px-4 py-3 rounded border border-stone dark:border-[#262A34] bg-white dark:bg-[#16181C] hover:bg-paper-tint dark:hover:bg-[#1E222A] text-xs font-mono font-semibold text-ink dark:text-[#F0F2F5] transition-colors"
            >
              Design New Track
            </Link>
          </div>
        </div>

        {/* 4 Specifications Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-1">
            <span className="text-graphite dark:text-[#7A8290] text-[10px] block">INITIAL LEVEL</span>
            <span className="font-bold text-ink dark:text-[#F0F2F5]">{activeRoadmap.skillLevel}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-1">
            <span className="text-graphite dark:text-[#7A8290] text-[10px] block">DAILY COMMITMENT</span>
            <span className="font-bold text-ink dark:text-[#F0F2F5]">{activeRoadmap.dailyTime} / day</span>
          </div>
          <div className="p-3.5 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-1">
            <span className="text-graphite dark:text-[#7A8290] text-[10px] block">TOTAL LESSONS</span>
            <span className="font-bold text-ink dark:text-[#F0F2F5]">{totalLessons} Ordered Units</span>
          </div>
          <div className="p-3.5 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-1">
            <span className="text-graphite dark:text-[#7A8290] text-[10px] block">PASS CRITERIA</span>
            <span className="font-bold text-sage-dark dark:text-emerald-400">70% Passing Ceiling</span>
          </div>
        </div>
      </div>

      {/* DISTINCTIVE 3-MODE ROADMAP DECK SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle gap-3">
        <div className="inline-flex p-1 rounded-md bg-paper-tint dark:bg-[#16181D] border border-stone-light dark:border-[#20242E]">
          <button
            onClick={() => setViewMode('atlas')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              viewMode === 'atlas'
                ? 'bg-ink dark:bg-vermilion text-white shadow-xs font-bold'
                : 'text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-[#F0F2F5]'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-vermilion" />
            <span>01 // Visual Trajectory Atlas</span>
          </button>

          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-ink dark:bg-vermilion text-white shadow-xs font-bold'
                : 'text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-[#F0F2F5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-vermilion" />
            <span>02 // Stage Milestone Matrix</span>
          </button>

          <button
            onClick={() => setViewMode('competency')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              viewMode === 'competency'
                ? 'bg-ink dark:bg-vermilion text-white shadow-xs font-bold'
                : 'text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-[#F0F2F5]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-vermilion" />
            <span>03 // Competency & Capstones</span>
          </button>
        </div>

        <div className="text-xs font-mono text-graphite dark:text-[#8A929E] px-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ALL 28 DAYS FULLY ACCESSIBLE</span>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE VISUAL TRAJECTORY ATLAS */}
      {viewMode === 'atlas' && (
        <InteractiveRoadmapAtlas
          stages={activeRoadmap.stages}
          activeDayNumber={activeDayNumber}
          completedLessonIds={completedLessonIds}
          isQuizUnlocked={isQuizUnlocked}
          onSelectLesson={(lesson) => setSelectedInspectorLesson(lesson)}
        />
      )}

      {/* VIEW MODE 2: STAGE MILESTONE MATRIX (EXPANDABLE EDITORIAL FEED) */}
      {viewMode === 'matrix' && (
        <div className="space-y-6 animate-fade-in">
          {/* Matrix Toolbar (Search & Expand/Collapse) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-white dark:bg-[#121418] border border-stone dark:border-[#242832]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-graphite dark:text-[#7A8290] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, lessons, or keywords..."
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded border border-stone dark:border-[#242832] bg-paper dark:bg-[#0E1013] text-ink dark:text-[#F0F2F5] focus:outline-hidden focus:border-vermilion transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 rounded border border-stone dark:border-[#242832] bg-paper-tint dark:bg-[#16181C] hover:bg-white dark:hover:bg-[#1E222A] text-graphite dark:text-[#8A929E] hover:text-ink transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 rounded border border-stone dark:border-[#242832] bg-paper-tint dark:bg-[#16181C] hover:bg-white dark:hover:bg-[#1E222A] text-graphite dark:text-[#8A929E] hover:text-ink transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Connected Stages Feed */}
          <div className="space-y-6">
            {activeRoadmap.stages.map((stage, sIdx) => {
              const isExpanded = expandedStages[stage.id] ?? true;
              const stageLessonsCompleted = stage.lessons.filter(l => completedLessonIds.includes(l.id)).length;
              const isStageFinished = stageLessonsCompleted === stage.lessons.length && stage.lessons.length > 0;

              // Filter lessons if searching
              const filteredLessons = stage.lessons.filter(l => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  l.title.toLowerCase().includes(q) ||
                  (l.summary && l.summary.toLowerCase().includes(q)) ||
                  stage.topics.some(t => t.toLowerCase().includes(q))
                );
              });

              if (searchQuery.trim() && filteredLessons.length === 0) return null;

              return (
                <div
                  key={stage.id}
                  className="bg-white dark:bg-[#121418] border border-stone dark:border-[#242832] rounded-xl shadow-subtle overflow-hidden"
                >
                  {/* Stage Header */}
                  <div
                    onClick={() => toggleStage(stage.id)}
                    className="p-6 sm:p-7 border-b border-stone-light dark:border-[#20242E] bg-paper-subtle/50 dark:bg-[#15171C] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-paper-tint/40 dark:hover:bg-[#1A1D24] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-ink dark:bg-vermilion text-white font-mono text-[10px] font-bold">
                          STAGE 0{sIdx + 1}
                        </span>
                        <span className="font-mono text-xs text-graphite dark:text-[#8A929E] uppercase">
                          WEEKS {sIdx * 2 + 1}&ndash;{sIdx * 2 + 2} &bull; {stage.estimatedWeeks} WEEKS
                        </span>
                        {isStageFinished && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>VERIFIED</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-serif font-bold text-ink dark:text-[#F0F2F5] tracking-tight">
                        {stage.title}
                      </h2>
                      <p className="text-xs text-graphite dark:text-[#8A929E] leading-relaxed max-w-2xl">
                        {stage.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-ink dark:text-[#F0F2F5] block">
                          {stageLessonsCompleted} / {stage.lessons.length}
                        </span>
                        <span className="text-[10px] font-mono text-graphite dark:text-[#7A8290]">Units Done</span>
                      </div>

                      <button className="p-1.5 rounded text-graphite dark:text-[#8A929E] hover:text-ink">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 sm:p-7 space-y-6">
                      {/* Topics Covered */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-graphite dark:text-[#7A8290] font-semibold block">
                          Domain Topics Covered:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {stage.topics.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded bg-paper-tint dark:bg-[#181B22] border border-stone-light dark:border-[#222630] text-xs font-mono text-ink dark:text-[#F0F2F5]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Daily Lessons List */}
                      <div className="space-y-2.5 pt-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-graphite dark:text-[#7A8290] font-semibold block">
                          Ordered Daily Lessons:
                        </span>
                        <div className="space-y-2">
                          {filteredLessons.map(lesson => {
                            const isDone = completedLessonIds.includes(lesson.id);
                            const isCurrent = lesson.dayNumber === activeDayNumber;

                            return (
                              <div
                                key={lesson.id}
                                className={`p-3.5 rounded-lg border flex items-center justify-between gap-4 transition-all ${
                                  isCurrent
                                    ? 'bg-paper-tint dark:bg-[#181B22] border-vermilion ring-1 ring-vermilion/30 shadow-subtle'
                                    : isDone
                                    ? 'bg-white dark:bg-[#121418] border-stone dark:border-[#222630]'
                                    : 'bg-white dark:bg-[#121418] border-stone dark:border-[#222630] hover:border-vermilion/50 shadow-subtle'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[11px] font-bold ${
                                      isDone
                                        ? 'bg-emerald-500 text-white'
                                        : isCurrent
                                        ? 'bg-vermilion text-white'
                                        : 'bg-paper dark:bg-[#1A1D24] border border-stone dark:border-[#282D38] text-ink dark:text-[#F0F2F5]'
                                    }`}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                      <span>{lesson.dayNumber < 10 ? `0${lesson.dayNumber}` : lesson.dayNumber}</span>
                                    )}
                                  </div>

                                  <div>
                                    <button
                                      onClick={() => setSelectedInspectorLesson(lesson)}
                                      className="text-xs sm:text-sm font-semibold text-ink dark:text-[#F0F2F5] hover:text-vermilion transition-colors block text-left"
                                    >
                                      {lesson.title}
                                    </button>
                                    <div className="text-[11px] text-graphite dark:text-[#8A929E] flex items-center gap-2 mt-0.5 font-mono">
                                      <span>{lesson.estimatedMinutes} mins</span>
                                      <span>&bull;</span>
                                      {isQuizUnlocked(lesson.dayNumber) ? (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Quiz Unlocked</span>
                                      ) : (
                                        <span className="text-graphite dark:text-[#7A8290] font-semibold flex items-center gap-1">
                                          <Lock className="w-2.5 h-2.5 text-vermilion" />
                                          <span>Quiz Locked</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => setSelectedInspectorLesson(lesson)}
                                    className="px-2.5 py-1.5 rounded border border-stone dark:border-[#242832] bg-white dark:bg-[#16181C] hover:bg-paper-tint dark:hover:bg-[#1E222A] text-xs font-mono font-medium text-graphite dark:text-[#8A929E] hover:text-ink transition-colors"
                                  >
                                    Inspect
                                  </button>

                                  <Link
                                    to={`/lesson/${lesson.dayNumber}`}
                                    className="px-3.5 py-1.5 rounded border border-vermilion/30 dark:border-vermilion/40 bg-white dark:bg-[#16181C] hover:bg-vermilion hover:text-white dark:hover:bg-vermilion text-xs font-mono font-bold text-vermilion transition-all shadow-subtle"
                                  >
                                    <span>{isDone ? 'Review' : 'Open Lab'} &rarr;</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Capstone Project Section */}
                      {stage.capstoneProject && (
                        <div className="p-5 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase text-vermilion font-bold">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Stage Capstone Deliverable: {stage.capstoneProject.title}</span>
                          </div>
                          <p className="text-xs text-graphite dark:text-[#8A929E] leading-relaxed">
                            {stage.capstoneProject.description}
                          </p>
                          {stage.capstoneProject.deliverables && (
                            <div className="pt-1 space-y-1">
                              <span className="text-[10px] font-mono text-graphite dark:text-[#7A8290] uppercase font-semibold">
                                Required Deliverables:
                              </span>
                              <ul className="list-disc list-inside text-xs text-ink dark:text-[#D4D8E0] space-y-0.5 pl-1">
                                {stage.capstoneProject.deliverables.map((d, dIdx) => (
                                  <li key={dIdx}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: COMPETENCY RADAR & PORTFOLIO DELIVERABLES */}
      {viewMode === 'competency' && (
        <div className="animate-fade-in">
          <CompetencyRadarHub
            stages={activeRoadmap.stages}
            roleTitle={activeRoadmap.jobTitle}
            completedLessonIds={completedLessonIds}
            totalLessons={totalLessons}
          />
        </div>
      )}

      {/* Professional Readiness Section (Portfolio, Resume, Interview & Job Search) */}
      <section className="bg-white dark:bg-[#121418] border border-stone dark:border-[#242832] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="border-b border-stone-light dark:border-[#20242E] pb-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-vermilion font-bold mb-1">
            CAREER INTEGRATION MODULES
          </div>
          <h2 className="text-2xl font-serif text-ink dark:text-[#F0F2F5] tracking-tight">
            Professional Transition & Industry Readiness
          </h2>
          <p className="text-xs text-graphite dark:text-[#8A929E] mt-1">
            Built into your roadmap to bridge technical learning with actual employment and hiring standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-2">
            <div className="w-7 h-7 rounded bg-white dark:bg-[#16181C] border border-stone dark:border-[#282D38] flex items-center justify-center text-ink dark:text-white">
              <Briefcase className="w-4 h-4 text-vermilion" />
            </div>
            <h3 className="text-xs font-bold text-ink dark:text-[#F0F2F5]">Portfolio Building</h3>
            <p className="text-[11px] text-graphite dark:text-[#8A929E] leading-relaxed">
              Curate 3 production-grade repositories with thorough READMEs, architecture diagrams, and live demos.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-2">
            <div className="w-7 h-7 rounded bg-white dark:bg-[#16181C] border border-stone dark:border-[#282D38] flex items-center justify-center text-ink dark:text-white">
              <FileText className="w-4 h-4 text-ink dark:text-[#F0F2F5]" />
            </div>
            <h3 className="text-xs font-bold text-ink dark:text-[#F0F2F5]">Resume Preparation</h3>
            <p className="text-[11px] text-graphite dark:text-[#8A929E] leading-relaxed">
              Format accomplishment bullets using the Google XYZ method with concrete metrics and tooling keywords.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-2">
            <div className="w-7 h-7 rounded bg-white dark:bg-[#16181C] border border-stone dark:border-[#282D38] flex items-center justify-center text-ink dark:text-white">
              <MessageSquare className="w-4 h-4 text-sage-dark dark:text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-ink dark:text-[#F0F2F5]">Interview Practice</h3>
            <p className="text-[11px] text-graphite dark:text-[#8A929E] leading-relaxed">
              Prepare system design case studies, behavioral STAR stories, and live whiteboarding technical drills.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-paper dark:bg-[#0E1013] border border-stone-light dark:border-[#20242E] space-y-2">
            <div className="w-7 h-7 rounded bg-white dark:bg-[#16181C] border border-stone dark:border-[#282D38] flex items-center justify-center text-ink dark:text-white">
              <Compass className="w-4 h-4 text-vermilion" />
            </div>
            <h3 className="text-xs font-bold text-ink dark:text-[#F0F2F5]">Job Search Strategy</h3>
            <p className="text-[11px] text-graphite dark:text-[#8A929E] leading-relaxed">
              Target high-signal companies, leverage warm engineering intros, and track multi-stage pipeline status.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
