import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import {
  CareerRoadmap,
  DailyLesson,
  QuizAttempt,
  WeeklyAssessmentAttempt,
  WeakTopicItem,
  UserPreferences,
  StudyActivityLog
} from '../types';
import { storage } from '../lib/storage';
import { useAuth } from './AuthContext';
import { supabaseSync } from '../lib/supabaseSync';
import { generateCareerRoadmap, generateAdaptiveRevision } from '../lib/aiEngine';
import { isPassingScore, calculatePercentage, calculateTopicBreakdown, identifyWeakTopics } from '../lib/scoring';
import { WEEK_1_ASSESSMENT_QUESTIONS } from '../data/sampleRoadmaps';

interface LearningStats {
  currentDay: number;
  totalDays: number;
  completedLessons: number;
  completionPercent: number;
  quizAverage: number;
  passedQuizzes: number;
  totalQuizzesTaken: number;
  weeklyAssessmentsPassed: number;
  weeklyAssessmentsTaken: number;
  currentStreakDays: number;
  activeWeakTopicsCount: number;
  nextRecommendedTask: {
    type: 'lesson' | 'quiz' | 'assessment' | 'revision';
    title: string;
    description: string;
    dayNumber?: number;
    weekNumber?: number;
    topicId?: string;
  };
}

