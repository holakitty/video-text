import React from 'react';
import {
  FileVideo,
  Sparkles,
  Layers,
  History,
  Download,
  PlusCircle,
  Video,
  Languages,
  Youtube,
} from 'lucide-react';

interface NavbarProps {
  onNewClick: () => void;
  onOpenYouTube: () => void;
  onOpenSamples: () => void;
  onOpenHistory: () => void;
  onOpenExport?: () => void;
  onOpenRecord: () => void;
  hasActiveTranscript: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewClick,
  onOpenYouTube,
  onOpenSamples,
  onOpenHistory,
  onOpenExport,
  onOpenRecord,
  hasActiveTranscript,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewClick}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 shadow-md shadow-indigo-500/20 text-white">
            <FileVideo className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                Script<span className="text-indigo-400">Sync</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Languages className="w-3 h-3" /> Multilingual AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Video & Audio to Timestamped Text Transcripts
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Share YouTube Link Button */}
          <button
            type="button"
            onClick={onOpenYouTube}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold shadow-md shadow-rose-600/20 transition-all hover:scale-102"
            title="Share and transcribe a YouTube video link"
          >
            <Youtube className="w-4 h-4 fill-white text-rose-600" />
            <span className="font-semibold">Share YouTube</span>
          </button>

          {/* Sample Presets */}
          <button
            type="button"
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/70 transition-all shadow-sm group"
            title="Try sample multilingual demo videos"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline font-medium">Sample Demos</span>
            <span className="md:hidden font-medium">Samples</span>
            <span className="hidden lg:inline text-slate-400 text-xs">🇺🇸 🇪🇸 🇯🇵 🇫🇷</span>
          </button>

          {/* Record button */}
          <button
            type="button"
            onClick={onOpenRecord}
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/70 transition-all shadow-sm"
            title="Record directly from webcam or microphone"
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span className="font-medium">Record</span>
          </button>

          {/* History drawer */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/70 transition-all shadow-sm"
            title="View saved past transcriptions"
          >
            <History className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline font-medium">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold border border-sky-500/30">
                {historyCount}
              </span>
            )}
          </button>

          {/* Export button (if transcript active) */}
          {hasActiveTranscript && onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-700/20 transition-all"
              title="Export as SRT, VTT, Markdown, TXT, JSON"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
          )}

          {/* New transcription */}
          <button
            type="button"
            onClick={onNewClick}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="font-medium">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
