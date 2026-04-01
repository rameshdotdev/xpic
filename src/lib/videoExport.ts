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
  
  const toastId = toast.loading("Preparing high-quality export...");

  try {
    const previewEl = previewRef.current;
    const naturalWidth = previewEl.offsetWidth;
    const naturalHeight = previewEl.offsetHeight;
    
    const domVideo = previewEl.querySelector('video');
    if (!domVideo) throw new Error("Video element not found in preview");
    
    // 1. Calculate precise coordinates
    const rect = previewEl.getBoundingClientRect();
    const videoRect = domVideo.getBoundingClientRect();
    const uiScale = rect.width / naturalWidth;
    
    const relX = (videoRect.left - rect.left) / uiScale;
    const relY = (videoRect.top - rect.top) / uiScale;
    const relW = videoRect.width / uiScale;
    const relH = videoRect.height / uiScale;

    const exportScale = options?.exportScale || 3.0; 
    const width = Math.floor(naturalWidth * exportScale);
    const height = Math.floor(naturalHeight * exportScale);

    // 2. Setup Export Video (Visible but small to prevent throttling)
    const exportVideo = document.createElement('video');
    exportVideo.style.position = 'fixed';
    exportVideo.style.bottom = '20px';
    exportVideo.style.right = '20px';
    exportVideo.style.width = '240px';
    exportVideo.style.height = '135px';
    exportVideo.style.zIndex = '10000';
    exportVideo.style.opacity = '0.5'; // More visible to prevent throttling
    exportVideo.style.borderRadius = '12px';
    exportVideo.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    exportVideo.style.border = '2px solid rgba(255,255,255,0.2)';
    exportVideo.muted = true; // Start muted to ensure play() works
    exportVideo.playsInline = true;
    exportVideo.crossOrigin = "anonymous";
    exportVideo.loop = false;
    
    // Add a label so user knows what it is
    const label = document.createElement('div');
    label.innerText = "EXPORT PREVIEW - DO NOT CLOSE";
    label.style.position = 'fixed';
    label.style.bottom = '160px';
    label.style.right = '20px';
    label.style.zIndex = '10001';
    label.style.background = 'black';
    label.style.color = 'white';
    label.style.padding = '4px 8px';
    label.style.fontSize = '10px';
    label.style.fontWeight = 'bold';
    label.style.borderRadius = '4px';
    
    document.body.appendChild(exportVideo);
    document.body.appendChild(label);
    
    let localVideoUrl = videoUrl;
    let isBlobUrl = false;

    // 3. Pre-fetch video as Blob
    if (videoUrl.startsWith('http') || videoUrl.startsWith('data:')) {
      try {
        toast.loading(videoUrl.startsWith('data:') ? "Processing local video..." : "Optimizing video...", { id: toastId });
        const response = await fetch(videoUrl);
        if (response.ok) {
          const blob = await response.blob();
          localVideoUrl = URL.createObjectURL(blob);
          isBlobUrl = true;
        }
      } catch (e) {
        console.warn("Video pre-fetch failed:", e);
      }
    }

    exportVideo.src = localVideoUrl;

    // 4. Capture static background
    const captureFrame = async () => {
      return await toPng(previewEl, { 
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

    // 5. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error("Canvas context failed");
    
    // Set high quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw initial frame to "warm up" the canvas
    ctx.drawImage(frameImg, 0, 0, width, height);

    // 6. Setup Recording
    const mimeType = options?.codec || 'video/webm;codecs=vp9,opus';
    
    // Fallback if requested codec is not supported
    const finalMimeType = (window as any).MediaRecorder && (window as any).MediaRecorder.isTypeSupported(mimeType)
      ? mimeType
      : 'video/webm';

    // Capture stream AFTER initial draw
    const canvasStream = canvas.captureStream(options?.frameRate || 30);
    let audioContext: AudioContext | null = null;
    let audioDestination: MediaStream | null = null;
    
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
      const source = audioContext.createMediaElementSource(exportVideo);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      audioDestination = destination.stream;
      
      // Unmute so audio flows into the source node
      exportVideo.muted = false;
      exportVideo.volume = 1.0;
    } catch (e) {
      console.warn("Audio capture failed, exporting without audio:", e);
    }

    // Combine canvas and audio streams
    const streams = [canvasStream];
    if (audioDestination) {
      streams.push(audioDestination);
    }

    const recorder = new RecordRTC(streams, {
      type: 'video',
      mimeType: finalMimeType as any,
      recorderType: (RecordRTC as any).MultiStreamRecorder,
      bitsPerSecond: options?.bitrate || 30000000,
      videoBitsPerSecond: options?.bitrate || 30000000,
      audioBitsPerSecond: 192000,
      frameRate: options?.frameRate || 30,
    });

    return new Promise<void>((resolve, reject) => {
      let isStarted = false;
      let lastVideoTime = -1;
      let stuckFrames = 0;
      let frameRequestId: number | null = null;

      const cleanup = () => {
        if (frameRequestId !== null) cancelAnimationFrame(frameRequestId);
        if (isBlobUrl) URL.revokeObjectURL(localVideoUrl);
        if (audioContext) audioContext.close().catch(() => {});
        exportVideo.pause();
        exportVideo.src = "";
        if (exportVideo.parentNode) document.body.removeChild(exportVideo);
        if (label.parentNode) document.body.removeChild(label);
      };

      const startRecording = async () => {
        if (isStarted) return;
        isStarted = true;

        try {
          // Resume audio context if it's suspended (common in browsers)
          if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          // Ensure video is at start
          exportVideo.currentTime = 0;
          await new Promise(r => {
            const onSeeked = () => {
              exportVideo.removeEventListener('seeked', onSeeked);
              r(null);
            };
            exportVideo.addEventListener('seeked', onSeeked);
            setTimeout(onSeeked, 2000);
          });
          
          try {
            await exportVideo.play();
            // Unmute after play starts to ensure audio is captured
            exportVideo.muted = false;
            exportVideo.volume = 1.0;
            // Wait a tiny bit for the video to actually start rendering
            await new Promise(r => setTimeout(r, 100));
          } catch (err) {
            console.warn("Autoplay blocked, will force play in loop:", err);
          }

          const duration = exportVideo.duration || 5;
          const vx = relX * exportScale;
          const vy = relY * exportScale;
          const vw = relW * exportScale;
          const vh = relH * exportScale;
          const radius = 16 * exportScale;

          const renderLoop = () => {
            if (!isExportingRef.current) {
              recorder.stopRecording(() => {
                cleanup();
                resolve();
              });
              return;
            }

            // Progress based on video time
            const progress = Math.min((exportVideo.currentTime / duration) * 100, 100);
            onProgress(progress);

            // Heartbeat: Check if video is stuck
            if (exportVideo.currentTime === lastVideoTime && !exportVideo.paused && !exportVideo.ended) {
              stuckFrames++;
              if (stuckFrames > 30) { // Stuck for ~1s
                console.warn("Video stuck, attempting to kickstart...");
                exportVideo.currentTime += 0.01;
                exportVideo.play().catch(() => {});
                stuckFrames = 0;
              }
            } else {
              stuckFrames = 0;
            }
            lastVideoTime = exportVideo.currentTime;

            // Ensure it's playing if it should be
            if (exportVideo.paused && !exportVideo.ended && exportVideo.currentTime < duration) {
              exportVideo.play().catch(() => {});
            }

            // Draw background
            ctx.drawImage(frameImg, 0, 0, width, height);

            // Draw video
            ctx.save();
            ctx.beginPath();
            if ((ctx as any).roundRect) {
              (ctx as any).roundRect(vx, vy, vw, vh, radius);
            } else {
              ctx.rect(vx, vy, vw, vh);
            }
            ctx.clip();

            if (exportVideo.readyState >= 2) {
              ctx.drawImage(exportVideo, vx, vy, vw, vh);
            } else {
              ctx.fillStyle = '#000';
              ctx.fillRect(vx, vy, vw, vh);
            }
            ctx.restore();

            if (!exportVideo.ended && exportVideo.currentTime < duration) {
              frameRequestId = requestAnimationFrame(renderLoop);
            } else {
              // Finish recording
              recorder.stopRecording(() => {
                const blob = recorder.getBlob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const extension = finalMimeType.includes('mp4') ? 'mp4' : 'webm';
                a.download = `xpic-video-${Date.now()}.${extension}`;
                a.click();
                
                cleanup();
                toast.success("Video exported successfully!", { id: toastId });
                resolve();
              });
            }
          };

          // Start render loop BEFORE recording to ensure stream is active
          renderLoop();
          
          recorder.startRecording();
          toast.loading("Recording high-quality video...", { id: toastId });
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
        setTimeout(() => { if (!isStarted) startRecording(); }, 8000);
      }
    });

  } catch (err) {
    toast.error("Export failed", { id: toastId });
    throw err;
  }
};
