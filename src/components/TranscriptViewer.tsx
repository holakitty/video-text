import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Edit2,
  Check,
  X,
  Copy,
  CheckCheck,
  Play,
  Filter,
  Sparkles,
  ArrowUpDown,
  Volume2,
} from 'lucide-react';
import { TranscriptSegment } from '../types/transcript';

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  onUpdateSegmentText: (id: string, newText: string) => void;
  onRenameSpeaker: (oldName: string, newName: string) => void;
  detectedLanguage?: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  currentTime,
  onSeek,
  onUpdateSegmentText,
  onRenameSpeaker,
  detectedLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeakerFilter, setSelectedSpeakerFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [renamingSpeakerName, setRenamingSpeakerName] = useState<string | null>(null);
  const [newSpeakerNameInput, setNewSpeakerNameInput] = useState('');
  const [copiedSegmentId, setCopiedSegmentId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  // Distinct speakers
  const uniqueSpeakers = useMemo(() => {
    const set = new Set<string>();
    segments.forEach((s) => set.add(s.speaker));
    return Array.from(set);
  }, [segments]);

  // Filtered segments based on speaker and search
  const filteredSegments = useMemo(() => {
    return segments.filter((seg) => {
      const matchesSpeaker = selectedSpeakerFilter === 'all' || seg.speaker === selectedSpeakerFilter;
      if (!matchesSpeaker) return false;
      if (!searchQuery.trim()) return true;
      return (
        seg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seg.speaker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [segments, selectedSpeakerFilter, searchQuery]);

  // Active segment
  const activeSegment = useMemo(() => {
    return segments.find((seg) => currentTime >= seg.start && currentTime <= seg.end);
  }, [segments, currentTime]);

  // Auto-scroll when active segment changes
  useEffect(() => {
    if (!autoScroll || !activeSegmentRef.current || !containerRef.current) return;
    activeSegmentRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [activeSegment?.id, autoScroll]);

  // Handle in-place edit text
  const startEditing = (seg: TranscriptSegment) => {
    setEditingSegmentId(seg.id);
    setEditingText(seg.text);
  };

  const saveEditing = (id: string) => {
    if (editingText.trim()) {
      onUpdateSegmentText(id, editingText.trim());
    }
    setEditingSegmentId(null);
  };

  // Handle speaker rename
  const startRenamingSpeaker = (speaker: string) => {
    setRenamingSpeakerName(speaker);
    setNewSpeakerNameInput(speaker);
  };

  const saveRenamingSpeaker = () => {
    if (renamingSpeakerName && newSpeakerNameInput.trim() && renamingSpeakerName !== newSpeakerNameInput.trim()) {
      onRenameSpeaker(renamingSpeakerName, newSpeakerNameInput.trim());
    }
    setRenamingSpeakerName(null);
  };

  // Copy segment text
  const copySegment = (seg: TranscriptSegment) => {
    navigator.clipboard.writeText(`[${seg.startTimeFormatted}] ${seg.speaker}: ${seg.text}`);
    setCopiedSegmentId(seg.id);
    setTimeout(() => setCopiedSegmentId(null), 1800);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Top Filter and Search Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/70 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search in transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Speaker Filter Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedSpeakerFilter}
                onChange={(e) => setSelectedSpeakerFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Speakers ({uniqueSpeakers.length})</option>
                {uniqueSpeakers.map((spk) => (
                  <option key={spk} value={spk}>
                    {spk}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-scroll toggle */}
            <button
              type="button"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                autoScroll
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
              title="Toggle automatic scrolling as the video plays"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-scroll</span>
            </button>

            {/* Font size toggle */}
            <button
              type="button"
              onClick={() => setFontSize((f) => (f === 'normal' ? 'large' : 'normal'))}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-mono font-medium"
              title="Toggle text size"
            >
              {fontSize === 'normal' ? 'A+' : 'A-'}
            </button>
          </div>
        </div>

        {/* Search match stats */}
        {searchQuery && (
          <div className="text-xs text-indigo-400 font-medium flex items-center justify-between">
            <span>
              Found {filteredSegments.length} segment{filteredSegments.length === 1 ? '' : 's'} matching "{searchQuery}"
            </span>
          </div>
        )}
      </div>

      {/* Speaker Renaming Banner Modal (if active) */}
      {renamingSpeakerName && (
        <div className="p-3 bg-indigo-950/80 border-b border-indigo-500/30 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-indigo-300 font-medium">Rename all "{renamingSpeakerName}" to:</span>
            <input
              type="text"
              value={newSpeakerNameInput}
              onChange={(e) => setNewSpeakerNameInput(e.target.value)}
              autoFocus
              className="flex-1 bg-slate-900 border border-indigo-500 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={saveRenamingSpeaker}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
              title="Apply to all segments"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setRenamingSpeakerName(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Segments Stream */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
        {filteredSegments.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No segments found matching the criteria.
          </div>
        ) : (
          filteredSegments.map((seg) => {
            const isActive = currentTime >= seg.start && currentTime <= seg.end;
            const isEditing = editingSegmentId === seg.id;

            return (
              <div
                key={seg.id}
                ref={isActive ? activeSegmentRef : undefined}
                className={`relative rounded-xl p-3.5 transition-all duration-150 border group ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-950/40 hover:bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Active Playing Indicator Ribbon */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-500 to-sky-400 rounded-r-full" />
                )}

                {/* Segment Meta Row: Timestamp, Speaker, Actions */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Timestamp seek button */}
                    <button
                      type="button"
                      onClick={() => onSeek(seg.start)}
                      className={`inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-md transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/60'
                      }`}
                      title="Click to jump video to this exact moment"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{seg.startTimeFormatted}</span>
                      <span className="text-slate-400 text-[10px]">({Math.round(seg.end - seg.start)}s)</span>
                    </button>

                    {/* Speaker badge - click to rename across whole video */}
                    <button
                      type="button"
                      onClick={() => startRenamingSpeaker(seg.speaker)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                      title="Click to rename this speaker across entire transcript"
                    >
                      <UserCheck className="w-3 h-3 text-amber-400" />
                      <span>{seg.speaker}</span>
                    </button>
                  </div>

                  {/* Actions: Edit & Copy */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEditing(seg)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Edit text in place"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => copySegment(seg)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy segment"
                    >
                      {copiedSegmentId === seg.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Segment Text or Edit Input */}
                {isEditing ? (
                  <div className="mt-1 space-y-2">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-indigo-500 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSegmentId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEditing(seg.id)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    onClick={() => onSeek(seg.start)}
                    className={`cursor-pointer leading-relaxed transition-colors ${
                      fontSize === 'large' ? 'text-base' : 'text-sm'
                    } ${
                      isActive ? 'text-white font-medium' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    {seg.text}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
