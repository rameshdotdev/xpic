import React from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Calendar, Clock, Type, User, AtSign, CheckCircle2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PostData } from '../../types';

interface StatsControlsProps {
  postData: PostData;
  setPostData: (data: PostData) => void;
}

export const StatsControls: React.FC<StatsControlsProps> = ({
  postData,
  setPostData,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Name</label>
          <Input 
            value={postData.name}
            onChange={(e) => setPostData({ ...postData, name: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Handle</label>
          <Input 
            value={postData.handle}
            onChange={(e) => setPostData({ ...postData, handle: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-2 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-medium">Verified Account</span>
        </div>
        <Switch 
          className="scale-75"
          checked={postData.isVerified} 
          onCheckedChange={(val) => setPostData({ ...postData, isVerified: val })} 
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Post Content</label>
        <Textarea 
          value={postData.content}
          onChange={(e) => setPostData({ ...postData, content: e.target.value })}
          className="min-h-[80px] text-xs bg-card border-border rounded-lg resize-none"
          placeholder="What's happening?"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Date</label>
          <Input 
            value={postData.date}
            onChange={(e) => setPostData({ ...postData, date: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Time</label>
          <Input 
            value={postData.time}
            onChange={(e) => setPostData({ ...postData, time: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Replies</label>
          <Input 
            value={postData.replies}
            onChange={(e) => setPostData({ ...postData, replies: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Retweets</label>
          <Input 
            value={postData.retweets}
            onChange={(e) => setPostData({ ...postData, retweets: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Likes</label>
          <Input 
            value={postData.likes}
            onChange={(e) => setPostData({ ...postData, likes: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Bookmarks</label>
          <Input 
            value={postData.bookmarks}
            onChange={(e) => setPostData({ ...postData, bookmarks: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Views</label>
          <Input 
            value={postData.views}
            onChange={(e) => setPostData({ ...postData, views: e.target.value })}
            className="h-8 text-xs bg-card border-border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
