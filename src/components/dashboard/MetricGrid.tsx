import React from 'react';
import { Calendar, CheckCircle2, TrendingUp, Award, Flame, AlertCircle } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { useLearning } from '../../context/LearningContext';

export const MetricGrid: React.FC = () => {
  const { stats, activeRoadmap } = useLearning();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <StatCard
        label="Current Track Day"
        value={`Day ${stats.currentDay}`}
        subtext={`of ${stats.totalDays} Total Days`}
        icon={Calendar}
        variant="primary"
      />
      <StatCard
        label="Completed Lessons"
        value={`${stats.completedLessons}`}
        subtext={`${stats.completionPercent}% Complete`}
        icon={CheckCircle2}
        variant="emerald"
      />
      <StatCard
        label="Roadmap Completion"
        value={`${stats.completionPercent}%`}
        subtext={activeRoadmap ? activeRoadmap.targetDuration : '8 weeks'}
        icon={TrendingUp}
        variant="violet"
      />
      <StatCard
        label="Quiz Average"
        value={stats.totalQuizzesTaken > 0 ? `${stats.quizAverage}%` : 'N/A'}
        subtext={`${stats.passedQuizzes}/${stats.totalQuizzesTaken} Quizzes Passed`}
        icon={Award}
        variant={stats.quizAverage >= 70 ? 'emerald' : 'amber'}
      />
      <StatCard
        label="Weekly Assessments"
        value={`${stats.weeklyAssessmentsPassed}`}
        subtext={`${stats.weeklyAssessmentsTaken} Cycles Evaluated`}
        icon={Award}
        variant="primary"
      />
      <StatCard
        label="Study Streak"
        value={`${stats.currentStreakDays} Days`}
        subtext={stats.activeWeakTopicsCount > 0 ? `${stats.activeWeakTopicsCount} Weak Topics` : 'All Topics Mastered'}
        icon={stats.activeWeakTopicsCount > 0 ? AlertCircle : Flame}
        variant={stats.activeWeakTopicsCount > 0 ? 'amber' : 'emerald'}
      />
    </div>
  );
};
