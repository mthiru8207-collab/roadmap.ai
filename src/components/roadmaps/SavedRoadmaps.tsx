import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';
import {
  FolderGit2,
  Calendar,
  Clock,
  Trash2,
  Download,
  Plus,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SavedRoadmaps: React.FC = () => {
  const navigate = useNavigate();
  const { roadmaps, activeRoadmap, setActiveRoadmap, setActiveDayNumber, deleteRoadmap } = useLearning();

  const handleExportJSON = (roadmap: any) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(roadmap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${roadmap.jobTitle.toLowerCase().replace(/\s+/g, '-')}-roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone pb-6 gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-vermilion font-bold mb-1">
            CURRICULUM ARCHIVE
          </div>
          <h1 className="text-3xl font-serif text-ink tracking-tight">Saved Career Roadmaps</h1>
          <p className="text-xs text-graphite mt-1">
            Switch between synthesized learning tracks or export curriculum files.
          </p>
        </div>

        <Link
          to="/setup"
          className="px-4 py-2.5 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-subtle shrink-0"
        >
          <Plus className="w-4 h-4 text-vermilion" />
          <span>Architect New Track</span>
        </Link>
      </div>

      {/* Grid of roadmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmaps.map(roadmap => {
          const isActive = activeRoadmap?.id === roadmap.id;
          const stagesCount = roadmap.stages.length;
          const lessonsCount = roadmap.stages.reduce((acc, st) => acc + st.lessons.length, 0);

          return (
            <div
              key={roadmap.id}
              className={`p-6 rounded border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-paper-tint border-vermilion ring-1 ring-vermilion/20 shadow-subtle'
                  : 'bg-white border-stone hover:border-ink/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white border border-stone text-ink">
                    {roadmap.skillLevel} Level
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-vermilion">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Track
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-ink tracking-tight mb-1.5">
                  {roadmap.jobTitle}
                </h3>
                <p className="text-xs text-graphite line-clamp-2 leading-relaxed">
                  {roadmap.summary}
                </p>

                {/* Meta details */}
                <div className="flex items-center gap-4 text-xs font-mono text-graphite mt-4 pt-3 border-t border-stone-light">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-vermilion" />
                    <span>{roadmap.targetDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-graphite" />
                    <span>{roadmap.dailyTime}/day</span>
                  </div>
                  <div>
                    <span>{stagesCount} Stages &bull; {lessonsCount} Lessons</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-3 border-t border-stone-light flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportJSON(roadmap)}
                    className="p-1.5 rounded border border-stone bg-white hover:bg-paper-tint text-graphite hover:text-ink transition-colors"
                    title="Export JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {roadmaps.length > 1 && (
                    <button
                      onClick={() => deleteRoadmap(roadmap.id)}
                      className="p-1.5 rounded border border-stone bg-white hover:bg-vermilion-light text-graphite hover:text-vermilion transition-colors"
                      title="Delete Track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {isActive ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-3.5 py-1.5 rounded bg-ink text-paper text-xs font-semibold flex items-center gap-1.5 hover:bg-ink-soft transition-colors"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveRoadmap(roadmap.id);
                      setActiveDayNumber(1);
                      navigate('/dashboard');
                    }}
                    className="px-3.5 py-1.5 rounded border border-stone bg-white hover:bg-paper-tint text-xs font-semibold text-ink transition-colors"
                  >
                    Set as Active
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
