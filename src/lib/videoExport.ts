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
    const scale = 2.0; 
    
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
        cacheBust: true,
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
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.crossOrigin = "anonymous";
      
      let isStarted = false;
      let startTime = 0;
      const duration = videoElement.duration || 5; 

      const onReady = async () => {
        if (isStarted) return;
        isStarted = true;
        
        videoElement.oncanplay = null;
        videoElement.oncanplaythrough = null;

        try {
          // Ensure video is at the start and ready
          videoElement.currentTime = 0;
          
          // Wait a bit for the seek to complete
          await new Promise(resolve => setTimeout(resolve, 500));

          await videoElement.play();
          
          // Wait for actual playback to start with a more robust check
          await new Promise((resolve) => {
            let attempts = 0;
            const checkPlaying = () => {
              attempts++;
              // Check if video is actually progressing
              if (videoElement.currentTime > 0 && !videoElement.paused) {
                resolve(true);
              } else if (attempts > 150) { // Increased attempts
                console.warn("Video playback start timed out, proceeding anyway");
                resolve(false);
              } else {
                requestAnimationFrame(checkPlaying);
              }
            };
            checkPlaying();
          });

          if (recorder.state === 'inactive') {
            recorder.start(); 
          }
          
          startTime = Date.now(); 
          toast.loading("Recording video frames...", { id: toastId });
          requestAnimationFrame(drawFrame);
        } catch (err) {
          console.error("Video playback error during export:", err);
          toast.error("Video playback failed. Try interacting with the video first.", { id: toastId });
          reject(err);
        }
      };

      // Ensure video is loaded enough to play
      if (videoElement.readyState >= 3) {
        onReady();
      } else {
        videoElement.oncanplaythrough = onReady;
        videoElement.oncanplay = onReady;
        videoElement.load(); // Force load
        setTimeout(() => { if (!isStarted) onReady(); }, 4000);
      }

      const drawFrame = () => {
        if (!isExportingRef.current) return;

        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min((elapsed / duration) * 100, 100);
        onProgress(progress);
        
        // Sync video time if it drifts too much (> 0.5s)
        const timeDiff = Math.abs(videoElement.currentTime - elapsed);
        if (timeDiff > 0.5 && elapsed < duration) {
          videoElement.currentTime = elapsed;
        }
        
        // Ensure it's playing if it should be
        if (videoElement.paused && !videoElement.ended && elapsed < duration) {
          videoElement.play().catch(() => {});
        }
        
        // Clear and draw static frame
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(frameImg, 0, 0, width, height);
        
        // Draw video frame
        try {
          // Check if video is ready to be drawn
          if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
            ctx.save();
            const vx = relativeX * scale;
            const vy = relativeY * scale;
            const vw = videoRect.width * scale;
            const vh = videoRect.height * scale;
            const radius = 16 * scale; 
            
            // Create rounded clipping path for video
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
            
            // Draw the video frame
            ctx.drawImage(videoElement, vx, vy, vw, vh);
            ctx.restore();
          } else {
            // Fallback: if video isn't ready, draw a black placeholder or the last frame
            ctx.fillStyle = '#000000';
            const vx = relativeX * scale;
            const vy = relativeY * scale;
            const vw = videoRect.width * scale;
            const vh = videoRect.height * scale;
            ctx.fillRect(vx, vy, vw, vh);
          }
        } catch (e) {
          console.error("Error drawing video frame to canvas:", e);
        }

        if (elapsed < duration && !videoElement.ended) {
          requestAnimationFrame(drawFrame);
        } else {
          // Give it a tiny bit more time to finish the last frame
          setTimeout(() => {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
            videoElement.pause();
          }, 300);
        }
      };
    });

  } catch (err) {
    toast.error("Failed to export video", { id: toastId });
    throw err;
  }
};
