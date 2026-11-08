import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Loader2, Play } from 'lucide-react';
import { TranscriptionResult } from '../types/transcript';

interface AskVideoTabProps {
  transcript: TranscriptionResult;
  onSeek: (time: number) => void;
}

export const AskVideoTab: React.FC<AskVideoTabProps> = ({ transcript, onSeek }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I have analyzed the entire transcript of "${transcript.title}". Ask me anything about what was spoken, discussed, or decided. I'll provide answers with clickable timestamp citations so you can jump straight to the video moment.`,
    },
  ]);

  const quickPrompts = [
    'What is the core message of this video?',
    'What key numbers or metrics were cited?',
    'Summarize each speaker’s main viewpoint',
    'List all action items and next steps',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || isLoading) return;

    const userMsg = q.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          transcript: transcript.fullText,
          title: transcript.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to query assistant.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.answer || 'No response.' }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue querying the transcript: ' + err.message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse text with [MM:SS] timestamps and render clickable jump buttons
  const renderMessageContent = (text: string) => {
    // Regex for [MM:SS] or [HH:MM:SS]
    const parts = text.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/);
      if (match) {
        let seconds = 0;
        if (match[3]) {
          seconds = parseInt(match[1], 10) * 3600 + parseInt(match[2], 10) * 60 + parseInt(match[3], 10);
        } else {
          seconds = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        }

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSeek(seconds)}
            className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-mono font-semibold transition-colors"
            title={`Seek video to ${part}`}
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>{part}</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-100">Ask Video AI Assistant</span>
        </div>
        <span className="text-[11px] text-slate-400">Powered by Gemini 3.8 Flash</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {msg.sender === 'ai' ? (
                <div className="whitespace-pre-line">{renderMessageContent(msg.text)}</div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl p-3 bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing transcript and timestamp references...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-500 shrink-0">Try:</span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleAsk(p)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about the video transcript..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
