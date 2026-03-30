import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VideoExportOverlayProps {
  isExportingVideo: boolean;
  exportProgress: number;
  onStop: () => void;
}

export const VideoExportOverlay: React.FC<VideoExportOverlayProps> = ({
  isExportingVideo,
  exportProgress,
  onStop,
}) => {
  return (
    <AnimatePresence>
      {isExportingVideo && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-[100] w-80"
        >
          <div className="bg-card border border-border p-6 rounded-[24px] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">Exporting Video</h3>
                <div className="flex items-center gap-2 text-[10px] font-medium text-primary uppercase tracking-widest">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing...
                </div>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={126}
                    strokeDashoffset={126 - (126 * exportProgress) / 100}
                    className="text-primary transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-tighter">{Math.round(exportProgress)}%</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${exportProgress}%` }}
                className="h-full bg-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">Keep this tab active</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onStop}
                className="h-7 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full text-[10px] font-bold"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
