/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  Share2, 
  Coffee, 
  Moon, 
  Sun, 
  Maximize2, 
  CheckCircle2, 
  MessageCircle, 
  Repeat2, 
  Heart, 
  BarChart3,
  Link as LinkIcon,
  X,
  Palette,
  Layout,
  Type,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Camera,
  Video,
  Eye,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Github,
  Twitter,
  Instagram,
  Layers,
  Smartphone,
  Monitor,
  Settings2,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  MoreHorizontal,
  LogOut,
  Home,
  Loader2
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { useTheme } from './components/theme-provider';

import { PostData, Config, AspectRatio, ExportFormat } from './types';
import { PRESET_BACKGROUNDS, DEFAULT_POST, ASPECT_RATIOS, renderContent } from './constants';
import { ThemeToggle } from './components/ThemeToggle';
import { TweetCard } from './components/TweetCard';
import { XLogo, StatItem } from './components/tweet/TweetComponents';
import { Sidebar, Toggle } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { VideoExportOverlay } from './components/VideoExportOverlay';
import { PreviewArea } from './components/PreviewArea';

// shadcn components
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// --- App ---

export default function App() {
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<'landing' | 'generator'>('landing');
  const [postUrl, setPostUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<PostData>(DEFAULT_POST);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const isExportingRef = useRef(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [config, setConfig] = useState<Config>({
    background: PRESET_BACKGROUNDS[0],
    customBackground: undefined,
    isDarkMode: true,
    aspectRatio: '1:1',
    showIcon: true,
    showUsername: true,
    showVerified: true,
    showDateTime: true,
    showResponses: true,
    padding: 64,
    rounded: 24,
    exportFormat: 'png',
    showQuotedPost: false,
    customWidth: 600,
    customHeight: 600,
    showBackground: true,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const quotedAvatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Update config isDarkMode based on theme
  useEffect(() => {
    if (theme === 'dark') {
      setConfig(prev => ({ ...prev, isDarkMode: true }));
    } else if (theme === 'light') {
      setConfig(prev => ({ ...prev, isDarkMode: false }));
    } else {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setConfig(prev => ({ ...prev, isDarkMode: isSystemDark }));
    }
  }, [theme]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, postImage: reader.result as string, postVideo: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, postVideo: reader.result as string, postImage: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const captureVideoFrame = () => {
    const video = document.querySelector('video');
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPostData({ ...postData, postImage: dataUrl, postVideo: undefined });
        toast.success("Frame captured! You can now export it as an image.");
      }
    }
  };

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostData({ ...postData, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const onAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarUpload(file);
  };

  const onAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleAvatarUpload(file);
    }
  };

  const handleQuotedAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && postData.quotedPost) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({
          ...postData,
          quotedPost: { ...postData.quotedPost!, avatar: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, customBackground: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    const targetRef = config.showBackground ? previewRef : cardRef;
    if (!targetRef.current) return;
    
    const toastId = toast.loading(`Exporting as ${config.exportFormat.toUpperCase()}...`);
    try {
      let dataUrl: string;
      const options = { cacheBust: true, pixelRatio: 2 };
      
      switch (config.exportFormat) {
        case 'jpg':
          dataUrl = await toJpeg(targetRef.current, options);
          break;
        default:
          dataUrl = await toPng(targetRef.current, options);
      }
      
      const link = document.createElement('a');
      link.download = `xpic-${Date.now()}.${config.exportFormat}`;
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded!", { id: toastId });
    } catch (err) {
      console.error('Failed to download image', err);
      toast.error("Export failed", { id: toastId });
    }
  };

  const handleDownloadVideo = async () => {
    if (!previewRef.current || !postData.postVideo) return;
    
    const videoElement = previewRef.current.querySelector('video');
    if (!videoElement) {
      console.error("Video element not found in previewRef");
      return;
    }
    console.log(`Video element found in preview. Src: ${videoElement.src.substring(0, 50)}...`);

    setIsExportingVideo(true);
    isExportingRef.current = true;
    setExportProgress(0);
    const toastId = toast.loading("Preparing video export...");

    try {
      // 1. Get dimensions
      const rect = previewRef.current.getBoundingClientRect();
      const videoRect = videoElement.getBoundingClientRect();
      console.log(`Preview rect: ${rect.width}x${rect.height}, Video rect: ${videoRect.width}x${videoRect.height}`);
      
      // Calculate relative position of video
      const relativeX = (videoRect.left - rect.left);
      const relativeY = (videoRect.top - rect.top);
      const scale = 1.2; // Lower scale to 1.2x for maximum stability
      
      const width = Math.floor(rect.width * scale);
      const height = Math.floor(rect.height * scale);

      // 2. Capture static frame (everything except the video)
      console.log("Capturing static frame...");
      
      // Use a timeout for toPng as it can hang on some browsers/extensions
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
      if (frameDataUrl) {
        console.log(`Static frame captured. Size: ${Math.round(frameDataUrl.length / 1024)} KB`);
      }
      
      const frameImg = new window.Image();
      frameImg.src = frameDataUrl;
      await new Promise(resolve => frameImg.onload = resolve);

      // 3. Setup Canvas and Recorder
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      console.log(`Canvas dimensions: ${width}x${height}`);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      const stream = canvas.captureStream(30); // 30 FPS
      console.log(`Stream captured. Tracks: ${stream.getTracks().length}`);
      
      // Add audio track if available
      try {
        if ((videoElement as any).captureStream) {
          const videoStream = (videoElement as any).captureStream();
          const audioTracks = videoStream.getAudioTracks();
          if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
            console.log("Audio track added to stream.");
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
      console.log("Using mimeType:", mimeType);

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000 // 8Mbps for higher quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          if (chunks.length % 10 === 0) {
            console.log(`Recorded ${chunks.length} chunks...`);
          }
        }
      };
      
      // 4. Recording Loop
      return new Promise<void>((resolve, reject) => {
        recorder.onstop = () => {
          console.log(`Recorder stopped. Chunks: ${chunks.length}`);
          if (chunks.length === 0) {
            toast.error("No video data recorded", { id: toastId });
            setIsExportingVideo(false);
            return;
          }
          const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          link.download = `xpic-video-${Date.now()}.${extension}`;
          link.href = url;
          link.click();
          setIsExportingVideo(false);
          isExportingRef.current = false;
          toast.success("Video exported!", { id: toastId });
          resolve();
        };

        recorder.onerror = (e) => {
          console.error("MediaRecorder error:", e);
          setIsExportingVideo(false);
          isExportingRef.current = false;
          toast.error("Video export failed", { id: toastId });
          reject(e);
        };

        // Start from beginning
        videoElement.currentTime = 0;
        
        // Wait for video to be ready at 0
        let isStarted = false;
        let startTime = Date.now();
        const duration = videoElement.duration || 5; 
        const fps = 30;
        const frameTime = 1000 / fps;

        const onReady = async () => {
          if (isStarted) return;
          isStarted = true;
          videoElement.oncanplay = null;
          videoElement.oncanplaythrough = null;

          try {
            console.log(`Video ready. State: ${videoElement.readyState}, Size: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
            
            videoElement.muted = true; 
            videoElement.playsInline = true;
            
            // Wait for the video to actually start playing visually
            const playPromise = videoElement.play();
            
            await new Promise((resolve) => {
              const checkPlaying = () => {
                if (videoElement.currentTime > 0 && !videoElement.paused) {
                  resolve(true);
                } else {
                  requestAnimationFrame(checkPlaying);
                }
              };
              checkPlaying();
              // Timeout after 3s
              setTimeout(resolve, 3000);
            });

            console.log("Video playback confirmed. Starting recorder.");

            if (recorder.state === 'inactive') {
              recorder.start(); 
            }
            
            startTime = Date.now(); 
            toast.loading("Recording video frames...", { id: toastId });
            drawFrame();
          } catch (err) {
            console.error("Failed to start video playback:", err);
            setIsExportingVideo(false);
            isExportingRef.current = false;
            toast.error("Playback blocked. Please interact with the page.", { id: toastId });
            reject(err);
          }
        };

        if (videoElement.readyState >= 3) {
          onReady();
        } else {
          videoElement.oncanplaythrough = onReady;
          videoElement.oncanplay = onReady;
          // Fallback if events don't fire
          setTimeout(() => { if (!isStarted) onReady(); }, 5000);
        }

        console.log(`Video duration: ${duration}s, ReadyState: ${videoElement.readyState}`);

        const drawFrame = () => {
          if (!isExportingRef.current) {
            console.log("Export stopped by user or error.");
            return;
          }

          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min((elapsed / duration) * 100, 100);
          setExportProgress(progress);
          
          // Force video to sync with elapsed time for frame-perfect export
          // But only if it's significantly out of sync to avoid stuttering
          const timeDiff = Math.abs(videoElement.currentTime - elapsed);
          if (timeDiff > 0.3) {
            videoElement.currentTime = elapsed;
          }
          
          if (videoElement.paused && !videoElement.ended && elapsed < duration) {
            videoElement.play().catch(() => {});
          }
          
          if (Math.floor(elapsed * 2) % 2 === 0) {
            // Log every 0.5s
            console.log(`Export: ${Math.round(progress)}%, VideoTime: ${videoElement.currentTime.toFixed(2)}s, Ready: ${videoElement.readyState}`);
          }

          // 1. Clear canvas
          ctx.clearRect(0, 0, width, height);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // 2. Draw background frame
          ctx.drawImage(frameImg, 0, 0, width, height);
          
          // 3. Draw current video frame
          try {
            if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
              ctx.save();
              
              const vx = relativeX * scale;
              const vy = relativeY * scale;
              const vw = videoRect.width * scale;
              const vh = videoRect.height * scale;
              const radius = 16 * scale; // rounded-2xl is 16px
              
              // Create rounded rectangle path for clipping
              ctx.beginPath();
              if ((ctx as any).roundRect) {
                (ctx as any).roundRect(vx, vy, vw, vh, radius);
              } else {
                // Fallback for older browsers
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
              
              if (Math.floor(elapsed * 2) % 2 === 0) {
                console.log(`Frame drawn at ${videoElement.currentTime.toFixed(2)}s. Video size: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
              }
            } else if (Math.floor(elapsed * 2) % 2 === 0) {
              console.warn(`Frame SKIPPED at ${videoElement.currentTime.toFixed(2)}s. ReadyState: ${videoElement.readyState}, VideoWidth: ${videoElement.videoWidth}`);
            }
          } catch (e) {
            console.error("Error drawing video frame:", e);
          }

          if (elapsed < duration && !videoElement.ended) {
            requestAnimationFrame(drawFrame);
          } else {
            console.log(`Recording finished. Ended: ${videoElement.ended}, Elapsed: ${elapsed.toFixed(2)}s`);
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
            videoElement.pause();
          }
        };
      });

    } catch (err) {
      console.error('Video export failed:', err);
      toast.error("Failed to export video", { id: toastId });
      setIsExportingVideo(false);
    }
  };

  const handleCopy = async () => {
    const targetRef = config.showBackground ? previewRef : cardRef;
    if (!targetRef.current) return;
    try {
      const dataUrl = await toPng(targetRef.current, { cacheBust: true, pixelRatio: 2 });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy image', err);
      toast.error('Failed to copy image');
    }
  };

  const fetchTweet = async () => {
    if (!postUrl) return;
    
    const tweetId = postUrl.match(/\/status\/(\d+)/)?.[1];
    if (!tweetId) {
      toast.error("Please enter a valid X/Twitter post URL");
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`;
      
      const res = await fetch(url).catch((error) => {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to connect to the tweet API: ${msg}. This might be due to a network issue or CORS restrictions in your browser.`);
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Tweet not found. It might be private, deleted, or the ID is incorrect.');
        }
        if (res.status === 403) {
          throw new Error('This tweet is private or restricted. The syndication API cannot access it.');
        }
        throw new Error(`Failed to fetch tweet (Status: ${res.status}). The API might be temporarily unavailable.`);
      }

      const data = await res.json().catch(() => {
        throw new Error('Failed to parse tweet data. The API response might be malformed.');
      });

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Received invalid data from the tweet API.');
      }

      const user = data.user;
      if (!user || typeof user !== 'object' || Array.isArray(user)) {
        console.error('API Response missing user object:', data);
        throw new Error('Tweet data is incomplete (missing user information). This usually happens with private or restricted posts.');
      }

      const dateObj = new Date(data.created_at || Date.now());
      const formattedDate = isNaN(dateObj.getTime()) 
        ? 'Unknown Date' 
        : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      
      const formattedTime = isNaN(dateObj.getTime())
        ? 'Unknown Time'
        : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      const newPostData: PostData = {
        name: user.name || user.screen_name || 'Unknown User',
        handle: user.screen_name || 'unknown',
        avatar: user.profile_image_url_https 
          ? user.profile_image_url_https.replace('_normal', '') 
          : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
        content: data.text || data.full_text || '',
        date: formattedDate,
        time: formattedTime,
        views: '1.2M', 
        replies: (data.reply_count || 0).toLocaleString(),
        retweets: (data.retweet_count || 0).toLocaleString(),
        likes: (data.favorite_count || 0).toLocaleString(),
        bookmarks: (data.bookmark_count || 0).toLocaleString(),
        isVerified: !!user.verified,
        postImage: data.mediaDetails?.[0]?.media_url_https,
      };

      if (data.quoted_tweet && 
          typeof data.quoted_tweet === 'object' && 
          !Array.isArray(data.quoted_tweet) && 
          data.quoted_tweet.user && 
          typeof data.quoted_tweet.user === 'object' && 
          !Array.isArray(data.quoted_tweet.user)) {
        const qUser = data.quoted_tweet.user;
        const qDateObj = new Date(data.quoted_tweet.created_at || Date.now());
        newPostData.quotedPost = {
          name: qUser.name || qUser.screen_name || 'Unknown User',
          handle: qUser.screen_name || 'unknown',
          avatar: qUser.profile_image_url_https 
            ? qUser.profile_image_url_https.replace('_normal', '') 
            : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
          content: data.quoted_tweet.text || data.quoted_tweet.full_text || '',
          date: isNaN(qDateObj.getTime()) ? 'Unknown Date' : qDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          isVerified: !!qUser.verified,
        };
        setConfig(prev => ({ ...prev, showQuotedPost: true }));
      } else {
        setConfig(prev => ({ ...prev, showQuotedPost: false }));
      }

      setPostData(newPostData);
      toast.success('Post fetched successfully!');
    } catch (err) {
      console.error('Error fetching tweet:', err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while fetching the tweet.";
      toast.error(errorMessage, {
        description: "Possible reasons: Private/deleted post, age-restricted content, AdBlockers, or CORS restrictions.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <VideoExportOverlay 
        isExportingVideo={isExportingVideo}
        exportProgress={exportProgress}
        onStop={() => {
          setIsExportingVideo(false);
          isExportingRef.current = false;
        }}
      />

      <LandingPage onStart={() => document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })}>
        <section id="editor" className="bg-muted/30 border-y border-border scroll-mt-16">
          <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
            <Sidebar 
              postUrl={postUrl}
              setPostUrl={setPostUrl}
              fetchTweet={fetchTweet}
              isLoading={isLoading}
              config={config}
              setConfig={setConfig}
              setTheme={setTheme}
              postData={postData}
              setPostData={setPostData}
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              captureVideoFrame={captureVideoFrame}
              handleBackgroundUpload={handleBackgroundUpload}
              handleExport={handleDownload}
              handleExportVideo={handleDownloadVideo}
              handleCopy={handleCopy}
              isExportingVideo={isExportingVideo}
              exportProgress={exportProgress}
              DEFAULT_POST={DEFAULT_POST}
              fileInputRef={fileInputRef}
              videoInputRef={videoInputRef}
              backgroundInputRef={backgroundInputRef}
              quotedAvatarInputRef={quotedAvatarInputRef}
              handleQuotedAvatarUpload={handleQuotedAvatarUpload}
            />

            <PreviewArea 
              previewRef={previewRef}
              cardRef={cardRef}
              videoRef={videoRef}
              avatarInputRef={avatarInputRef}
              onAvatarFileChange={onAvatarFileChange}
              onAvatarDrop={onAvatarDrop}
              postData={postData}
              setPostData={setPostData}
              config={config}
            />
          </div>
        </section>
      </LandingPage>
      <Toaster position="bottom-right" />
    </>
  );
}



