import React, { useState } from 'react';
import { Languages, ArrowRight, Loader2, Check, Download, Copy, Play } from 'lucide-react';
import { TARGET_TRANSLATION_LANGUAGES } from '../data/languages';
import { TranscriptSegment } from '../types/transcript';
import { generateSrt, generateVtt, downloadFile } from '../utils/exportUtils';

interface TranslateTabProps {
  segments: TranscriptSegment[];
  currentLanguage: string;
  onSeek: (time: number) => void;
  currentTime: number;
}

export const TranslateTab: React.FC<TranslateTabProps> = ({
  segments,
  currentLanguage,
  onSeek,
  currentTime,
}) => {
  const [targetCode, setTargetCode] = useState('es'); // default Spanish
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedSegments, setTranslatedSegments] = useState<TranscriptSegment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedTargetLang = TARGET_TRANSLATION_LANGUAGES.find((l) => l.code === targetCode) || TARGET_TRANSLATION_LANGUAGES[0];

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError(null);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segments,
          targetLanguage: selectedTargetLang.name,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Translation request failed.');
      }

      const res = await response.json();
      setTranslatedSegments(res.translatedSegments || []);
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || 'Failed to translate transcript.');
    } finally {
      setIsTranslating(false);
    }
  };

  const downloadTranslatedSrt = () => {
    if (!translatedSegments) return;
    const srt = generateSrt(translatedSegments);
    downloadFile(srt, `transcript_${targetCode}.srt`, 'text/plain');
  };

  const copyTranslatedText = () => {
    if (!translatedSegments) return;
    const text = translatedSegments.map((s) => `[${s.startTimeFormatted}] ${s.speaker}: ${s.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-5 space-y-5">
      {/* Configuration Header */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-400" /> Multilingual Translation Studio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Translate every spoken line into any world language while preserving exact microsecond video timestamps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Language:</span>
            <select
              value={targetCode}
              onChange={(e) => setTargetCode(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {TARGET_TRANSLATION_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="text-xs text-slate-400">
            Current: <span className="text-slate-200 font-medium">{currentLanguage}</span> → Target:{' '}
            <span className="text-indigo-400 font-medium">
              {selectedTargetLang.flag} {selectedTargetLang.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={isTranslating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Translating {segments.length} segments...</span>
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                <span>Translate with Gemini</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Translated Results */}
      {translatedSegments && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Translated to {selectedTargetLang.name} ({translatedSegments.length} segments)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyTranslatedText}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
              <button
                type="button"
                onClick={downloadTranslatedSrt}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export Translated SRT</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {translatedSegments.map((seg, idx) => {
              const original = segments[idx];
              const isActive = currentTime >= seg.start && currentTime <= seg.end;

              return (
                <div
                  key={seg.id || idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-indigo-950/30 border-indigo-500 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSeek(seg.start)}
                        className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{seg.startTimeFormatted}</span>
                      </button>
                      <span className="text-xs font-semibold text-amber-300">{seg.speaker}</span>
                    </div>
                  </div>

                  {/* Translated Text */}
                  <p className="text-sm font-medium text-slate-100 mb-1">{seg.text}</p>

                  {/* Original Text comparison */}
                  {original && (
                    <p className="text-xs text-slate-500 border-t border-slate-800/60 pt-1 mt-1">
                      Original: {original.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
