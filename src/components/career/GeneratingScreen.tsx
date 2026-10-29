import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, Sparkles, Brain, Cpu, Layers } from 'lucide-react';

interface GeneratingScreenProps {
  jobTitle: string;
  skillLevel: string;
}

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({ jobTitle, skillLevel }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Deconstructing industry domain taxonomy & core standards', icon: Brain },
    { title: `Mapping competency milestones for ${skillLevel} level`, icon: Layers },
    { title: 'Synthesizing 4 sequential stages & 28 daily lesson units', icon: Cpu },
    { title: 'Engineering 5-question verified comprehension quizzes', icon: Sparkles },
    { title: 'Structuring 7-day cumulative checkpoints & portfolio project', icon: Compass },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
      {/* Editorial loader stamp */}
      <div className="mb-6 relative">
        <div className="w-16 h-16 rounded border border-stone bg-white flex items-center justify-center shadow-subtle">
          <Compass className="w-8 h-8 text-vermilion animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded bg-vermilion text-white font-mono text-[9px] font-bold">
          SYNTHESIS
        </div>
      </div>

      <div className="font-mono text-xs text-graphite uppercase tracking-wider mb-1">
        CURRICULUM COMPILER
      </div>
      <h2 className="text-2xl font-serif text-ink tracking-tight mb-2">
        Structuring your trajectory
      </h2>
      <p className="text-xs text-graphite mb-8 max-w-md">
        Synthesizing ordered lessons, exercises, verified quizzes, and milestone projects for{' '}
        <span className="font-semibold text-ink">{jobTitle}</span>.
      </p>

      {/* Step Checklist */}
      <div className="w-full space-y-2.5 text-left">
        {steps.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 p-3 rounded border transition-all ${
                isDone
                  ? 'bg-paper-tint/70 border-stone text-ink-light'
                  : isCurrent
                  ? 'bg-white border-vermilion text-ink shadow-subtle'
                  : 'border-stone-light text-graphite-light bg-paper/50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${
                  isDone
                    ? 'bg-sage-light text-sage-dark'
                    : isCurrent
                    ? 'bg-vermilion-light text-vermilion'
                    : 'bg-stone-light text-graphite'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>
              <span className="text-xs font-medium flex-1">{s.title}</span>
              {isCurrent && (
                <span className="text-[10px] font-mono text-vermilion font-bold animate-pulse">
                  ACTIVE
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
