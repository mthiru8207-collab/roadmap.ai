import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ActivePage } from '../common/Sidebar';

interface WeakTopicsCardProps {
  onNavigate: (page: ActivePage) => void;
}

export const WeakTopicsCard: React.FC<WeakTopicsCardProps> = ({ onNavigate }) => {
  const { weakTopics } = useLearning();
  const unmastered = weakTopics.filter(w => !w.mastered);

  return (
    <div className="glass-card p-5 rounded-2xl border border-dark-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Adaptive Revision Queue
              </h4>
              <p className="text-[11px] text-slate-400">
                {unmastered.length > 0
                  ? `${unmastered.length} topics scored <70%`
                  : 'Zero active learning deficits'}
              </p>
            </div>
          </div>
          {unmastered.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse-subtle">
              Priority
            </span>
          )}
        </div>

        {unmastered.length > 0 ? (
          <div className="space-y-2 mt-4">
            {unmastered.slice(0, 3).map(topic => (
              <div
                key={topic.id}
                className="p-3 rounded-xl bg-[#111726] border border-rose-500/20 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-200 font-medium truncate">{topic.topic}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                  {topic.sourceType === 'quiz' ? `Day ${topic.sourceDayOrWeek}` : `Week ${topic.sourceDayOrWeek}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-200">Full Topic Mastery</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All tested concepts have met or exceeded the 70% threshold.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-slate-800/80">
        <button
          onClick={() => onNavigate('revision')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#141C30] hover:bg-[#1A253E] border border-slate-700/80 text-xs font-semibold text-brand-300 flex items-center justify-center gap-2 transition-colors"
        >
          <span>Open Adaptive Revision Room</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
