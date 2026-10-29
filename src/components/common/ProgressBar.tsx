import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'primary' | 'violet' | 'emerald' | 'amber';
  height?: string;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'primary',
  height = 'h-2',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const gradientMap = {
    primary: 'from-brand-600 to-brand-400',
    violet: 'from-purple-600 to-brand-accent',
    emerald: 'from-emerald-600 to-teal-400',
    amber: 'from-amber-600 to-yellow-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-dark-surface border border-slate-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full bg-gradient-to-r ${gradientMap[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
