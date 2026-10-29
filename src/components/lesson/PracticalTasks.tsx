import React, { useState } from 'react';
import { PracticalTask } from '../../types';
import { Wrench, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface PracticalTasksProps {
  tasks: PracticalTask[];
}

export const PracticalTasks: React.FC<PracticalTasksProps> = ({ tasks }) => {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(tasks[0]?.id || null);

  const toggleTask = (id: string) => {
    setCompletedTaskIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const completedCount = completedTaskIds.length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="glass-card p-6 rounded-2xl border border-dark-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Practical Hands-On Exercises
          </h3>
        </div>
        <div className="text-xs font-semibold text-brand-300">
          {completedCount} of {totalCount} completed ({percent}%)
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-brand-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Task List */}
      <div className="space-y-3 pt-2">
        {tasks.map(task => {
          const isDone = completedTaskIds.includes(task.id);
          const isExpanded = expandedId === task.id;

          return (
            <div
              key={task.id}
              className={`rounded-xl border transition-all ${
                isDone
                  ? 'bg-[#0E1524]/80 border-emerald-500/30'
                  : 'bg-[#101728] border-slate-800'
              }`}
            >
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : task.id)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded Instructions */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 mt-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Step-by-Step Instructions:
                  </span>
                  <ol className="space-y-1.5 list-decimal list-inside text-xs text-slate-300">
                    {task.instructions.map((inst, i) => (
                      <li key={i} className="leading-relaxed">
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
