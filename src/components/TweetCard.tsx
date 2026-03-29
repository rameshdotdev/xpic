import React from 'react';
import { motion } from 'motion/react';
import { Palette } from 'lucide-react';
import { cn } from '../lib/utils';
import { PostData, Config } from '../types';
import { renderContent, ASPECT_RATIOS } from '../constants';

import { TweetHeader } from './tweet/TweetHeader';
import { TweetContent } from './tweet/TweetContent';
import { TweetFooter } from './tweet/TweetFooter';
import { QuotedPost } from './tweet/QuotedPost';

interface TweetCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarDrop: (e: React.DragEvent) => void;
  postData: PostData;
  setPostData: (data: PostData) => void;
  config: Config;
}

export const TweetCard: React.FC<TweetCardProps> = ({
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
    <motion.div 
      ref={cardRef}
      layout
      className={cn(
        "w-full max-w-[500px] p-6 shadow-2xl transition-colors duration-300 overflow-hidden",
        config.isDarkMode ? "bg-[#000000] text-white" : "bg-white text-[#0F1419]"
      )}
      style={{ borderRadius: `${config.rounded}px` }}
    >
      <TweetHeader 
        postData={postData}
        setPostData={setPostData}
        config={config}
        avatarInputRef={avatarInputRef}
        onAvatarFileChange={onAvatarFileChange}
        onAvatarDrop={onAvatarDrop}
      />

      <TweetContent 
        postData={postData}
        setPostData={setPostData}
        config={config}
        videoRef={videoRef}
      />

      <QuotedPost 
        postData={postData}
        config={config}
      />

      <TweetFooter 
        postData={postData}
        setPostData={setPostData}
        config={config}
      />
    </motion.div>
  );
};
