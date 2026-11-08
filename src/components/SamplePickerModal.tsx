import React from 'react';
import { X, Sparkles, Clock, Users, Languages, Play, CheckCircle2 } from 'lucide-react';
import { SAMPLE_MEDIA_LIST } from '../data/sampleMedia';
import { SampleMediaItem } from '../types/transcript';

interface SamplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleMediaItem) => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">Multilingual Sample Demos</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly test synchronized video player, speaker diarization, search, and subtitle exports without needing a local video file.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample List */}
        <div className="overflow-y-auto py-4 space-y-3.5 flex-1 pr-1">
          {SAMPLE_MEDIA_LIST.map((sample) => {
            const flagMap: Record<string, string> = {
              en: '🇺🇸',
              es: '🇪🇸',
              ja: '🇯🇵',
              fr: '🇫🇷',
            };
            const flag = flagMap[sample.languageCode] || '🌐';

            return (
              <div
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer group shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg leading-none">{flag}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {sample.language}
                    </span>
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60">
                      {sample.category}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {sample.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {sample.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" /> {sample.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-amber-400" /> {sample.speakerCount} Speakers
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Full Transcripts & Subtitles
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="sm:self-center shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load Sample</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
