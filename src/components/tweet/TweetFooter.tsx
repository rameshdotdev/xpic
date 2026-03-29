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
  return (
    <div className="space-y-4">
      {config.showDateTime && (
        <div className="flex items-center gap-1.5 text-[#536471] text-[15px] py-1">
          <span>{postData.time}</span>
          <span>·</span>
          <span>{postData.date}</span>
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
        </div>
      )}

      {config.showResponses && (
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[#536471]">
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-blue-500 transition-colors">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle className="w-[18.75px] h-[18.75px]" />
            </div>
            <span className="text-[13px]">{postData.replies}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-green-500 transition-colors">
            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat2 className="w-[18.75px] h-[18.75px]" />
            </div>
            <span className="text-[13px]">{postData.retweets}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-pink-500 transition-colors">
            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
              <Heart className="w-[18.75px] h-[18.75px]" />
            </div>
            <span className="text-[13px]">{postData.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-blue-500 transition-colors">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <BarChart2 className="w-[18.75px] h-[18.75px]" />
            </div>
            <span className="text-[13px]">{postData.bookmarks}</span>
          </div>
          <div className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer">
            <Share className="w-[18.75px] h-[18.75px]" />
          </div>
        </div>
      )}
    </div>
  );
};
