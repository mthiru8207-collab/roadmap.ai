import { supabase, isSupabaseConfigured } from './supabase';
import {
  CareerRoadmap,
  QuizAttempt,
  WeeklyAssessmentAttempt,
  StudyActivityLog,
  UserProfile,
} from '../types';

export const supabaseSync = {
  /**
   * Syncs user profile metadata to the `profiles` table in Supabase
   */
  async syncUserProfile(user: UserProfile): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || user.isGuest) return;
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.name,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[SupabaseSync] Error syncing user profile:', err);
    }
  },

  /**
   * Saves or updates a roadmap in the `roadmaps` table in Supabase
   */
  async saveRoadmap(roadmap: CareerRoadmap, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase || !userId) return false;
    try {
      const { error } = await supabase.from('roadmaps').upsert({
        id: roadmap.id,
        user_id: userId,
        job_title: roadmap.jobTitle,
        skill_level: roadmap.skillLevel,
        daily_time: roadmap.dailyTime,
        target_duration: roadmap.targetDuration,
        existing_skills: roadmap.existingSkills || [],
        total_days: roadmap.totalDays || 28,
        summary: roadmap.summary || '',
        stages: roadmap.stages,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('[SupabaseSync] Error saving roadmap:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[SupabaseSync] Exception saving roadmap:', err);
      return false;
    }
  },

  /**
   * Loads all roadmaps created by or assigned to this user from Supabase
   */
  async fetchUserRoadmaps(userId: string): Promise<CareerRoadmap[] | null> {
    if (!isSupabaseConfigured() || !supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('[SupabaseSync] Error fetching user roadmaps:', error);
        return null;
      }

      return data.map((row) => ({
        id: row.id,
        jobTitle: row.job_title,
        skillLevel: row.skill_level,
        dailyTime: row.daily_time,
        targetDuration: row.target_duration,
        existingSkills: row.existing_skills || [],
        totalDays: row.total_days || 28,
        summary: row.summary || '',
        stages: row.stages,
        createdAt: row.created_at,
        updatedAt: row.updated_at || row.created_at,
        isCustom: true,
      }));
    } catch (err) {
      console.warn('[SupabaseSync] Exception fetching roadmaps:', err);
      return null;
    }
  },

  /**
   * Persists lesson completion state to `lesson_progress` table
   */
  async setLessonCompleted(
    roadmapId: string,
    lessonId: string,
    dayNumber: number,
    completed: boolean,
    userId: string
  ): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || !userId) return;
    try {
      await supabase.from('lesson_progress').upsert(
        {
          user_id: userId,
          roadmap_id: roadmapId,
          lesson_id: lessonId,
          day_number: dayNumber,
          completed: completed,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,roadmap_id,lesson_id' }
      );
    } catch (err) {
      console.warn('[SupabaseSync] Error persisting lesson progress:', err);
    }
  },

  /**
   * Fetches completed lesson IDs for a specific roadmap
   */
  async fetchCompletedLessons(roadmapId: string, userId: string): Promise<string[] | null> {
    if (!isSupabaseConfigured() || !supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId)
        .eq('roadmap_id', roadmapId)
        .eq('completed', true);

      if (error || !data) return null;
      return data.map((d) => d.lesson_id);
    } catch (err) {
      console.warn('[SupabaseSync] Exception fetching completed lessons:', err);
      return null;
    }
  },

  /**
   * Inserts a quiz attempt into `quiz_attempts` table
   */
  async recordQuizAttempt(attempt: QuizAttempt, userId: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || !userId) return;
    try {
      await supabase.from('quiz_attempts').insert({
        user_id: userId,
        roadmap_id: attempt.roadmapId,
        lesson_id: attempt.lessonId,
        day_number: attempt.dayNumber,
        score: attempt.score,
        total_questions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
        submitted_answers: attempt.submittedAnswers,
        weak_topics: attempt.weakTopics,
        created_at: attempt.timestamp || new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[SupabaseSync] Error recording quiz attempt:', err);
    }
  },

  /**
   * Inserts a weekly assessment attempt into `weekly_assessments` table
   */
  async recordWeeklyAssessment(attempt: WeeklyAssessmentAttempt, userId: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || !userId) return;
    try {
      await supabase.from('weekly_assessments').insert({
        user_id: userId,
        roadmap_id: attempt.roadmapId,
        week_number: attempt.weekNumber,
        score: attempt.score,
        total_questions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
        topic_breakdown: attempt.topicBreakdown,
        weak_topics: attempt.weakTopics,
        submitted_answers: attempt.submittedAnswers,
        created_at: attempt.timestamp || new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[SupabaseSync] Error recording weekly assessment:', err);
    }
  },

  /**
   * Records or updates study activity in `study_activity` table
   */
  async recordStudyActivity(
    minutes: number,
    lessons: number,
    quizzes: number,
    userId: string
  ): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || !userId) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      // Fetch existing row for today
      const { data } = await supabase
        .from('study_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_date', today)
        .maybeSingle();

      if (data) {
        await supabase
          .from('study_activity')
          .update({
            minutes_spent: (data.minutes_spent || 0) + minutes,
            lessons_completed: (data.lessons_completed || 0) + lessons,
            quizzes_taken: (data.quizzes_taken || 0) + quizzes,
          })
          .eq('id', data.id);
      } else {
        await supabase.from('study_activity').insert({
          user_id: userId,
          activity_date: today,
          minutes_spent: minutes,
          lessons_completed: lessons,
          quizzes_taken: quizzes,
        });
      }
    } catch (err) {
      console.warn('[SupabaseSync] Error recording study activity:', err);
    }
  },
};

