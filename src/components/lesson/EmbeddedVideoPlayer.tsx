import React, { useState } from 'react';
import { VideoResource } from '../../types';
import { Play, ExternalLink, Video, Sparkles, CheckCircle2 } from 'lucide-react';

interface EmbeddedVideoPlayerProps {
  video: VideoResource;
  lessonDay?: number;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({ video, lessonDay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Clean YouTube Embed URL using privacy-enhanced domain
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <section className="rounded border border-stone bg-white shadow-subtle overflow-hidden my-8">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-paper border-b border-stone flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-vermilion/10 text-vermilion flex items-center justify-center font-mono text-xs font-bold">
            <Video className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
            Curated Technical Video Masterclass
          </span>
          {lessonDay && (
            <span className="text-[10px] font-mono text-vermilion font-bold bg-vermilion/10 px-1.5 py-0.5 rounded">
              DAY {lessonDay < 10 ? `0${lessonDay}` : lessonDay}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-graphite">
          <span className="font-semibold text-ink">{video.channel}</span>
          <span>&bull;</span>
          <span>{video.duration}</span>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-vermilion hover:text-vermilion-dark font-semibold transition-colors ml-1"
          >
            <span>Open in YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Video Title and Context */}
      <div className="px-5 pt-4 pb-2">
        <h4 className="font-serif text-lg font-bold text-ink">
          {video.title}
        </h4>
        {video.summary && (
          <p className="text-xs text-graphite mt-1 leading-relaxed">
            {video.summary}
          </p>
        )}
      </div>

      {/* Video Container (Responsive 16:9) */}
      <div className="p-5 pt-2">
        <div className="relative w-full aspect-video rounded border border-stone-light overflow-hidden bg-ink shadow-atlas group">
          {isPlaying ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
            >
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300"
                onError={e => {
                  // Fallback to high quality placeholder if thumbnail fails
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/15 transition-colors" />

              {/* Big Editorial Play Button */}
              <div className="absolute z-10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-vermilion hover:bg-vermilion-dark text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                <span className="font-mono text-xs font-bold text-white bg-ink/75 px-3 py-1 rounded backdrop-blur-xs shadow-xs">
                  Click to Stream Lecture ({video.duration})
                </span>
              </div>

              {/* Channel badge overlay */}
              <div className="absolute bottom-3 left-3 bg-ink/80 text-white font-mono text-[11px] px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vermilion" />
                <span>Instructor: {video.channel}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-5 pb-4 text-xs font-mono text-graphite flex items-center justify-between border-t border-stone-light/60 pt-3">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-vermilion" />
          <span>Recommended viewing: Complete before tackling the 5-question comprehension quiz.</span>
        </span>
        <span className="hidden sm:inline text-[11px] text-graphite">
          Official Educational Reference &bull; Verified 2026
        </span>
      </div>
    </section>
  );
};

