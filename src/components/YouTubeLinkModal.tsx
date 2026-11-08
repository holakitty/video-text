import React, { useState, useEffect } from 'react';
import {
  X,
  Youtube,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  CheckCircle2,
  Play,
  Clipboard,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { LanguageOption, TranscriptionResult } from '../types/transcript';
import { LanguageSelector } from './LanguageSelector';

interface YouTubeLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscribeSuccess: (
    result: TranscriptionResult,
    mediaUrl: string,
    mediaType: 'video' | 'audio' | 'youtube'
  ) => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
}

const CURATED_YOUTUBE_EXAMPLES = [
  {
    title: "Steve Jobs' 2005 Stanford Address",
    creator: 'Stanford University',
    url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    videoId: 'UF8uR6Z6KLc',
    desc: 'Connecting dots, love and loss, and staying hungry.',
  },
  {
    title: 'Jensen Huang GTC Keynote',
    creator: 'NVIDIA',
    url: 'https://www.youtube.com/watch?v=Y2F848jKeDc',
    videoId: 'Y2F848jKeDc',
    desc: 'Accelerated computing and next-gen AI supercomputers.',
  },
  {
    title: 'Sam Altman on AI & Compute',
    creator: 'Y Combinator',
    url: 'https://www.youtube.com/watch?v=d_kOwrk-uQU',
    videoId: 'd_kOwrk-uQU',
    desc: 'The trajectory of foundational intelligence and robotics.',
  },
];

export const YouTubeLinkModal: React.FC<YouTubeLinkModalProps> = ({
  isOpen,
  onClose,
  onTranscribeSuccess,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [progressPercent, setProgressPercent] = useState<number | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMeta, setPreviewMeta] = useState<{ title?: string; author?: string; thumbnail?: string } | null>(null);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const parsedVideoId = extractVideoId(youtubeUrl);

  // Fetch oEmbed preview when valid URL is entered
  useEffect(() => {
    if (!parsedVideoId) {
      setPreviewMeta(null);
      return;
    }

    let isMounted = true;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${parsedVideoId}&format=json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setPreviewMeta({
            title: data.title,
            author: data.author_name,
            thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${parsedVideoId}/hqdefault.jpg`,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setPreviewMeta({
            title: 'YouTube Video',
            thumbnail: `https://i.ytimg.com/vi/${parsedVideoId}/hqdefault.jpg`,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [parsedVideoId]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setYoutubeUrl(text.trim());
      }
    } catch (e) {
      // ignore
    }
  };

  const handleTranscribe = async (urlToUse?: string) => {
    const targetUrl = (urlToUse || youtubeUrl).trim();
    const vidId = extractVideoId(targetUrl);
    if (!vidId) {
      setErrorMessage('Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgressStage(`Fetching YouTube video metadata & audio streams...`);
    setProgressPercent(20);

    try {
      setProgressStage(
        `Gemini 3.8 Flash Analyzing Spoken Speech (${selectedLanguage.code === 'auto' ? 'Auto-Detect' : selectedLanguage.name})...`
      );
      setProgressPercent(50);

      const response = await fetch('/api/transcribe-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          language: selectedLanguage.code !== 'auto' ? selectedLanguage.name : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Transcription failed with HTTP status ${response.status}`);
      }

      setProgressStage('Formatting timestamps, chapters, and speaker diarization...');
      setProgressPercent(90);

      const data = await response.json();
      const transcriptionResult: TranscriptionResult = {
        ...data,
        id: `yt_${vidId}_${Date.now()}`,
        mediaType: 'youtube',
        youtubeVideoId: vidId,
        youtubeUrl: targetUrl,
        mediaUrl: `https://www.youtube.com/watch?v=${vidId}`,
        createdAt: new Date().toISOString(),
        selectedInputLanguage: selectedLanguage.code,
      };

      onTranscribeSuccess(transcriptionResult, transcriptionResult.mediaUrl!, 'youtube');
      onClose();
    } catch (err: any) {
      console.error('YouTube transcription error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while transcribing YouTube video.');
    } finally {
      setIsProcessing(false);
      setProgressPercent(undefined);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/25">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Share & Transcribe YouTube Link
              </h2>
              <p className="text-xs text-slate-400">
                Paste any YouTube video or shorts link to get synchronized transcripts with interactive player.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto pr-1">
          {/* Input language row */}
          <div>
            <LanguageSelector
              selectedCode={selectedLanguage.code}
              onSelectLanguage={onSelectLanguage}
              label="Spoken Language in YouTube Video"
            />
          </div>

          {/* YouTube link input with Paste button */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              YouTube Video URL
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isProcessing}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
                title="Paste URL from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            </div>
          </div>

          {/* Preview Card */}
          {previewMeta && parsedVideoId && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 animate-in fade-in">
              <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-slate-800">
                <img
                  src={previewMeta.thumbnail}
                  alt={previewMeta.title || 'YouTube thumbnail'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white/80" />
                </div>
              </div>
              <div className="flex-1 truncate">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                  {previewMeta.title}
                </h4>
                {previewMeta.author && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Channel: {previewMeta.author}</p>
                )}
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Valid YouTube Video Ready
                </span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{progressStage}</span>
                {progressPercent !== undefined && (
                  <span className="text-rose-400 font-mono font-bold">{progressPercent}%</span>
                )}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 via-indigo-500 to-sky-400 h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent || 40}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1-Click Popular Examples */}
          <div>
            <span className="text-xs text-slate-400 block mb-2 font-medium">
              Or pick a popular video speech:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CURATED_YOUTUBE_EXAMPLES.map((ex) => (
                <button
                  key={ex.videoId}
                  type="button"
                  onClick={() => {
                    setYoutubeUrl(ex.url);
                    handleTranscribe(ex.url);
                  }}
                  disabled={isProcessing}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-rose-300 transition-colors block truncate">
                      {ex.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">{ex.creator}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Transcribe</span>
                    <Play className="w-3 h-3 text-rose-400 fill-rose-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleTranscribe()}
            disabled={!parsedVideoId || isProcessing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Transcribing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Activate YouTube Transcription</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
