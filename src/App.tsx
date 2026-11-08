/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MediaUploadSection } from './components/MediaUploadSection';
import { VideoPlayer } from './components/VideoPlayer';
import { TranscriptViewer } from './components/TranscriptViewer';
import { InsightsTab } from './components/InsightsTab';
import { ChaptersTab } from './components/ChaptersTab';
import { TranslateTab } from './components/TranslateTab';
import { AskVideoTab } from './components/AskVideoTab';
import { SamplePickerModal } from './components/SamplePickerModal';
import { RecordMediaModal } from './components/RecordMediaModal';
import { ExportModal } from './components/ExportModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { YouTubeLinkModal } from './components/YouTubeLinkModal';
import { SUPPORTED_LANGUAGES } from './data/languages';
import { SAMPLE_MEDIA_LIST } from './data/sampleMedia';
import {
  TranscriptionResult,
  LanguageOption,
  SampleMediaItem,
  TranscriptSegment,
} from './types/transcript';
import { createSyntheticVideoURL } from './utils/audioExtractor';
import {
  FileText,
  Sparkles,
  Bookmark,
  Languages,
  MessageSquare,
  ArrowLeft,
  Share2,
  Clock,
  Layers,
  ChevronRight,
  Youtube,
} from 'lucide-react';

const STORAGE_KEY = 'scriptsync_transcription_history_v1';

