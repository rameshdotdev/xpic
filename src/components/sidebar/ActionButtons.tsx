import React from 'react';
import { Download, Copy, Coffee, Share2, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Config, ExportFormat, PostData } from '../../types';

interface ActionButtonsProps {
  config: Config;
  setConfig: (config: Config) => void;
  handleCopy: () => void;
  handleDownload: () => void;
  handleDownloadVideo: () => void;
  isExportingVideo: boolean;
  exportProgress: number;
  postData: PostData;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  config,
  setConfig,
  handleCopy,
  handleDownload,
  handleDownloadVideo,
  isExportingVideo,
  exportProgress,
  postData,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <Download className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Export Format</span>
        </div>
        <Select 
          value={config.exportFormat}
          onValueChange={(val) => setConfig({ ...config, exportFormat: val as ExportFormat })}
        >
          <SelectTrigger className="w-[100px] border-none bg-muted/50 focus:ring-0 h-auto px-3 py-1.5 text-right font-medium text-muted-foreground rounded-lg transition-colors hover:bg-muted">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPEG</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          <Button 
            variant="outline"
            onClick={() => window.open('https://www.buymeacoffee.com', '_blank')}
            className="flex items-center justify-center p-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm"
          >
            <Coffee className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button 
            variant="outline"
            onClick={handleCopy}
            className="flex items-center justify-center p-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm"
          >
            <Copy className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownload}
            disabled={isExportingVideo}
            className="col-span-1 flex items-center justify-center gap-2 p-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-5 h-5 text-muted-foreground" />
            <span className="hidden xl:inline">Download</span>
          </Button>
          <Button 
            onClick={() => window.open('https://twitter.com/intent/tweet?text=Check out this X Post Screenshot Generator!', '_blank')}
            className="col-span-1 flex items-center justify-center gap-2 p-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden xl:inline">Post</span>
          </Button>
        </div>

        {postData.postVideo && (
          <Button 
            onClick={handleDownloadVideo}
            disabled={isExportingVideo}
            className="w-full flex items-center justify-center gap-2 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 font-bold"
          >
            {isExportingVideo ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Exporting Video ({Math.round(exportProgress)}%)</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                <span>Download as Video</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
