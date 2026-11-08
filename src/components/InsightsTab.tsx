import React, { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  Square,
  Users,
  Activity,
  Copy,
  Check,
  FileText,
  Clock,
  Volume2,
} from 'lucide-react';
import { TranscriptionResult, ActionItem } from '../types/transcript';

interface InsightsTabProps {
  transcript: TranscriptionResult;
  onToggleActionItem: (id: string) => void;
  onSeek: (time: number) => void;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  transcript,
  onToggleActionItem,
  onSeek,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const copySummary = () => {
    navigator.clipboard.writeText(transcript.summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const paceLabel = (wpm: number) => {
    if (wpm < 120) return { label: 'Relaxed & Deliberate', color: 'text-sky-400 bg-sky-500/10' };
    if (wpm <= 165) return { label: 'Optimal Conversational', color: 'text-emerald-400 bg-emerald-500/10' };
    return { label: 'Brisk & Fast-Paced', color: 'text-amber-400 bg-amber-500/10' };
  };

  const paceInfo = paceLabel(transcript.paceWpm);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 space-y-6 text-slate-200">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Duration
          </div>
          <div className="text-lg font-bold text-slate-100">{transcript.durationFormatted}</div>
          <div className="text-[11px] text-slate-500">{transcript.durationSeconds} seconds</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <FileText className="w-3.5 h-3.5 text-sky-400" /> Word Count
          </div>
          <div className="text-lg font-bold text-slate-100">{transcript.wordCount}</div>
          <div className="text-[11px] text-slate-500">{transcript.segments.length} segments</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Speaking Pace
          </div>
          <div className="text-lg font-bold text-slate-100">{transcript.paceWpm} WPM</div>
          <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded inline-block mt-0.5 ${paceInfo.color}`}>
            {paceInfo.label}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-amber-400" /> Speakers
          </div>
          <div className="text-lg font-bold text-slate-100">{transcript.speakerStats.length}</div>
          <div className="text-[11px] text-slate-500">Language: {transcript.detectedLanguage}</div>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Executive Summary
          </h3>
          <button
            type="button"
            onClick={copySummary}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{transcript.summary}</p>
      </div>

      {/* Speaker Talk-Time Distribution */}
      {transcript.speakerStats.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-amber-400" /> Speaker Talk-Time Breakdown
          </h3>

          {/* Visual Bar Stack */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 mb-4">
            {transcript.speakerStats.map((spk, idx) => {
              const colors = ['bg-indigo-500', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400', 'bg-rose-400'];
              return (
                <div
                  key={spk.speaker}
                  style={{ width: `${spk.percentage}%` }}
                  className={`${colors[idx % colors.length]} h-full transition-all`}
                  title={`${spk.speaker}: ${spk.percentage}% (${spk.talkTimeSeconds}s)`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {transcript.speakerStats.map((spk, idx) => {
              const borderColors = [
                'border-indigo-500/40',
                'border-sky-400/40',
                'border-amber-400/40',
                'border-emerald-400/40',
              ];
              const dotColors = ['bg-indigo-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400'];
              return (
                <div
                  key={spk.speaker}
                  className={`p-3 rounded-xl bg-slate-900 border ${borderColors[idx % borderColors.length]} flex items-center justify-between text-xs`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColors[idx % dotColors.length]}`} />
                    <span className="font-semibold text-slate-100 truncate">{spk.speaker}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-100">{spk.percentage}%</span>
                    <span className="text-slate-400 text-[11px] ml-1">({spk.talkTimeSeconds}s • {spk.wordCount} words)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      {transcript.keyTakeaways && transcript.keyTakeaways.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" /> Key Discussion Takeaways
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {transcript.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items Checklist */}
      {transcript.actionItems && transcript.actionItems.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-emerald-400" /> Action Items & Commitments
          </h3>
          <div className="space-y-2">
            {transcript.actionItems.map((act) => (
              <div
                key={act.id}
                onClick={() => onToggleActionItem(act.id)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  act.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-400 shrink-0"
                >
                  {act.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
                </button>
                <div className="flex-1 text-xs sm:text-sm">
                  <span>{act.task}</span>
                  {(act.owner || act.timestamp) && (
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      {act.owner && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                          @{act.owner}
                        </span>
                      )}
                      {act.timestamp && (
                        <span className="text-indigo-400 font-mono">[{act.timestamp}]</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
