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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border p-8 rounded-[32px] shadow-2xl max-w-md w-full mx-4 space-y-6 text-center"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * exportProgress) / 100}
                  className="text-primary transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black tracking-tighter">{Math.round(exportProgress)}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Exporting Video</h3>
              <p className="text-muted-foreground">Please keep this tab open. We're rendering your visual masterpiece...</p>
            </div>

            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${exportProgress}%` }}
                className="h-full bg-primary"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing frames...
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Troubleshooting</p>
              <ul className="text-xs text-muted-foreground text-left space-y-2 list-disc pl-4">
                <li>Disable AdBlockers if the process hangs at 0%</li>
                <li>Ensure your browser supports MediaRecorder (Chrome/Edge/Safari)</li>
                <li>If it takes more than 2 minutes, try a shorter clip</li>
              </ul>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onStop}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full text-xs font-bold"
              >
                Force Stop Export
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