interface LearningContextType {
  roadmaps: CareerRoadmap[];
  activeRoadmap: CareerRoadmap | null;
  activeDayNumber: number;
  completedLessonIds: string[];
  quizAttempts: QuizAttempt[];
  weeklyAttempts: WeeklyAssessmentAttempt[];
  weakTopics: WeakTopicItem[];
  studyLogs: StudyActivityLog[];
  stats: LearningStats;
  isGenerating: boolean;
  highestUnlockedQuizDay: number;
  isQuizUnlocked: (dayNumber: number) => boolean;
  setActiveRoadmap: (id: string) => void;
  setActiveDayNumber: (day: number) => void;
  toggleLessonCompleted: (lessonId: string) => void;
  submitDailyQuiz: (
    lesson: DailyLesson,
    submittedAnswers: number[]
  ) => { attempt: QuizAttempt; passed: boolean; weakTopics: string[] };
  submitWeeklyAssessment: (
    weekNumber: number,
    submittedAnswers: number[]
  ) => { attempt: WeeklyAssessmentAttempt; passed: boolean };
  markWeakTopicMastered: (topicId: string) => void;
  createRoadmap: (preferences: UserPreferences) => Promise<CareerRoadmap>;
  deleteRoadmap: (roadmapId: string) => void;
  resetAllProgress: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>(() => storage.getRoadmaps());
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(() => storage.getActiveRoadmapId());
  const [activeDayNumber, setActiveDayNumber] = useState<number>(3); // Defaults to Day 3 for rich demo state
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => storage.getCompletedLessons());
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => storage.getQuizAttempts());
  const [weeklyAttempts, setWeeklyAttempts] = useState<WeeklyAssessmentAttempt[]>(() => storage.getWeeklyAttempts());
  const [weakTopics, setWeakTopics] = useState<WeakTopicItem[]>(() => storage.getWeakTopics());
  const [studyLogs, setStudyLogs] = useState<StudyActivityLog[]>(() => storage.getStudyLogs());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Cloud sync on user authentication state change
  useEffect(() => {
    if (user && !user.isGuest) {
      supabaseSync.syncUserProfile(user);

      // Fetch user's custom roadmaps from Supabase
      supabaseSync.fetchUserRoadmaps(user.id).then((userRoadmaps) => {
        if (userRoadmaps && userRoadmaps.length > 0) {
          setRoadmaps((prev) => {
            const userMapIds = new Set(userRoadmaps.map((r) => r.id));
            const merged = [...userRoadmaps, ...prev.filter((r) => !userMapIds.has(r.id))];
            storage.saveRoadmaps(merged);
            return merged;
          });
        }
      });

      // Fetch completed lessons from Supabase for current roadmap
      if (activeRoadmapId) {
        supabaseSync.fetchCompletedLessons(activeRoadmapId, user.id).then((cloudCompleted) => {
          if (cloudCompleted && cloudCompleted.length > 0) {
            setCompletedLessonIds((prev) => {
              const merged = Array.from(new Set([...prev, ...cloudCompleted]));
              merged.forEach((id) => storage.setLessonCompleted(id, true));
              return merged;
            });
          }
        });
      }
    }
  }, [user?.id, activeRoadmapId]);

  // Active roadmap lookup
  const activeRoadmap = useMemo(() => {
    return roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0] || null;
  }, [roadmaps, activeRoadmapId]);

  const setActiveRoadmap = useCallback((id: string) => {
    setActiveRoadmapId(id);
    storage.setActiveRoadmapId(id);
  }, []);

  const toggleLessonCompleted = useCallback((lessonId: string) => {
    setCompletedLessonIds(prev => {
      const isCurrentlyCompleted = prev.includes(lessonId);
      const nextCompleted = !isCurrentlyCompleted;
      const updated = storage.setLessonCompleted(lessonId, nextCompleted);

      if (user && !user.isGuest && activeRoadmap) {
        const lesson = activeRoadmap.stages.flatMap(s => s.lessons).find(l => l.id === lessonId);
        supabaseSync.setLessonCompleted(
          activeRoadmap.id,
          lessonId,
          lesson?.dayNumber || 1,
          nextCompleted,
          user.id
        );
      }

      return updated;
    });
  }, [user, activeRoadmap]);

  // Submit Daily Quiz (5 questions, 70% threshold: 4/5 required)
  const submitDailyQuiz = useCallback(
    (lesson: DailyLesson, submittedAnswers: number[]) => {
      const questions = lesson.quizQuestions;
      let correctCount = 0;
      const missedIds: string[] = [];

      questions.forEach((q, idx) => {
        if (submittedAnswers[idx] === q.correctAnswerIndex) {
          correctCount++;
        } else {
          missedIds.push(q.id);
        }
      });

      const passed = isPassingScore(correctCount, questions.length);
      const percentage = calculatePercentage(correctCount, questions.length);
      const detectedWeak = identifyWeakTopics(questions, submittedAnswers);

      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        roadmapId: activeRoadmap?.id || 'default',
        lessonId: lesson.id,
        dayNumber: lesson.dayNumber,
        score: correctCount,
        totalQuestions: questions.length,
        percentage,
        passed,
        submittedAnswers,
        timestamp: new Date().toISOString(),
        missedQuestionIds: missedIds,
        weakTopics: detectedWeak,
      };

      // Save attempt locally and to Supabase
      storage.saveQuizAttempt(attempt);
      setQuizAttempts(prev => [attempt, ...prev]);

      if (user && !user.isGuest) {
        supabaseSync.recordQuizAttempt(attempt, user.id);
        supabaseSync.recordStudyActivity(15, attempt.passed ? 1 : 0, 1, user.id);
      }

      // If user passed, automatically mark lesson as completed
      if (passed) {
        setCompletedLessonIds(prev => {
          if (!prev.includes(lesson.id)) {
            const updated = storage.setLessonCompleted(lesson.id, true);
            if (user && !user.isGuest && activeRoadmap) {
              supabaseSync.setLessonCompleted(
                activeRoadmap.id,
                lesson.id,
                lesson.dayNumber,
                true,
                user.id
              );
            }
            return updated;
          }
          return prev;
        });
      } else {
        // If user scored below 70%, automatically create adaptive revision items
        // Important: Next lesson is NOT locked!
        detectedWeak.forEach(topic => {
          const revItem = generateAdaptiveRevision(topic, 'quiz', lesson.dayNumber);
          storage.saveWeakTopic(revItem);
          setWeakTopics(prev => {
            const exists = prev.some(w => w.topic.toLowerCase() === topic.toLowerCase());
            return exists ? prev : [revItem, ...prev];
          });
        });
      }

      setStudyLogs(storage.getStudyLogs());
      return { attempt, passed, weakTopics: detectedWeak };
    },
    [activeRoadmap, user]
  );

  // Submit Weekly Assessment (10 questions, 70% threshold: 7/10 required)
  const submitWeeklyAssessment = useCallback(
    (weekNumber: number, submittedAnswers: number[]) => {
      const questions = WEEK_1_ASSESSMENT_QUESTIONS;
      let correctCount = 0;

      questions.forEach((q, idx) => {
        if (submittedAnswers[idx] === q.correctAnswerIndex) {
          correctCount++;
        }
      });

      const passed = isPassingScore(correctCount, questions.length);
      const percentage = calculatePercentage(correctCount, questions.length);
      const topicBreakdown = calculateTopicBreakdown(questions, submittedAnswers);
      const weakTopicsFound = topicBreakdown
        .filter(t => t.needsRevision)
        .map(t => t.topic);

      const attempt: WeeklyAssessmentAttempt = {
        id: `week-att-${Date.now()}`,
        roadmapId: activeRoadmap?.id || 'default',
        weekNumber,
        coveredDays: [(weekNumber - 1) * 7 + 1, weekNumber * 7],
        score: correctCount,
        totalQuestions: questions.length,
        percentage,
        passed,
        topicBreakdown,
        weakTopics: weakTopicsFound,
        submittedAnswers,
        timestamp: new Date().toISOString(),
      };

      storage.saveWeeklyAttempt(attempt);
      setWeeklyAttempts(prev => [attempt, ...prev]);

      if (user && !user.isGuest) {
        supabaseSync.recordWeeklyAssessment(attempt, user.id);
        supabaseSync.recordStudyActivity(30, 0, 1, user.id);
      }

      // Queue revision items for weak topics
      weakTopicsFound.forEach(topic => {
        const rev = generateAdaptiveRevision(topic, 'weekly_assessment', weekNumber);
        storage.saveWeakTopic(rev);
        setWeakTopics(prev => {
          const exists = prev.some(w => w.topic.toLowerCase() === topic.toLowerCase());
          return exists ? prev : [rev, ...prev];
        });
      });

      setStudyLogs(storage.getStudyLogs());
      return { attempt, passed };
    },
    [activeRoadmap, user]
  );

  const markWeakTopicMastered = useCallback((topicId: string) => {
    storage.markWeakTopicMastered(topicId);
    setWeakTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, mastered: true } : t))
    );
  }, []);

  const createRoadmap = useCallback(async (preferences: UserPreferences) => {
    setIsGenerating(true);
    try {
      const newRoadmap = await generateCareerRoadmap(preferences);
      setRoadmaps(prev => {
        const updated = [newRoadmap, ...prev];
        storage.saveRoadmaps(updated);
        return updated;
      });
      setActiveRoadmapId(newRoadmap.id);
      storage.setActiveRoadmapId(newRoadmap.id);
      setActiveDayNumber(1);

      if (user && !user.isGuest) {
        supabaseSync.saveRoadmap(newRoadmap, user.id);
      }

      return newRoadmap;
    } finally {
      setIsGenerating(false);
    }
  }, [user]);

  const deleteRoadmap = useCallback((roadmapId: string) => {
    setRoadmaps(prev => {
      const updated = prev.filter(r => r.id !== roadmapId);
      storage.saveRoadmaps(updated);
      if (activeRoadmapId === roadmapId && updated.length > 0) {
        setActiveRoadmapId(updated[0].id);
        storage.setActiveRoadmapId(updated[0].id);
      }
      return updated;
    });
  }, [activeRoadmapId]);

  const resetAllProgress = useCallback(() => {
    storage.resetAllData();
    const defaults = storage.getRoadmaps();
    setRoadmaps(defaults);
    setActiveRoadmapId(defaults[0]?.id || '');
    setActiveDayNumber(1);
    setCompletedLessonIds([]);
    setQuizAttempts([]);
    setWeeklyAttempts([]);
    setWeakTopics([]);
    setStudyLogs(storage.getStudyLogs());
  }, []);

  // Lock upcoming quizzes:
  // Day 1 is always unlocked.
  // Day N is unlocked once Day N-1 quiz is passed (or user already attempted Day N).
  const highestUnlockedQuizDay = useMemo(() => {
    const passedDays = new Set(quizAttempts.filter(q => q.passed).map(q => q.dayNumber));
    let day = 1;
    while (passedDays.has(day)) {
      day++;
    }
    return day;
  }, [quizAttempts]);

  const isQuizUnlocked = useCallback((dayNumber: number) => {
    if (dayNumber <= 1) return true;
    if (dayNumber <= highestUnlockedQuizDay) return true;
    return quizAttempts.some(q => q.dayNumber === dayNumber);
  }, [highestUnlockedQuizDay, quizAttempts]);

  // Compute live dashboard metrics directly from saved state
  const stats = useMemo<LearningStats>(() => {
    const totalDays = activeRoadmap?.totalDays || 28;
    const completedCount = completedLessonIds.length;
    const completionPercent = totalDays > 0 ? Math.min(100, Math.round((completedCount / totalDays) * 100)) : 0;

    const quizCount = quizAttempts.length;
    const quizAvg =
      quizCount > 0
        ? Math.round(
            quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizCount
          )
        : 0;
    const passedQuizzes = quizAttempts.filter(q => q.passed).length;

    const weeklyPassed = weeklyAttempts.filter(w => w.passed).length;
    const weeklyCount = weeklyAttempts.length;

    const activeWeakCount = weakTopics.filter(w => !w.mastered).length;

    // Current learning day (first uncompleted day, or highest completed + 1)
    let currentDay = 1;
    if (activeRoadmap) {
      const allLessons: DailyLesson[] = [];
      activeRoadmap.stages.forEach(st => allLessons.push(...st.lessons));
      const firstUncompleted = allLessons.find(l => !completedLessonIds.includes(l.id));
      currentDay = firstUncompleted ? firstUncompleted.dayNumber : completedCount > 0 ? completedCount : 1;
    }

    // Streak calculation based on recent study activity
    const streakDays = Math.min(7, Math.max(1, studyLogs.length));

    // Next recommended task logic
    let nextTask: LearningStats['nextRecommendedTask'];
    if (activeWeakCount > 0 && Math.random() > 0.6) {
      const firstWeak = weakTopics.find(w => !w.mastered)!;
      nextTask = {
        type: 'revision',
        title: `Revise: ${firstWeak.topic}`,
        description: 'Master missed concepts with simplified breakdown and practice drill.',
        topicId: firstWeak.id,
      };
    } else if (currentDay > 0 && currentDay % 7 === 0 && weeklyCount === 0) {
      nextTask = {
        type: 'assessment',
        title: `Week ${Math.floor(currentDay / 7)} Assessment Ready`,
        description: 'Take the 10-question cumulative assessment covering this week.',
        weekNumber: Math.floor(currentDay / 7),
      };
    } else {
      nextTask = {
        type: 'lesson',
        title: `Continue Day ${currentDay}`,
        description: 'Deep dive into objectives, code examples, and practical exercises.',
        dayNumber: currentDay,
      };
    }

    return {
      currentDay,
      totalDays,
      completedLessons: completedCount,
      completionPercent,
      quizAverage: quizAvg,
      passedQuizzes,
      totalQuizzesTaken: quizCount,
      weeklyAssessmentsPassed: weeklyPassed,
      weeklyAssessmentsTaken: weeklyCount,
      currentStreakDays: streakDays,
      activeWeakTopicsCount: activeWeakCount,
      nextRecommendedTask: nextTask,
    };
  }, [activeRoadmap, completedLessonIds, quizAttempts, weeklyAttempts, weakTopics, studyLogs]);

  return (
    <LearningContext.Provider
      value={{
        roadmaps,
        activeRoadmap,
        activeDayNumber,
        completedLessonIds,
        quizAttempts,
        weeklyAttempts,
        weakTopics,
        studyLogs,
        stats,
        isGenerating,
        highestUnlockedQuizDay,
        isQuizUnlocked,
        setActiveRoadmap,
        setActiveDayNumber,
        toggleLessonCompleted,
        submitDailyQuiz,
        submitWeeklyAssessment,
        markWeakTopicMastered,
        createRoadmap,
        deleteRoadmap,
        resetAllProgress,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
