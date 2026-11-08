import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Gauge,
  Sparkles,
  ExternalLink,
  Youtube,
} from 'lucide-react';
import { TranscriptSegment, Chapter } from '../types/transcript';

interface VideoPlayerProps {
  mediaUrl: string;
  mediaType: 'video' | 'audio' | 'youtube';
  youtubeVideoId?: string;
  youtubeUrl?: string;
  title: string;
  durationSeconds?: number;
  segments: TranscriptSegment[];
  chapters: Chapter[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onSeek: (time: number) => void;
  activeSegment?: TranscriptSegment;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  mediaUrl,
  mediaType,
  youtubeVideoId,
  youtubeUrl,
  title,
  durationSeconds = 0,
  segments,
  chapters,
  currentTime,
  onTimeUpdate,
  onSeek,
  activeSegment,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(durationSeconds || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitleSize, setSubtitleSize] = useState<'sm' | 'md' | 'lg'>('md');

  const isYouTube = mediaType === 'youtube' || !!youtubeVideoId;

  // Update duration if prop changes
  useEffect(() => {
    if (durationSeconds > 0) {
      setDuration(durationSeconds);
    }
  }, [durationSeconds]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const s = Math.max(0, Math.floor(secs));
    const mins = Math.floor(s / 60);
    const remainingSecs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Helper to send postMessage to YouTube IFrame
  const postToYouTube = useCallback((func: string, args: any[] = []) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args,
      }),
      '*'
    );
  }, []);

  // Listen for YouTube Iframe events
  useEffect(() => {
    if (!isYouTube) return;

    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (!data) return;

        // Player state change: 1 = playing, 2 = paused, 0 = ended
        if (data.event === 'onStateChange') {
          if (data.info === 1) setIsPlaying(true);
          else if (data.info === 2 || data.info === 0) setIsPlaying(false);
        }

        // Info delivery: provides currentTime and duration
        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            onTimeUpdate(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            setIsPlaying(data.info.playerState === 1);
          }
        }
      } catch (err) {
        // ignore non-json messages
      }
    };

    window.addEventListener('message', handleMessage);

    // Initial handshake to start receiving infoDelivery events
    const initTimer = setTimeout(() => {
      postToYouTube('listening');
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(initTimer);
    };
  }, [isYouTube, onTimeUpdate, postToYouTube]);

  // Fallback ticker for YouTube time tracking if postMessage is quiet
  useEffect(() => {
    if (!isYouTube || !isPlaying) return;
    const ticker = setInterval(() => {
      onTimeUpdate(Math.min(duration, currentTime + 0.5));
    }, 500);
    return () => clearInterval(ticker);
  }, [isYouTube, isPlaying, duration, currentTime, onTimeUpdate]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isYouTube) {
      if (isPlaying) {
        postToYouTube('pauseVideo');
        setIsPlaying(false);
      } else {
        postToYouTube('playVideo');
        setIsPlaying(true);
      }
      return;
    }

    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isYouTube, isPlaying, postToYouTube]);

  // Jump +/- 5s
  const jumpTime = useCallback(
    (offset: number) => {
      const newTime = Math.min(Math.max(0, currentTime + offset), duration);
      if (isYouTube) {
        postToYouTube('seekTo', [newTime, true]);
        onSeek(newTime);
        return;
      }

      if (!videoRef.current) return;
      videoRef.current.currentTime = newTime;
      onSeek(newTime);
    },
    [isYouTube, currentTime, duration, onSeek, postToYouTube]
  );

  // Handle scrub change
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (isYouTube) {
      postToYouTube('seekTo', [time, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    onSeek(time);
  };

  // Handle speed change
  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (isYouTube) {
      postToYouTube('setPlaybackRate', [rate]);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isYouTube) {
      postToYouTube('setVolume', [Math.round(val * 100)]);
    } else if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (isYouTube) {
      if (isMuted) {
        postToYouTube('unMute');
        setIsMuted(false);
      } else {
        postToYouTube('mute');
        setIsMuted(true);
      }
      return;
    }

    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Synchronize when parent requests a seek
  useEffect(() => {
    if (isYouTube) {
      postToYouTube('seekTo', [currentTime, true]);
    } else if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [isYouTube, currentTime, postToYouTube]);

  const subtitleSizeClasses = {
    sm: 'text-xs sm:text-sm px-3 py-1.5',
    md: 'text-sm sm:text-base px-4 py-2',
    lg: 'text-base sm:text-lg px-5 py-2.5',
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col group select-none"
    >
      {/* Media Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {isYouTube ? (
          // YouTube Iframe Embed
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&origin=${encodeURIComponent(
              window.location.origin
            )}&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          // Native Video
          <video
            ref={videoRef}
            src={mediaUrl}
            playsInline
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                onTimeUpdate(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration || durationSeconds || 0);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        )}

        {/* Synced Closed Captions / Subtitle Overlay */}
        {showSubtitles && activeSegment && (
          <div className="absolute bottom-16 left-4 right-4 flex justify-center pointer-events-none transition-all duration-150 z-20">
            <div
              className={`bg-black/85 text-white backdrop-blur-md rounded-xl text-center max-w-xl font-medium shadow-2xl border border-white/10 ${
                subtitleSizeClasses[subtitleSize]
              }`}
            >
              {activeSegment.speaker && (
                <span className="text-amber-400 font-semibold mr-2 block sm:inline text-xs sm:text-sm">
                  {activeSegment.speaker}:
                </span>
              )}
              <span className="leading-snug">{activeSegment.text}</span>
            </div>
          </div>
        )}

        {/* Top Header pill: Media title & Synced badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs text-slate-200 font-medium truncate max-w-xs sm:max-w-md pointer-events-auto">
            {isYouTube && <Youtube className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
            <span className="truncate">{title}</span>
            {isYouTube && youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white ml-1 shrink-0"
                title="Open on YouTube"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30 text-[11px] text-indigo-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced Transcript</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4 flex flex-col gap-2 z-20">
        {/* Scrubber and Chapter Markers */}
        <div className="relative flex items-center group/scrub">
          {/* Chapter markers along the timeline bar */}
          {chapters.map((chap, i) => {
            if (duration <= 0) return null;
            const pct = (chap.startTime / duration) * 100;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (isYouTube) {
                    postToYouTube('seekTo', [chap.startTime, true]);
                  } else if (videoRef.current) {
                    videoRef.current.currentTime = chap.startTime;
                  }
                  onSeek(chap.startTime);
                }}
                style={{ left: `${pct}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 hover:scale-150 hover:bg-amber-300 z-10 transition-transform shadow-md group/marker"
                title={`${chap.title} (${chap.startTimeFormatted})`}
              >
                <span className="hidden group-hover/marker:block absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black text-[10px] text-white whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none">
                  {chap.title}
                </span>
              </button>
            );
          })}

          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 text-slate-300">
          {/* Left Controls: Play, -5s, +5s, Time */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => jumpTime(-5)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Seek backward 5 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => jumpTime(5)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Seek forward 5 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Time readout */}
            <div className="ml-1 text-xs font-mono text-slate-400 tracking-tight">
              <span className="text-slate-100 font-semibold">{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-600">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Subtitles toggle, Speed, Volume, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Subtitle CC toggle */}
            <button
              type="button"
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-xl transition-colors ${
                showSubtitles
                  ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
              title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Subtitle Size toggle (if subtitles enabled) */}
            {showSubtitles && (
              <button
                type="button"
                onClick={() => {
                  setSubtitleSize((prev) => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'));
                }}
                className="hidden sm:inline-flex px-2 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Change subtitle font size"
              >
                CC {subtitleSize.toUpperCase()}
              </button>
            )}

            {/* Speed Selector */}
            <div className="relative group/speed">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                title="Playback Speed"
              >
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                <span>{playbackRate}x</span>
              </button>
              <div className="absolute bottom-full right-0 mb-1 hidden group-hover/speed:flex flex-col bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-xl z-30">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => changeSpeed(rate)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium text-left transition-colors ${
                      playbackRate === rate ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
