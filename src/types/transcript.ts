export interface TranscriptSegment {
  id: string;
  start: number; // in seconds
  end: number; // in seconds
  startTimeFormatted: string; // e.g. "01:23"
  endTimeFormatted: string; // e.g. "01:28"
  speaker: string; // e.g. "Speaker 1" or "Dr. Smith"
  text: string;
  confidence?: number;
}

export interface Chapter {
  title: string;
  startTime: number;
  startTimeFormatted: string;
  description: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner?: string;
  timestamp?: string;
  completed?: boolean;
}

export interface SpeakerStat {
  speaker: string;
  talkTimeSeconds: number;
  percentage: number;
  wordCount: number;
}

export interface TranscriptionResult {
  id: string;
  title: string;
  fileName?: string;
  createdAt: string;
  mediaUrl?: string;
  mediaType: 'video' | 'audio' | 'youtube';
  youtubeVideoId?: string;
  youtubeUrl?: string;
  detectedLanguage: string;
  selectedInputLanguage?: string;
  durationSeconds: number;
  durationFormatted: string;
  wordCount: number;
  paceWpm: number;
  summary: string;
  segments: TranscriptSegment[];
  fullText: string;
  chapters: Chapter[];
  keyTakeaways: string[];
  actionItems: ActionItem[];
  topics: string[];
  speakerStats: SpeakerStat[];
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
}

export interface SampleMediaItem {
  id: string;
  title: string;
  language: string;
  languageCode: string;
  duration: string;
  durationSeconds: number;
  speakerCount: number;
  description: string;
  category: string;
  mediaType: 'video' | 'audio';
  // Generated sample audio generator config or pre-packaged audio buffer
  audioToneSequence?: {
    synthVoiceType: 'male' | 'female' | 'tech';
    textToSpeak?: string;
  };
  sampleTranscript: TranscriptionResult;
}
