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
  Coffee,
  ChevronDown,
  ChevronUp,
  Settings2,
  BarChart3,
  Quote
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from 'motion/react';
import { PostData, Config, AspectRatio, ExportFormat } from '../types';
import { PRESET_BACKGROUNDS, ASPECT_RATIOS } from '../constants';
import { XLogo } from './tweet/TweetComponents';

import { MediaControls } from './sidebar/MediaControls';
import { BackgroundSelection } from './sidebar/DesignSelection';
import { CustomizationControls } from './sidebar/CustomizationControls';
import { QuotedPostControls } from './sidebar/QuotedPostControls';
import { ActionButtons } from './sidebar/ActionButtons';
import { StatsControls } from './sidebar/StatsControls';
import { VideoExportControls } from './sidebar/VideoExportControls';

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
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Switch checked={active} onCheckedChange={onChange} />
    </div>
  );
}

function CollapsibleSection({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-border rounded-2xl bg-card/50 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <span className="text-sm font-bold uppercase tracking-widest">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 space-y-4">
              <div className="h-px bg-border mb-4" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  isVideoLoading: boolean;
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
  isVideoLoading,
  exportProgress,
  DEFAULT_POST
}) => {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">X Screenshot</h1>
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
              cardShadow: 40,
              cardOpacity: 100,
              exportFormat: 'png',
              showQuotedPost: false,
              customWidth: 600,
              customHeight: 600,
              showBackground: true,
              videoExportOptions: {
                frameRate: 30,
                bitrate: 30000000,
                codec: 'video/webm;codecs=vp9,opus',
                exportScale: 3.0,
              }
            });
            setPostData(DEFAULT_POST);
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
        >
          Reset
        </button>
      </header>

      {/* URL Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Paste post link..."
            className="pl-11 py-5 bg-card border-border rounded-xl shadow-sm text-sm"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTweet()}
          />
        </div>
        <Button 
          onClick={fetchTweet}
          disabled={isLoading}
          variant="outline"
          className="h-auto py-3 px-4 rounded-xl text-sm"
        >
          {isLoading ? '...' : 'Fetch'}
        </Button>
      </div>

      <div className="space-y-4">
        <CollapsibleSection title="Media" icon={<ImageIcon className="w-4 h-4" />} defaultOpen={true}>
          <MediaControls 
            fileInputRef={fileInputRef}
            videoInputRef={videoInputRef}
            handleImageUpload={handleImageUpload}
            handleVideoUpload={handleVideoUpload}
            captureVideoFrame={captureVideoFrame}
            postData={postData}
            setPostData={setPostData}
            isVideoLoading={isVideoLoading}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Design" icon={<Palette className="w-4 h-4" />}>
          <BackgroundSelection 
            config={config}
            setConfig={setConfig}
            backgroundInputRef={backgroundInputRef}
            handleBackgroundUpload={handleBackgroundUpload}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Layout" icon={<Settings2 className="w-4 h-4" />}>
          <CustomizationControls 
            config={config}
            setConfig={setConfig}
            setTheme={setTheme}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Stats" icon={<BarChart3 className="w-4 h-4" />}>
          <StatsControls 
            postData={postData}
            setPostData={setPostData}
          />
        </CollapsibleSection>

        {config.showQuotedPost && (
          <CollapsibleSection title="Quote" icon={<Quote className="w-4 h-4" />} defaultOpen={true}>
            <QuotedPostControls 
              postData={postData}
              setPostData={setPostData}
              quotedAvatarInputRef={quotedAvatarInputRef}
              handleQuotedAvatarUpload={handleQuotedAvatarUpload}
              config={config}
            />
          </CollapsibleSection>
        )}

        {postData.postVideo && (
          <CollapsibleSection title="Video Export" icon={<Video className="w-4 h-4" />}>
            <VideoExportControls 
              config={config}
              setConfig={setConfig}
            />
          </CollapsibleSection>
        )}
      </div>

      <div className="pt-4 border-t border-border">
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
      </div>
    </aside>
  );
};
