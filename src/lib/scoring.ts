import { QuizQuestion, TopicMastery } from '../types';

/**
 * Calculates passing threshold:
 * Passing threshold is 70%, calculated by rounding the required number of correct answers up to a whole question.
 * For 5 questions: Math.ceil(5 * 0.70) = Math.ceil(3.5) = 4 correct answers required.
 * For 10 questions: Math.ceil(10 * 0.70) = 7.
 * For 15 questions: Math.ceil(15 * 0.70) = 11.
 */
export function getRequiredCorrectCount(totalQuestions: number): number {
  return Math.ceil(totalQuestions * 0.7);
}

export function isPassingScore(correctCount: number, totalQuestions: number): boolean {
  if (totalQuestions <= 0) return false;
  const required = getRequiredCorrectCount(totalQuestions);
  return correctCount >= required;
}

export function calculatePercentage(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

/**
 * Analyzes questions and user selections to compute topic-wise mastery
 */
export function calculateTopicBreakdown(
  questions: QuizQuestion[],
  submittedAnswers: number[]
): TopicMastery[] {
  const topicMap: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, idx) => {
    const topic = q.topicTag || 'General';
    if (!topicMap[topic]) {
      topicMap[topic] = { correct: 0, total: 0 };
    }
    topicMap[topic].total += 1;
    if (submittedAnswers[idx] === q.correctAnswerIndex) {
      topicMap[topic].correct += 1;
    }
  });

  return Object.entries(topicMap).map(([topic, data]) => {
    const percentage = Math.round((data.correct / data.total) * 100);
    // If topic score is below 70%, marks as needing revision
    const requiredForTopic = Math.ceil(data.total * 0.7);
    const needsRevision = data.correct < requiredForTopic;
    return {
      topic,
      correct: data.correct,
      total: data.total,
      percentage,
      needsRevision,
    };
  });
}

/**
 * Extracts weak topics from questions where the user made an error
 */
export function identifyWeakTopics(
  questions: QuizQuestion[],
  submittedAnswers: number[]
): string[] {
  const missedTopics = new Set<string>();

  questions.forEach((q, idx) => {
    if (submittedAnswers[idx] !== q.correctAnswerIndex) {
      if (q.topicTag) {
        missedTopics.add(q.topicTag);
      }
    }
  });

  return Array.from(missedTopics);
}
