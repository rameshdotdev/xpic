/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from './components/theme-provider';
import { DEFAULT_POST } from './constants';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { VideoExportOverlay } from './components/VideoExportOverlay';
import { PreviewArea } from './components/PreviewArea';
import { Toaster } from "@/components/ui/sonner"
import { useTweetEditor } from './hooks/useTweetEditor';

export default function App() {
  const { theme, setTheme } = useTheme();
  const {
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
  } = useTweetEditor(theme);

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
          <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
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
                handleCopy={handleCopy}
                handleDownload={handleDownload}
                handleDownloadVideo={handleDownloadVideo}
                isExportingVideo={isExportingVideo}
                isVideoLoading={isVideoLoading}
                exportProgress={exportProgress}
                DEFAULT_POST={DEFAULT_POST}
                fileInputRef={fileInputRef}
                videoInputRef={videoInputRef}
                backgroundInputRef={backgroundInputRef}
                quotedAvatarInputRef={quotedAvatarInputRef}
                handleQuotedAvatarUpload={handleQuotedAvatarUpload}
              />
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
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
                setConfig={setConfig}
              />
            </div>
          </div>
        </section>
      </LandingPage>
      <Toaster position="bottom-right" />
    </>
  );
}



