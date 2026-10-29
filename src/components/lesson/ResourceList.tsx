import React from 'react';
import { LearningResource } from '../../types';
import { ExternalLink, BookOpen, FileText, Video, Code2 } from 'lucide-react';

interface ResourceListProps {
  resources: LearningResource[];
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  const getTypeIcon = (type: LearningResource['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'article':
        return FileText;
      case 'interactive':
        return Code2;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-dark-border space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-brand-400" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Curated Learning Resources & Documentation
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map(res => {
          const Icon = getTypeIcon(res.type);
          return (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-[#101728] border border-slate-800 hover:border-brand-500/50 hover:bg-[#141C30] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="capitalize">{res.type}</span>
                    <span>&bull;</span>
                    <span>{res.duration}</span>
                    {res.isFree && (
                      <span className="text-emerald-400 font-medium">Free Access</span>
                    )}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 ml-2" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
