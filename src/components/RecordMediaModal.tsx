import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Video,
  Mic,
  StopCircle,
  Play,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { LanguageOption } from '../types/transcript';
import { LanguageSelector } from './LanguageSelector';

interface RecordMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordSuccess: (file: File, mediaType: 'video' | 'audio') => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
}

export const RecordMediaModal: React.FC<RecordMediaModalProps> = ({
  isOpen,
  onClose,
  onRecordSuccess,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [recordMode, setRecordMode] = useState<'video' | 'audio'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Start device camera / mic preview when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopMediaStream();
      return;
    }

    startPreviewStream(recordMode);

    return () => {
      stopMediaStream();
      clearInterval(timerIntervalRef.current);
    };
  }, [isOpen, recordMode]);

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startPreviewStream = async (mode: 'video' | 'audio') => {
    stopMediaStream();
    setErrorMessage(null);
    setRecordedBlob(null);

    try {
      const constraints: MediaStreamConstraints =
        mode === 'video'
          ? { video: { width: 1280, height: 720 }, audio: true }
          : { audio: true, video: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoPreviewRef.current && mode === 'video') {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(console.error);
      }
    } catch (err: any) {
      console.error('Media access error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone or Camera access was denied. Please allow permissions in your browser.'
          : 'Could not access audio/video device: ' + err.message
      );
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordedBlob(null);
    setRecordDuration(0);

    try {
      const mimeType =
        recordMode === 'video'
          ? MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : 'video/webm'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
      };

      recorder.start(500); // 500ms slices
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage('Failed to start recording: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordDuration(0);
    startPreviewStream(recordMode);
  };

  const handleConfirmAndTranscribe = () => {
    if (!recordedBlob) return;
    const fileName = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.${
      recordMode === 'video' ? 'webm' : 'webm'
    }`;
    const file = new File([recordedBlob], fileName, { type: recordedBlob.type });
    stopMediaStream();
    onRecordSuccess(file, recordMode);
    onClose();
  };

  if (!isOpen) return null;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              {recordMode === 'video' ? <Video className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Live Recording Studio</h2>
              <p className="text-xs text-slate-400">Record video or microphone directly in your browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector and Language Selector */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (!isRecording) setRecordMode('video');
              }}
              disabled={isRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                recordMode === 'video'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Webcam Video</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isRecording) setRecordMode('audio');
              }}
              disabled={isRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                recordMode === 'audio'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Mic Audio</span>
            </button>
          </div>

          <div className="w-48">
            <LanguageSelector
              selectedCode={selectedLanguage.code}
              onSelectLanguage={onSelectLanguage}
              label=""
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="my-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Viewport / Preview Box */}
        <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-slate-800 my-2">
          {recordedBlob ? (
            // Recorded preview
            recordMode === 'video' ? (
              <video
                ref={recordedVideoRef}
                src={URL.createObjectURL(recordedBlob)}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Mic className="w-8 h-8" />
                </div>
                <div className="text-sm font-semibold text-slate-200">Audio Clip Recorded</div>
                <audio src={URL.createObjectURL(recordedBlob)} controls className="w-64" />
              </div>
            )
          ) : (
            // Live Stream
            <>
              {recordMode === 'video' ? (
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Mic className="w-10 h-10" />
                  </div>
                  <div className="text-xs text-slate-400">Microphone Input Active</div>
                </div>
              )}

              {/* Recording indicator ribbon */}
              {isRecording && (
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-rose-300">
                    REC {formatTimer(recordDuration)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer controls */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {recordedBlob ? (
            <>
              <button
                type="button"
                onClick={resetRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Record Again</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAndTranscribe}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Transcribe Recording ({selectedLanguage.name})</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                >
                  <StopCircle className="w-5 h-5 fill-white text-rose-600" />
                  <span>Stop Recording ({formatTimer(recordDuration)})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
                >
                  <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  <span>Start Recording</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
