import {
  CareerRoadmap,
  QuizAttempt,
  StudyActivityLog,
  WeeklyAssessmentAttempt,
  WeakTopicItem
} from '../types';
import { SAMPLE_AI_ROADMAP, SAMPLE_WEAK_TOPIC_REVISION } from '../data/sampleRoadmaps';
import { ALL_DEMANDED_ROADMAPS } from '../data/curriculums';
import { ensureFull28DayCurriculum } from './curriculumEnhancer';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  ROADMAPS: 'roadmap_ai_roadmaps',
  ACTIVE_ID: 'roadmap_ai_active_id',
  COMPLETED_LESSONS: 'roadmap_ai_completed_lessons',
  QUIZ_ATTEMPTS: 'roadmap_ai_quiz_attempts',
  WEEKLY_ATTEMPTS: 'roadmap_ai_weekly_attempts',
  WEAK_TOPICS: 'roadmap_ai_weak_topics',
  STUDY_LOGS: 'roadmap_ai_study_logs',
  DEMO_MODE: 'roadmap_ai_demo_mode',
};

// Default initial state for smooth demo experience
const INITIAL_COMPLETED = ['lesson-d1', 'lesson-d2'];

const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'attempt-d1',
    roadmapId: SAMPLE_AI_ROADMAP.id,
    lessonId: 'lesson-d1',
    dayNumber: 1,
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    passed: true,
    submittedAnswers: [1, 0, 1, 1, 1],
    timestamp: '2026-10-21T18:35:00Z',
    missedQuestionIds: [],
    weakTopics: [],
  },
  {
    id: 'attempt-d2',
    roadmapId: SAMPLE_AI_ROADMAP.id,
    lessonId: 'lesson-d2',
    dayNumber: 2,
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    passed: true,
    submittedAnswers: [1, 1, 1, 1, 0],
    timestamp: '2026-10-22T19:05:00Z',
    missedQuestionIds: ['q-d2-5'],
    weakTopics: ['Tensors & Autograd'],
  },
];

const INITIAL_STUDY_LOGS: StudyActivityLog[] = [
  { date: '2026-10-21', minutesSpent: 60, lessonsCompleted: 1, quizzesTaken: 1 },
  { date: '2026-10-22', minutesSpent: 65, lessonsCompleted: 1, quizzesTaken: 1 },
  { date: '2026-10-24', minutesSpent: 45, lessonsCompleted: 0, quizzesTaken: 0 },
  { date: '2026-10-26', minutesSpent: 30, lessonsCompleted: 0, quizzesTaken: 0 },
  { date: '2026-10-27', minutesSpent: 50, lessonsCompleted: 0, quizzesTaken: 0 },
];

export const storage = {
  getRoadmaps(): CareerRoadmap[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
      const fullDemanded = ALL_DEMANDED_ROADMAPS.map(ensureFull28DayCurriculum);

      if (!data) {
        // Pre-seed with all in-demand career roadmaps
        localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(fullDemanded));
        return fullDemanded;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const enhanced = parsed.map(ensureFull28DayCurriculum);
        if (enhanced.length < fullDemanded.length) {
          const existingIds = new Set(enhanced.map(r => r.id));
          for (const r of fullDemanded) {
            if (!existingIds.has(r.id)) {
              enhanced.push(r);
            }
          }
          localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(enhanced));
        }
        return enhanced;
      }
      return fullDemanded;
    } catch {
      return ALL_DEMANDED_ROADMAPS.map(ensureFull28DayCurriculum);
    }
  },

  saveRoadmaps(roadmaps: CareerRoadmap[]): void {
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
  },

  getActiveRoadmapId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    return id || SAMPLE_AI_ROADMAP.id;
  },

  setActiveRoadmapId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
  },

  getCompletedLessons(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      return data ? JSON.parse(data) : INITIAL_COMPLETED;
    } catch {
      return INITIAL_COMPLETED;
    }
  },

  setLessonCompleted(lessonId: string, completed: boolean): string[] {
    const current = this.getCompletedLessons();
    const updated = completed
      ? Array.from(new Set([...current, lessonId]))
      : current.filter(id => id !== lessonId);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(updated));
    return updated;
  },

  getQuizAttempts(): QuizAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      return data ? JSON.parse(data) : INITIAL_QUIZ_ATTEMPTS;
    } catch {
      return INITIAL_QUIZ_ATTEMPTS;
    }
  },

  saveQuizAttempt(attempt: QuizAttempt): void {
    const attempts = this.getQuizAttempts();
    const updated = [attempt, ...attempts];
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(updated));

    // Also update today's study activity
    this.recordStudyActivity(15, attempt.passed ? 1 : 0, 1);
  },

  getWeeklyAttempts(): WeeklyAssessmentAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWeeklyAttempt(attempt: WeeklyAssessmentAttempt): void {
    const attempts = this.getWeeklyAttempts();
    const updated = [attempt, ...attempts];
    localStorage.setItem(STORAGE_KEYS.WEEKLY_ATTEMPTS, JSON.stringify(updated));
    this.recordStudyActivity(30, 0, 1);
  },

  getWeakTopics(): WeakTopicItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEAK_TOPICS);
      return data ? JSON.parse(data) : [SAMPLE_WEAK_TOPIC_REVISION];
    } catch {
      return [SAMPLE_WEAK_TOPIC_REVISION];
    }
  },

  saveWeakTopic(item: WeakTopicItem): void {
    const current = this.getWeakTopics();
    const existingIdx = current.findIndex(w => w.topic.toLowerCase() === item.topic.toLowerCase());
    let updated: WeakTopicItem[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = item;
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(STORAGE_KEYS.WEAK_TOPICS, JSON.stringify(updated));
  },

  markWeakTopicMastered(topicId: string): void {
    const current = this.getWeakTopics();
    const updated = current.map(item => item.id === topicId ? { ...item, mastered: true } : item);
    localStorage.setItem(STORAGE_KEYS.WEAK_TOPICS, JSON.stringify(updated));
  },

  getStudyLogs(): StudyActivityLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_LOGS);
      return data ? JSON.parse(data) : INITIAL_STUDY_LOGS;
    } catch {
      return INITIAL_STUDY_LOGS;
    }
  },

  recordStudyActivity(minutes: number, lessons = 0, quizzes = 0): void {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getStudyLogs();
    const existingIndex = logs.findIndex(l => l.date === today);

    let updated: StudyActivityLog[];
    if (existingIndex >= 0) {
      updated = [...logs];
      updated[existingIndex] = {
        ...updated[existingIndex],
        minutesSpent: updated[existingIndex].minutesSpent + minutes,
        lessonsCompleted: updated[existingIndex].lessonsCompleted + lessons,
        quizzesTaken: updated[existingIndex].quizzesTaken + quizzes,
      };
    } else {
      updated = [...logs, { date: today, minutesSpent: minutes, lessonsCompleted: lessons, quizzesTaken: quizzes }];
    }
    localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(updated));
  },

  isDemoMode(): boolean {
    const val = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
    return val === null ? true : val === 'true';
  },

  setDemoMode(val: boolean): void {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, val ? 'true' : 'false');
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.ROADMAPS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.WEAK_TOPICS);
    localStorage.removeItem(STORAGE_KEYS.STUDY_LOGS);
  }
};
