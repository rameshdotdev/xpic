import React, { useState, useRef, useEffect } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { toast } from "sonner";
import { PostData, Config } from '../types';
import { DEFAULT_POST, PRESET_BACKGROUNDS } from '../constants';
import { fetchTweetData } from '../lib/tweetApi';
import { exportToVideo } from '../lib/videoExport';

export function useTweetEditor(theme: string | undefined) {
  const [postUrl, setPostUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<PostData>(DEFAULT_POST);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
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
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error("Invalid file format", {
          description: "Please upload a valid video file."
        });
        return;
      }

      // Validate file size (limit to 100MB)
      const MAX_SIZE = 100 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast.error("File too large", {
          description: "Video files must be smaller than 100MB."
        });
        return;
      }

      setIsVideoLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, postVideo: reader.result as string, postImage: undefined });
        setIsVideoLoading(false);
        toast.success("Video uploaded successfully!");
      };
      reader.onerror = () => {
        setIsVideoLoading(false);
        toast.error("Upload failed", {
          description: "There was an error processing your video file."
        });
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
    
    setIsExportingVideo(true);
    isExportingRef.current = true;
    setExportProgress(0);

    try {
      await exportToVideo({
        previewRef,
        videoUrl: postData.postVideo,
        onProgress: setExportProgress,
        isExportingRef,
      });
    } catch (err) {
      console.error('Video export failed:', err);
    } finally {
      setIsExportingVideo(false);
      isExportingRef.current = false;
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
      const newPostData = await fetchTweetData(tweetId);
      setPostData(newPostData);
      setConfig(prev => ({ ...prev, showQuotedPost: !!newPostData.quotedPost }));
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

  return {
    postUrl, setPostUrl,
    isLoading,
    postData, setPostData,
    isExportingVideo, setIsExportingVideo,
    isVideoLoading,
    isExportingRef,
    exportProgress,
    config, setConfig,
    previewRef, cardRef, videoRef,
    fileInputRef, videoInputRef, avatarInputRef, quotedAvatarInputRef, backgroundInputRef,
    handleImageUpload, handleVideoUpload, captureVideoFrame,
    onAvatarFileChange, onAvatarDrop,
    handleQuotedAvatarUpload, handleBackgroundUpload,
    handleDownload, handleDownloadVideo, handleCopy, fetchTweet
  };
}
