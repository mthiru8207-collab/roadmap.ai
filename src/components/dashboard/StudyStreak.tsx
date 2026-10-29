import React from 'react';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const StudyStreak: React.FC = () => {
  const { studyLogs, stats, activeRoadmap } = useLearning();

  const totalMinutes = studyLogs.reduce((acc, log) => acc + log.minutesSpent, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Generate 7 day activity bars
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="glass-card p-5 rounded-2xl border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Study Momentum & Activity
            </h4>
            <p className="text-[11px] text-slate-400">
              {stats.currentStreakDays}-day continuous learning streak
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-white">{totalHours} hrs</div>
          <div className="text-[10px] text-slate-400">Total Track Time</div>
        </div>
      </div>

      {/* 7-Day Activity Bars */}
      <div className="grid grid-cols-7 gap-2 pt-2 pb-1">
        {daysOfWeek.map((day, idx) => {
          // Calculate simulated height based on logs or default
          const hasActivity = idx < stats.currentStreakDays;
          const heightPercent = hasActivity ? Math.min(100, 30 + idx * 15) : 10;

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div className="w-full h-16 bg-[#0E1524] rounded-lg p-1 flex items-end">
                <div
                  className={`w-full rounded-md transition-all duration-500 ${
                    hasActivity
                      ? 'bg-gradient-to-t from-brand-600 to-brand-400 shadow-sm'
                      : 'bg-slate-800'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-400" />
          <span>Daily Target: {activeRoadmap?.dailyTime || '1h'}</span>
        </div>
        <span className="text-emerald-400 font-medium flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          On Track
        </span>
      </div>
    </div>
  );
};
