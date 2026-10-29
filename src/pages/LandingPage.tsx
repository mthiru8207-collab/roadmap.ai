import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Target,
  FileText,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { POPULAR_ROLES } from '../data/rolePresets';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { HeroTrajectoryVisualizer } from '../components/landing/HeroTrajectoryVisualizer';

interface LandingPageProps {
  onOpenAuth?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { setActiveDayNumber } = useLearning();
  const { user } = useAuth();

  const handleSelectCareer = (roleTitle: string) => {
    navigate(`/setup?career=${encodeURIComponent(roleTitle)}`);
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg text-ink dark:text-dark-ink selection:bg-vermilion/15 transition-colors duration-200">
      {/* Editorial Navigation */}
      <nav className="border-b border-stone dark:border-[#282D36] bg-[#F7F6F2] dark:bg-[#0E1012] sticky top-0 z-50 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded border border-ink/20 dark:border-[#282D36] bg-paper-tint dark:bg-[#16181C] flex items-center justify-center text-ink dark:text-[#F0F2F5] font-mono font-bold text-xs group-hover:border-vermilion group-hover:text-vermilion transition-colors">
              R/A
            </div>
            <div className="flex items-baseline">
              <span className="font-bold text-lg text-ink dark:text-[#F0F2F5] tracking-tight font-sans">
                roadmap<span className="text-vermilion font-serif italic text-xl">/ai</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-graphite-dark dark:text-[#8A929E]">
            <a href="#careers" className="hover:text-ink dark:hover:text-[#F0F2F5] transition-colors">Explore Careers</a>
            <a href="#how-it-works" className="hover:text-ink dark:hover:text-[#F0F2F5] transition-colors">How It Works</a>
            <a href="#system" className="hover:text-ink dark:hover:text-[#F0F2F5] transition-colors">The 70% Method</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Visual Theme Switcher */}
            <ThemeToggle />

            {user && !user.isGuest ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-stone dark:border-[#282D36] bg-white dark:bg-[#16181C] hover:bg-paper-subtle dark:hover:bg-[#20242B] text-xs font-semibold text-ink dark:text-[#F0F2F5] transition-colors"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded bg-stone dark:bg-dark-surface flex items-center justify-center text-[10px] font-mono font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded border border-stone dark:border-[#282D36] bg-white dark:bg-[#16181C] hover:bg-paper-subtle dark:hover:bg-[#20242B] text-xs font-semibold text-ink dark:text-[#F0F2F5] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
            <Link
              to="/setup"
              className="px-4 py-2 rounded bg-vermilion hover:bg-vermilion-dark text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-subtle"
            >
              <span>Build my roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone dark:border-dark-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card text-[11px] font-mono tracking-wider text-graphite dark:text-dark-muted uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
              <span>THE PERSONAL LEARNING INSTRUMENT &bull; VOL. 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-ink dark:text-dark-ink tracking-tight leading-[1.08]">
              A career isn’t a course. <br />
              <span className="italic font-normal text-ink dark:text-dark-ink">It’s a path you build.</span>
            </h1>

            <p className="text-base sm:text-lg text-graphite-dark dark:text-dark-muted max-w-xl leading-relaxed font-sans font-normal">
              Choose where you want to go. Get a learning plan built around your skills, your time, and the work you want to do.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/setup"
                className="px-6 py-3.5 rounded bg-vermilion hover:bg-vermilion-dark text-white font-semibold text-sm flex items-center gap-2.5 transition-all shadow-subtle group"
              >
                <span>Design my roadmap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/dashboard"
                className="px-5 py-3.5 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card hover:bg-paper-subtle dark:hover:bg-dark-subtle text-ink dark:text-dark-ink font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <span>Explore an example roadmap</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-mono text-graphite dark:text-dark-muted">
              <div className="flex items-center gap-1.5">
                <span className="text-vermilion font-bold">01</span>
                <span>NO REPETITIVE CARDS</span>
              </div>
              <div className="border-l border-stone dark:border-dark-border h-3" />
              <div className="flex items-center gap-1.5">
                <span className="text-vermilion font-bold">02</span>
                <span>70% CEILING THRESHOLD</span>
              </div>
              <div className="border-l border-stone dark:border-dark-border h-3" />
              <div className="flex items-center gap-1.5">
                <span className="text-vermilion font-bold">03</span>
                <span>LOCAL & SUPABASE READY</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Trajectory Atlas Visualizer */}
          <div className="lg:col-span-5">
            <HeroTrajectoryVisualizer />
          </div>
        </div>
      </section>

      {/* Compact Four-Step Process Strip */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-stone dark:border-dark-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border">
            <div className="font-mono text-xs text-vermilion font-bold mb-2">01 // DIRECTION</div>
            <h3 className="font-bold text-sm text-ink dark:text-dark-ink mb-1">State Any Career Goal</h3>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              Input any job title from AI Engineer to UX Researcher. The synthesizer formulates an ordered trajectory.
            </p>
          </div>

          <div className="p-5 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border">
            <div className="font-mono text-xs text-vermilion font-bold mb-2">02 // DAILY UNITS</div>
            <h3 className="font-bold text-sm text-ink dark:text-dark-ink mb-1">Bite-Sized Daily Study</h3>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              Clear learning objectives, structured reading, real links, practical coding, and an interactive task.
            </p>
          </div>

          <div className="p-5 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border">
            <div className="font-mono text-xs text-vermilion font-bold mb-2">03 // VERIFICATION</div>
            <h3 className="font-bold text-sm text-ink dark:text-dark-ink mb-1">5-Question Daily Quizzes</h3>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              Rigorous 70% passing threshold (<code className="font-mono text-[11px]">ceil(5 &times; 0.70) = 4</code>). Immediate feedback without blocking.
            </p>
          </div>

          <div className="p-5 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border">
            <div className="font-mono text-xs text-vermilion font-bold mb-2">04 // CHECKPOINTS</div>
            <h3 className="font-bold text-sm text-ink dark:text-dark-ink mb-1">Weekly Cumulative Review</h3>
            <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
              10–15 question comprehensive exams that diagnose weak topics and suggest targeted revision.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Explanation Section: The Method */}
      <section id="system" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-stone dark:border-dark-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-graphite dark:text-dark-muted">THE DISCIPLINE</div>
            <h2 className="text-3xl font-serif text-ink dark:text-dark-ink tracking-tight">
              Designed as a technical field note, not a flashy toy.
            </h2>
            <p className="text-sm text-graphite dark:text-dark-muted leading-relaxed">
              Most online learning sites drown you in video playlists, gamified badges, and vague progress bars. RoadmapAI treats career development like serious engineering: daily practice, verified comprehension, and built deliverables.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded bg-paper-subtle dark:bg-dark-card border border-stone dark:border-dark-border space-y-3">
              <BookOpen className="w-5 h-5 text-ink dark:text-dark-ink" />
              <h3 className="font-bold text-sm text-ink dark:text-dark-ink">Daily Lessons</h3>
              <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
                Concise, high-density explanations with real code snippets, conceptual diagrams, and verified documentation links.
              </p>
            </div>

            <div className="p-6 rounded bg-paper-subtle dark:bg-dark-card border border-stone dark:border-dark-border space-y-3">
              <HelpCircle className="w-5 h-5 text-vermilion" />
              <h3 className="font-bold text-sm text-ink dark:text-dark-ink">70% Application Scoring</h3>
              <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
                Calculated purely in deterministic application logic. Missing questions flags specific topics for tailored review.
              </p>
            </div>

            <div className="p-6 rounded bg-paper-subtle dark:bg-dark-card border border-stone dark:border-dark-border space-y-3">
              <Award className="w-5 h-5 text-sage-dark" />
              <h3 className="font-bold text-sm text-ink dark:text-dark-ink">Weekly Milestone Exams</h3>
              <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed">
                Every 7-day cycle culminates in a 10–15 question assessment tracking knowledge retention across all previous modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Popular Career Presets */}
      <section id="careers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-stone dark:border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-graphite dark:text-dark-muted mb-1">CURATED TRACKS</div>
            <h2 className="text-2xl sm:text-3xl font-serif text-ink dark:text-dark-ink tracking-tight">
              Explore Available Curriculums
            </h2>
          </div>
          <p className="text-xs text-graphite-dark dark:text-dark-muted max-w-sm">
            Or type any unique job title in the generator to synthesize a custom pathway instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_ROLES.map(role => (
            <div
              key={role.id}
              onClick={() => handleSelectCareer(role.title)}
              className="p-5 rounded bg-white dark:bg-dark-card border border-stone dark:border-dark-border hover:border-vermilion dark:hover:border-vermilion cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-graphite dark:text-dark-muted mb-2">
                  <span>{role.category}</span>
                  <span className="text-vermilion font-semibold">{role.suggestedDuration}</span>
                </div>
                {role.inDemandTag && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-vermilion-light dark:bg-vermilion/20 border border-vermilion/20 text-vermilion text-[10px] font-mono font-bold">
                      {role.inDemandTag}
                    </span>
                  </div>
                )}
                <h3 className="text-base font-bold text-ink dark:text-dark-ink mb-1.5 group-hover:text-vermilion transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-graphite dark:text-dark-muted leading-relaxed mb-4">
                  {role.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stone-light dark:border-dark-border">
                  {role.popularTechnologies.slice(0, 4).map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-paper-tint dark:bg-dark-surface text-[10px] font-mono text-ink-light dark:text-dark-muted border border-stone-light dark:border-dark-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-ink dark:text-dark-ink pt-2">
                  <span>Synthesize curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-vermilion" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concluding CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block font-mono text-xs text-vermilion tracking-wider uppercase font-semibold">
            YOUR NEXT CAREER MILESTONE
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink dark:text-dark-ink tracking-tight">
            Start structuring your path today.
          </h2>
          <p className="text-sm text-graphite dark:text-dark-muted leading-relaxed max-w-xl mx-auto">
            No credit card. No artificial fluff. Just an artfully organized technical curriculum configured around your life.
          </p>
          <div className="pt-2">
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded bg-vermilion hover:bg-vermilion-dark text-white font-semibold text-sm transition-colors shadow-atlas"
            >
              <span>Build my roadmap</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-stone dark:border-dark-border py-8 bg-paper-subtle dark:bg-dark-card text-xs text-graphite dark:text-dark-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink dark:text-dark-ink">roadmap/ai</span>
            <span className="font-mono text-[10px]">&bull; THE PERSONAL LEARNING INSTRUMENT</span>
          </div>
          <div className="font-mono text-[10px] text-graphite dark:text-dark-muted">
            SWISS EDITORIAL SYSTEM &bull; 70% THRESHOLD DISCIPLINE &bull; 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
