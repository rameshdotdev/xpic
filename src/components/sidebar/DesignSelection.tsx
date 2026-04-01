import React from 'react';
import { Palette, Check, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Config } from '../../types';
import { PRESET_BACKGROUNDS } from '../../constants';

interface DesignSwitcherProps {
  config: Config;
  setConfig: (config: Config) => void;
}

export const DesignSwitcher: React.FC<DesignSwitcherProps> = ({
  config,
  setConfig,
}) => {
  return (
    <div className="flex items-center gap-3 bg-card/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
      {/* Design 1: Only Tweet */}
      <button
        onClick={() => setConfig(prev => ({ ...prev, showBackground: false }))}
        className={cn(
          "relative flex-1 aspect-[16/10] min-w-[100px] bg-card border-2 rounded-xl transition-all overflow-hidden group",
          !config.showBackground ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-muted-foreground/30"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className="w-full space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="h-1 w-8 bg-muted rounded-full" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-muted rounded-full" />
              <div className="h-1 w-2/3 bg-muted rounded-full" />
            </div>
          </div>
        </div>
        {!config.showBackground && (
          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-2 h-2 text-primary-foreground" />
          </div>
        )}
      </button>

      {/* Design 2: With Background */}
      <button
        onClick={() => setConfig(prev => ({ ...prev, showBackground: true }))}
        className={cn(
          "relative flex-1 aspect-[16/10] min-w-[100px] bg-muted border-2 rounded-xl transition-all overflow-hidden group",
          config.showBackground ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-muted-foreground/30"
        )}
      >
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center p-2">
          <div className="w-full bg-card rounded p-1.5 shadow-sm space-y-0.5 scale-90">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted" />
              <div className="h-0.5 w-6 bg-muted rounded-full" />
            </div>
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-muted rounded-full" />
              <div className="h-0.5 w-1/2 bg-muted rounded-full" />
            </div>
          </div>
        </div>
        {config.showBackground && (
          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-2 h-2 text-primary-foreground" />
          </div>
        )}
      </button>
    </div>
  );
};

interface BackgroundSelectionProps {
  config: Config;
  setConfig: (config: Config) => void;
  backgroundInputRef: React.RefObject<HTMLInputElement | null>;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BackgroundSelection: React.FC<BackgroundSelectionProps> = ({
  config,
  setConfig,
  backgroundInputRef,
  handleBackgroundUpload,
}) => {
  if (!config.showBackground) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3 bg-muted/30 rounded-xl border border-dashed border-border">
        <Palette className="w-8 h-8 text-muted-foreground/50" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Background is disabled</p>
          <p className="text-xs text-muted-foreground">Enable "With Background" design to customize styles.</p>
        </div>
        <button 
          onClick={() => setConfig(prev => ({ ...prev, showBackground: true }))}
          className="text-xs font-bold text-primary hover:underline"
        >
          Enable Background
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-xl">
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

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Presets</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_BACKGROUNDS.map((bg) => (
            <button
              key={bg}
              onClick={() => setConfig(prev => ({ ...prev, background: bg, customBackground: undefined }))}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                (config.background === bg && !config.customBackground) ? "border-primary scale-110 shadow-md" : "border-transparent"
              )}
              style={{ background: bg }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Custom Image</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => backgroundInputRef.current?.click()}
            className={cn(
              "relative w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center transition-all hover:border-primary overflow-hidden group",
              config.customBackground ? "border-primary" : ""
            )}
          >
            {config.customBackground ? (
              <>
                <img src={config.customBackground} alt="Custom" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </>
            ) : (
              <Plus className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium">{config.customBackground ? 'Image uploaded' : 'Upload custom image'}</p>
            <p className="text-[10px] text-muted-foreground">Supports JPG, PNG, WebP</p>
          </div>
          {config.customBackground && (
            <button 
              onClick={() => setConfig(prev => ({ ...prev, customBackground: undefined }))}
              className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          )}
        </div>
        <input 
          type="file" 
          ref={backgroundInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleBackgroundUpload} 
        />
      </div>
    </div>
  );
};

