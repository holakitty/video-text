import React from 'react';
import { Bookmark, Play, Clock } from 'lucide-react';
import { Chapter } from '../types/transcript';

interface ChaptersTabProps {
  chapters: Chapter[];
  currentTime: number;
  durationSeconds: number;
  onSeek: (time: number) => void;
}

export const ChaptersTab: React.FC<ChaptersTabProps> = ({
  chapters,
  currentTime,
  durationSeconds,
  onSeek,
}) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No chapters detected in this media.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" /> Video Chapters & Topics
        </h3>
        <span className="text-xs text-slate-400">{chapters.length} chapters</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {chapters.map((chap, idx) => {
          const nextStart = chapters[idx + 1] ? chapters[idx + 1].startTime : durationSeconds;
          const isActive = currentTime >= chap.startTime && currentTime < nextStart;

          return (
            <div
              key={idx}
              onClick={() => onSeek(chap.startTime)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer group ${
                isActive
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-950/50 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-6 top-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  isActive
                    ? 'bg-amber-400 border-slate-950 scale-125 shadow-md shadow-amber-400/50'
                    : 'bg-slate-800 border-slate-700 group-hover:bg-amber-400'
                }`}
              />

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-semibold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                  {chap.title}
                </span>

                <button
                  type="button"
                  className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{chap.startTimeFormatted}</span>
                </button>
              </div>

              {chap.description && (
                <p className="text-xs text-slate-400 leading-relaxed">{chap.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
