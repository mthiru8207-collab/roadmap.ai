import { CareerRoadmap } from '../../types';
import { SAMPLE_AI_ROADMAP } from '../sampleRoadmaps';
import { SAMPLE_FULLSTACK_ROADMAP } from './fullstackDev';
import { SAMPLE_DEVOPS_ROADMAP } from './devopsPlatform';
import { SAMPLE_CYBERSECURITY_ROADMAP } from './cybersecurity';
import { SAMPLE_DATA_SCIENTIST_ROADMAP } from './dataScientist';
import { SAMPLE_PRODUCT_DESIGNER_ROADMAP } from './productDesigner';

export {
  SAMPLE_AI_ROADMAP,
  SAMPLE_FULLSTACK_ROADMAP,
  SAMPLE_DEVOPS_ROADMAP,
  SAMPLE_CYBERSECURITY_ROADMAP,
  SAMPLE_DATA_SCIENTIST_ROADMAP,
  SAMPLE_PRODUCT_DESIGNER_ROADMAP,
};

export const ALL_DEMANDED_ROADMAPS: CareerRoadmap[] = [
  SAMPLE_AI_ROADMAP,
  SAMPLE_FULLSTACK_ROADMAP,
  SAMPLE_DEVOPS_ROADMAP,
  SAMPLE_CYBERSECURITY_ROADMAP,
  SAMPLE_DATA_SCIENTIST_ROADMAP,
  SAMPLE_PRODUCT_DESIGNER_ROADMAP,
];

/**
 * Finds a matching curated roadmap for a given job title if available.
 */
export function findMatchingCuratedRoadmap(title: string): CareerRoadmap | null {
  const query = title.toLowerCase().trim();

  if (query.includes('ai') || query.includes('machine learning') || query.includes('deep learning')) {
    return SAMPLE_AI_ROADMAP;
  }
  if (query.includes('full stack') || query.includes('fullstack') || query.includes('backend') || query.includes('software')) {
    return SAMPLE_FULLSTACK_ROADMAP;
  }
  if (query.includes('devops') || query.includes('cloud') || query.includes('platform') || query.includes('sre') || query.includes('infrastructure')) {
    return SAMPLE_DEVOPS_ROADMAP;
  }
  if (query.includes('security') || query.includes('cyber') || query.includes('threat') || query.includes('infosec')) {
    return SAMPLE_CYBERSECURITY_ROADMAP;
  }
  if (query.includes('data scientist') || query.includes('data science') || query.includes('analytics')) {
    return SAMPLE_DATA_SCIENTIST_ROADMAP;
  }
  if (query.includes('design') || query.includes('product designer') || query.includes('ux') || query.includes('ui')) {
    return SAMPLE_PRODUCT_DESIGNER_ROADMAP;
  }

  return null;
}

