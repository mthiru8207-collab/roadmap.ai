import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Target, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StageInfo {
  number: string;
  name: string;
  range: string;
  tag: string;
  summary: string;
  skills: string[];
  cx: number;
  cy: number;
  color: string;
  isPinnacle?: boolean;
}

export const HeroTrajectoryVisualizer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(3); // Default to Stage 4 (Destination)

  const stages: StageInfo[] = [
    {
      number: '01',
      name: 'Foundations',
      range: 'Days 01–07',
      tag: 'PHASE 01 // BASELINE',
      summary: 'Low-level runtimes, memory models, clean architecture & design patterns.',
      skills: ['Linux Internals', 'Data Structures', 'Async Runtimes', 'State Isolation'],
      cx: 60,
      cy: 245,
      color: '#10B981', // emerald
    },
    {
      number: '02',
      name: 'Production Engine',
      range: 'Days 08–14',
      tag: 'PHASE 02 // APIs & DATA',
      summary: 'High-throughput endpoints, transactional integrity & distributed caching.',
      skills: ['REST & gRPC', 'PostgreSQL & SQL', 'Redis Caching', 'Authentication'],
      cx: 165,
      cy: 175,
      color: '#0EA5E9', // sky
    },
    {
      number: '03',
      name: 'Cloud & Scale',
      range: 'Days 15–21',
      tag: 'PHASE 03 // CLOUD NATIVE',
      summary: 'Containerization, orchestration, telemetry pipelines & CI/CD automations.',
      skills: ['Docker & OCI', 'Kubernetes', 'CI/CD Pipelines', 'Observability'],
      cx: 270,
      cy: 110,
      color: '#8B5CF6', // violet
    },
    {
      number: '04',
      name: 'Industry Ready',
      range: 'Days 22–28',
      tag: 'DESTINATION // PINNACLE',
      summary: 'Enterprise portfolio capstone, architectural review & mock technical drills.',
      skills: ['Full Capstone Repo', 'System Design', '70% Assessment', 'Production Deploy'],
      cx: 375,
      cy: 50,
      color: '#F04B35', // vermilion
      isPinnacle: true,
    },
  ];

  const current = stages[activeStage];

  return (
    <div className="relative rounded-xl border border-stone dark:border-[#282D36] bg-white dark:bg-[#121418] shadow-atlas overflow-hidden transition-all">
      {/* Top Technical Telemetry Masthead */}
      <div className="px-5 py-3 border-b border-stone-light dark:border-[#20242E] bg-paper-tint/50 dark:bg-[#16181D] flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse" />
          <span className="font-bold text-ink dark:text-[#F0F2F5] tracking-wider uppercase">
            PLATE 01 // TRAJECTORY ATLAS
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-graphite dark:text-[#8A929E]">
          <span className="hidden sm:inline">COORD: 37°46'N 122°25'W</span>
          <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#20242E] border border-stone-light dark:border-[#282D36] text-ink dark:text-dark-ink font-semibold">
            28-DAY PATH
          </span>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="p-4 sm:p-6 relative">
        <svg
          viewBox="0 0 440 290"
          className="w-full h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid Lines */}
          <line x1="20" y1="50" x2="420" y2="50" stroke="currentColor" className="text-stone-light dark:text-[#1E222A]" strokeDasharray="3 3" />
          <line x1="20" y1="110" x2="420" y2="110" stroke="currentColor" className="text-stone-light dark:text-[#1E222A]" strokeDasharray="3 3" />
          <line x1="20" y1="175" x2="420" y2="175" stroke="currentColor" className="text-stone-light dark:text-[#1E222A]" strokeDasharray="3 3" />
          <line x1="20" y1="245" x2="420" y2="245" stroke="currentColor" className="text-stone-light dark:text-[#1E222A]" strokeDasharray="3 3" />

          {/* Arterial Connecting Path: Smooth S-Curve */}
          <path
            d="M 60 245 C 110 245, 115 175, 165 175 C 215 175, 220 110, 270 110 C 320 110, 325 50, 375 50"
            stroke="currentColor"
            className="text-stone dark:text-[#282D38]"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Active Gradient Laser Glow Line */}
          <path
            d="M 60 245 C 110 245, 115 175, 165 175 C 215 175, 220 110, 270 110 C 320 110, 325 50, 375 50"
            stroke="url(#trajectoryLaser)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="trajectoryLaser" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#0EA5E9" />
              <stop offset="70%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F04B35" />
            </linearGradient>
          </defs>

          {/* 4 Interactive Nodes */}
          {stages.map((st, idx) => {
            const isSelected = activeStage === idx;
            return (
              <g
                key={st.number}
                className="cursor-pointer group"
                onClick={() => setActiveStage(idx)}
              >
                {/* Outer Ring */}
                {st.isPinnacle ? (
                  <>
                    <circle
                      cx={st.cx}
                      cy={st.cy}
                      r={isSelected ? 22 : 18}
                      fill="#F04B35"
                      fillOpacity="0.12"
                      stroke="#F04B35"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin-slow transition-all duration-300"
                    />
                    <circle
                      cx={st.cx}
                      cy={st.cy}
                      r="13"
                      fill="#F04B35"
                      className="shadow-atlas"
                    />
                    <circle cx={st.cx} cy={st.cy} r="4" fill="#FFFFFF" />
                  </>
                ) : (
                  <>
                    <circle
                      cx={st.cx}
                      cy={st.cy}
                      r={isSelected ? 18 : 14}
                      className={`transition-all duration-300 ${
                        isSelected
                          ? 'fill-paper-tint dark:fill-[#202530] stroke-vermilion'
                          : 'fill-white dark:fill-[#16181C] stroke-stone dark:stroke-[#2E3340] group-hover:stroke-graphite'
                      }`}
                      strokeWidth={isSelected ? '2' : '1.5'}
                    />
                    <circle
                      cx={st.cx}
                      cy={st.cy}
                      r="5"
                      fill={isSelected ? '#F04B35' : st.color}
                      className="transition-colors duration-200"
                    />
                  </>
                )}

                {/* Clear, Un-overlapped Spatial Callout Labels */}
                {/* Node 01: Placed Below */}
                {idx === 0 && (
                  <g transform={`translate(${st.cx - 35}, ${st.cy + 20})`}>
                    <rect width="70" height="20" rx="3" className="fill-paper-tint dark:fill-[#181B22] stroke-stone dark:stroke-[#252932]" strokeWidth="1" />
                    <text x="35" y="14" textAnchor="middle" className="fill-ink dark:fill-[#F0F2F5] text-[10px] font-mono font-bold">
                      01 // LEARN
                    </text>
                  </g>
                )}

                {/* Node 02: Placed to the Bottom-Left */}
                {idx === 1 && (
                  <g transform={`translate(${st.cx - 85}, ${st.cy + 12})`}>
                    <rect width="75" height="20" rx="3" className="fill-paper-tint dark:fill-[#181B22] stroke-stone dark:stroke-[#252932]" strokeWidth="1" />
                    <text x="37" y="14" textAnchor="middle" className="fill-ink dark:fill-[#F0F2F5] text-[10px] font-mono font-bold">
                      02 // PRACTICE
                    </text>
                  </g>
                )}

                {/* Node 03: Placed to the Top-Left */}
                {idx === 2 && (
                  <g transform={`translate(${st.cx - 80}, ${st.cy - 30})`}>
                    <rect width="70" height="20" rx="3" className="fill-paper-tint dark:fill-[#181B22] stroke-stone dark:stroke-[#252932]" strokeWidth="1" />
                    <text x="35" y="14" textAnchor="middle" className="fill-ink dark:fill-[#F0F2F5] text-[10px] font-mono font-bold">
                      03 // BUILD
                    </text>
                  </g>
                )}

                {/* Node 04: Placed to the Right */}
                {idx === 3 && (
                  <g transform={`translate(${st.cx - 95}, ${st.cy - 34})`}>
                    <rect width="90" height="22" rx="3" className="fill-vermilion-light/80 dark:fill-vermilion/20 stroke-vermilion" strokeWidth="1" />
                    <text x="45" y="15" textAnchor="middle" fill="#F04B35" className="text-[10px] font-mono font-extrabold">
                      ★ 04 // BECOME
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Live Interactive Detail Card for the Selected Milestone */}
        <div className="mt-2 p-3.5 rounded-lg border border-stone-light dark:border-[#222630] bg-paper-tint/70 dark:bg-[#16181D] space-y-2 text-xs font-mono transition-all">
          <div className="flex items-center justify-between border-b border-stone-light dark:border-[#222630] pb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: current.color }}
              />
              <span className="font-bold text-ink dark:text-[#F0F2F5] uppercase text-[11px]">
                STAGE {current.number}: {current.name}
              </span>
              <span className="text-graphite dark:text-[#8A929E] text-[10px]">
                ({current.range})
              </span>
            </div>

            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                current.isPinnacle
                  ? 'bg-vermilion text-white font-extrabold'
                  : 'bg-white dark:bg-[#20242E] text-graphite-dark dark:text-[#8A929E] border border-stone-light dark:border-[#282D36]'
              }`}
            >
              {current.tag}
            </span>
          </div>

          <p className="text-[11px] font-sans text-graphite-dark dark:text-[#B0B6C0] leading-snug">
            {current.summary}
          </p>

          {/* Competency Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {current.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#121418] border border-stone dark:border-[#252932] text-ink dark:text-dark-ink font-medium"
              >
                &bull; {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 4-Step Interactive Navigation Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-stone-light dark:border-[#20242E]">
          {stages.map((st, idx) => {
            const isSelected = activeStage === idx;
            return (
              <button
                key={st.number}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer border text-[10px] font-mono ${
                  isSelected
                    ? 'border-vermilion bg-white dark:bg-[#1A1D24] text-vermilion font-bold shadow-2xs ring-1 ring-vermilion/40'
                    : 'border-transparent bg-paper-tint/40 dark:bg-[#14161C] text-graphite dark:text-[#8A929E] hover:text-ink dark:hover:text-white hover:border-stone dark:hover:border-[#2A2E38]'
                }`}
              >
                <div className="font-bold">STAGE {st.number}</div>
                <div className="text-[9px] text-graphite-dark dark:text-[#7A8290] hidden sm:block truncate">
                  {st.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Technical Footer Status Strip */}
      <div className="px-5 py-2.5 border-t border-stone-light dark:border-[#20242E] bg-paper-tint/30 dark:bg-[#121418] flex items-center justify-between text-[10px] font-mono text-graphite dark:text-[#8A929E]">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-vermilion" />
          <span>SYNTHESIS: DYNAMIC ORDERING</span>
        </div>
        <Link
          to="/roadmap"
          className="text-vermilion hover:underline font-bold flex items-center gap-1"
        >
          <span>Explore 28-Day Circuit</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
