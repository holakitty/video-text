import React from 'react';
import { X, History, Trash2, Clock, Play, FileText, Languages, Youtube } from 'lucide-react';
import { TranscriptionResult } from '../types/transcript';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: TranscriptionResult[];
  onSelectTranscript: (item: TranscriptionResult) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectTranscript,
  onDeleteHistoryItem,
  onClearAllHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-slate-100">Transcription History</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                {history.length}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {history.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                No saved transcripts yet. Upload or record media to build your library.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between gap-2.5"
                >
                  <div
                    onClick={() => {
                      onSelectTranscript(item);
                      onClose();
                    }}
                    className="cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-400" /> {item.durationFormatted}
                        </span>
                        {item.youtubeVideoId && (
                          <span className="flex items-center gap-1 text-rose-400 font-medium">
                            <Youtube className="w-3 h-3 text-rose-500" /> YouTube
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 font-medium text-emerald-400">
                        <Languages className="w-3 h-3" /> {item.detectedLanguage}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary || item.fullText.substring(0, 100) + '...'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete transcript"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTranscript(item);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-medium transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Clear All */}
          {history.length > 0 && (
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClearAllHistory}
                className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
              >
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
