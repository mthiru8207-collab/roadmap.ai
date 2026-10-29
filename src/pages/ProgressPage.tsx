import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const ProgressPage: React.FC = () => {
  const {
    activeRoadmap,
    stats,
    quizAttempts,
    weeklyAttempts,
    weakTopics,
    studyLogs,
    completedLessonIds,
    markWeakTopicMastered,
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'all' | 'quizzes' | 'assessments' | 'revision'>('all');

  const unmasteredWeakTopics = weakTopics.filter(t => !t.mastered);
  const totalLessons = activeRoadmap?.stages.reduce((acc, s) => acc + s.lessons.length, 0) || 28;
  const milestonesCompleted = activeRoadmap?.stages.filter(s =>
    s.lessons.every(l => completedLessonIds.includes(l.id))
  ).length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Editorial Header */}
      <div className="border-b border-stone pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-vermilion font-bold">
            AUDIT TRAIL // LEARNING METRICS
          </span>
          <span className="text-stone-dark">&bull;</span>
          <span className="font-mono text-[10px] text-graphite uppercase">
            RECORDED ON-DEVICE & CLOUD
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight">
          Progress & Verification Ledger
        </h1>
        <p className="text-xs sm:text-sm text-graphite mt-1.5 max-w-2xl leading-relaxed">
          Deterministic records of all lesson readings, 70% threshold quiz attempts, cumulative checkpoints, and detected weak topics.
        </p>
      </div>

      {/* 6 Key Tracked Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Lessons completed */}
        <div className="p-4 rounded bg-white border border-stone shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-graphite block">LESSONS DONE</span>
          <div className="font-mono text-2xl font-bold text-ink">
            {stats.completedLessons}
            <span className="text-xs text-graphite font-normal"> / {totalLessons}</span>
          </div>
          <span className="text-[10px] font-mono text-sage-dark block">
            {stats.completionPercent}% Complete
          </span>
        </div>

        {/* 2. Daily quizzes passed */}
        <div className="p-4 rounded bg-white border border-stone shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-graphite block">QUIZZES PASSED</span>
          <div className="font-mono text-2xl font-bold text-ink">
            {stats.passedQuizzes}
          </div>
          <span className="text-[10px] font-mono text-graphite block">
            &ge; 70% required
          </span>
        </div>

        {/* 3. Weekly assessments completed */}
        <div className="p-4 rounded bg-white border border-stone shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-graphite block">ASSESSMENTS</span>
          <div className="font-mono text-2xl font-bold text-ink">
            {stats.weeklyAssessmentsPassed}
          </div>
          <span className="text-[10px] font-mono text-sage-dark block">
            Weekly reviews
          </span>
        </div>

        {/* 4. Current learning streak */}
        <div className="p-4 rounded bg-white border border-stone shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-graphite block">STUDY STREAK</span>
          <div className="font-mono text-2xl font-bold text-vermilion">
            {stats.currentStreakDays}
            <span className="text-xs text-graphite font-normal"> Days</span>
          </div>
          <span className="text-[10px] font-mono text-graphite block">
            Real dates recorded
          </span>
        </div>

        {/* 5. Roadmap milestones completed */}
        <div className="p-4 rounded bg-white border border-stone shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-graphite block">MILESTONES</span>
          <div className="font-mono text-2xl font-bold text-ink">
            {milestonesCompleted}
            <span className="text-xs text-graphite font-normal"> / {activeRoadmap?.stages.length || 4}</span>
          </div>
          <span className="text-[10px] font-mono text-graphite block">
            Stages finished
          </span>
        </div>

        {/* 6. Topics requiring revision */}
        <div className="p-4 rounded bg-white border border-stone shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-graphite block">REVISIONS</span>
          <div className={`font-mono text-2xl font-bold ${unmasteredWeakTopics.length > 0 ? 'text-vermilion' : 'text-sage-dark'}`}>
            {unmasteredWeakTopics.length}
          </div>
          <span className="text-[10px] font-mono text-graphite block">
            {unmasteredWeakTopics.length > 0 ? 'Topics flagged' : 'All clear'}
          </span>
        </div>
      </div>

      {/* Topics Requiring Revision (If any) */}
      {unmasteredWeakTopics.length > 0 && (
        <section className="p-6 rounded bg-vermilion-light/30 border border-vermilion/30 space-y-4">
          <div className="flex items-center justify-between border-b border-vermilion/20 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-vermilion" />
              <h2 className="font-serif text-lg text-ink font-semibold">
                Detected Topics Requiring Reinforcement
              </h2>
            </div>
            <span className="text-xs font-mono text-vermilion font-bold">
              {unmasteredWeakTopics.length} ACTIVE
            </span>
          </div>

          <p className="text-xs text-graphite-dark leading-relaxed">
            The questions you missed during daily quizzes or weekly assessments flagged these specific concepts. Review the simplified explanations below and click "Mark as Mastered" when confident.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {unmasteredWeakTopics.map(topic => (
              <div
                key={topic.id}
                className="p-4 rounded bg-white border border-stone space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-ink">{topic.topic}</h3>
                    <span className="text-[10px] font-mono text-graphite">
                      Source: {topic.sourceType === 'quiz' ? `Day ${topic.sourceDayOrWeek} Quiz` : `Week ${topic.sourceDayOrWeek} Exam`}
                    </span>
                  </div>
                  <button
                    onClick={() => markWeakTopicMastered(topic.id)}
                    className="px-2.5 py-1 rounded bg-stone-light hover:bg-sage-light hover:text-sage-dark text-[11px] font-mono font-bold transition-colors"
                  >
                    Mark Mastered
                  </button>
                </div>

                <div className="text-xs text-graphite-dark leading-relaxed bg-paper-tint/60 p-3 rounded">
                  <span className="font-bold text-ink block mb-0.5">Core Intuition:</span>
                  {topic.simplifiedExplanation}
                </div>

                {topic.analogy && (
                  <p className="text-[11px] text-graphite italic">
                    &ldquo;{topic.analogy}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Ledger Section */}
      <section className="bg-white border border-stone rounded p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone pb-4 gap-3">
          <div>
            <h2 className="font-serif text-xl text-ink font-medium">Evaluation Ledger</h2>
            <p className="text-xs text-graphite">Recorded attempts with scores, percentages, and timestamps.</p>
          </div>

          <div className="flex items-center gap-1 bg-paper-tint p-1 rounded border border-stone text-xs font-mono">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'all' ? 'bg-white font-bold text-ink shadow-subtle' : 'text-graphite hover:text-ink'
              }`}
            >
              ALL ({quizAttempts.length + weeklyAttempts.length})
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'quizzes' ? 'bg-white font-bold text-ink shadow-subtle' : 'text-graphite hover:text-ink'
              }`}
            >
              QUIZZES ({quizAttempts.length})
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'assessments' ? 'bg-white font-bold text-ink shadow-subtle' : 'text-graphite hover:text-ink'
              }`}
            >
              ASSESSMENTS ({weeklyAttempts.length})
            </button>
          </div>
        </div>

        {/* Ledger Items */}
        <div className="space-y-3">
          {quizAttempts.length === 0 && weeklyAttempts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-8 h-8 text-graphite mx-auto" />
              <h3 className="font-serif text-base text-ink">No recorded attempts yet</h3>
              <p className="text-xs text-graphite max-w-sm mx-auto">
                Complete your Day 1 lesson and take the 5-question comprehension quiz to initialize your ledger.
              </p>
              <Link
                to="/lesson/1"
                className="inline-block mt-2 px-4 py-2 rounded bg-ink text-paper text-xs font-semibold"
              >
                Go to Day 1 Lesson
              </Link>
            </div>
          ) : (
            <>
              {(activeTab === 'all' || activeTab === 'quizzes') &&
                quizAttempts.map(attempt => (
                  <div
                    key={attempt.id}
                    className="p-4 rounded border border-stone-light bg-paper-tint/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs ${
                          attempt.passed ? 'bg-sage-light text-sage-dark' : 'bg-vermilion-light text-vermilion'
                        }`}
                      >
                        {attempt.passed ? 'PASS' : 'REV'}
                      </div>
                      <div>
                        <span className="font-bold text-ink block">
                          Day 0{attempt.dayNumber} Lesson Quiz
                        </span>
                        <span className="font-mono text-[10px] text-graphite">
                          {new Date(attempt.timestamp).toLocaleString()} &bull; 5 Questions
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="font-mono font-bold text-ink block">
                          {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${attempt.passed ? 'text-sage-dark' : 'text-vermilion'}`}>
                          {attempt.passed ? 'PASSED 70%' : 'BELOW 70%'}
                        </span>
                      </div>

                      <Link
                        to={`/quiz/${attempt.dayNumber}`}
                        className="px-2.5 py-1 rounded border border-stone bg-white hover:bg-paper-subtle text-xs font-mono font-medium text-ink transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}

              {(activeTab === 'all' || activeTab === 'assessments') &&
                weeklyAttempts.map(attempt => (
                  <div
                    key={attempt.id}
                    className="p-4 rounded border border-stone bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs ${
                          attempt.passed ? 'bg-sage-light text-sage-dark' : 'bg-vermilion-light text-vermilion'
                        }`}
                      >
                        W0{attempt.weekNumber}
                      </div>
                      <div>
                        <span className="font-bold text-ink block">
                          Week 0{attempt.weekNumber} Cumulative Assessment
                        </span>
                        <span className="font-mono text-[10px] text-graphite">
                          {new Date(attempt.timestamp).toLocaleString()} &bull; {attempt.totalQuestions} Questions
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="font-mono font-bold text-ink block">
                          {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${attempt.passed ? 'text-sage-dark' : 'text-vermilion'}`}>
                          {attempt.passed ? 'PASSED 70%' : 'REVISION RECOMMENDED'}
                        </span>
                      </div>

                      <Link
                        to="/assessment"
                        className="px-2.5 py-1 rounded border border-stone bg-white hover:bg-paper-subtle text-xs font-mono font-medium text-ink transition-colors"
                      >
                        Retake
                      </Link>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
