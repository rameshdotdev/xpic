import React from 'react';
import { cn } from '../../lib/utils';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PostData, Config } from '../../types';

interface QuotedPostControlsProps {
  postData: PostData;
  setPostData: (data: PostData) => void;
  quotedAvatarInputRef: React.RefObject<HTMLInputElement | null>;
  handleQuotedAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  config: Config;
}

export const QuotedPostControls: React.FC<QuotedPostControlsProps> = ({
  postData,
  setPostData,
  quotedAvatarInputRef,
  handleQuotedAvatarUpload,
  config,
}) => {
  if (!postData.quotedPost) return null;

  return (
    <div className={cn(
      "space-y-4 p-4 border rounded-xl transition-colors duration-300",
      config.isDarkMode ? "bg-[#15202B] border-white/10" : "bg-white border-[#EFF3F4]"
    )}>
      <h2 className={cn(
        "text-xs font-bold uppercase tracking-widest",
        config.isDarkMode ? "text-white/60" : "text-[#536471]"
      )}>Quoted Post</h2>
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Name"
          className={cn(
            "w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-colors",
            config.isDarkMode ? "bg-black/20 border-white/10 text-white placeholder:text-white/30" : "bg-white border-[#EFF3F4] text-black"
          )}
          value={postData.quotedPost.name}
          onChange={(e) => setPostData({
            ...postData,
            quotedPost: { ...postData.quotedPost!, name: e.target.value }
          })}
        />
        <input 
          type="text" 
          placeholder="Handle"
          className={cn(
            "w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-colors",
            config.isDarkMode ? "bg-black/20 border-white/10 text-white placeholder:text-white/30" : "bg-white border-[#EFF3F4] text-black"
          )}
          value={postData.quotedPost.handle}
          onChange={(e) => setPostData({
            ...postData,
            quotedPost: { ...postData.quotedPost!, handle: e.target.value }
          })}
        />
        <input 
          type="text" 
          placeholder="Date"
          className={cn(
            "w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-colors",
            config.isDarkMode ? "bg-black/20 border-white/10 text-white placeholder:text-white/30" : "bg-white border-[#EFF3F4] text-black"
          )}
          value={postData.quotedPost.date}
          onChange={(e) => setPostData({
            ...postData,
            quotedPost: { ...postData.quotedPost!, date: e.target.value }
          })}
        />
        <div className="flex items-center justify-between px-1">
          <span className={cn(
            "text-xs font-medium",
            config.isDarkMode ? "text-white/60" : "text-[#536471]"
          )}>Avatar</span>
          <button 
            onClick={() => quotedAvatarInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600"
          >
            Change
          </button>
          <input 
            type="file" 
            ref={quotedAvatarInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleQuotedAvatarUpload} 
          />
        </div>
        <div className="flex items-center justify-between px-1">
          <span className={cn(
            "text-xs font-medium",
            config.isDarkMode ? "text-white/60" : "text-muted-foreground"
          )}>Verified</span>
          <Switch 
            checked={postData.quotedPost.isVerified} 
            onCheckedChange={(val) => setPostData({
              ...postData,
              quotedPost: { ...postData.quotedPost!, isVerified: val }
            })} 
          />
        </div>
        <Textarea 
          placeholder="Content"
          className={cn(
            "w-full px-4 py-3 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 resize-none transition-colors",
            config.isDarkMode ? "bg-black/20 border-white/10 text-white placeholder:text-white/30" : "bg-white border-[#EFF3F4] text-black"
          )}
          rows={3}
          value={postData.quotedPost.content}
          onChange={(e) => setPostData({
            ...postData,
            quotedPost: { ...postData.quotedPost!, content: e.target.value }
          })}
        />
      </div>
    </div>
  );
};
