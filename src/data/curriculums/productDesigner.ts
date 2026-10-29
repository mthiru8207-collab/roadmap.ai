import { CareerRoadmap, LearningStage } from '../../types';

export const PRODUCT_DESIGNER_STAGES: LearningStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: User Research, Problem Framing & Cognitive Mental Models',
    description: 'Master qualitative user discovery interviews, problem framing (Jobs to Be Done), cognitive ergonomics, and information architecture hierarchy.',
    estimatedWeeks: 1,
    topics: ['Jobs-to-be-Done (JTBD) & Problem Definition', 'User Interview Synthesis & Affinity Mapping', 'Mental Models, Heuristic Evaluation & Gestalt Principles', 'Card Sorting & Information Architecture Trees', 'User Journey Mapping & Opportunity Identification'],
    capstoneProject: {
      title: 'End-to-End User Discovery Research & Problem Brief',
      description: 'Conduct 5 user discovery interviews, synthesize findings using an affinity diagram, and author a product discovery brief for engineering.',
      deliverables: ['Affinity map with prioritized pain points', 'User persona grounded in real interview transcripts', 'Opportunity solution tree with hypothesis tests'],
    },
    lessons: [
      {
        id: 'ux-l1',
        dayNumber: 1,
        stageId: 'stage-1',
        stageName: 'Stage 1: User Research & Problem Framing',
        title: 'Day 1: Jobs-to-be-Done (JTBD) Framework, Forces of Progress & User Interviewing',
        summary: 'Extract underlying motivations and switching triggers using the Jobs to be Done timeline interview method instead of asking hypothetical questions.',
        estimatedMinutes: 50,
        isCompleted: true,
        completedAt: '2026-10-21T18:00:00Z',
        objectives: [
          'Differentiate between superficial feature requests and the root "job" users hire software to accomplish.',
          'Map the Four Forces of Progress (Push of Current Situation, Pull of New Solution, Habit/Inertia, Anxiety of Change).',
          'Execute non-leading discovery interviews focusing strictly on past purchasing decisions.',
        ],
        contentMarkdown: `### 1. The Core Philosophy of JTBD
People do not buy products; they **hire** products to make progress in specific life situations.
- **Bad Discovery Question**: *"Would you like a feature that automatically summarizes emails?"* (Hypothetical & leads to false positives).
- **Good JTBD Question**: *"Tell me about the last time you felt overwhelmed by your inbox. What was happening right before that? What did you do?"* (Anchored in past historical facts).

### 2. The Four Forces of Progress
Every product adoption decision is governed by a dynamic tug-of-war:
1. **Push**: The frustration and pain of the current tool.
2. **Pull**: The attractive appeal of the new solution.
3. **Anxiety**: The fear of learning a new tool or breaking workflows.
4. **Habit (Inertia)**: The comfort of sticking with the familiar existing setup.`,
        codeSnippet: {
          language: 'markdown',
          code: `# JTBD Job Story Format
When [Situation / Context]
I want to [Motivation / Struggle]
So that [Desired Outcome / Core Progress]

# Example:
When I am preparing for a technical system design interview,
I want to practice real architectural trade-offs with immediate feedback,
So that I feel confident walking into the live interview room.`,
          description: 'Standardized Jobs-to-be-Done Job Story template for product designers'
        },
        keyTakeaways: [
          'Never ask users to predict their future behavior in interviews.',
          'Focus on the historical timeline: First Thought -> Passive Looking -> Active Looking -> Deciding.',
          'To win adoption, Push + Pull must overcome Inertia + Anxiety.'
        ],
        resources: [
          { id: 'ux-res-1', title: 'Nielsen Norman Group: User Interviews 101', url: 'https://www.nngroup.com/articles/user-interviews/', type: 'documentation', duration: '20 min', isFree: true }
        ],
        tasks: [
          {
            id: 'ux-task-1',
            title: 'Draft a JTBD User Interview Protocol',
            description: 'Write an interview script with 6 non-leading questions investigating how someone recently chose a productivity tool.',
            instructions: [
              'Include warm-up questions focusing on the purchase date.',
              'Ask timeline probing questions regarding the "first thought" and "trigger event".',
              'Avoid any questions starting with "Would you..." or "Do you think...".'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'ux-q1-1',
            question: 'Why do experienced product designers avoid asking "Would you use a feature that does X?" in user interviews?',
            options: [
              'Because user research is illegal under GDPR',
              'Because humans are notoriously inaccurate at predicting their future hypothetical behavior and will falsely agree to be polite',
              'Because developers prefer writing backend code first',
              'Because feature requests should only come from executives'
            ],
            correctAnswerIndex: 1,
            explanation: 'Hypothetical questions yield high false-positive validation. Research must investigate concrete historical past actions.',
            topicTag: 'UX Research'
          },
          {
            id: 'ux-q1-2',
            question: 'In the Jobs to be Done (JTBD) framework, which two forces act as RESISTANCE against adopting a new product?',
            options: [
              'Push and Pull',
              'Inertia (Habit) and Anxiety (Fear of the unknown)',
              'Price and Design',
              'Speed and Bandwidth'
            ],
            correctAnswerIndex: 1,
            explanation: 'Inertia (comfort of existing habits) and Anxiety (uncertainty about switching) resist the adoption of any new product.',
            topicTag: 'Product Strategy'
          },
          {
            id: 'ux-q1-3',
            question: 'What is a "Job Story" in product design?',
            options: [
              'A job description posted on LinkedIn',
              'A structured framework: When [Situation], I want to [Motivation], So that [Outcome]',
              'A resume bullet point',
              'A user manual for software'
            ],
            correctAnswerIndex: 1,
            explanation: 'Job stories emphasize situation, motivation, and expected progress over arbitrary demographic personas.',
            topicTag: 'Product Strategy'
          },
          {
            id: 'ux-q1-4',
            question: 'What passing threshold is required for a 5-question daily quiz under RoadmapAI standards?',
            options: ['2 questions', '3 questions', '4 questions (Math.ceil(5 * 0.70))', '5 questions'],
            correctAnswerIndex: 2,
            explanation: 'RoadmapAI enforces a 70% threshold rounded up: Math.ceil(5 * 0.70) = 4 correct answers required.',
            topicTag: 'Platform Rules'
          },
          {
            id: 'ux-q1-5',
            question: 'Which of the following represents an effective qualitative discovery interview technique?',
            options: [
              'Presenting a live sales pitch during the call',
              'Asking the participant to recount the specific timeline and circumstances of their last tool purchase',
              'Sending a 50-question multiple choice survey only',
              'Interrupting whenever the user mentions a competitor'
            ],
            correctAnswerIndex: 1,
            explanation: 'Reconstructing the chronological story of a past purchase uncovers genuine triggers and anxieties.',
            topicTag: 'UX Research'
          }
        ]
      }
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Wireframing, Figma Design Systems & Design Token Architecture',
    description: 'Build scalable design systems in Figma using auto-layout, component variants, semantic design tokens (W3C), and WCAG 2.2 accessibility.',
    estimatedWeeks: 1,
    topics: ['Figma Auto-Layout & Responsive Constraints', 'Component Properties & Interactive Variants', 'Design Tokens (Color, Typography, Spacing) via Tokens Studio', 'WCAG 2.2 AA Contrast & Accessible Touch Targets', 'Rapid Wireframing & Information Scaffolding'],
    capstoneProject: {
      title: 'Studio-Caliber Scalable Figma Design System',
      description: 'Author a complete Figma design library with 3-tier semantic tokens, dark/light theme switching, and accessible interactive UI components.',
      deliverables: ['Figma file with Auto-Layout components', 'Design token JSON export compatible with Style Dictionary', 'Accessibility audit matrix'],
    },
    lessons: []
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: High-Fidelity Prototyping, Micro-Interactions & Usability Testing',
    description: 'Create high-fidelity interactive prototypes, choreograph subtle micro-interactions with Smart Animate, and run moderated usability tests.',
    estimatedWeeks: 1,
    topics: ['Smart Animate & Transition Physics in Figma', 'Usability Testing Protocol & Task Completion Metrics', 'System Usability Scale (SUS) Benchmark Scoring', 'Micro-interactions & Perceived Performance Feedback', 'Design Critiques & Cross-Functional Alignment'],
    capstoneProject: {
      title: 'Moderated Usability Study & Evaluated Interactive Prototype',
      description: 'Build a clickable high-fidelity mobile prototype, test it with 5 target users, record task success rates, and present design iteration recommendations.',
      deliverables: ['Clickable Figma mobile prototype', 'Usability test session recordings and task completion ledger', 'Iteration roadmap showing before/after design revisions'],
    },
    lessons: []
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: Developer Handoff, Design QA & Portfolio Case Study Presentation',
    description: 'Deliver clean specifications to engineering, inspect CSS box models, conduct design QA, and craft a compelling portfolio case study.',
    estimatedWeeks: 1,
    topics: ['Figma Dev Mode & Component Specification Handoff', 'CSS Box Model, Flexbox & Grid for Designers', 'Design QA Protocols & Visual Regression Verification', 'Portfolio Storytelling: Problem, Process & Business Impact', 'Design Leadership & Product Strategy Review'],
    capstoneProject: {
      title: 'Industry-Ready Product Design Portfolio Case Study',
      description: 'Craft a comprehensive, visually stunning product design case study showcasing discovery research, design iterations, metrics, and production impact.',
      deliverables: ['Published case study with high-resolution artifacts', 'Figma presentation deck for senior hiring managers', 'Design system documentation guide'],
    },
    lessons: []
  }
];

export const SAMPLE_PRODUCT_DESIGNER_ROADMAP: CareerRoadmap = {
  id: 'roadmap-product-designer-ux',
  jobTitle: 'Product Designer & UX/UI Architect',
  skillLevel: 'Intermediate',
  targetDuration: '4 weeks',
  dailyTime: '1h',
  existingSkills: ['Figma basics', 'User empathy', 'Visual layout'],
  createdAt: '2026-10-21T09:00:00Z',
  updatedAt: '2026-10-28T09:00:00Z',
  totalDays: 28,
  summary: 'A 28-day product design curriculum mastering Jobs-to-be-Done user discovery, scalable Figma design tokens, usability testing, and developer handoff.',
  stages: PRODUCT_DESIGNER_STAGES,
};

