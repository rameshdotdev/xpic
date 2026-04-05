import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { PostData, Config } from "../../types";

interface TweetHeaderProps {
  postData: PostData;
  setPostData: (data: PostData) => void;
  config: Config;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarDrop: (e: React.DragEvent) => void;
}

import { VerifiedBadge, XLogo } from "./TweetComponents";

export const TweetHeader: React.FC<TweetHeaderProps> = ({
  postData,
  setPostData,
  config,
  avatarInputRef,
  onAvatarFileChange,
  onAvatarDrop,
}) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div
          className="relative group cursor-pointer"
          onClick={() => avatarInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onAvatarDrop}
        >
          <img
            src={postData.avatar}
            alt={postData.name}
            className="w-12 h-12 rounded-full object-cover border border-border/50"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] text-white font-bold uppercase">
              Edit
            </span>
          </div>
          <input
            type="file"
            ref={avatarInputRef}
            className="hidden"
            accept="image/*"
            onChange={onAvatarFileChange}
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <input
              className={cn(
                "font-bold text-[15px] bg-transparent border-none p-0 focus:ring-0 truncate",
                config.isDarkMode ? "text-white" : "text-black",
              )}
              style={{
                width: `${(postData.name || "").length - 1}ch`,
                minWidth: "2ch",
                maxWidth: "100%",
              }}
              value={postData.name}
              onChange={(e) =>
                setPostData({ ...postData, name: e.target.value })
              }
              placeholder="Name"
            />
            {config.showVerified && postData.isVerified && (
              <VerifiedBadge className="shrink-0" />
            )}
          </div>
          {config.showUsername && (
            <div className="flex items-center text-[#536471] text-[15px] w-full">
              <span className="shrink-0">@</span>
              <input
                className="bg-transparent border-none p-0 focus:ring-0 text-[#536471] truncate"
                style={{
                  width: `${(postData.handle || "").length + 1}ch`,
                  minWidth: "2ch",
                  maxWidth: "100%",
                }}
                value={postData.handle}
                onChange={(e) =>
                  setPostData({ ...postData, handle: e.target.value })
                }
                placeholder="handle"
              />
            </div>
          )}
        </div>
      </div>
      {config.showIcon && (
        <XLogo
          className={cn(
            "w-6 h-6",
            config.isDarkMode ? "text-white" : "text-black",
          )}
        />
      )}
    </div>
  );
};
