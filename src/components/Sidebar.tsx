import React from 'react';
import { 
  Moon, 
  Sun, 
  Maximize2, 
  CheckCircle2, 
  Repeat2, 
  Heart, 
  Link as LinkIcon,
  X,
  Palette,
  Layout,
  Type,
  Check,
  Image as ImageIcon,
  Camera,
  Video,
  Plus,
  Download,
  Copy,
  Share2,
  Coffee
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PostData, Config, AspectRatio, ExportFormat } from '../types';
import { PRESET_BACKGROUNDS, ASPECT_RATIOS } from '../constants';
import { XLogo } from './tweet/TweetComponents';

import { MediaControls } from './sidebar/MediaControls';
import { DesignSelection } from './sidebar/DesignSelection';
import { CustomizationControls } from './sidebar/CustomizationControls';
import { QuotedPostControls } from './sidebar/QuotedPostControls';
import { ActionButtons } from './sidebar/ActionButtons';

export function Toggle({ 
  icon, 
  label, 
  active, 
  onChange 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onChange: (val: boolean) => void 
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Switch checked={active} onCheckedChange={onChange} />
    </div>
  );
}

interface SidebarProps {
  postUrl: string;
  setPostUrl: (url: string) => void;
  fetchTweet: () => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  postData: PostData;
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  captureVideoFrame: () => void;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  setTheme: (theme: "dark" | "light" | "system") => void;
  backgroundInputRef: React.RefObject<HTMLInputElement | null>;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  quotedAvatarInputRef: React.RefObject<HTMLInputElement | null>;
  handleQuotedAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCopy: () => void;
  handleDownload: () => void;
  handleDownloadVideo: () => void;
  isExportingVideo: boolean;
  exportProgress: number;
  DEFAULT_POST: PostData;
}

export const Sidebar: React.FC<SidebarProps> = ({
  postUrl,
  setPostUrl,
  fetchTweet,
  isLoading,
  fileInputRef,
  handleImageUpload,
  postData,
  setPostData,
  videoInputRef,
  captureVideoFrame,
  handleVideoUpload,
  config,
  setConfig,
  setTheme,
  backgroundInputRef,
  handleBackgroundUpload,
  quotedAvatarInputRef,
  handleQuotedAvatarUpload,
  handleCopy,
  handleDownload,
  handleDownloadVideo,
  isExportingVideo,
  exportProgress,
  DEFAULT_POST
}) => {
  return (
    <aside className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Generate X Screenshots</h1>
      </header>

      {/* URL Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Paste the link of the post"
            className="pl-11 py-6 bg-card border-border rounded-xl shadow-sm"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTweet()}
          />
        </div>
        <Button 
          onClick={fetchTweet}
          disabled={isLoading}
          variant="outline"
          className="h-auto py-4 px-6 rounded-xl"
        >
          {isLoading ? 'Fetching...' : 'Fetch'}
        </Button>
      </div>

      <MediaControls 
        fileInputRef={fileInputRef}
        videoInputRef={videoInputRef}
        handleImageUpload={handleImageUpload}
        handleVideoUpload={handleVideoUpload}
        captureVideoFrame={captureVideoFrame}
        postData={postData}
        setPostData={setPostData}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Customize</h2>
          <button 
            onClick={() => {
              setConfig({
                background: PRESET_BACKGROUNDS[0],
                isDarkMode: true,
                aspectRatio: '1:1',
                showIcon: true,
                showUsername: true,
                showVerified: true,
                showDateTime: true,
                showResponses: true,
                padding: 64,
                rounded: 24,
                exportFormat: 'png',
                showQuotedPost: false,
                customWidth: 600,
                customHeight: 600,
                showBackground: true,
              });
              setPostData(DEFAULT_POST);
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <DesignSelection 
          config={config}
          setConfig={setConfig}
          backgroundInputRef={backgroundInputRef}
          handleBackgroundUpload={handleBackgroundUpload}
        />

        <CustomizationControls 
          config={config}
          setConfig={setConfig}
          setTheme={setTheme}
        />
      </div>

      <QuotedPostControls 
        postData={postData}
        setPostData={setPostData}
        quotedAvatarInputRef={quotedAvatarInputRef}
        handleQuotedAvatarUpload={handleQuotedAvatarUpload}
        config={config}
      />

      <ActionButtons 
        config={config}
        setConfig={setConfig}
        handleCopy={handleCopy}
        handleDownload={handleDownload}
        handleDownloadVideo={handleDownloadVideo}
        isExportingVideo={isExportingVideo}
        exportProgress={exportProgress}
        postData={postData}
      />
    </aside>
  );
};
