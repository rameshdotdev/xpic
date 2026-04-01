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
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (exportProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isExportingVideo && (
        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-8 right-8 z-[100] w-80"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-6 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-5 overflow-hidden relative">
            {/* Subtle background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Exporting Video</h3>
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"
                  />
                  <span className="text-sm font-semibold tracking-tight">Processing Frames</span>
                </div>
              </div>
              
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_4px_var(--color-primary)]">
                  {/* Background Track */}
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted/30"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    key={Math.round(exportProgress)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-mono font-bold"
                  >
                    {Math.round(exportProgress)}%
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden border border-border/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-primary relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Progress</span>
                <span className="text-[10px] font-mono text-muted-foreground">{Math.round(exportProgress)} / 100</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50 relative z-10">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                <p className="text-[10px] text-muted-foreground font-medium">Keep tab active</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onStop}
                className="h-8 px-4 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
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
