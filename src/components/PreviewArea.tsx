import React from 'react';
import { cn } from '../lib/utils';
import { TweetCard } from './TweetCard';
import { PostData, Config } from '../types';

interface PreviewAreaProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarDrop: (e: React.DragEvent) => void;
  postData: PostData;
  setPostData: (data: PostData) => void;
  config: Config;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  previewRef,
  cardRef,
  videoRef,
  avatarInputRef,
  onAvatarFileChange,
  onAvatarDrop,
  postData,
  setPostData,
  config,
}) => {
  return (
    <main className="flex flex-col items-center gap-8">
      <div 
        ref={previewRef}
        className={cn(
          "relative overflow-hidden transition-all duration-500",
          config.showBackground ? "shadow-2xl" : ""
        )}
        style={{
          width: config.showBackground ? (config.aspectRatio === 'custom' ? `${config.customWidth}px` : '100%') : 'auto',
          height: config.showBackground ? (config.aspectRatio === 'custom' ? `${config.customHeight}px` : 'auto') : 'auto',
          aspectRatio: (config.showBackground && config.aspectRatio !== 'custom') ? config.aspectRatio.replace(':', '/') : 'auto',
          background: config.showBackground ? (config.customBackground ? `url(${config.customBackground}) center/cover no-repeat` : config.background) : 'transparent',
          padding: config.showBackground ? `${config.padding}px` : '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: config.showBackground ? '32px' : '0',
        }}
      >
        <TweetCard 
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

      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium bg-card px-4 py-2 rounded-full border border-border shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Preview
        </div>
        <div className="w-px h-3 bg-border" />
        <span>Auto-saves changes</span>
      </div>
    </main>
  );
};
