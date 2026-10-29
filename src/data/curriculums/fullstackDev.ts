import { CareerRoadmap, LearningStage } from '../../types';

export const FULLSTACK_STAGES: LearningStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Modern TypeScript, Asynchronous Runtimes & System Foundations',
    description: 'Master advanced TypeScript type systems, Node.js libuv event loop phases, modular microservices architecture, and robust REST/tRPC design.',
    estimatedWeeks: 2,
    topics: ['Advanced TypeScript & Generics', 'Node.js Event Loop & Microtasks', 'RESTful API Engineering & Zod', 'PostgreSQL Schema Modeling & Migrations', 'Authentication & JWT/OAuth Security'],
    capstoneProject: {
      title: 'Type-Safe Modular E-Commerce Core & API Gateway',
      description: 'Architect a modular TypeScript backend with Prisma ORM, PostgreSQL transactions, strict Zod validation, and rate-limited auth endpoints.',
      deliverables: ['Normalized PostgreSQL schema with indexes', 'Zod request/response validation middleware', 'JWT auth with refresh token rotation', 'Jest/Vitest integration test suite'],
    },
    lessons: [
      {
        id: 'fs-l1',
        dayNumber: 1,
        stageId: 'stage-1',
        stageName: 'Stage 1: TypeScript & System Foundations',
        title: 'Day 1: Advanced TypeScript Generics, Discriminated Unions & Type Invariance',
        summary: 'Eliminate runtime bugs by engineering strict compile-time types with conditional inference, keyof mappings, and discriminated union state machines.',
        estimatedMinutes: 60,
        isCompleted: true,
        completedAt: '2026-10-21T18:00:00Z',
        objectives: [
          'Construct robust discriminated unions that eliminate impossible application states at compile time.',
          'Implement conditional types with the infer keyword to extract function return types and promise resolutions.',
          'Configure tsconfig.json with strict compiler flags and path aliases for production packages.',
        ],
        contentMarkdown: `### 1. Discriminated Unions for Bulletproof API States
In full-stack TypeScript engineering, optional properties like \`data?: T\` and \`error?: Error\` allow impossible states (such as having both data and an error simultaneously).

A **Discriminated Union** enforces a single source of truth via an immutable discriminator property (e.g. \`status\`):

\`\`\`typescript
export type ApiResponse<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; timestamp: number }
  | { status: 'error'; error: { code: string; message: string } };

export function handleResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case 'loading':
      return 'Request in flight...';
    case 'success':
      // TypeScript guarantees res.data exists here!
      return \`Received payload: \${JSON.stringify(res.data)}\`;
    case 'error':
      // TypeScript guarantees res.error exists here!
      return \`Failed with code \${res.error.code}: \${res.error.message}\`;
    default:
      return 'Idle';
  }
}
\`\`\`

### 2. Inferring Return Types with Conditional Generics
The \`infer\` keyword lets you unwrap types dynamically:

\`\`\`typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnwrapPromise<Promise<{ id: string; role: string }>>; // { id: string; role: string }
\`\`\``,
        codeSnippet: {
          language: 'typescript',
          code: `export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}`,
          description: 'Type-safe Rust-inspired Result pattern for functional error handling in TypeScript'
        },
        keyTakeaways: [
          'Discriminated unions ensure the compiler enforces state-specific field access.',
          'The infer keyword allows deduplication of API payload signatures across frontend and backend.',
          'Enabling strict: true catches null and undefined edge-cases before deployment.'
        ],
        videoResource: {
          youtubeId: 'gieEQFIfgYc',
          title: 'TypeScript Advanced Types & Production Patterns',
          channel: 'freeCodeCamp',
          duration: '1 hr 35 min',
          summary: 'Master generics, discriminated unions, conditional inference with infer, and strict tsconfig.json compiler flags.'
        },
        resources: [
          { id: 'fs-res-1', title: 'TypeScript Handbook: Everyday Types & Discriminated Unions', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html', type: 'documentation', duration: '20 min', isFree: true },
          { id: 'fs-res-2', title: 'Modern TypeScript Best Practices for Backend APIs', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'article', duration: '30 min', isFree: true }
        ],
        tasks: [
          {
            id: 'fs-task-1',
            title: 'Build a Type-Safe Event Dispatcher',
            description: 'Implement an EventEmitter class where events and their payloads are strictly typed according to an EventMap interface.',
            instructions: [
              'Define an interface OrderEvents with order:created and order:refunded payloads.',
              'Implement typed emit() and on() methods using keyof OrderEvents.',
              'Verify that emitting with invalid payload types triggers TypeScript compiler errors.'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'fs-q1-1',
            question: 'What is the primary architectural advantage of a discriminated union in full-stack TypeScript?',
            options: [
              'It shrinks the compiled JavaScript file size',
              'It eliminates impossible states at compile time by binding field availability to a shared tag literal',
              'It enables multi-threading in Node.js',
              'It bypasses the need for JSON parsing'
            ],
            correctAnswerIndex: 1,
            explanation: 'Discriminated unions bind properties to literal tags (like status: success), making it impossible to access data during an error state.',
            topicTag: 'TypeScript Advanced'
          },
          {
            id: 'fs-q1-2',
            question: 'What does the infer keyword do inside a conditional type definition?',
            options: [
              'It casts a variable to any',
              'It declares a generic type variable to be deduced from the type being examined',
              'It imports an external module at runtime',
              'It forces synchronous execution'
            ],
            correctAnswerIndex: 1,
            explanation: 'infer introduces a type variable within a conditional type branch to extract nested or return types.',
            topicTag: 'TypeScript Advanced'
          },
          {
            id: 'fs-q1-3',
            question: 'Which tsconfig.json compiler option prevents accessing properties on unknown types without narrowing?',
            options: ['target: ES2022', 'strict: true', 'moduleResolution: node', 'skipLibCheck: true'],
            correctAnswerIndex: 1,
            explanation: 'strict: true enables strictNullChecks and prevents unsafe member access without explicit narrowing or guards.',
            topicTag: 'TypeScript Advanced'
          },
          {
            id: 'fs-q1-4',
            question: 'Under RoadmapAI application rules, what is the required passing threshold for a 5-question daily quiz?',
            options: ['2 correct answers', '3 correct answers', '4 correct answers (ceil(5 * 0.70))', '5 correct answers'],
            correctAnswerIndex: 2,
            explanation: 'The threshold is 70% rounded up to a whole question: Math.ceil(5 * 0.70) = 4 correct answers.',
            topicTag: 'System Rules'
          },
          {
            id: 'fs-q1-5',
            question: 'How does keyof Record<string, number> evaluate in TypeScript?',
            options: ['string | number', 'number[]', 'string', 'boolean'],
            correctAnswerIndex: 0,
            explanation: 'In TypeScript, string index signatures accept both string and number keys due to JavaScript object property coercion.',
            topicTag: 'TypeScript Advanced'
          }
        ]
      },
      {
        id: 'fs-l2',
        dayNumber: 2,
        stageId: 'stage-1',
        stageName: 'Stage 1: TypeScript & System Foundations',
        title: 'Day 2: Node.js Event Loop Architecture, Microtask Prioritization & Libuv',
        summary: 'Deconstruct the single-threaded asynchronous runtime, libuv phase transitions, and thread pool worker offloading.',
        estimatedMinutes: 60,
        isCompleted: true,
        completedAt: '2026-10-22T19:00:00Z',
        objectives: [
          'Trace execution flow through Timers, Pending Callbacks, Poll, and Check phases of the libuv event loop.',
          'Differentiate microtask drain order (process.nextTick vs Promise.then) against macrotasks.',
          'Prevent event loop starvation by offloading cryptographic and CPU-heavy operations to worker threads.',
        ],
        contentMarkdown: `### 1. The Libuv Event Loop Phases
Node.js processes I/O operations through the C-based **libuv** library across sequential phases:
1. **Timers**: Handles expired callbacks from \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks**: Executes deferred I/O error handlers.
3. **Poll**: Retrieves new I/O events (network connections, disk reads) and blocks when appropriate.
4. **Check**: Dedicated exclusively to \`setImmediate()\` callbacks.
5. **Close Callbacks**: Cleans up resources like socket closures.

### 2. Microtask Execution Priority
Microtasks execute **immediately between operations**, draining completely before Node moves to the next event loop phase:
- \`process.nextTick()\` has priority over standard Promise microtasks!
- Excessive recursive \`process.nextTick()\` calls will starve the event loop and crash your server.`,
        codeSnippet: {
          language: 'javascript',
          code: `const fs = require('fs');

console.log('1: Main Script Start');

setTimeout(() => console.log('5: Timers Phase'), 0);
setImmediate(() => console.log('6: Check Phase (setImmediate)'));

Promise.resolve().then(() => console.log('3: Promise Microtask'));
process.nextTick(() => console.log('2: NextTick Microtask'));

console.log('4: Main Script End');`,
          description: 'Deterministic demonstration of Node.js synchronous execution and microtask draining priority'
        },
        keyTakeaways: [
          'process.nextTick drains before Promise.then microtasks.',
          'setImmediate always executes in the Check phase, after Poll completes.',
          'Never run synchronous CPU-heavy hashing loops on the primary event loop thread.'
        ],
        videoResource: {
          youtubeId: '8aGhZQkoFbQ',
          title: 'What the heck is the event loop anyway?',
          channel: 'Philip Roberts',
          duration: '26 min',
          summary: 'The classic masterclass deconstructing call stack, browser/libuv threadpool, task queues, and microtask draining.'
        },
        resources: [
          { id: 'fs-res-3', title: 'The Node.js Event Loop, Timers, and process.nextTick()', url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick', type: 'documentation', duration: '25 min', isFree: true }
        ],
        tasks: [
          {
            id: 'fs-task-2',
            title: 'Diagnose Event Loop Starvation',
            description: 'Write an asynchronous ping HTTP server and trigger a heavy synchronous bcrypt hash to observe latency spikes.',
            instructions: [
              'Create an HTTP server that responds with timestamp on /ping.',
              'Add a CPU intensive route /heavy using synchronous crypto.pbkdf2Sync.',
              'Measure latency with ApacheBench or curl while /heavy is processing.'
            ],
            completed: true
          }
        ],
        quizQuestions: [
          {
            id: 'fs-q2-1',
            question: 'Which phase of the libuv event loop is dedicated to running callbacks scheduled with setImmediate()?',
            options: ['Timers', 'Poll', 'Check', 'Pending I/O'],
            correctAnswerIndex: 2,
            explanation: 'The Check phase runs immediately after the Poll phase and is designed specifically for setImmediate() callbacks.',
            topicTag: 'Node.js Internals'
          },
          {
            id: 'fs-q2-2',
            question: 'Between process.nextTick() and Promise.resolve().then(), which queue has priority in Node.js?',
            options: ['Promise.resolve().then() executes first', 'process.nextTick() executes first', 'They execute in round-robin order', 'They execute simultaneously on two threads'],
            correctAnswerIndex: 1,
            explanation: 'The nextTickQueue is processed before the microtask queue (Promise callbacks) on every tick of the event loop.',
            topicTag: 'Node.js Internals'
          },
          {
            id: 'fs-q2-3',
            question: 'What happens if a route handler executes a synchronous 10-second calculation on the main thread?',
            options: [
              'Node.js automatically moves it to another CPU core',
              'All other incoming HTTP requests are completely blocked until the calculation completes',
              'The calculation is queued into Redis automatically',
              'The operating system kills the process immediately'
            ],
            correctAnswerIndex: 1,
            explanation: 'Because Node.js runs JavaScript on a single thread, synchronous operations block the event loop entirely.',
            topicTag: 'Node.js Internals'
          },
          {
            id: 'fs-q2-4',
            question: 'Which native Node.js module is recommended for offloading heavy CPU computation without blocking the event loop?',
            options: ['worker_threads', 'cluster', 'child_process.execSync', 'net'],
            correctAnswerIndex: 0,
            explanation: 'The worker_threads module enables multi-threaded execution with shared memory and message passing.',
            topicTag: 'Node.js Internals'
          },
          {
            id: 'fs-q2-5',
            question: 'What is the default size of the libuv thread pool used for file system and DNS calls?',
            options: ['1 thread', '4 threads', '16 threads', 'Unlimited threads'],
            correctAnswerIndex: 1,
            explanation: 'The default UV_THREADPOOL_SIZE is 4 threads, which can be configured via environment variables up to 1024.',
            topicTag: 'Node.js Internals'
          }
        ]
      },
      {
        id: 'fs-l3',
        dayNumber: 3,
        stageId: 'stage-1',
        stageName: 'Stage 1: TypeScript & System Foundations',
        title: 'Day 3: Relational Modeling with PostgreSQL, Indexing & Query Plans',
        summary: 'Design normalized relational databases, configure B-Tree and GIN indexes, and analyze performance with EXPLAIN ANALYZE.',
        estimatedMinutes: 60,
        isCompleted: false,
        objectives: [
          'Design 3NF normalized PostgreSQL tables with foreign keys and cascade rules.',
          'Analyze query performance bottlenecks using EXPLAIN (ANALYZE, BUFFERS).',
          'Implement composite and partial indexes to optimize multi-column filter queries.',
        ],
        contentMarkdown: `### 1. PostgreSQL Index Mechanics: Sequential Scan vs Index Scan
When executing a query like \`SELECT * FROM orders WHERE user_id = 42\`, PostgreSQL decides between:
- **Sequential Scan**: Reads every page of the table from disk into RAM.
- **Index Scan**: Traverses an ordered B-Tree to fetch the exact physical tuple pointers (\`ctid\`).

\`\`\`sql
-- Composite index for fast filtering and sorting
CREATE INDEX idx_orders_user_status ON orders (user_id, status);

-- Partial index for active records (dramatically smaller index footprint!)
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'PENDING';
\`\`\`

### 2. Reading EXPLAIN ANALYZE Output
Always inspect the **actual time** and **buffer hits**:
\`\`\`text
Index Scan using idx_orders_user_status on orders (cost=0.29..8.30 rows=1 width=72) (actual time=0.015..0.016 rows=1 loops=1)
  Buffers: shared hit=3
Planning Time: 0.082 ms
Execution Time: 0.031 ms
\`\`\``,
        codeSnippet: {
          language: 'sql',
          code: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);`,
          description: 'Production PostgreSQL schema with UUID keys, constraints, and composite descending indexes'
        },
        keyTakeaways: [
          'Sequential scans become catastrophic bottlenecks as tables grow past thousands of rows.',
          'Partial indexes allow indexing only hot, frequently queried subsets of data.',
          'Foreign key columns should almost always have supporting indexes to speed up joins and cascade deletions.'
        ],
        resources: [
          { id: 'fs-res-4', title: 'PostgreSQL Official Documentation: Index Types & Performance', url: 'https://www.postgresql.org/docs/current/indexes-types.html', type: 'documentation', duration: '30 min', isFree: true }
        ],
        tasks: [
          {
            id: 'fs-task-3',
            title: 'Benchmark Index vs Table Scan in Postgres',
            description: 'Generate 100,000 mock orders in a PostgreSQL database and compare execution time before and after adding a composite B-tree index.',
            instructions: [
              'Use generate_series(1, 100000) to populate test records.',
              'Run EXPLAIN ANALYZE on a filter query before indexing.',
              'Add CREATE INDEX and compare planning and execution metrics.'
            ],
            completed: false
          }
        ],
        quizQuestions: [
          {
            id: 'fs-q3-1',
            question: 'What is the primary benefit of a Partial Index in PostgreSQL?',
            options: [
              'It encrypts rows matching the condition',
              'It indexes only rows that satisfy a WHERE predicate, saving disk space and memory cache overhead',
              'It allows null values in primary keys',
              'It replicates data to read replicas automatically'
            ],
            correctAnswerIndex: 1,
            explanation: 'A partial index covers only a subset of table rows (e.g. WHERE status = "PENDING"), yielding smaller index size and faster updates.',
            topicTag: 'PostgreSQL Optimization'
          },
          {
            id: 'fs-q3-2',
            question: 'Why should foreign key columns in child tables almost always have an index in PostgreSQL?',
            options: [
              'PostgreSQL automatically creates them by default on foreign keys',
              'PostgreSQL does NOT automatically index foreign keys, leading to full table scans during JOINs and parent deletions',
              'Foreign keys cannot store integer values without indexes',
              'Indexes disable transaction rollback overhead'
            ],
            correctAnswerIndex: 1,
            explanation: 'Unlike primary keys, PostgreSQL does not auto-index foreign keys. Without an index, cascade deletions and joins force slow sequential scans.',
            topicTag: 'PostgreSQL Optimization'
          },
          {
            id: 'fs-q3-3',
            question: 'What does "shared hit" in an EXPLAIN (ANALYZE, BUFFERS) query plan represent?',
            options: [
              'Blocks read directly from disk',
              'Blocks found directly in PostgreSQL shared buffer memory cache',
              'Number of active database connections',
              'Number of dropped packets'
            ],
            correctAnswerIndex: 1,
            explanation: 'Shared hits indicate pages already cached in PostgreSQL memory buffer, which are orders of magnitude faster than disk reads.',
            topicTag: 'PostgreSQL Optimization'
          },
          {
            id: 'fs-q3-4',
            question: 'Which index type is best suited for full-text search and array containment queries in PostgreSQL?',
            options: ['B-Tree', 'Hash', 'GIN (Generalized Inverted Index)', 'BRIN'],
            correctAnswerIndex: 2,
            explanation: 'GIN indexes are engineered to handle composite items containing multiple elements, such as arrays, jsonb, and tsvector text search.',
            topicTag: 'PostgreSQL Optimization'
          },
          {
            id: 'fs-q3-5',
            question: 'What is the consequence of having too many indexes on a write-heavy database table?',
            options: [
              'Queries become slower',
              'INSERT, UPDATE, and DELETE operations become slower because every index must be maintained on each write',
              'PostgreSQL forces table locks on read queries',
              'Database storage is reduced'
            ],
            correctAnswerIndex: 1,
            explanation: 'Every index incurs write overhead because every new or modified row requires updating the corresponding B-Tree nodes on disk.',
            topicTag: 'PostgreSQL Optimization'
          }
        ]
      }
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Modern React 19, Server Components & State Synchronization',
    description: 'Master React 19 Actions, Server Components (RSC), optimistic UI updates, streaming SSR, and Zustand/TanStack Query client caching.',
    estimatedWeeks: 2,
    topics: ['React Server Components vs Client Components', 'Optimistic UI Updates & useOptimistic', 'TanStack Query (React Query) Architecture', 'Form Actions & useActionState', 'Web Vitals & Performance Profiling'],
    capstoneProject: {
      title: 'Real-Time Collaborative Dashboard with Streaming SSR',
      description: 'Build a production web application with Next.js App Router, streaming Suspense boundaries, TanStack Query cache invalidation, and optimistic mutations.',
      deliverables: ['Streaming dashboard with Suspense fallbacks', 'Optimistic task updating without loading spinners', 'Server Actions with Zod safeParse validation'],
    },
    lessons: []
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Containerization, CI/CD Automation & Cloud Deployment',
    description: 'Package production applications with multi-stage Docker builds, orchestrate environments with Docker Compose, and automate testing with GitHub Actions.',
    estimatedWeeks: 2,
    topics: ['Multi-Stage Dockerfile Optimization', 'Docker Compose Networking & Volumes', 'GitHub Actions Workflows & Matrix Builds', 'Reverse Proxies & Nginx Configuration', 'Cloud Hosting on AWS ECS & Vercel'],
    capstoneProject: {
      title: 'Automated Zero-Downtime Deployment Pipeline',
      description: 'Configure automated pull-request preview deployments, security audits, Docker image push to AWS ECR, and automated health checks.',
      deliverables: ['Optimized multi-stage Dockerfile (<100MB image)', 'GitHub Actions CI with caching and linting', 'Nginx reverse proxy with SSL termination'],
    },
    lessons: []
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: System Design, Scalability & Senior Interview Mastery',
    description: 'Design distributed architectures, Redis caching layers, message queues, rate limiting, and prepare for top-tier full-stack technical interviews.',
    estimatedWeeks: 2,
    topics: ['Distributed Caching Patterns (Cache-Aside, Write-Through)', 'Message Queues with BullMQ & Redis', 'Database Sharding & Read Replicas', 'API Security & Rate Limiting (Token Bucket)', 'Senior System Design Case Studies'],
    capstoneProject: {
      title: 'High-Throughput Distributed Rate Limiter & Webhook Dispatcher',
      description: 'Implement a Redis-backed sliding-window rate limiter and fault-tolerant webhook delivery queue with exponential backoff retries.',
      deliverables: ['Sliding-window Redis Lua script', 'BullMQ retry worker with dead-letter queue', 'Architecture diagram and system design documentation'],
    },
    lessons: []
  }
];

export const SAMPLE_FULLSTACK_ROADMAP: CareerRoadmap = {
  id: 'roadmap-fullstack-cloud-dev',
  jobTitle: 'Full Stack Cloud Developer',
  skillLevel: 'Intermediate',
  targetDuration: '8 weeks',
  dailyTime: '2h',
  existingSkills: ['JavaScript', 'HTML/CSS', 'Git basics'],
  createdAt: '2026-10-21T09:00:00Z',
  updatedAt: '2026-10-28T09:00:00Z',
  totalDays: 28,
  summary: 'An ordered 28-day professional curriculum mastering TypeScript, PostgreSQL indexing, React 19 Server Components, multi-stage Docker, and scalable cloud systems.',
  stages: FULLSTACK_STAGES,
};

