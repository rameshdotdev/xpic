import React from 'react';
import { cn } from '../../lib/utils';
import { PostData, Config } from '../../types';
import { VerifiedBadge } from './TweetComponents';
import { renderTweetText } from '../../lib/textUtils';

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
      "mt-3 rounded-2xl border p-3 space-y-1.5",
      config.isDarkMode ? "border-white/20" : "border-border/60"
    )}>
      <div className="flex items-center gap-1.5 text-[14px]">
        <img 
          src={postData.quotedPost.avatar} 
          alt={postData.quotedPost.name}
          className="w-5 h-5 rounded-full object-cover shrink-0"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <span className={cn("font-bold truncate max-w-[140px]", config.isDarkMode ? "text-white" : "text-black")}>
          {postData.quotedPost.name}
        </span>
        {postData.quotedPost.isVerified && (
          <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="text-[#536471] truncate">@{postData.quotedPost.handle}</span>
        <span className="text-[#536471]">·</span>
        <span className="text-[#536471] shrink-0">{postData.quotedPost.date}</span>
      </div>
      <p className={cn(
        "text-[14px] leading-relaxed break-words",
        config.isDarkMode ? "text-white" : "text-black"
      )}>
        {renderTweetText(postData.quotedPost.content)}
      </p>
    </div>
  );
};
