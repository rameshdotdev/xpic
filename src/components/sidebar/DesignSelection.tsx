import React from 'react';
import { Palette, Check, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Config } from '../../types';
import { PRESET_BACKGROUNDS } from '../../constants';

interface DesignSelectionProps {
  config: Config;
  setConfig: (config: Config) => void;
  backgroundInputRef: React.RefObject<HTMLInputElement | null>;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DesignSelection: React.FC<DesignSelectionProps> = ({
  config,
  setConfig,
  backgroundInputRef,
  handleBackgroundUpload,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select the design</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Design 1: Only Tweet */}
        <button
          onClick={() => setConfig({ ...config, showBackground: false })}
          className={cn(
            "relative aspect-square bg-card border-2 rounded-2xl transition-all overflow-hidden group",
            !config.showBackground ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-muted-foreground/30"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted" />
                <div className="h-2 w-16 bg-muted rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-full bg-muted rounded-full" />
                <div className="h-2 w-full bg-muted rounded-full" />
                <div className="h-2 w-2/3 bg-muted rounded-full" />
              </div>
            </div>
          </div>
          {!config.showBackground && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </button>

        {/* Design 2: With Background */}
        <button
          onClick={() => setConfig({ ...config, showBackground: true })}
          className={cn(
            "relative aspect-square bg-muted border-2 rounded-2xl transition-all overflow-hidden group",
            config.showBackground ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-muted-foreground/30"
          )}
        >
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center p-6">
            <div className="w-full bg-card rounded-lg p-3 shadow-sm space-y-2 scale-90">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-muted" />
                <div className="h-1.5 w-12 bg-muted rounded-full" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-muted rounded-full" />
                <div className="h-1.5 w-full bg-muted rounded-full" />
                <div className="h-1.5 w-1/2 bg-muted rounded-full" />
              </div>
            </div>
          </div>
          {config.showBackground && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </button>
      </div>

      {config.showBackground && (
        <div className="space-y-3 p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Background Style</span>
            </div>
            <div 
              className="w-8 h-8 rounded-full border-2 border-background shadow-sm cursor-pointer"
              style={{ background: config.background }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_BACKGROUNDS.map((bg) => (
              <button
                key={bg}
                onClick={() => setConfig({ ...config, background: bg, customBackground: undefined })}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                  (config.background === bg && !config.customBackground) ? "border-primary scale-110 shadow-md" : "border-transparent"
                )}
                style={{ background: bg }}
              />
            ))}
            <button
              onClick={() => backgroundInputRef.current?.click()}
              className={cn(
                "w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center transition-all hover:scale-110 hover:border-primary overflow-hidden",
                config.customBackground ? "border-primary scale-110 shadow-md" : ""
              )}
            >
              {config.customBackground ? (
                <img src={config.customBackground} alt="Custom" className="w-full h-full object-cover" />
              ) : (
                <Plus className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <input 
              type="file" 
              ref={backgroundInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleBackgroundUpload} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
