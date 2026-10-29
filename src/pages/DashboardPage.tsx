import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  HelpCircle,
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
  Calendar,
  Sparkles,
  BarChart2,
  AlertCircle,
  CheckSquare,
  Lock,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { ConnectedRouteTimeline } from '../components/dashboard/ConnectedRouteTimeline';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRoadmap,
    stats,
    activeDayNumber,
    studyLogs,
    quizAttempts,
    weeklyAttempts,
    completedLessonIds,
    weakTopics,
    isQuizUnlocked,
  } = useLearning();

  // Date format: e.g. "Wednesday, October 28, 2026"
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Find today's active lesson
  const allLessons = activeRoadmap?.stages.flatMap(s => s.lessons) || [];
  const todayLesson =
    allLessons.find(l => l.dayNumber === activeDayNumber) || allLessons[0];

  const currentStage = activeRoadmap?.stages.find(
    s => todayLesson && s.lessons.some(l => l.id === todayLesson.id)
  ) || activeRoadmap?.stages[0];

  // Calculate assessment checkpoint info
  const currentWeekNumber = Math.ceil(activeDayNumber / 7);
  const nextCheckpointDay = currentWeekNumber * 7;
  const daysUntilCheckpoint = Math.max(0, nextCheckpointDay - activeDayNumber);
  const checkpointQuestions = 10;
  const checkpointRequiredToPass = Math.ceil(checkpointQuestions * 0.7); // 7

  // Real recent quiz attempts
  const recentQuizzes = quizAttempts.slice(-3).reverse();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. Main Header */}
      <div className="border-b border-stone pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] text-graphite uppercase tracking-wider">
                {formattedToday}
              </span>
              <span className="text-stone-dark">&bull;</span>
              <span className="font-mono text-[11px] text-vermilion font-bold uppercase tracking-wider">
                DAY {stats.currentDay} OF {stats.totalDays}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight">
              Make today count.
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-graphite">
              <span className="font-medium text-ink">
                Career: <strong className="text-ink">{activeRoadmap?.jobTitle || 'Career Trajectory'}</strong>
              </span>
              <span className="text-stone">&bull;</span>
              <span>
                Stage: <strong className="text-ink">{currentStage ? currentStage.title : 'Stage 1'}</strong>
              </span>
              <span className="text-stone">&bull;</span>
              <span>
                Level: <strong className="text-ink">{activeRoadmap?.skillLevel || 'Intermediate'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/setup"
              className="px-3.5 py-2.5 rounded border border-stone bg-white hover:bg-paper-subtle text-xs font-semibold text-ink transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-vermilion" />
              <span>Change Path</span>
            </Link>

            <Link
              to={`/lesson/${activeDayNumber}`}
              className="px-5 py-2.5 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center gap-2 transition-colors shadow-subtle group"
            >
              <span>Continue learning</span>
              <ArrowRight className="w-3.5 h-3.5 text-vermilion group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Today's Focus Section */}
      <section className="bg-paper-subtle border border-stone rounded p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-vermilion text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                TODAY'S FOCUS &bull; DAY 0{activeDayNumber}
              </span>
              <span className="text-xs font-mono text-graphite flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {todayLesson?.estimatedMinutes || 45} MIN ESTIMATE
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-ink tracking-tight font-medium">
                {todayLesson?.title || `Day ${activeDayNumber}: Core Practice`}
              </h2>
              <p className="text-xs sm:text-sm text-graphite-dark mt-1 leading-relaxed">
                {todayLesson?.summary || 'Deepen technical comprehension through guided reading and practical tasks.'}
              </p>
            </div>

            {/* Objectives checklist preview */}
            {todayLesson?.objectives && todayLesson.objectives.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-graphite font-semibold block">
                  Today's Objectives:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {todayLesson.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-ink-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-vermilion mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-stone lg:pl-6 space-y-3 flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-graphite">
                VERIFICATION METRIC
              </div>
              <div className="text-xs text-graphite leading-relaxed">
                Complete the daily lesson, implement the exercise, and achieve &ge; 70% on the 5-question comprehension quiz.
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <Link
                to={`/lesson/${activeDayNumber}`}
                className="w-full py-3 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-bold uppercase tracking-wider font-mono text-center transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Start Lesson</span>
              </Link>
              <Link
                to={`/quiz/${activeDayNumber}`}
                className="w-full py-2.5 rounded border border-stone bg-white hover:bg-paper-tint text-xs font-semibold text-ink text-center transition-colors flex items-center justify-center gap-1.5"
              >
                {isQuizUnlocked(activeDayNumber) ? (
                  <>
                    <HelpCircle className="w-3.5 h-3.5 text-graphite" />
                    <span>Jump to Quiz (5Q)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-vermilion" />
                    <span>Quiz Locked (Day {activeDayNumber - 1} Req.)</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Your Route (The Signature Component) */}
      <section>
        <ConnectedRouteTimeline />
      </section>

      {/* 4. Asymmetrical Split: Weekly Checkpoint & Learning Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Checkpoint (5 columns) */}
        <section className="lg:col-span-5 bg-white border border-stone rounded p-6 shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-stone pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-vermilion" />
              <h3 className="font-serif text-lg text-ink font-medium">Weekly Checkpoint</h3>
            </div>
            <span className="font-mono text-[10px] text-graphite uppercase">
              MILESTONE {currentWeekNumber}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-graphite">Upcoming Assessment</span>
              <span className="font-mono text-xs font-bold text-ink">
                Week 0{currentWeekNumber} Comprehensive
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded bg-paper-tint border border-stone-light">
                <div className="font-mono text-lg font-bold text-ink">{checkpointQuestions}</div>
                <div className="text-[10px] font-mono text-graphite">QUESTIONS</div>
              </div>
              <div className="p-3 rounded bg-paper-tint border border-stone-light">
                <div className="font-mono text-lg font-bold text-vermilion">70%</div>
                <div className="text-[10px] font-mono text-graphite">THRESHOLD</div>
              </div>
              <div className="p-3 rounded bg-paper-tint border border-stone-light">
                <div className="font-mono text-lg font-bold text-ink">
                  {checkpointRequiredToPass} / {checkpointQuestions}
                </div>
                <div className="text-[10px] font-mono text-graphite">TO PASS</div>
              </div>
            </div>

            <p className="text-xs text-graphite leading-relaxed">
              Synthesizes recall, structural understanding, and practical scenario problems from Days 01 through 07.
            </p>

            <div className="pt-2">
              <Link
                to="/assessment"
                className="w-full py-2.5 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Launch Weekly Assessment</span>
                <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
              </Link>
            </div>
          </div>
        </section>

        {/* Real Learning Activity (7 columns) */}
        <section className="lg:col-span-7 bg-white border border-stone rounded p-6 shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-stone pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-ink" />
              <h3 className="font-serif text-lg text-ink font-medium">Recorded Activity</h3>
            </div>
            <span className="font-mono text-[10px] text-graphite">
              ACTIVE STREAK: {stats.currentStreakDays} DAYS
            </span>
          </div>

          {/* Activity Bar Chart based on real studyActivity logs */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-28 pt-4 pb-1 border-b border-stone-light px-2">
              {studyLogs.slice(-7).map((log, idx) => {
                const maxMinutes = 90;
                const heightPercent = Math.min(100, Math.max(15, (log.minutesSpent / maxMinutes) * 100));
                const dayLabel = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] font-mono text-graphite opacity-0 group-hover:opacity-100 transition-opacity">
                      {log.minutesSpent}m
                    </span>
                    <div className="w-full max-w-[28px] bg-stone-light rounded-t relative overflow-hidden flex items-end" style={{ height: '70px' }}>
                      <div
                        className="w-full bg-ink rounded-t transition-all duration-500 group-hover:bg-vermilion"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-graphite uppercase">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-1 text-center">
              <div>
                <span className="text-xs text-graphite block">Lessons Finished</span>
                <span className="font-mono text-base font-bold text-ink">
                  {stats.completedLessons} / {stats.totalDays}
                </span>
              </div>
              <div className="border-x border-stone-light">
                <span className="text-xs text-graphite block">Quizzes Passed</span>
                <span className="font-mono text-base font-bold text-ink">
                  {stats.passedQuizzes}
                </span>
              </div>
              <div>
                <span className="text-xs text-graphite block">Mastery Score</span>
                <span className="font-mono text-base font-bold text-sage-dark">
                  {stats.completionPercent}%
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 5. Recent Work & Weak Topics Strip */}
      <section className="bg-paper-tint/60 border border-stone rounded p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone pb-3">
          <div>
            <h3 className="font-serif text-lg text-ink font-medium">Recent Work & Records</h3>
            <p className="text-xs text-graphite">Verified quiz attempts and lesson completions.</p>
          </div>
          <Link
            to="/progress"
            className="text-xs font-mono text-vermilion font-semibold hover:underline flex items-center gap-1"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentQuizzes.length > 0 ? (
            recentQuizzes.map(attempt => (
              <div
                key={attempt.id}
                className="p-4 rounded bg-white border border-stone space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink">
                    DAY 0{attempt.dayNumber} QUIZ
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      attempt.passed
                        ? 'bg-sage-light text-sage-dark'
                        : 'bg-vermilion-light text-vermilion'
                    }`}
                  >
                    {attempt.passed ? 'PASSED 70%' : 'NEEDS REVISION'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-graphite">
                  <span>Score achieved</span>
                  <span className="font-mono font-bold text-ink">
                    {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                  </span>
                </div>
                {attempt.weakTopics && attempt.weakTopics.length > 0 && (
                  <div className="text-[11px] text-vermilion font-mono pt-1">
                    Review: {attempt.weakTopics.join(', ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-6 text-xs text-graphite">
              No recent quiz submissions yet. Start your first lesson to record progress.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
