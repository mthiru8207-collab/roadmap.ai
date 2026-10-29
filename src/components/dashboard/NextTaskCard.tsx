import React from 'react';
import { ArrowRight, BookOpen, RotateCcw, Award, Play } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ActivePage } from '../common/Sidebar';

interface NextTaskCardProps {
  onNavigate: (page: ActivePage) => void;
}

export const NextTaskCard: React.FC<NextTaskCardProps> = ({ onNavigate }) => {
  const { stats, setActiveDayNumber } = useLearning();
  const task = stats.nextRecommendedTask;

  const handleClick = () => {
    if (task.type === 'revision') {
      onNavigate('revision');
    } else if (task.type === 'assessment') {
      onNavigate('assessment');
    } else {
      if (task.dayNumber) {
        setActiveDayNumber(task.dayNumber);
      }
      onNavigate('lesson');
    }
  };

  const getIcon = () => {
    switch (task.type) {
      case 'revision':
        return RotateCcw;
      case 'assessment':
        return Award;
      default:
        return BookOpen;
    }
  };

  const Icon = getIcon();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#23314F] bg-gradient-to-r from-[#0F1628] via-[#141E34] to-[#121A2F] p-6 shadow-card-dark">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Play className="w-2.5 h-2.5 fill-brand-400" />
              Recommended Next Step
            </span>
            {task.type === 'revision' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Action Required
              </span>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Icon className="w-5 h-5 text-brand-400 shrink-0" />
            <span>{task.title}</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">{task.description}</p>
        </div>

        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-500 hover:to-purple-500 text-white text-xs font-semibold shadow-glow-primary transition-all shrink-0"
        >
          <span>
            {task.type === 'revision'
              ? 'Launch Revision'
              : task.type === 'assessment'
              ? 'Start Weekly Assessment'
              : 'Start Day Lesson'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
