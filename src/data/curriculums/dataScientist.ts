import { CareerRoadmap, LearningStage } from '../../types';

export const DATA_SCIENTIST_STAGES: LearningStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Statistical Inference, Advanced SQL & Exploratory Data Analysis',
    description: 'Master hypothesis testing, Bayesian reasoning, advanced SQL window functions (PARTITION BY), Pandas data manipulation, and data visualization.',
    estimatedWeeks: 2,
    topics: ['Hypothesis Testing & p-value Calculation', 'SQL Window Functions & Analytical CTEs', 'Pandas Vectorized Operations & Memory Profiling', 'Exploratory Data Analysis (EDA) & Outlier Detection', 'Feature Scaling, Imputation & Categorical Encodings'],
    capstoneProject: {
      title: 'Customer Churn Behavioral Analytics & Feature Pipeline',
      description: 'Execute an end-to-end exploratory analysis on a 500,000-row customer dataset using PostgreSQL window functions and Pandas feature engineering.',
      deliverables: ['Analytical SQL query suite with window functions', 'Jupyter notebook with Seaborn statistical plots', 'Reproducible Scikit-Learn data cleaning pipeline'],
    },
    lessons: [
      {
        id: 'ds-l1',
        dayNumber: 1,
        stageId: 'stage-1',
        stageName: 'Stage 1: Statistical Foundations & Advanced SQL',
        title: 'Day 1: Advanced SQL Window Functions, Running Totals & Cohort Retention Analysis',
        summary: 'Master OVER(), PARTITION BY, LEAD/LAG, and DENSE_RANK to calculate moving averages, cohort retention, and churn metrics without self-joins.',
        estimatedMinutes: 60,
        isCompleted: true,
        completedAt: '2026-10-21T18:00:00Z',
        objectives: [
          'Differentiate between row-level aggregations and non-reducing SQL window functions.',
          'Calculate monthly user retention cohorts using DATE_TRUNC and LAG/LEAD functions.',
          'Optimize execution plans for heavy window partitioning using composite indexes.',
        ],
        contentMarkdown: `### 1. Window Functions vs GROUP BY
A standard \`GROUP BY\` collapses multiple rows into a single aggregated summary row.

In contrast, a **Window Function** computes calculations over a designated partition of rows while **retaining each row's individual identity**:

\`\`\`sql
SELECT 
  user_id,
  order_date,
  amount_cents,
  -- Calculate running total spent per user over time
  SUM(amount_cents) OVER (
    PARTITION BY user_id 
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_spend,
  -- Calculate days since user's previous order
  order_date - LAG(order_date, 1) OVER (
    PARTITION BY user_id 
    ORDER BY order_date
  ) AS days_since_last_order
FROM orders;
\`\`\`

### 2. DENSE_RANK vs RANK vs ROW_NUMBER
- \`ROW_NUMBER()\`: Assigns sequential unique integers (1, 2, 3, 4).
- \`RANK()\`: Ties receive identical numbers, but leaves gaps (1, 2, 2, 4).
- \`DENSE_RANK()\`: Ties receive identical numbers without gaps (1, 2, 2, 3).`,
        codeSnippet: {
          language: 'sql',
          code: `-- 30-Day Moving Average Revenue Query
WITH daily_revenue AS (
  SELECT 
    DATE_TRUNC('day', order_date) AS order_day,
    SUM(amount_cents) / 100.0 AS daily_total
  FROM orders
  GROUP BY 1
)
SELECT 
  order_day,
  daily_total,
  AVG(daily_total) OVER (
    ORDER BY order_day 
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) AS moving_avg_30d
FROM daily_revenue
ORDER BY order_day DESC;`,
          description: 'Production PostgreSQL analytical query calculating a trailing 30-day moving average revenue'
        },
        keyTakeaways: [
          'Window functions calculate running metrics without collapsing individual rows.',
          'LAG and LEAD allow cross-row calculations without expensive self-joins.',
          'Partitioning on indexed columns prevents sorting entire multi-million row tables in memory.'
        ],
        resources: [
          { id: 'ds-res-1', title: 'PostgreSQL Tutorial: Window Functions Guide', url: 'https://www.postgresqltutorial.com/postgresql-window-function/', type: 'documentation', duration: '25 min', isFree: true }
        ],
        tasks: [
          {
            id: 'ds-task-1',
            title: 'Write a Monthly User Retention Cohort Query',
            description: 'Write an SQL query that calculates the percentage of users who returned to make a purchase 1, 2, and 3 months after their registration month.',
            instructions: [
              'Use DATE_TRUNC to define the signup cohort month.',
              'Use COUNT(DISTINCT user_id) partitioned by cohort and activity month.',
              'Calculate retention percentages.'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'ds-q1-1',
            question: 'What is the key difference between a SQL Window Function and a GROUP BY aggregation?',
            options: [
              'Window functions only work on numeric values',
              'Window functions calculate values across a set of rows without collapsing rows into a single summary output',
              'GROUP BY is faster in 100% of cases',
              'Window functions cannot be used in PostgreSQL'
            ],
            correctAnswerIndex: 1,
            explanation: 'Window functions preserve individual row output while calculating running totals, rankings, or moving averages across partitions.',
            topicTag: 'Advanced SQL'
          },
          {
            id: 'ds-q1-2',
            question: 'If two rows tie for 2nd place, what ranks will DENSE_RANK() assign to the first four items?',
            options: ['1, 2, 3, 4', '1, 2, 2, 4', '1, 2, 2, 3', '1, 2, 2, 2'],
            correctAnswerIndex: 2,
            explanation: 'DENSE_RANK() assigns identical ranks to ties without skipping subsequent numbers (1, 2, 2, 3), unlike RANK() which would output (1, 2, 2, 4).',
            topicTag: 'Advanced SQL'
          },
          {
            id: 'ds-q1-3',
            question: 'Which window function allows retrieving a column value from the preceding row within a partition?',
            options: ['FIRST_VALUE()', 'LEAD()', 'LAG()', 'NTH_VALUE()'],
            correctAnswerIndex: 2,
            explanation: 'LAG() accesses data from a previous row at a specified physical offset, essential for calculating time differences or growth rates.',
            topicTag: 'Advanced SQL'
          },
          {
            id: 'ds-q1-4',
            question: 'What passing threshold is required for a 5-question daily quiz under RoadmapAI standards?',
            options: ['2 questions', '3 questions', '4 questions (Math.ceil(5 * 0.70))', '5 questions'],
            correctAnswerIndex: 2,
            explanation: 'Passing threshold is 70% rounded up: Math.ceil(5 * 0.70) = 4 correct answers required.',
            topicTag: 'Platform Rules'
          },
          {
            id: 'ds-q1-5',
            question: 'What does ROWS BETWEEN 6 PRECEDING AND CURRENT ROW specify in a window frame?',
            options: [
              'A window containing exactly 7 rows: the current row and the 6 rows immediately prior',
              'A window containing 6 random rows',
              'All rows in the table',
              'Only rows with index between 0 and 6'
            ],
            correctAnswerIndex: 0,
            explanation: 'This defines a 7-day trailing moving window consisting of the current row and the 6 preceding chronological rows.',
            topicTag: 'Advanced SQL'
          }
        ]
      }
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Machine Learning Modeling, Validation & Hyperparameter Tuning',
    description: 'Implement regression, tree ensembles (Random Forests, XGBoost, LightGBM), cross-validation, and ROC/PR curve evaluations.',
    estimatedWeeks: 2,
    topics: ['Linear & Logistic Regression with Regularization (L1/L2)', 'Decision Trees, Random Forests & Gradient Boosting', 'XGBoost & LightGBM Parameter Optimization', 'K-Fold Stratified Cross-Validation & Data Leakage Prevention', 'Precision, Recall, F1-Score & Precision-Recall Curves'],
    capstoneProject: {
      title: 'Predictive Credit Default Risk Model with XGBoost',
      description: 'Build, tune, and evaluate an XGBoost classification pipeline predicting loan defaults while strictly preventing temporal data leakage.',
      deliverables: ['Scikit-Learn ColumnTransformer pipeline', 'Optuna automated hyperparameter tuning script', 'SHAP feature importance report'],
    },
    lessons: []
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Deep Learning, Natural Language Processing & Time Series',
    description: 'Build neural networks with PyTorch, apply word embeddings, fine-tune transformer models, and forecast time series with Prophet and ARIMA.',
    estimatedWeeks: 2,
    topics: ['Multi-Layer Perceptrons & Backpropagation in PyTorch', 'Text Embeddings & Sentence-Transformers', 'Transfer Learning with HuggingFace Transformers', 'Time-Series Decomposition, Stationarity & ARIMA', 'Unsupervised Clustering (K-Means, HDBSCAN, PCA)'],
    capstoneProject: {
      title: 'Customer Sentiment Analysis & Topic Extraction Engine',
      description: 'Fine-tune a pretrained RoBERTa model to classify customer reviews and cluster latent complaint themes using embedding vectors.',
      deliverables: ['PyTorch / HuggingFace training script', 'Confusion matrix and F1-score evaluation benchmark', 'FastAPI inference endpoint for batch scoring'],
    },
    lessons: []
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: MLOps, Model Monitoring & Production Decision Systems',
    description: 'Serve machine learning models via FastAPI, track experiments with MLflow, monitor feature drift with Evidently AI, and build dbt/Snowflake pipelines.',
    estimatedWeeks: 2,
    topics: ['Model Packaging & Containerization with Docker', 'FastAPI High-Throughput Batch Scoring Service', 'MLflow Experiment Tracking & Model Registry', 'Detecting Concept Drift & Data Drift in Production', 'dbt Data Transformations & Business Metrics in Snowflake'],
    capstoneProject: {
      title: 'Production Model Serving Pipeline with Automated Drift Monitoring',
      description: 'Deploy an automated ML service that scores customer records in real-time, logs prediction latency to Prometheus, and alerts on input feature drift.',
      deliverables: ['Dockerized FastAPI model serving container', 'MLflow model registry tracking artifact versions', 'Evidently AI automated drift detection report'],
    },
    lessons: []
  }
];

export const SAMPLE_DATA_SCIENTIST_ROADMAP: CareerRoadmap = {
  id: 'roadmap-data-scientist-analytics',
  jobTitle: 'Data Scientist & AI Analytics Engineer',
  skillLevel: 'Intermediate',
  targetDuration: '8 weeks',
  dailyTime: '1h',
  existingSkills: ['Python', 'SQL', 'Basic Statistics'],
  createdAt: '2026-10-21T09:00:00Z',
  updatedAt: '2026-10-28T09:00:00Z',
  totalDays: 28,
  summary: 'A 28-day data science path spanning advanced SQL window functions, Scikit-Learn pipelines, XGBoost gradient boosting, and production MLOps.',
  stages: DATA_SCIENTIST_STAGES,
};

