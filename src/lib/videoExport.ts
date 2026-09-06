import React from 'react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import RecordRTC from 'recordrtc';

interface VideoExportOptions {
  previewRef: React.RefObject<HTMLDivElement | null>;
  videoUrl: string;
  onProgress: (progress: number) => void;
  isExportingRef: React.MutableRefObject<boolean>;
  options?: {
    frameRate: number;
    bitrate: number;
    codec: string;
    exportScale: number;
  };
}

export const exportToVideo = async ({
  previewRef,
  videoUrl,
  onProgress,
  isExportingRef,
  options,
}: VideoExportOptions): Promise<void> => {
  if (!previewRef.current || !videoUrl) return;
  
  const toastId = toast.loading("Preparing high-definition export...");

  try {
    const previewEl = previewRef.current;
    const naturalWidth = previewEl.offsetWidth;
    const naturalHeight = previewEl.offsetHeight;
    
    const domVideo = previewEl.querySelector('video');
    if (!domVideo) throw new Error("Video element not found in preview");
    
    // 1. Calculate precise relative coordinates inside the unscaled preview
    const rect = previewEl.getBoundingClientRect();
    const videoRect = domVideo.getBoundingClientRect();
    const uiScale = rect.width / (naturalWidth || 1);
    
    const relX = (videoRect.left - rect.left) / uiScale;
    const relY = (videoRect.top - rect.top) / uiScale;
    const relW = videoRect.width / uiScale;
    const relH = videoRect.height / uiScale;

    // Use high resolution scale (default 2.5x - 3.0x for crisp HD quality)
    const exportScale = Math.max(1, options?.exportScale || 2.5); 
    // Video encoders require even pixel dimensions (divisible by 2)
    const width = Math.floor((naturalWidth * exportScale) / 2) * 2;
    const height = Math.floor((naturalHeight * exportScale) / 2) * 2;

    const vx = Math.round(relX * exportScale);
    const vy = Math.round(relY * exportScale);
    const vw = Math.round(relW * exportScale);
    const vh = Math.round(relH * exportScale);
    const radius = Math.round(16 * exportScale);

    // 2. Setup Export Video element (active in viewport with 0.001 opacity so browser decodes full frames)
    const exportVideo = document.createElement('video');
    exportVideo.style.position = 'fixed';
    exportVideo.style.bottom = '0';
    exportVideo.style.right = '0';
    exportVideo.style.width = '320px';
    exportVideo.style.height = '180px';
    exportVideo.style.opacity = '0.001';
    exportVideo.style.pointerEvents = 'none';
    exportVideo.style.zIndex = '0';
    exportVideo.muted = true;
    exportVideo.playsInline = true;
    exportVideo.crossOrigin = "anonymous";
    exportVideo.loop = false;
    
    document.body.appendChild(exportVideo);
    
    let localVideoUrl = videoUrl;
    let isBlobUrl = false;

    // 3. Pre-fetch video as Blob to prevent network buffering during recording
    if (videoUrl.startsWith('http') || videoUrl.startsWith('data:')) {
      try {
        toast.loading(videoUrl.startsWith('data:') ? "Processing local video..." : "Optimizing video buffer...", { id: toastId });
        const response = await fetch(videoUrl);
        if (response.ok) {
          const blob = await response.blob();
          localVideoUrl = URL.createObjectURL(blob);
          isBlobUrl = true;
        }
      } catch (e) {
        console.warn("Video pre-fetch fallback:", e);
      }
    }

    exportVideo.src = localVideoUrl;

    // 4. Capture static background frame with exact high resolution
    const captureFrame = async () => {
      return await toPng(previewEl, { 
        width: naturalWidth,
        height: naturalHeight,
        pixelRatio: exportScale,
        filter: (node: any) => {
          if (node.tagName === 'VIDEO') return false;
          if (node.classList?.contains('export-overlay')) return false;
          return true;
        },
        cacheBust: true,
      });
    };

    const frameDataUrl = await captureFrame();
    const frameImg = new window.Image();
    frameImg.src = frameDataUrl;
    await new Promise((resolve) => { frameImg.onload = resolve; });

    // 5. Setup Master Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error("Failed to initialize canvas context");
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw initial frame
    ctx.drawImage(frameImg, 0, 0, width, height);

    // 6. Setup Audio Stream if available
    let audioContext: AudioContext | null = null;
    let audioDestination: MediaStreamAudioDestinationNode | null = null;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
        const source = audioContext.createMediaElementSource(exportVideo);
        audioDestination = audioContext.createMediaStreamDestination();
        source.connect(audioDestination);
        exportVideo.muted = false;
        exportVideo.volume = 1.0;
      }
    } catch (e) {
      console.warn("Audio extraction unavailable, recording video track only:", e);
    }

    // 7. Setup Combined Stream & Native High-Bitrate MediaRecorder
    const targetFps = options?.frameRate || 30;
    const canvasStream = canvas.captureStream(targetFps);
    
    const combinedTracks: MediaStreamTrack[] = [
      ...canvasStream.getVideoTracks(),
      ...(audioDestination ? audioDestination.stream.getAudioTracks() : [])
    ];
    const combinedStream = new MediaStream(combinedTracks);

    // Determine optimal supported MIME type
    const candidateMimeTypes = [
      options?.codec,
      'video/mp4;codecs=avc1.4d002a,mp4a.40.2',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ].filter(Boolean) as string[];

    let finalMimeType = 'video/webm';
    for (const mime of candidateMimeTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        finalMimeType = mime;
        break;
      }
    }

    const bitrate = options?.bitrate || 25000000; // 25-30 Mbps for pristine HD video

    return new Promise<void>((resolve, reject) => {
      let isStarted = false;
      let lastVideoTime = -1;
      let stuckFrames = 0;
      let frameRequestId: number | null = null;
      const recordedChunks: Blob[] = [];
      let nativeRecorder: MediaRecorder | null = null;
      let rtcRecorder: RecordRTC | null = null;

      const cleanup = () => {
        if (frameRequestId !== null) cancelAnimationFrame(frameRequestId);
        if (isBlobUrl) URL.revokeObjectURL(localVideoUrl);
        if (audioContext) audioContext.close().catch(() => {});
        exportVideo.pause();
        exportVideo.src = "";
        if (exportVideo.parentNode) document.body.removeChild(exportVideo);
      };

      const finishAndDownload = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = finalMimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = `xpic-${Date.now()}.${extension}`;
        a.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 15000);
        cleanup();
        toast.success("High-definition video exported successfully!", { id: toastId });
        resolve();
      };

      const startRecording = async () => {
        if (isStarted) return;
        isStarted = true;

        try {
          if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          // Seek to beginning
          exportVideo.currentTime = 0;
          await new Promise(r => {
            const onSeeked = () => {
              exportVideo.removeEventListener('seeked', onSeeked);
              r(null);
            };
            exportVideo.addEventListener('seeked', onSeeked);
            setTimeout(onSeeked, 1500);
          });
          
          try {
            await exportVideo.play();
            exportVideo.muted = false;
            exportVideo.volume = 1.0;
            await new Promise(r => setTimeout(r, 100));
          } catch (err) {
            console.warn("Autoplay notice, continuing:", err);
          }

          const duration = exportVideo.duration && isFinite(exportVideo.duration) && exportVideo.duration > 0
            ? exportVideo.duration 
            : 5;

          // Start Native MediaRecorder or RecordRTC single-stream
          if (typeof MediaRecorder !== 'undefined') {
            nativeRecorder = new MediaRecorder(combinedStream, {
              mimeType: finalMimeType,
              videoBitsPerSecond: bitrate,
              audioBitsPerSecond: 192000,
            });

            nativeRecorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) {
                recordedChunks.push(e.data);
              }
            };

            nativeRecorder.onstop = () => {
              const fullBlob = new Blob(recordedChunks, { type: finalMimeType });
              finishAndDownload(fullBlob);
            };

            nativeRecorder.start(100);
          } else {
            // Fallback to single-stream RecordRTC (NOT MultiStreamRecorder which downsamples)
            rtcRecorder = new RecordRTC(combinedStream, {
              type: 'video',
              mimeType: finalMimeType as any,
              recorderType: RecordRTC.MediaStreamRecorder,
              bitsPerSecond: bitrate,
              videoBitsPerSecond: bitrate,
              audioBitsPerSecond: 192000,
              frameRate: targetFps,
            });
            rtcRecorder.startRecording();
          }

          toast.loading("Encoding crystal-clear video...", { id: toastId });

          const stopAll = () => {
            if (nativeRecorder && nativeRecorder.state === 'recording') {
              nativeRecorder.stop();
            } else if (rtcRecorder) {
              rtcRecorder.stopRecording(() => {
                const blob = rtcRecorder!.getBlob();
                finishAndDownload(blob);
              });
            } else {
              cleanup();
              resolve();
            }
          };

          const renderLoop = () => {
            if (!isExportingRef.current) {
              stopAll();
              return;
            }

            const progress = Math.min((exportVideo.currentTime / duration) * 100, 100);
            onProgress(progress);

            // Heartbeat: detect if playback stalls
            if (exportVideo.currentTime === lastVideoTime && !exportVideo.paused && !exportVideo.ended) {
              stuckFrames++;
              if (stuckFrames > 30) {
                exportVideo.currentTime += 0.01;
                exportVideo.play().catch(() => {});
                stuckFrames = 0;
              }
            } else {
              stuckFrames = 0;
            }
            lastVideoTime = exportVideo.currentTime;

            if (exportVideo.paused && !exportVideo.ended && exportVideo.currentTime < duration) {
              exportVideo.play().catch(() => {});
            }

            // 1. Draw static background
            ctx.drawImage(frameImg, 0, 0, width, height);

            // 2. Draw video with smooth clipped rounded corners
            ctx.save();
            ctx.beginPath();
            if (typeof (ctx as any).roundRect === 'function') {
              (ctx as any).roundRect(vx, vy, vw, vh, radius);
            } else {
              const r = Math.min(radius, vw / 2, vh / 2);
              ctx.moveTo(vx + r, vy);
              ctx.arcTo(vx + vw, vy, vx + vw, vy + vh, r);
              ctx.arcTo(vx + vw, vy + vh, vx, vy + vh, r);
              ctx.arcTo(vx, vy + vh, vx, vy, r);
              ctx.arcTo(vx, vy, vx, vy + vh, r);
              ctx.closePath();
            }
            ctx.clip();

            if (exportVideo.readyState >= 2) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(exportVideo, vx, vy, vw, vh);
            } else {
              ctx.fillStyle = '#000000';
              ctx.fillRect(vx, vy, vw, vh);
            }
            ctx.restore();

            if (!exportVideo.ended && exportVideo.currentTime < duration) {
              frameRequestId = requestAnimationFrame(renderLoop);
            } else {
              stopAll();
            }
          };

          renderLoop();
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      if (exportVideo.readyState >= 2) {
        startRecording();
      } else {
        exportVideo.oncanplay = startRecording;
        exportVideo.load();
        setTimeout(() => { if (!isStarted) startRecording(); }, 6000);
      }
    });

  } catch (err) {
    toast.error("Export failed", { id: toastId });
    throw err;
  }
};

