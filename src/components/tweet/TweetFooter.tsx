import React from 'react';
import { Heart, MessageCircle, Repeat2, Share, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PostData, Config } from '../../types';

interface TweetFooterProps {
  postData: PostData;
  config: Config;
}

export const TweetFooter: React.FC<TweetFooterProps> = ({
  postData,
  config,
}) => {
  if (!config.showDateTime && !config.showResponses) return null;

  return (
    <div className="mt-3.5 space-y-3">
      {config.showDateTime && (
        <div className="flex items-center gap-1.5 text-[#536471] text-[15px] leading-5">
          <span>{postData.time}</span>
          <span>·</span>
          <span>{postData.date}</span>
          {postData.views && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "font-bold",
                  config.isDarkMode ? "text-white" : "text-black"
                )}>
                  {postData.views}
                </span>
                <span>Views</span>
              </div>
            </>
          )}
        </div>
      )}

      {config.showResponses && (
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[#536471]">
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-blue-500 transition-colors">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-medium leading-none">{postData.replies}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-green-500 transition-colors">
            <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat2 className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-medium leading-none">{postData.retweets}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-pink-500 transition-colors">
            <div className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
              <Heart className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-medium leading-none">{postData.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-blue-500 transition-colors">
            <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <BarChart2 className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-medium leading-none">{postData.bookmarks}</span>
          </div>
          <div className="p-1.5 -mr-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer">
            <Share className="w-[18px] h-[18px]" />
          </div>
        </div>
      )}
    </div>
  );
};
