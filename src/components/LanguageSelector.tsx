import React, { useState, useMemo } from 'react';
import { Search, Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageOption } from '../types/transcript';

interface LanguageSelectorProps {
  selectedCode: string;
  onSelectLanguage: (lang: LanguageOption) => void;
  className?: string;
  label?: string;
  showPopularOnlyByDefault?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedCode,
  onSelectLanguage,
  className = '',
  label = 'Input Spoken Language',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === selectedCode) || SUPPORTED_LANGUAGES[0];
  }, [selectedCode]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter((l) => l.popular);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          {label}
        </label>
      )}

      {/* Main trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl text-left transition-all duration-150 shadow-sm group focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-xl leading-none">{selectedLanguage.flag}</span>
          <div className="truncate">
            <span className="text-sm font-medium text-slate-100 group-hover:text-white block truncate">
              {selectedLanguage.name}
            </span>
            <span className="text-xs text-slate-400 truncate block">
              {selectedLanguage.nativeName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">
            {selectedLanguage.code.toUpperCase()}
          </span>
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Quick popular pills beneath trigger for 1-click convenience */}
      <div className="mt-2 flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] text-slate-400 mr-0.5">Quick:</span>
        {popularLanguages.slice(0, 5).map((l) => {
          const isActive = l.code === selectedCode;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => onSelectLanguage(l)}
              className={`text-xs px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all ${
                isActive
                  ? 'bg-indigo-600/90 text-white font-medium border border-indigo-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:text-white'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.code === 'auto' ? 'Auto' : l.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
          />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 flex flex-col">
            {/* Search header */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/60">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 35+ languages (e.g. Spanish, 日本語, Hindi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-800/40">
              {filteredLanguages.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  No language found matching "{searchQuery}"
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = lang.code === selectedCode;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onSelectLanguage(lang);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'hover:bg-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-xl leading-none">{lang.flag}</span>
                        <div className="truncate">
                          <div className="font-medium text-slate-100">{lang.name}</div>
                          <div className="text-xs text-slate-400">{lang.nativeName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lang.code !== 'auto' && (
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                            {lang.code.toUpperCase()}
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
