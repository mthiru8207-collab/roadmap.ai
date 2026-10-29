# RoadmapAI — The Personal Learning Instrument

**RoadmapAI** is an art-directed career learning platform inspired by Swiss editorial design, technical field notes, modern productivity software, and printed career atlases.

It helps learners master any career goal through personalized, multi-stage roadmaps, daily lesson units, verified 5-question comprehension quizzes, weekly cumulative checkpoints, and career outcome readiness modules.

---

## Visual Identity & Design System

The platform strictly adheres to the **Personal Learning Instrument** design language:
- **Paper White (`#F7F6F2`)**: Warm, authentic paper background.
- **Ink Black (`#20211F`)**: High-contrast, publication-grade typography.
- **Vermilion Red (`#F04B35`)**: Distinctive destination markers, active indicators, and critical annotations.
- **Muted Sage (`#879584`)**: Subtle secondary verification badges and passing states.
- **Pale Stone (`#E7E5DE`)**: Delicate dividing rules and structural borders.
- **Graphite (`#777872`)**: Secondary technical captions, coordinates, and metadata.
- **Typography**: Newsreader / Instrument Serif display typography paired with Plus Jakarta Sans and JetBrains Mono for monospaced metadata, dates, durations, and coordinates.
- **No decorative clutter**: Zero generic glowing gradients, zero glassmorphism, zero repetitive rounded card grids, and zero fake analytics.

---

## Key Features

1. **Editorial Landing Page (`/`)**
   - Wordmark: `roadmap/ai`
   - Navigation: Explore Careers, How It Works, The 70% Method, Sign In, "Build my roadmap"
   - Hero Headline: *“A career isn't a course. It's a path you build.”*
   - Custom SVG Route Illustration connecting four numbered milestones:
     `01 Learn` &rarr; `02 Practice` &rarr; `03 Build` &rarr; `04 Become`
   - Compact 4-step process strip and curated career track selector.

2. **Career Setup Flow (`/setup`)**
   - 3-step editorial setup wizard with step indicator:
     - **Step 01 — Direction**: Target job title (free text input for any profession + suggestion chips)
     - **Step 02 — Starting Point**: Beginner, Intermediate, Advanced, existing skills adder, learning goals
     - **Step 03 — Study Pace**: Daily commitment (30m, 1h, 2h, 3h), completion timeline (4–16 weeks), format, and resource budget.
   - Animated synthesis loading screen structuring the 4-stage curriculum.

3. **Main Dashboard (`/dashboard`)**
   - Header: *“Make today count.”* with current date, career, and stage.
   - **Today's Focus**: Objectives preview, estimated duration, and Start Lesson button.
   - **Your Route (Signature Component)**: Connected milestone timeline with Completed, In-Progress, Upcoming, and Revision-Needed states.
   - **Weekly Checkpoint**: Next assessment questions and 70% threshold.
   - **Recorded Activity**: Bar chart of real minutes studied and lessons finished.
   - **Recent Work**: Verified quiz scores and audit trail.

4. **Daily Lesson Interface (`/lesson/:id`)**
   - Technical publication reading measure and typography.
   - Clear learning objectives, structured markdown, code snippet with copy button, practical exercise with instructions and collapsible solution reference, key takeaways, completion checklist, and previous/next day navigation.

5. **Daily Comprehension Quiz (`/quiz/:id`)**
   - 5 questions derived from lesson content.
   - Deterministic 70% passing threshold: $\lceil 5 \times 0.70 \rceil = 4$ correct answers required.
   - Step indicator tabs, option selection, explanation feedback, and revision recommendations when below 70% (non-blocking).

6. **Weekly Cumulative Assessment (`/assessment`)**
   - 10–15 question comprehensive exams after every 7-day learning cycle.
   - 70% passing threshold ($\lceil 10 \times 0.70 \rceil = 7$).
   - Topic-by-topic diagnostic breakdown and weak-topic queueing.

7. **Roadmap Details (`/roadmap`)**
   - Connected 4-stage view with stage objectives, topics, daily lessons, practical exercises, and capstone project deliverables.
   - Career integration modules: Portfolio building, Resume preparation, Technical interview practice, and Job search strategy.

8. **Progress & Verification Ledger (`/progress`)**
   - Tracks 6 separate metrics from real activity: lessons completed, quizzes passed, weekly assessments completed, real study streak, roadmap milestones, and topics requiring revision.

9. **Settings & Persistence (`/settings`)**
   - Supabase configuration indicator and honest Demo Mode label (clearly noting local browser persistence when credentials are missing).
   - Backend health check (`/api/health`) for secure server-side LLM proxy.
   - Progress data export (JSON) and reset controls.

---

## Connected Routes

- `/` &mdash; Editorial Landing Page
- `/setup` &mdash; Multi-Step Career Architect
- `/dashboard` &mdash; Overview & Signature Milestone Timeline
- `/roadmap` &mdash; Complete 4-Stage Syllabus & Projects
- `/lesson/:id` &mdash; Daily Technical Publication
- `/quiz/:id` &mdash; 5-Question Daily Quiz (70% threshold)
- `/assessment` &mdash; Weekly Cumulative Checkpoint
- `/progress` &mdash; Verification Ledger & Weak Topics
- `/roadmaps` &mdash; Saved Career Tracks
- `/settings` &mdash; System Status & Persistence Settings

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the repository
cd "d:/ROAD MAP AI"

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set optional variables if using cloud sync or live Gemini API:
```env
# Optional Supabase Cloud Sync
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional Server-Side Gemini API Key (keep secrets off client)
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If Supabase or Gemini keys are omitted, RoadmapAI operates smoothly in **Honest Demo Mode** with pre-seeded realistic curriculum data and local browser persistence.

### Development Server
```bash
# Start frontend Vite dev server
npm run dev

# (Optional) Start server-side AI proxy
npm run server
```

### Production Build
```bash
npm run build
npm run preview
```

### Database Setup (Supabase PostgreSQL)
When configuring Supabase:
1. Open the **SQL Editor** in your Supabase dashboard.
2. Execute the script in [`supabase/schema.sql`](file:///d:/ROAD%20MAP%20AI/supabase/schema.sql).
3. The schema provisions `profiles`, `roadmaps`, `lesson_progress`, `quiz_attempts`, `weekly_assessments`, `weak_topics`, and `study_activity` tables with Row Level Security (RLS) enabled.
