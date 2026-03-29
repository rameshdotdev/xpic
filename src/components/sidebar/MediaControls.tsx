import React from 'react';
import { ImageIcon, Video, Camera, X, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PostData } from '../../types';

interface MediaControlsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  captureVideoFrame: () => void;
  postData: PostData;
  setPostData: (data: PostData) => void;
  isVideoLoading?: boolean;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  fileInputRef,
  videoInputRef,
  handleImageUpload,
  handleVideoUpload,
  captureVideoFrame,
  postData,
  setPostData,
  isVideoLoading = false,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Media</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm font-medium text-sm"
          >
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            Image
          </Button>
          {postData.postImage && (
            <Button 
              variant="outline"
              onClick={() => setPostData({ ...postData, postImage: undefined })}
              className="px-4 py-6 bg-card border-border rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm font-medium text-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            disabled={isVideoLoading}
            className="flex-1 flex items-center justify-center gap-2 py-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm font-medium text-sm disabled:opacity-50"
          >
            {isVideoLoading ? (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            ) : (
              <Video className="w-4 h-4 text-muted-foreground" />
            )}
            {isVideoLoading ? 'Loading...' : 'Video'}
          </Button>
          {postData.postVideo && !isVideoLoading && (
            <Button 
              variant="outline"
              onClick={captureVideoFrame}
              className="px-4 py-6 bg-card border-border rounded-xl hover:bg-primary/10 hover:text-primary transition-colors shadow-sm font-medium text-sm"
              title="Capture current frame as image"
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
          {postData.postVideo && !isVideoLoading && (
            <Button 
              variant="outline"
              onClick={() => setPostData({ ...postData, postVideo: undefined })}
              className="px-4 py-6 bg-card border-border rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm font-medium text-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        <input 
          type="file" 
          ref={videoInputRef} 
          className="hidden" 
          accept="video/*" 
          onChange={handleVideoUpload} 
        />
      </div>
    </div>
  );
};
