import React, { useState, useMemo } from 'react';
import { X, Download, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';
import { TranscriptionResult } from '../types/transcript';
import {
  generateSrt,
  generateVtt,
  generatePlainText,
  generateMarkdown,
  downloadFile,
} from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: TranscriptionResult;
}

type ExportFormat = 'srt' | 'vtt' | 'txt' | 'md' | 'json';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transcript,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('srt');
  const [includeTimestampsTxt, setIncludeTimestampsTxt] = useState(true);
  const [copied, setCopied] = useState(false);

  const fileData = useMemo(() => {
    switch (selectedFormat) {
      case 'srt':
        return {
          content: generateSrt(transcript.segments),
          filename: `${transcript.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.srt`,
          mime: 'text/plain',
          label: 'SubRip Subtitles (.srt)',
          desc: 'Compatible with YouTube, Adobe Premiere, DaVinci Resolve, Final Cut Pro, and VLC.',
        };
      case 'vtt':
        return {
          content: generateVtt(transcript.segments),
          filename: `${transcript.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.vtt`,
          mime: 'text/vtt',
          label: 'WebVTT Captions (.vtt)',
          desc: 'Standard web subtitle format used in HTML5 video and web players.',
        };
      case 'txt':
        return {
          content: generatePlainText(transcript, includeTimestampsTxt),
          filename: `${transcript.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`,
          mime: 'text/plain',
          label: 'Plain Text (.txt)',
          desc: 'Clean, unformatted text ideal for copying into documents or notes.',
        };
      case 'md':
        return {
          content: generateMarkdown(transcript),
          filename: `${transcript.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`,
          mime: 'text/markdown',
          label: 'Markdown Notes (.md)',
          desc: 'Rich formatted documentation with executive summary, chapters, and action items.',
        };
      case 'json':
        return {
          content: JSON.stringify(transcript, null, 2),
          filename: `${transcript.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`,
          mime: 'application/json',
          label: 'Structured JSON (.json)',
          desc: 'Full structured data with microsecond timestamps and metadata for developers.',
        };
    }
  }, [selectedFormat, transcript, includeTimestampsTxt]);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadFile(fileData.content, fileData.filename, fileData.mime);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" /> Export Transcripts & Subtitles
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your desired export format for video editing, archiving, or sharing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="py-4 border-b border-slate-800 flex flex-wrap gap-2">
          {(['srt', 'vtt', 'txt', 'md', 'json'] as ExportFormat[]).map((fmt) => {
            const isActive = selectedFormat === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                .{fmt}
              </button>
            );
          })}
        </div>

        {/* Format Details & Options */}
        <div className="py-2.5 flex items-center justify-between text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-200">{fileData.label}: </span>
            <span>{fileData.desc}</span>
          </div>

          {selectedFormat === 'txt' && (
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={includeTimestampsTxt}
                onChange={(e) => setIncludeTimestampsTxt(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Include timestamps</span>
            </label>
          )}
        </div>

        {/* Preview Area */}
        <div className="flex-1 min-h-[220px] max-h-[340px] my-2 bg-slate-950 rounded-2xl border border-slate-800/80 p-4 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap select-all">
          {fileData.content}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 truncate max-w-xs">{fileData.filename}</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-700/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{selectedFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
