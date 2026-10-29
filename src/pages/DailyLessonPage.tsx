import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { LessonContent } from '../components/lesson/LessonContent';
import { DailyLesson } from '../types';
import { StudyTimer } from '../components/student/StudyTimer';
import { AiStudyTutor } from '../components/student/AiStudyTutor';
import { InterviewFlashcards } from '../components/student/InterviewFlashcards';
import { LessonNotesDrawer } from '../components/student/LessonNotesDrawer';
import { StudentConsoleDeck, StudentTab } from '../components/student/StudentConsoleDeck';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Layers,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ListOrdered,
  X,
  ExternalLink,
  Lock,
  MessageSquare,
  Bookmark,
  FileText,
  Clock,
} from 'lucide-react';


export const DailyLessonPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    activeRoadmap,
    activeDayNumber,
    setActiveDayNumber,
    completedLessonIds,
    toggleLessonCompleted,
    isQuizUnlocked,
    highestUnlockedQuizDay,
  } = useLearning();

  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>(() => {
    const initialDay = id ? parseInt(id, 10) : activeDayNumber;
    return Math.ceil((initialDay || 1) / 7);
  });
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState<StudentTab>('lesson');

  if (!activeRoadmap) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-white dark:bg-dark-card border border-stone dark:border-dark-border rounded shadow-subtle my-12">
        <Compass className="w-8 h-8 text-vermilion mx-auto mb-3" />
        <h2 className="text-xl font-serif text-ink dark:text-dark-ink mb-2">No Active Roadmap</h2>
        <p className="text-xs text-graphite dark:text-dark-muted mb-6">
          Initialize or select a career roadmap to view daily curriculum units.
        </p>
        <Link
          to="/setup"
          className="px-5 py-2.5 rounded bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg text-xs font-semibold hover:bg-ink-soft transition-colors"
        >
          Design Roadmap
        </Link>
      </div>
    );
  }

  // Flatten lessons from all stages
  const allLessons: DailyLesson[] = [];
  activeRoadmap.stages.forEach(stage => {
    allLessons.push(...stage.lessons);
  });

  // Resolve requested day from param or context
  const targetDay = id ? parseInt(id, 10) : activeDayNumber;
  const currentLesson =
    allLessons.find(l => l.dayNumber === targetDay || l.id === id) ||
    allLessons.find(l => l.dayNumber === activeDayNumber) ||
    allLessons[0];

  if (!currentLesson) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-white dark:bg-dark-card border border-stone dark:border-dark-border rounded shadow-subtle my-12">
        <h2 className="text-xl font-serif text-ink dark:text-dark-ink mb-2">Day Not Found</h2>
        <p className="text-xs text-graphite dark:text-dark-muted mb-4">
          The requested lesson day does not exist in this curriculum.
        </p>
        <button
          onClick={() => navigate('/lesson/1')}
          className="px-4 py-2 rounded bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg text-xs font-semibold"
        >
          Return to Day 1
        </button>
      </div>
    );
  }

  const isCompleted = completedLessonIds.includes(currentLesson.id);

  const handlePrevDay = () => {
    if (currentLesson.dayNumber > 1) {
      const prevDay = currentLesson.dayNumber - 1;
      setActiveDayNumber(prevDay);
      setSelectedWeek(Math.ceil(prevDay / 7));
      navigate(`/lesson/${prevDay}`);
    }
  };

  const handleNextDay = () => {
    if (currentLesson.dayNumber < allLessons.length) {
      const nextDay = currentLesson.dayNumber + 1;
      setActiveDayNumber(nextDay);
      setSelectedWeek(Math.ceil(nextDay / 7));
      navigate(`/lesson/${nextDay}`);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    setActiveDayNumber(dayNum);
    setSelectedWeek(Math.ceil(dayNum / 7));
    navigate(`/lesson/${dayNum}`);
  };

  const handleOpenQuiz = () => {
    if (!isCompleted) {
      toggleLessonCompleted(currentLesson.id);
    }
    navigate(`/quiz/${currentLesson.dayNumber}`);
  };

  // Filter lessons based on selected week
  const displayedLessons =
    selectedWeek === 'all'
      ? allLessons
      : allLessons.filter(l => Math.ceil(l.dayNumber / 7) === selectedWeek);

  const currentWeekNumber = Math.ceil(currentLesson.dayNumber / 7);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Editorial Stepper & Curriculum Navigator */}
      <div className="bg-white dark:bg-dark-card p-5 rounded border border-stone dark:border-dark-border shadow-subtle space-y-4">
        {/* Top Header: Unlocked Status, Study Timer & Directory Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-light dark:border-dark-border text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <span className="font-bold text-ink dark:text-dark-ink uppercase tracking-wider text-xs">
              ALL 28 DAYS UNLOCKED &bull; 100% OPEN CURRICULUM
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Embedded Pomodoro Study Timer */}
            <StudyTimer variant="compact" />

            {/* All 28 Days Modal Launcher */}
            <button
              onClick={() => setShowDirectoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone dark:border-dark-border hover:border-ink dark:hover:border-dark-muted bg-paper-subtle dark:bg-dark-surface hover:bg-paper-tint text-xs font-mono font-semibold text-ink dark:text-dark-ink transition-colors cursor-pointer shadow-2xs"
            >
              <ListOrdered className="w-3.5 h-3.5 text-vermilion" />
              <span className="hidden sm:inline">Browse Index</span>
              <span className="sm:hidden">Index</span>
            </button>
          </div>
        </div>

        {/* Week Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-graphite dark:text-dark-muted uppercase tracking-wider mr-1">
            Section:
          </span>
          {[
            { num: 1, label: 'W01: Days 01–07' },
            { num: 2, label: 'W02: Days 08–14' },
            { num: 3, label: 'W03: Days 15–21' },
            { num: 4, label: 'W04: Days 22–28' },
          ].map(w => {
            const isTabActive = selectedWeek === w.num;
            const hasCurrentLesson = currentWeekNumber === w.num;
            return (
              <button
                key={w.num}
                onClick={() => setSelectedWeek(w.num)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg border-ink dark:border-dark-ink shadow-sm'
                    : 'bg-paper-tint dark:bg-dark-surface text-graphite-dark dark:text-dark-muted border-stone dark:border-dark-border hover:border-ink hover:text-ink'
                }`}
              >
                <span>{w.label}</span>
                {hasCurrentLesson && !isTabActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border cursor-pointer ${
              selectedWeek === 'all'
                ? 'bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg border-ink dark:border-dark-ink shadow-sm'
                : 'bg-paper-tint dark:bg-dark-surface text-graphite-dark dark:text-dark-muted border-stone dark:border-dark-border hover:border-ink hover:text-ink'
            }`}
          >
            All 28 Days View
          </button>
        </div>

        {/* Days Stepper Bar with Prev / Next */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handlePrevDay}
            disabled={currentLesson.dayNumber <= 1}
            className="px-3.5 py-2.5 rounded border border-stone dark:border-dark-border text-xs font-mono font-bold text-ink dark:text-dark-ink hover:bg-paper-subtle dark:hover:bg-dark-surface disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5 transition-colors shrink-0 shadow-subtle cursor-pointer"
            title="Go to previous day"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-bold">PREV DAY</span>
          </button>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-thin">
            {displayedLessons.map(lesson => {
              const isSelected = lesson.dayNumber === currentLesson.dayNumber;
              const isDone = completedLessonIds.includes(lesson.id);
              const isCheckpoint = lesson.dayNumber % 7 === 0;
              const quizUnlocked = isQuizUnlocked(lesson.dayNumber);

              let pillStyles = 'bg-paper-tint dark:bg-dark-surface border-stone dark:border-dark-border text-ink dark:text-dark-ink hover:border-ink';
              if (isSelected) {
                pillStyles = 'bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg border-ink dark:border-dark-ink ring-2 ring-vermilion font-bold shadow-sm';
              } else if (isDone) {
                pillStyles = 'bg-sage-light dark:bg-sage/20 border-sage text-sage-dark dark:text-sage font-semibold';
              } else if (isCheckpoint) {
                pillStyles = 'bg-vermilion-light dark:bg-vermilion/20 border-vermilion text-vermilion font-bold';
              }

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectDay(lesson.dayNumber)}
                  className={`w-9 h-9 rounded font-mono text-xs flex items-center justify-center shrink-0 border transition-all cursor-pointer relative ${pillStyles}`}
                  title={`Day ${lesson.dayNumber}: ${lesson.title}${!quizUnlocked ? ' (Quiz Locked until prerequisite)' : ''}`}
                >
                  <span>{lesson.dayNumber < 10 ? `0${lesson.dayNumber}` : lesson.dayNumber}</span>
                  {!quizUnlocked && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-paper dark:bg-dark-bg border border-stone dark:border-dark-border flex items-center justify-center">
                      <Lock className="w-2 h-2 text-vermilion" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextDay}
            disabled={currentLesson.dayNumber >= allLessons.length}
            className="px-3.5 py-2.5 rounded border border-stone dark:border-dark-border text-xs font-mono font-bold text-ink dark:text-dark-ink hover:bg-paper-subtle dark:hover:bg-dark-surface disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5 transition-colors shrink-0 shadow-subtle cursor-pointer"
            title="Go to next day"
          >
            <span className="font-bold">NEXT DAY</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Complete 28-Day Curriculum Directory Modal */}
      {showDirectoryModal && (
        <div className="fixed inset-0 bg-ink/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-dark-card border border-stone dark:border-dark-border rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-elevation overflow-hidden">
            <div className="p-5 border-b border-stone-light dark:border-dark-border flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink dark:text-dark-ink">
                  Complete 28-Day Curriculum Directory
                </h3>
                <p className="text-xs text-graphite dark:text-dark-muted font-mono">
                  All 28 days are fully unlocked. Click any day to jump directly to its lesson & quiz.
                </p>
              </div>
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="p-1.5 rounded hover:bg-paper dark:hover:bg-dark-surface text-graphite dark:text-dark-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {activeRoadmap.stages.map((stage, stageIdx) => (
                <div key={stage.id} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-light dark:border-dark-border pb-1.5">
                    <span className="font-mono text-xs font-bold text-vermilion uppercase tracking-wider">
                      Stage 0{stageIdx + 1}: {stage.title} (Week {stageIdx + 1})
                    </span>
                    <span className="text-[11px] font-mono text-graphite dark:text-dark-muted">
                      7 Days &bull; Assessment at Day {(stageIdx + 1) * 7}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {stage.lessons.map(lesson => {
                      const isDone = completedLessonIds.includes(lesson.id);
                      const isCur = lesson.dayNumber === currentLesson.dayNumber;
                      const isCheckpoint = lesson.dayNumber % 7 === 0;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            handleSelectDay(lesson.dayNumber);
                            setShowDirectoryModal(false);
                          }}
                          className={`p-3 rounded border text-left flex items-start gap-3 transition-all cursor-pointer ${
                            isCur
                              ? 'bg-paper-tint dark:bg-dark-surface border-vermilion ring-1 ring-vermilion shadow-xs'
                              : isDone
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
                              : 'bg-white dark:bg-dark-card border-stone dark:border-dark-border hover:border-ink hover:bg-paper-tint'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                              isCur
                                ? 'bg-ink dark:bg-dark-ink text-white dark:text-dark-bg'
                                : isDone
                                ? 'bg-sage-light text-sage-dark border border-sage'
                                : isCheckpoint
                                ? 'bg-vermilion text-white'
                                : 'bg-paper-subtle dark:bg-dark-surface border border-stone dark:border-dark-border text-ink dark:text-dark-ink'
                            }`}
                          >
                            {lesson.dayNumber < 10 ? `0${lesson.dayNumber}` : lesson.dayNumber}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-ink dark:text-dark-ink truncate">
                                {lesson.title}
                              </span>
                              {isCheckpoint && (
                                <span className="text-[9px] font-mono text-vermilion font-bold bg-vermilion/10 px-1 rounded">
                                  TEST
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-graphite dark:text-dark-muted font-mono mt-0.5 flex items-center gap-2">
                              <span>{lesson.estimatedMinutes} mins</span>
                              <span>&bull;</span>
                              {isQuizUnlocked(lesson.dayNumber) ? (
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Quiz Unlocked</span>
                              ) : (
                                <span className="text-graphite dark:text-dark-muted font-semibold flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5 text-vermilion" />
                                  <span>Quiz Locked</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-stone dark:border-dark-border bg-paper dark:bg-dark-bg flex justify-end">
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="px-4 py-2 rounded bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg text-xs font-mono font-bold hover:bg-ink-soft cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIQUE SWISS EDITORIAL COMMAND & WORKBENCH DECK */}
      <StudentConsoleDeck
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        dayNumber={currentLesson.dayNumber}
        totalDays={allLessons.length || 28}
        roleTitle={activeRoadmap.jobTitle}
        stageName={currentLesson.stageName}
      />

      {/* Main Content Area: Switches based on Active Student Tab */}
      {activeTab === 'lesson' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article (9 columns) */}
          <div className="lg:col-span-9">
            <LessonContent
              lesson={currentLesson}
              isCompleted={isCompleted}
              isQuizUnlocked={isQuizUnlocked(currentLesson.dayNumber)}
              highestUnlockedQuizDay={highestUnlockedQuizDay}
              onToggleComplete={() => toggleLessonCompleted(currentLesson.id)}
              onOpenQuiz={handleOpenQuiz}
            />
          </div>

          {/* Sticky Table of Contents & Quick Action Sidebar (3 columns) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5">
            {/* Progress Card */}
            <div className="bg-white dark:bg-dark-card p-5 rounded border border-stone dark:border-dark-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-stone-light dark:border-dark-border pb-2">
                <span className="text-xs font-mono font-semibold text-graphite dark:text-dark-muted uppercase tracking-wider">
                  Lesson Status
                </span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    isCompleted
                      ? 'bg-sage-light text-sage-dark border border-sage'
                      : 'bg-paper dark:bg-dark-surface text-graphite dark:text-dark-muted border border-stone dark:border-dark-border'
                  }`}
                >
                  {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-graphite dark:text-dark-muted">
                  <span>Stage:</span>
                  <span className="text-ink dark:text-dark-ink font-semibold truncate max-w-[120px]">{currentLesson.stageName}</span>
                </div>
                <div className="flex justify-between text-graphite dark:text-dark-muted">
                  <span>Target Time:</span>
                  <span className="text-ink dark:text-dark-ink font-semibold">{currentLesson.estimatedMinutes} min</span>
                </div>
                <div className="flex justify-between text-graphite dark:text-dark-muted">
                  <span>Quiz Lock:</span>
                  <span className={isQuizUnlocked(currentLesson.dayNumber) ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-vermilion font-bold'}>
                    {isQuizUnlocked(currentLesson.dayNumber) ? 'Unlocked (4/5)' : `Req. Day ${currentLesson.dayNumber - 1}`}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-light dark:border-dark-border space-y-2">
                {!isQuizUnlocked(currentLesson.dayNumber) ? (
                  <button
                    onClick={handleOpenQuiz}
                    className="w-full py-2.5 px-3 rounded bg-paper-tint dark:bg-dark-surface text-graphite dark:text-dark-muted border border-stone dark:border-dark-border text-xs font-mono font-semibold hover:border-ink hover:text-ink transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-vermilion" />
                    <span>Quiz Locked</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenQuiz}
                    className="w-full py-2.5 px-3 rounded bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-dark transition-colors flex items-center justify-center gap-1.5 shadow-subtle cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Take 5-Q Mastery Quiz</span>
                  </button>
                )}

                <button
                  onClick={() => toggleLessonCompleted(currentLesson.id)}
                  className={`w-full py-2 px-3 rounded border text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCompleted
                      ? 'border-sage bg-sage-light text-sage-dark hover:bg-white'
                      : 'border-stone dark:border-dark-border text-ink dark:text-dark-ink hover:border-ink hover:bg-paper-tint'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Mark as Unread' : 'Mark as Complete'}</span>
                </button>
              </div>
            </div>

            {/* Quick Student Tools Card */}
            <div className="bg-white dark:bg-dark-card p-4 rounded border border-stone dark:border-dark-border shadow-subtle space-y-2.5 font-mono text-xs">
              <span className="text-[10px] text-graphite dark:text-dark-muted uppercase font-bold tracking-wider block border-b border-stone-light dark:border-dark-border pb-1.5">
                Quick Study Switcher
              </span>
              <button
                onClick={() => setActiveTab('tutor')}
                className="w-full p-2 rounded text-left border border-stone-light dark:border-dark-border hover:border-vermilion hover:bg-paper-tint dark:hover:bg-dark-surface transition-colors flex items-center justify-between text-ink dark:text-dark-ink"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-vermilion" />
                  <span>Ask AI Tutor</span>
                </div>
                <span className="text-[10px] text-vermilion font-bold">&rarr;</span>
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className="w-full p-2 rounded text-left border border-stone-light dark:border-dark-border hover:border-vermilion hover:bg-paper-tint dark:hover:bg-dark-surface transition-colors flex items-center justify-between text-ink dark:text-dark-ink"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-vermilion" />
                  <span>Interview Flashcards</span>
                </div>
                <span className="text-[10px] text-vermilion font-bold">&rarr;</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className="w-full p-2 rounded text-left border border-stone-light dark:border-dark-border hover:border-vermilion hover:bg-paper-tint dark:hover:bg-dark-surface transition-colors flex items-center justify-between text-ink dark:text-dark-ink"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-vermilion" />
                  <span>Jot Study Notes</span>
                </div>
                <span className="text-[10px] text-vermilion font-bold">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 1-on-1 AI Tutor */}
      {activeTab === 'tutor' && (
        <div className="space-y-4">
          <AiStudyTutor
            lessonTitle={currentLesson.title}
            lessonDay={currentLesson.dayNumber}
            role={activeRoadmap.jobTitle}
            codeContext={currentLesson.codeSnippet?.code}
          />
        </div>
      )}

      {/* Tab 3: Interview Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-4">
          <InterviewFlashcards lesson={currentLesson} />
        </div>
      )}

      {/* Tab 4: Study Notes & Deliverable Repo */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <LessonNotesDrawer lesson={currentLesson} />
        </div>
      )}
    </div>
  );
};
