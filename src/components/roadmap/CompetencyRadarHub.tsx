import React from 'react';
import { LearningStage, DailyLesson } from '../../types';
import { Briefcase, CheckCircle2, Award, Sparkles, FolderGit2, ShieldCheck, Target, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompetencyRadarHubProps {
  stages: LearningStage[];
  roleTitle: string;
  completedLessonIds: string[];
  totalLessons: number;
}

export const CompetencyRadarHub: React.FC<CompetencyRadarHubProps> = ({
  stages,
  roleTitle,
  completedLessonIds,
  totalLessons,
}) => {
  // Domain competency pillars
  const pillars = [
    {
      title: 'Architectural Foundations',
      description: 'Design patterns, system invariants, language runtimes, and memory models.',
      targetStage: 'Stage 1',
      skills: ['Clean Architecture', 'Data Structures', 'Async Runtimes', 'State Isolation'],
      weight: 25,
      stageIndex: 0,
    },
    {
      title: 'Production API & Data Engine',
      description: 'Distributed persistence, caching tiers, transaction isolation, and schema contracts.',
      targetStage: 'Stage 2',
      skills: ['REST/gRPC Specifications', 'Database Indexing', 'Redis Caching', 'Authentication & JWT'],
      weight: 25,
      stageIndex: 1,
    },
    {
      title: 'Cloud Infrastructure & Scaling',
      description: 'Docker containerization, Kubernetes orchestration, CI/CD telemetry, and network security.',
      targetStage: 'Stage 3',
      skills: ['Container Orchestration', 'CI/CD Pipelines', 'Observability & Metrics', 'Edge Routing'],
      weight: 25,
      stageIndex: 2,
    },
    {
      title: 'Enterprise Capstone & Hiring Ready',
      description: 'End-to-end integration, performance benchmarking, security audits, and technical interview design.',
      targetStage: 'Stage 4',
      skills: ['System Design Case Studies', 'Load Testing', 'Fault Tolerance', 'Production Deliverables'],
      weight: 25,
      stageIndex: 3,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Competency Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((pillar, idx) => {
          const stage = stages[pillar.stageIndex];
          const stageLessons = stage?.lessons || [];
          const stageDoneCount = stageLessons.filter((l: DailyLesson) => completedLessonIds.includes(l.id)).length;
          const stagePct = stageLessons.length > 0 ? Math.round((stageDoneCount / stageLessons.length) * 100) : 0;

          return (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-light dark:border-[#20242E] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-ink dark:bg-vermilion text-white">
                    0{idx + 1}
                  </span>
                  <span className="font-mono text-xs text-graphite dark:text-[#8A929E] uppercase">
                    {pillar.targetStage} // PILLAR
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-graphite dark:text-[#8A929E]">MASTERY:</span>
                  <span className="font-bold text-vermilion">{stagePct}%</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-ink dark:text-[#F0F2F5]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-graphite dark:text-[#8A929E] mt-1 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-paper-tint dark:bg-[#1C2028] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-vermilion transition-all duration-500 rounded-full"
                    style={{ width: `${stagePct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-graphite dark:text-[#7A8290]">
                  <span>{stageDoneCount} OF {stageLessons.length} UNITS</span>
                  <span>{stagePct === 100 ? '● CERTIFIED' : 'IN TRAINING'}</span>
                </div>
              </div>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {pillar.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper dark:bg-[#181B22] text-ink dark:text-[#D4D8E0] border border-stone-light dark:border-[#242832]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Deliverables Showcase */}
      <div className="p-6 sm:p-8 rounded-xl border border-stone dark:border-[#242832] bg-white dark:bg-[#121418] shadow-subtle space-y-6">
        <div className="border-b border-stone-light dark:border-[#20242E] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-vermilion" />
              <span className="font-mono text-xs uppercase tracking-wider text-vermilion font-bold">
                PORTFOLIO BLUEPRINTS // 4 STAGE CAPSTONES
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-ink dark:text-[#F0F2F5] mt-1">
              Tangible GitHub Deliverables
            </h2>
            <p className="text-xs text-graphite dark:text-[#8A929E] mt-0.5">
              Every stage culminates in a real engineering deliverable to showcase to technical hiring managers.
            </p>
          </div>

          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-paper-tint dark:bg-[#181B22] text-ink dark:text-[#F0F2F5] border border-stone dark:border-[#242832] self-start sm:self-auto">
            4 PRODUCTION REPOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-5 rounded-lg border border-stone-light dark:border-[#20242E] bg-paper dark:bg-[#0E1013] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-vermilion">
                  CAPSTONE 0{idx + 1} &bull; STAGE {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-graphite dark:text-[#8A929E] flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3 text-vermilion" />
                  <span>Public GitHub Repo</span>
                </span>
              </div>

              <h4 className="font-bold text-sm text-ink dark:text-[#F0F2F5]">
                {stage.capstoneProject?.title || `Stage ${idx + 1} Architecture System`}
              </h4>

              <p className="text-xs text-graphite dark:text-[#8A929E] leading-relaxed">
                {stage.capstoneProject?.description ||
                  `Build a production-grade module demonstrating deterministic architecture, automated tests, and containerized deployment.`}
              </p>

              {stage.capstoneProject?.deliverables && (
                <div className="pt-2 border-t border-stone-light/50 dark:border-[#20242E] space-y-1">
                  <span className="text-[10px] font-mono text-graphite dark:text-[#7A8290] uppercase font-bold">
                    SPECIFICATION REQUIREMENTS:
                  </span>
                  <ul className="text-xs space-y-1 text-ink dark:text-[#D4D8E0]">
                    {stage.capstoneProject.deliverables.map((deliv: string, dIdx: number) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-vermilion font-bold">&check;</span>
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