export default function App() {
  // Active transcript & media state
  const [activeTranscript, setActiveTranscript] = useState<TranscriptionResult | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'youtube'>('video');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights' | 'chapters' | 'translate' | 'ask'>('transcript');

  // Input Language selection (Auto-detect by default)
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);

  // History state
  const [history, setHistory] = useState<TranscriptionResult[]>([]);

  // Modals state
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  // Keep track of synthetic cleanup functions
  const [cleanupSyntheticVideo, setCleanupSyntheticVideo] = useState<(() => void) | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((item: TranscriptionResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      const updated = [item, ...filtered].slice(0, 30); // keep last 30
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history:', e);
      }
      return updated;
    });
  }, []);

  // Handle successful transcription from upload or recorder or youtube
  const handleTranscribeSuccess = useCallback(
    (result: TranscriptionResult, url: string, type: 'video' | 'audio' | 'youtube') => {
      if (cleanupSyntheticVideo) {
        cleanupSyntheticVideo();
        setCleanupSyntheticVideo(null);
      }
      setActiveTranscript(result);
      setMediaUrl(url);
      setMediaType(type);
      setCurrentTime(0);
      setActiveTab('transcript');
      saveToHistory(result);
    },
    [cleanupSyntheticVideo, saveToHistory]
  );

  // Handle sample selection
  const handleSelectSample = useCallback(
    (sample: SampleMediaItem) => {
      if (cleanupSyntheticVideo) {
        cleanupSyntheticVideo();
      }

      // Generate synthetic video canvas playback for this sample
      const speakerNames = sample.sampleTranscript.speakerStats.map((s) => s.speaker);
      const { videoUrl, cleanup } = createSyntheticVideoURL(
        sample.sampleTranscript.title,
        speakerNames,
        sample.sampleTranscript.durationSeconds,
        sample.languageCode === 'es' ? '#f59e0b' : sample.languageCode === 'ja' ? '#ec4899' : sample.languageCode === 'fr' ? '#10b981' : '#6366f1'
      );

      setCleanupSyntheticVideo(() => cleanup);
      setActiveTranscript(sample.sampleTranscript);
      setMediaUrl(videoUrl);
      setMediaType('video');
      setCurrentTime(0);
      setActiveTab('transcript');
      saveToHistory(sample.sampleTranscript);
    },
    [cleanupSyntheticVideo, saveToHistory]
  );

  // Handle recording completion -> trigger transcription
  const handleRecordSuccess = useCallback(
    async (file: File, type: 'video' | 'audio') => {
      const url = URL.createObjectURL(file);
      // We can directly call the upload handler
      // Let's create an event or call MediaUploadSection directly
      // For responsiveness, we can transcribe directly
      try {
        const { prepareMediaForTranscription } = await import('./utils/audioExtractor');
        const { base64, mimeType } = await prepareMediaForTranscription(file);

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaBase64: base64,
            mimeType: mimeType,
            language: selectedLanguage.code !== 'auto' ? selectedLanguage.name : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to transcribe recorded media.');
        }

        const data = await response.json();
        const result: TranscriptionResult = {
          ...data,
          id: `rec_${Date.now()}`,
          fileName: file.name,
          createdAt: new Date().toISOString(),
          mediaUrl: url,
          mediaType: type,
          selectedInputLanguage: selectedLanguage.code,
        };

        handleTranscribeSuccess(result, url, type);
      } catch (err: any) {
        alert('Recording transcription error: ' + err.message);
      }
    },
    [selectedLanguage, handleTranscribeSuccess]
  );

  // In-place text edit
  const handleUpdateSegmentText = useCallback(
    (id: string, newText: string) => {
      if (!activeTranscript) return;
      const updatedSegments = activeTranscript.segments.map((seg) =>
        seg.id === id ? { ...seg, text: newText } : seg
      );
      const updatedFullText = updatedSegments
        .map((s) => `[${s.startTimeFormatted}] ${s.speaker}: ${s.text}`)
        .join('\n\n');

      const updated = {
        ...activeTranscript,
        segments: updatedSegments,
        fullText: updatedFullText,
      };

      setActiveTranscript(updated);
      saveToHistory(updated);
    },
    [activeTranscript, saveToHistory]
  );

  // Speaker rename
  const handleRenameSpeaker = useCallback(
    (oldName: string, newName: string) => {
      if (!activeTranscript) return;
      const updatedSegments = activeTranscript.segments.map((seg) =>
        seg.speaker === oldName ? { ...seg, speaker: newName } : seg
      );
      const updatedSpeakerStats = activeTranscript.speakerStats.map((st) =>
        st.speaker === oldName ? { ...st, speaker: newName } : st
      );
      const updatedFullText = updatedSegments
        .map((s) => `[${s.startTimeFormatted}] ${s.speaker}: ${s.text}`)
        .join('\n\n');

      const updated = {
        ...activeTranscript,
        segments: updatedSegments,
        speakerStats: updatedSpeakerStats,
        fullText: updatedFullText,
      };

      setActiveTranscript(updated);
      saveToHistory(updated);
    },
    [activeTranscript, saveToHistory]
  );

  // Toggle action item
  const handleToggleActionItem = useCallback(
    (id: string) => {
      if (!activeTranscript) return;
      const updatedActions = activeTranscript.actionItems.map((act) =>
        act.id === id ? { ...act, completed: !act.completed } : act
      );
      const updated = {
        ...activeTranscript,
        actionItems: updatedActions,
      };
      setActiveTranscript(updated);
      saveToHistory(updated);
    },
    [activeTranscript, saveToHistory]
  );

  // Delete history item
  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update history:', e);
      }
      return updated;
    });
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear history:', e);
    }
  }, []);

  // Seek handler
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Active segment
  const activeSegment = useMemo(() => {
    if (!activeTranscript) return undefined;
    return activeTranscript.segments.find(
      (s) => currentTime >= s.start && currentTime <= s.end
    );
  }, [activeTranscript, currentTime]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onNewClick={() => {
          if (cleanupSyntheticVideo) {
            cleanupSyntheticVideo();
            setCleanupSyntheticVideo(null);
          }
          setActiveTranscript(null);
          setMediaUrl(null);
          setCurrentTime(0);
        }}
        onOpenYouTube={() => setIsYouTubeModalOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenRecord={() => setIsRecordOpen(true)}
        hasActiveTranscript={!!activeTranscript}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {!activeTranscript ? (
          // View 1: Upload & Language Selection Screen
          <MediaUploadSection
            onTranscribeSuccess={handleTranscribeSuccess}
            onOpenSamples={() => setIsSamplesOpen(true)}
            onOpenRecord={() => setIsRecordOpen(true)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        ) : (
          // View 2: Studio Workspace (Synchronized Player + Transcript Tabs)
          <div className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-4">
            {/* Top Workspace Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 truncate">
                <button
                  type="button"
                  onClick={() => {
                    if (cleanupSyntheticVideo) {
                      cleanupSyntheticVideo();
                      setCleanupSyntheticVideo(null);
                    }
                    setActiveTranscript(null);
                  }}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                  title="Upload another video"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">
                      {activeTranscript.title}
                    </h2>
                    {activeTranscript.youtubeVideoId && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                        <Youtube className="w-3.5 h-3.5 text-rose-400" /> YouTube
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                      {activeTranscript.detectedLanguage}
                    </span>
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono">
                      {activeTranscript.durationFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('transcript')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeTab === 'transcript'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Transcript</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({activeTranscript.segments.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('insights')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeTab === 'insights'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Executive Summary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chapters')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeTab === 'chapters'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                  <span>Chapters ({activeTranscript.chapters.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('translate')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeTab === 'translate'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Translate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ask')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeTab === 'ask'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                  <span>Ask Video</span>
                </button>
              </div>
            </div>

            {/* Split Screen Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
              {/* Left Column: Synchronized Video Player & Video Stats (5 cols on lg) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <VideoPlayer
                  mediaUrl={mediaUrl || ''}
                  mediaType={mediaType}
                  youtubeVideoId={activeTranscript.youtubeVideoId}
                  youtubeUrl={activeTranscript.youtubeUrl}
                  title={activeTranscript.title}
                  durationSeconds={activeTranscript.durationSeconds}
                  segments={activeTranscript.segments}
                  chapters={activeTranscript.chapters}
                  currentTime={currentTime}
                  onTimeUpdate={setCurrentTime}
                  onSeek={handleSeek}
                  activeSegment={activeSegment}
                />

                {/* Media Quick Stats card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Spoken Language:</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" /> {activeTranscript.detectedLanguage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Speaking Pace:</span>
                    <span className="text-slate-200 font-semibold">{activeTranscript.paceWpm} WPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Total Word Count:</span>
                    <span className="text-slate-200 font-semibold">{activeTranscript.wordCount} words</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Distinct Speakers:</span>
                    <span className="text-amber-400 font-semibold">
                      {activeTranscript.speakerStats.map((s) => s.speaker).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Active Tab Content (7 cols on lg) */}
              <div className="lg:col-span-7 flex flex-col min-h-[500px]">
                {activeTab === 'transcript' && (
                  <TranscriptViewer
                    segments={activeTranscript.segments}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    onUpdateSegmentText={handleUpdateSegmentText}
                    onRenameSpeaker={handleRenameSpeaker}
                    detectedLanguage={activeTranscript.detectedLanguage}
                  />
                )}

                {activeTab === 'insights' && (
                  <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
                    <InsightsTab
                      transcript={activeTranscript}
                      onToggleActionItem={handleToggleActionItem}
                      onSeek={handleSeek}
                    />
                  </div>
                )}

                {activeTab === 'chapters' && (
                  <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
                    <ChaptersTab
                      chapters={activeTranscript.chapters}
                      currentTime={currentTime}
                      durationSeconds={activeTranscript.durationSeconds}
                      onSeek={handleSeek}
                    />
                  </div>
                )}

                {activeTab === 'translate' && (
                  <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
                    <TranslateTab
                      segments={activeTranscript.segments}
                      currentLanguage={activeTranscript.detectedLanguage}
                      onSeek={handleSeek}
                      currentTime={currentTime}
                    />
                  </div>
                )}

                {activeTab === 'ask' && (
                  <div className="flex-1 min-h-[500px]">
                    <AskVideoTab transcript={activeTranscript} onSeek={handleSeek} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <YouTubeLinkModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onTranscribeSuccess={handleTranscribeSuccess}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      <SamplePickerModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <RecordMediaModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        onRecordSuccess={handleRecordSuccess}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      {activeTranscript && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          transcript={activeTranscript}
        />
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectTranscript={(item) => {
          if (cleanupSyntheticVideo) {
            cleanupSyntheticVideo();
            setCleanupSyntheticVideo(null);
          }
          setActiveTranscript(item);
          if (item.youtubeVideoId) {
            setMediaUrl(item.youtubeUrl || `https://www.youtube.com/watch?v=${item.youtubeVideoId}`);
            setMediaType('youtube');
          } else if (item.mediaUrl) {
            setMediaUrl(item.mediaUrl);
            setMediaType(item.mediaType);
          } else {
            // Generate synthetic preview for past item if file is no longer in memory
            const { videoUrl, cleanup } = createSyntheticVideoURL(
              item.title,
              item.speakerStats.map((s) => s.speaker),
              item.durationSeconds
            );
            setCleanupSyntheticVideo(() => cleanup);
            setMediaUrl(videoUrl);
            setMediaType('video');
          }
          setCurrentTime(0);
          setActiveTab('transcript');
        }}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearAllHistory={handleClearAllHistory}
      />
    </div>
  );
}
