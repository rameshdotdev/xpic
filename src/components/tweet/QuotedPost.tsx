import React from 'react';
import { cn } from '../../lib/utils';
import { PostData, Config } from '../../types';
import { VerifiedBadge } from './TweetComponents';

interface QuotedPostProps {
  postData: PostData;
  config: Config;
}

export const QuotedPost: React.FC<QuotedPostProps> = ({
  postData,
  config,
}) => {
  if (!config.showQuotedPost || !postData.quotedPost) return null;

  return (
    <div className={cn(
      "mt-3 rounded-2xl border p-3 space-y-1",
      config.isDarkMode ? "border-white/20" : "border-border/50"
    )}>
      <div className="flex items-center gap-1.5">
        <img 
          src={postData.quotedPost.avatar} 
          alt={postData.quotedPost.name}
          className="w-5 h-5 rounded-full object-cover"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <span className={cn("text-[15px] font-bold", config.isDarkMode ? "text-white" : "text-black")}>
          {postData.quotedPost.name}
        </span>
        {postData.quotedPost.isVerified && (
          <VerifiedBadge className="w-4 h-4" />
        )}
        <span className="text-[#536471] text-[15px]">@{postData.quotedPost.handle}</span>
        <span className="text-[#536471] text-[15px]">·</span>
        <span className="text-[#536471] text-[15px]">{postData.quotedPost.date}</span>
      </div>
      <p className={cn(
        "text-[15px] leading-normal",
        config.isDarkMode ? "text-white" : "text-black"
      )}>
        {postData.quotedPost.content}
      </p>
    </div>
  );
};
