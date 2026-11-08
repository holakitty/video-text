import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  UploadCloud,
  FileVideo,
  FileAudio,
  Sparkles,
  Video,
  Mic,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Languages,
  Youtube,
  Link as LinkIcon,
  Play,
  ExternalLink,
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { LanguageOption, TranscriptionResult } from '../types/transcript';
import { prepareMediaForTranscription } from '../utils/audioExtractor';

interface MediaUploadSectionProps {
  onTranscribeSuccess: (result: TranscriptionResult, mediaUrl: string, mediaType: 'video' | 'audio' | 'youtube', file?: File) => void;
  onOpenSamples: () => void;
  onOpenRecord: () => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
}

// Popular curated YouTube test clips
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

export const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  onTranscribeSuccess,
  onOpenSamples,
  onOpenRecord,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'youtube'>('youtube'); // Default to YouTube link since user asked
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [progressPercent, setProgressPercent] = useState<number | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // YouTube link state
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [previewMeta, setPreviewMeta] = useState<{ title?: string; author?: string; thumbnail?: string } | null>(null);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customVocabulary, setCustomVocabulary] = useState('');
  const [speakerCountHint, setSpeakerCountHint] = useState<string>('auto');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract YouTube video ID
  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const parsedVideoId = extractVideoId(youtubeUrl);

  // Fetch quick oEmbed preview when valid YouTube URL is entered
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

  // Transcribe YouTube Video
  const handleTranscribeYouTube = async (urlToUse?: string) => {
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
          speakerHint: speakerCountHint !== 'auto' ? speakerCountHint : undefined,
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
    } catch (err: any) {
      console.error('YouTube transcription error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while transcribing YouTube video.');
    } finally {
      setIsProcessing(false);
      setProgressPercent(undefined);
    }
  };

  // Transcribe Local File
  const handleFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setIsProcessing(true);
      setProgressStage('Inspecting media file format...');
      setProgressPercent(10);

      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|mkv|avi)$/i.test(file.name);
      const mediaType: 'video' | 'audio' = isVideo ? 'video' : 'audio';
      const mediaUrl = URL.createObjectURL(file);

      try {
        const { base64, mimeType } = await prepareMediaForTranscription(file, (stage, pct) => {
          setProgressStage(stage);
          if (pct !== undefined) setProgressPercent(pct);
        });

        setProgressStage(
          `AI Multimodal Transcription (${selectedLanguage.code === 'auto' ? 'Auto-Detect' : selectedLanguage.name})...`
        );
        setProgressPercent(60);

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaBase64: base64,
            mimeType: mimeType,
            language: selectedLanguage.code !== 'auto' ? selectedLanguage.name : undefined,
            speakerHint: speakerCountHint !== 'auto' ? speakerCountHint : undefined,
            options: {
              vocabulary: customVocabulary.trim() || undefined,
            },
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Transcription failed with HTTP status ${response.status}`);
        }

        setProgressStage('Formatting timestamps, chapters, and intelligence...');
        setProgressPercent(95);

        const data = await response.json();
        const transcriptionResult: TranscriptionResult = {
          ...data,
          id: `tx_${Date.now()}`,
          fileName: file.name,
          createdAt: new Date().toISOString(),
          mediaUrl,
          mediaType,
          selectedInputLanguage: selectedLanguage.code,
        };

        onTranscribeSuccess(transcriptionResult, mediaUrl, mediaType, file);
      } catch (err: any) {
        console.error('Transcription error:', err);
        setErrorMessage(err.message || 'An unexpected error occurred during transcription.');
      } finally {
        setIsProcessing(false);
        setProgressPercent(undefined);
      }
    },
    [selectedLanguage, speakerCountHint, customVocabulary, onTranscribeSuccess]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium mb-3">
          <Languages className="w-3.5 h-3.5" /> High-Accuracy Multilingual Video Transcription
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Turn <span className="text-rose-400 inline-flex items-center gap-1.5"><Youtube className="w-7 h-7 sm:w-8 sm:h-8 inline text-rose-500" /> YouTube</span> & Video Files into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300">Synchronized Transcripts</span>
        </h1>
        <p className="mt-2.5 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Share any YouTube link or upload video/audio files to generate timestamped verbatim transcripts, speaker labels, auto-chapters, executive summaries, and subtitle exports in 35+ languages.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Source Switcher: YouTube Link vs Upload File */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveMode('youtube')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeMode === 'youtube'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Youtube className="w-4 h-4 text-white" />
              <span>Share YouTube Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeMode === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Video / Audio</span>
            </button>
          </div>
        </div>

        {/* Input Language Selector Row */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-400" /> Input Spoken Language
              </h3>
              <p className="text-xs text-slate-400">
                Select the language spoken in the video for maximum transcription accuracy, or leave on Auto-detect.
              </p>
            </div>
            {selectedLanguage.code !== 'auto' && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-center font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tuned for {selectedLanguage.name}
              </span>
            )}
          </div>

          <LanguageSelector
            selectedCode={selectedLanguage.code}
            onSelectLanguage={onSelectLanguage}
            label=""
          />
        </div>

        {/* Tab 1: YouTube Link Input Area */}
        {activeMode === 'youtube' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-500" />
                Paste YouTube Video Link
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={isProcessing}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleTranscribeYouTube()}
                  disabled={!parsedVideoId || isProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-rose-600/25 transition-all shrink-0"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transcribing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Transcribe YouTube</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Preview Card when YouTube link is entered */}
              {previewMeta && parsedVideoId && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-3 animate-in fade-in">
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
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
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Ready for Gemini Transcription
                    </span>
                  </div>
                </div>
              )}

              {/* Processing Progress Bar */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{progressStage}</span>
                    {progressPercent !== undefined && (
                      <span className="text-indigo-400 font-mono font-bold">{progressPercent}%</span>
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

              {/* Curated YouTube Examples */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2 font-medium">
                  Or test with 1-click popular YouTube speeches:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CURATED_YOUTUBE_EXAMPLES.map((ex) => (
                    <button
                      key={ex.videoId}
                      type="button"
                      onClick={() => {
                        setYoutubeUrl(ex.url);
                        handleTranscribeYouTube(ex.url);
                      }}
                      disabled={isProcessing}
                      className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="truncate">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-rose-300 transition-colors block truncate">
                          {ex.title}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">{ex.creator}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Click to transcribe</span>
                        <Play className="w-3 h-3 text-rose-400 fill-rose-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Upload File Drag & Drop Area */}
        {activeMode === 'upload' && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-700/80 hover:border-indigo-500/70 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,audio/*,.mp4,.webm,.mov,.m4v,.mkv,.avi,.mp3,.wav,.m4a,.aac,.ogg,.flac"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
              disabled={isProcessing}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                </div>
                <h4 className="text-base font-semibold text-slate-100 mb-1">
                  {progressStage || 'Transcribing media...'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Powered by Gemini 3.8 Flash • Speaker Diarization • Microsecond Time Alignment
                </p>

                {progressPercent !== undefined && (
                  <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-sky-400 h-2 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-400 group-hover:text-indigo-300 transition-all shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-indigo-200 transition-colors">
                  Drop your video or audio file here, or <span className="text-indigo-400 underline underline-offset-4">browse</span>
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md">
                  Supports MP4, WebM, MOV, MKV, MP3, WAV, M4A, AAC. Automatic client-side audio extraction enables lightning-fast processing!
                </p>

                <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    <FileVideo className="w-3 h-3 text-sky-400" /> Video (MP4, WebM, MOV)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    <FileAudio className="w-3 h-3 text-amber-400" /> Audio (MP3, WAV, M4A)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    <Languages className="w-3 h-3 text-emerald-400" /> {selectedLanguage.flag} {selectedLanguage.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-rose-200">Transcription Failed</div>
              <div className="mt-0.5 text-xs text-rose-300/90 leading-relaxed">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Advanced Options Accordion */}
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Advanced Transcription Settings & Jargon Tuning</span>
            <span className="text-[11px] text-slate-500">{showAdvanced ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Custom Technical Vocabulary / Jargon Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kubernetes, CRISPR-Cas9, PyTorch, GraphQL"
                  value={customVocabulary}
                  onChange={(e) => setCustomVocabulary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Helps Gemini correctly spell proprietary names and specialized domain terminology.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Expected Number of Speakers
                </label>
                <select
                  value={speakerCountHint}
                  onChange={(e) => setSpeakerCountHint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="auto">Auto-detect Speakers (Recommended)</option>
                  <option value="1">1 Speaker (Monologue / Solo Presentation)</option>
                  <option value="2">2 Speakers (Interview / Dialogue / Host & Guest)</option>
                  <option value="3+">3+ Speakers (Panel / Meeting / Group Discussion)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Guides speaker diarization and separation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Alternative Options: Samples & Recording */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Need sample videos or camera test?</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSamples}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multilingual Demos (🇺🇸 🇪🇸 🇯🇵 🇫🇷)</span>
            </button>

            <button
              type="button"
              onClick={onOpenRecord}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
            >
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>Record Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
