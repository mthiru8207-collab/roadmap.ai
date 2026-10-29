import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { QuizRunner } from '../components/quiz/QuizRunner';
import { DailyLesson } from '../types';
import { HelpCircle, ArrowLeft, Compass, Lock } from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    activeRoadmap,
    activeDayNumber,
    setActiveDayNumber,
    isQuizUnlocked,
    highestUnlockedQuizDay,
  } = useLearning();

  if (!activeRoadmap) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-white border border-stone rounded shadow-subtle my-12">
        <Compass className="w-8 h-8 text-vermilion mx-auto mb-3" />
        <h2 className="text-xl font-serif text-ink mb-2">No Active Roadmap</h2>
        <p className="text-xs text-graphite mb-6">
          Generate or select a roadmap to take daily comprehension quizzes.
        </p>
        <Link
          to="/setup"
          className="px-5 py-2.5 rounded bg-ink text-paper text-xs font-semibold hover:bg-ink-soft transition-colors"
        >
          Design Roadmap
        </Link>
      </div>
    );
  }

  const allLessons: DailyLesson[] = [];
  activeRoadmap.stages.forEach(st => allLessons.push(...st.lessons));

  const targetDay = id ? parseInt(id, 10) : activeDayNumber;
  const currentLesson =
    allLessons.find(l => l.dayNumber === targetDay || l.id === id) ||
    allLessons.find(l => l.dayNumber === activeDayNumber) ||
    allLessons[0];

  if (!currentLesson || !currentLesson.quizQuestions || currentLesson.quizQuestions.length === 0) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-white border border-stone rounded shadow-subtle my-12 space-y-4">
        <HelpCircle className="w-8 h-8 text-graphite mx-auto" />
        <h2 className="text-xl font-serif text-ink">Quiz Unit Initializing</h2>
        <p className="text-xs text-graphite">
          Questions for Day {targetDay} are being formulated.
        </p>
        <button
          onClick={() => navigate(`/lesson/${currentLesson?.dayNumber || 1}`)}
          className="px-4 py-2 rounded bg-ink text-paper text-xs font-semibold"
        >
          Return to Lesson
        </button>
      </div>
    );
  }

  // Check if upcoming quiz is locked
  const isLocked = !isQuizUnlocked(currentLesson.dayNumber);

  if (isLocked) {
    const requiredPrereqDay = currentLesson.dayNumber - 1;
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12">
        <Link
          to={`/lesson/${currentLesson.dayNumber}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-graphite hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO LESSON {currentLesson.dayNumber}</span>
        </Link>

        <div className="p-8 sm:p-10 rounded border border-stone bg-white shadow-subtle text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-paper-tint border border-stone-dark flex items-center justify-center mx-auto text-vermilion shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-vermilion">
              UPCOMING QUIZ LOCKED &bull; PREREQUISITE REQUIRED
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-ink font-bold">
              Day {currentLesson.dayNumber} Quiz is Locked
            </h2>
            <p className="text-xs sm:text-sm text-graphite max-w-md mx-auto leading-relaxed">
              To unlock this evaluation, you must first pass the <strong className="text-ink">Day {requiredPrereqDay} Quiz</strong> with at least 70% (4/5 questions correct).
            </p>
          </div>

          <div className="p-4 rounded bg-paper-subtle border border-stone-light text-left font-mono text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between items-center text-graphite">
              <span>Prerequisite Milestone:</span>
              <span className="text-vermilion font-bold">Pass Day {requiredPrereqDay} Quiz</span>
            </div>
            <div className="flex justify-between items-center text-graphite">
              <span>Highest Unlocked Quiz:</span>
              <span className="text-ink font-bold">Day {highestUnlockedQuizDay}</span>
            </div>
            <div className="flex justify-between items-center text-graphite">
              <span>Day {currentLesson.dayNumber} Curriculum:</span>
              <span className="text-emerald-700 font-bold">Reading Unlocked</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveDayNumber(highestUnlockedQuizDay);
                navigate(`/quiz/${highestUnlockedQuizDay}`);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-mono font-bold transition-all shadow-subtle cursor-pointer"
            >
              Take Day {highestUnlockedQuizDay} Quiz Now &rarr;
            </button>
            <button
              onClick={() => navigate(`/lesson/${currentLesson.dayNumber}`)}
              className="w-full sm:w-auto px-5 py-3 rounded border border-stone hover:border-ink bg-white text-xs font-mono font-bold text-ink transition-all cursor-pointer"
            >
              Read Day {currentLesson.dayNumber} Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleNextLesson = () => {
    const nextDay = currentLesson.dayNumber + 1;
    setActiveDayNumber(nextDay);
    navigate(`/lesson/${nextDay}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to={`/lesson/${currentLesson.dayNumber}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-graphite hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO LESSON {currentLesson.dayNumber}</span>
        </Link>
        <span className="text-[11px] font-mono text-vermilion font-bold">
          70% PASSING CRITERIA ENFORCED
        </span>
      </div>

      <QuizRunner
        lesson={currentLesson}
        onNextLesson={handleNextLesson}
        onOpenRevision={() => navigate('/progress')}
      />
    </div>
  );
};

