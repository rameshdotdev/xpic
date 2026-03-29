import React from 'react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface VideoExportOptions {
  previewRef: React.RefObject<HTMLDivElement | null>;
  videoUrl: string;
  onProgress: (progress: number) => void;
  isExportingRef: React.MutableRefObject<boolean>;
}

export const exportToVideo = async ({
  previewRef,
  videoUrl,
  onProgress,
  isExportingRef,
}: VideoExportOptions): Promise<void> => {
  if (!previewRef.current || !videoUrl) return;
  
  const videoElement = previewRef.current.querySelector('video');
  if (!videoElement) {
    throw new Error("Video element not found in preview");
  }

  const toastId = toast.loading("Preparing video export...");

  try {
    // 1. Get dimensions
    const rect = previewRef.current.getBoundingClientRect();
    const videoRect = videoElement.getBoundingClientRect();
    
    // Calculate relative position of video
    const relativeX = (videoRect.left - rect.left);
    const relativeY = (videoRect.top - rect.top);
    const scale = 1.2; 
    
    const width = Math.floor(rect.width * scale);
    const height = Math.floor(rect.height * scale);

    // 2. Capture static frame (everything except the video)
    const captureFrame = async () => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Capture timed out")), 15000)
      );
      
      const capturePromise = toPng(previewRef.current!, { 
        pixelRatio: scale,
        filter: (node: any) => {
          if (node.tagName === 'VIDEO') return false;
          return true;
        },
        skipFonts: true,
      });

      return Promise.race([capturePromise, timeoutPromise]) as Promise<string>;
    };

    const frameDataUrl = await captureFrame();
    const frameImg = new window.Image();
    frameImg.src = frameDataUrl;
    await new Promise(resolve => frameImg.onload = resolve);

    // 3. Setup Canvas and Recorder
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");

    const stream = canvas.captureStream(30); 
    
    // Add audio track if available
    try {
      if ((videoElement as any).captureStream) {
        const videoStream = (videoElement as any).captureStream();
        const audioTracks = videoStream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }
      }
    } catch (e) {
      console.warn("Could not capture audio track:", e);
    }

    const supportedMimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];
    
    let mimeType = supportedMimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';

    const recorder = new MediaRecorder(stream, {
      mimeType: mimeType,
      videoBitsPerSecond: 8000000 
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    // 4. Recording Loop
    return new Promise<void>((resolve, reject) => {
      recorder.onstop = () => {
        if (chunks.length === 0) {
          toast.error("No video data recorded", { id: toastId });
          reject(new Error("No video data recorded"));
          return;
        }
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        link.download = `xpic-video-${Date.now()}.${extension}`;
        link.href = url;
        link.click();
        toast.success("Video exported!", { id: toastId });
        resolve();
      };

      recorder.onerror = (e) => {
        toast.error("Video export failed", { id: toastId });
        reject(e);
      };

      // Start from beginning
      videoElement.currentTime = 0;
      
      let isStarted = false;
      let startTime = Date.now();
      const duration = videoElement.duration || 5; 

      const onReady = async () => {
        if (isStarted) return;
        isStarted = true;
        videoElement.oncanplay = null;
        videoElement.oncanplaythrough = null;

        try {
          videoElement.muted = true; 
          videoElement.playsInline = true;
          
          await videoElement.play();
          
          await new Promise((resolve) => {
            const checkPlaying = () => {
              if (videoElement.currentTime > 0 && !videoElement.paused) {
                resolve(true);
              } else {
                requestAnimationFrame(checkPlaying);
              }
            };
            checkPlaying();
            setTimeout(resolve, 3000);
          });

          if (recorder.state === 'inactive') {
            recorder.start(); 
          }
          
          startTime = Date.now(); 
          toast.loading("Recording video frames...", { id: toastId });
          drawFrame();
        } catch (err) {
          toast.error("Playback blocked. Please interact with the page.", { id: toastId });
          reject(err);
        }
      };

      if (videoElement.readyState >= 3) {
        onReady();
      } else {
        videoElement.oncanplaythrough = onReady;
        videoElement.oncanplay = onReady;
        setTimeout(() => { if (!isStarted) onReady(); }, 5000);
      }

      const drawFrame = () => {
        if (!isExportingRef.current) return;

        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min((elapsed / duration) * 100, 100);
        onProgress(progress);
        
        const timeDiff = Math.abs(videoElement.currentTime - elapsed);
        if (timeDiff > 0.3) {
          videoElement.currentTime = elapsed;
        }
        
        if (videoElement.paused && !videoElement.ended && elapsed < duration) {
          videoElement.play().catch(() => {});
        }
        
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(frameImg, 0, 0, width, height);
        
        try {
          if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
            ctx.save();
            const vx = relativeX * scale;
            const vy = relativeY * scale;
            const vw = videoRect.width * scale;
            const vh = videoRect.height * scale;
            const radius = 16 * scale; 
            
            ctx.beginPath();
            if ((ctx as any).roundRect) {
              (ctx as any).roundRect(vx, vy, vw, vh, radius);
            } else {
              ctx.moveTo(vx + radius, vy);
              ctx.arcTo(vx + vw, vy, vx + vw, vy + vh, radius);
              ctx.arcTo(vx + vw, vy + vh, vx, vy + vh, radius);
              ctx.arcTo(vx, vy + vh, vx, vy, radius);
              ctx.arcTo(vx, vy, vx + vw, vy, radius);
              ctx.closePath();
            }
            ctx.clip();
            ctx.drawImage(videoElement, vx, vy, vw, vh);
            ctx.restore();
          }
        } catch (e) {
          console.error("Error drawing video frame:", e);
        }

        if (elapsed < duration && !videoElement.ended) {
          requestAnimationFrame(drawFrame);
        } else {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
          videoElement.pause();
        }
      };
    });

  } catch (err) {
    toast.error("Failed to export video", { id: toastId });
    throw err;
  }
};
