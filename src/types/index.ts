export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type DailyCommitment = '30m' | '1h' | '2h' | '3h';
export type TargetDuration = '4 weeks' | '8 weeks' | '12 weeks' | '16 weeks';
export type LearningGoal = 'understand_fundamentals' | 'become_job_ready' | 'switch_careers' | 'improve_skills';
export type ResourceBudget = 'free_only' | 'free_and_paid';
export type LearningFormat = 'hands_on' | 'deep_theory' | 'structured_balance';

export interface UserPreferences {
  jobTitle: string;
  skillLevel: SkillLevel;
  existingSkills: string[];
  dailyTime: DailyCommitment;
  targetDuration: TargetDuration;
  learningGoal?: LearningGoal;
  resourceBudget?: ResourceBudget;
  learningFormat?: LearningFormat;
  learningFocus?: 'Hands-on Projects' | 'Deep Theory' | 'Interview & Cert Prep';
}

export interface VideoResource {
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  summary?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'article' | 'video' | 'interactive' | 'course';
  duration: string;
  isFree?: boolean;
  youtubeId?: string;
}

export interface PracticalTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  solutionSnippet?: string;
  completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topicTag: string;
}

export interface DailyLesson {
  id: string;
  dayNumber: number;
  stageId: string;
  stageName: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
  contentMarkdown: string;
  codeSnippet?: {
    language: string;
    code: string;
    description: string;
  };
  keyTakeaways: string[];
  videoResource?: VideoResource;
  resources: LearningResource[];
  tasks: PracticalTask[];
  quizQuestions: QuizQuestion[];
  isCompleted?: boolean;
  completedAt?: string;
}

export interface LearningStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  estimatedWeeks: number;
  topics: string[];
  lessons: DailyLesson[];
  capstoneProject?: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

export interface CareerRoadmap {
  id: string;
  userId?: string;
  jobTitle: string;
  skillLevel: SkillLevel;
  targetDuration: TargetDuration;
  dailyTime: DailyCommitment;
  existingSkills: string[];
  createdAt: string;
  updatedAt: string;
  stages: LearningStage[];
  totalDays: number;
  summary: string;
}

export interface QuizAttempt {
  id: string;
  roadmapId: string;
  lessonId: string;
  dayNumber: number;
  score: number; // number of correct answers
  totalQuestions: number; // 5
  percentage: number;
  passed: boolean; // threshold is 70% (ceil(5 * 0.7) = 4)
  submittedAnswers: number[];
  timestamp: string;
  missedQuestionIds: string[];
  weakTopics: string[];
}

export interface TopicMastery {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
  needsRevision: boolean;
}

export interface WeeklyAssessmentAttempt {
  id: string;
  roadmapId: string;
  weekNumber: number;
  coveredDays: [number, number]; // e.g. [1, 7]
  score: number;
  totalQuestions: number; // 10-15
  percentage: number;
  passed: boolean; // >= 70%
  topicBreakdown: TopicMastery[];
  weakTopics: string[];
  submittedAnswers: number[];
  timestamp: string;
}

export interface WeakTopicItem {
  id: string;
  topic: string;
  sourceType: 'quiz' | 'weekly_assessment';
  sourceDayOrWeek: number;
  detectedAt: string;
  simplifiedExplanation: string;
  analogy: string;
  practiceExercise: {
    prompt: string;
    hint: string;
    solution: string;
  };
  drillQuestions: QuizQuestion[];
  mastered: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isGuest: boolean;
  created_at: string;
}

export interface StudyActivityLog {
  date: string; // YYYY-MM-DD
  minutesSpent: number;
  lessonsCompleted: number;
  quizzesTaken: number;
}
