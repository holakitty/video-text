/**
 * Client-side audio extractor:
 * Extracts audio track from video files using Web Audio API to produce a lightweight,
 * optimized audio payload (16kHz mono WAV) for fast and reliable transcription.
 */

// Helper to encode AudioBuffer to 16-bit PCM WAV
function audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
  const numChannels = 1; // mono for speech
  const sampleRate = 16000; // 16kHz is ideal for speech transcription
  const format = 1; // PCM
  const bitDepth = 16;

  // Resample/downmix to 16kHz mono
  const offlineCtx = new OfflineAudioContext(numChannels, Math.ceil(buffer.duration * sampleRate), sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  return offlineCtx.startRendering().then((renderedBuffer) => {
    const channelData = renderedBuffer.getChannelData(0);
    const dataLength = channelData.length * (bitDepth / 8);
    const bufferArray = new ArrayBuffer(44 + dataLength);
    const view = new DataView(bufferArray);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');

    // FMT sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, format, true); // AudioFormat PCM = 1
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // ByteRate
    view.setUint16(32, numChannels * (bitDepth / 8), true); // BlockAlign
    view.setUint16(34, bitDepth, true);

    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < channelData.length; i++) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Converts a File or Blob into base64 string
 */
export async function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Extracts optimized audio from video file if possible, or returns the original file.
 * Returns { base64: string, mimeType: string, isExtracted: boolean }
 */
export async function prepareMediaForTranscription(
  file: File,
  onProgress?: (stage: string, percent?: number) => void
): Promise<{ base64: string; mimeType: string; isExtracted: boolean }> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|mkv|avi|flv)$/i.test(file.name);

  // If already a small audio file (< 20MB), directly convert to base64
  if (!isVideo && file.size < 20 * 1024 * 1024) {
    onProgress?.('Encoding audio file...');
    const base64 = await fileToBase64(file);
    return {
      base64,
      mimeType: file.type || 'audio/mp3',
      isExtracted: false,
    };
  }

  // If it's a video file, extract audio using AudioContext to drastically reduce payload
  if (isVideo) {
    try {
      onProgress?.('Extracting audio track from video...', 20);
      const arrayBuffer = await file.arrayBuffer();

      onProgress?.('Decoding audio waveforms...', 50);
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      onProgress?.('Optimizing audio for speech recognition (16kHz)...', 80);
      const wavBlob = await audioBufferToWav(decodedBuffer);
      audioCtx.close();

      onProgress?.('Finalizing payload...', 95);
      const base64 = await fileToBase64(wavBlob);
      return {
        base64,
        mimeType: 'audio/wav',
        isExtracted: true,
      };
    } catch (err) {
      console.warn('AudioContext extraction fell back to direct file upload:', err);
      // Fallback: send the video file directly
      onProgress?.('Reading video file directly...');
      const base64 = await fileToBase64(file);
      return {
        base64,
        mimeType: file.type || 'video/mp4',
        isExtracted: false,
      };
    }
  }

  // Audio file fallback
  onProgress?.('Reading audio file...');
  const base64 = await fileToBase64(file);
  return {
    base64,
    mimeType: file.type || 'audio/mp3',
    isExtracted: false,
  };
}

/**
 * Generates an interactive synthetic canvas animation video stream
 * to serve as video preview for preset samples or audio-only files!
 */
export function createSyntheticVideoURL(
  title: string,
  speakerNames: string[],
  durationSeconds: number,
  themeColor: string = '#6366f1'
): { videoUrl: string; cleanup: () => void } {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(30);

  // Create an audio oscillator for synchronized sound playback
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();

  // Create background ambient sound
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
  osc.connect(gain);
  gain.connect(dest);
  osc.start();

  // Combine video and audio
  const combinedStream = new MediaStream([
    ...stream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  let animationFrameId: number;
  let startTime = performance.now();

  function draw() {
    const elapsed = (performance.now() - startTime) / 1000;
    const progress = Math.min(1, elapsed / durationSeconds);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#111827');
    grad.addColorStop(1, '#0b1120');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated glow circles
    const pulse1 = Math.sin(elapsed * 1.5) * 40;
    const pulse2 = Math.cos(elapsed * 1.8) * 30;

    const radial = ctx.createRadialGradient(
      640 + pulse1,
      360 + pulse2,
      50,
      640 + pulse1,
      360 + pulse2,
      380
    );
    radial.addColorStop(0, `${themeColor}44`);
    radial.addColorStop(0.6, `${themeColor}11`);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Audio Visualizer Waveform bars
    const barCount = 48;
    const barWidth = 12;
    const startX = (canvas.width - barCount * (barWidth + 8)) / 2;
    const centerY = 450;

    for (let i = 0; i < barCount; i++) {
      const wave = Math.sin(elapsed * 4 + i * 0.28) * 0.5 + 0.5;
      const wave2 = Math.cos(elapsed * 3 - i * 0.15) * 0.3 + 0.3;
      const height = 15 + (wave + wave2) * 90;

      const barGrad = ctx.createLinearGradient(0, centerY - height, 0, centerY + height);
      barGrad.addColorStop(0, '#38bdf8');
      barGrad.addColorStop(0.5, themeColor);
      barGrad.addColorStop(1, '#a855f7');

      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(startX + i * 20, centerY - height / 2, barWidth, height, 4);
      ctx.fill();
    }

    // Title Card
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.fillText(title, canvas.width / 2, 220);

    // Subtitle / Speakers
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Featured Speakers: ${speakerNames.join(' & ')}`, canvas.width / 2, 270);

    // Live Time Indicator
    const currentMins = Math.floor(elapsed / 60);
    const currentSecs = Math.floor(elapsed % 60);
    const timeStr = `${currentMins.toString().padStart(2, '0')}:${currentSecs.toString().padStart(2, '0')}`;
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 24px monospace';
    ctx.fillText(`● SYNCHRONIZED PLAYBACK: ${timeStr}`, canvas.width / 2, 600);

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // We record for up to 3 seconds or create a persistent stream URL
  const videoUrl = URL.createObjectURL(combinedStream as any);

  const cleanup = () => {
    cancelAnimationFrame(animationFrameId);
    osc.stop();
    audioCtx.close();
    combinedStream.getTracks().forEach((t) => t.stop());
    URL.revokeObjectURL(videoUrl);
  };

  return { videoUrl, cleanup };
}
