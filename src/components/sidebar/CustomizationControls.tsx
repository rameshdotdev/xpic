import React from 'react';
import { Moon, Maximize2, Layout, CheckCircle2, Sun, Heart, Repeat2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Toggle } from '../Sidebar';
import { XLogo } from '../tweet/TweetComponents';
import { Config, AspectRatio } from '../../types';
import { ASPECT_RATIOS } from '../../constants';

interface CustomizationControlsProps {
  config: Config;
  setConfig: (config: Config) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
}

export const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  config,
  setConfig,
  setTheme,
}) => {
  return (
    <div className="space-y-2">
      <Toggle 
        icon={<Moon className="w-3.5 h-3.5" />} 
        label="Dark Card" 
        active={config.isDarkMode} 
        onChange={(val) => {
          setConfig(prev => ({ ...prev, isDarkMode: val }));
          setTheme(val ? "dark" : "light");
        }} 
      />
      
      {config.showBackground && (
        <>
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">Aspect Ratio</span>
            </div>
            <Select 
              value={config.aspectRatio}
              onValueChange={(val) => setConfig(prev => ({ ...prev, aspectRatio: val as AspectRatio }))}
            >
              <SelectTrigger className="w-[120px] border-none bg-muted/50 focus:ring-0 h-8 px-2 text-right text-xs font-medium text-muted-foreground rounded-lg transition-colors hover:bg-muted">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {config.aspectRatio === 'custom' && (
            <div className="p-3 bg-card border border-border rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Maximize2 className="w-3 h-3" />
                <span>Custom Dimensions (px)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Width</label>
                  <Input 
                    type="number" 
                    min={200}
                    max={2000}
                    className="h-8 px-3 text-xs bg-muted/50 border-border rounded-lg focus:ring-1 focus:ring-primary"
                    value={config.customWidth}
                    onChange={(e) => setConfig(prev => ({ ...prev, customWidth: Math.max(0, parseInt(e.target.value) || 0) }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Height</label>
                  <Input 
                    type="number" 
                    min={200}
                    max={2000}
                    className="h-8 px-3 text-xs bg-muted/50 border-border rounded-lg focus:ring-1 focus:ring-primary"
                    value={config.customHeight}
                    onChange={(e) => setConfig(prev => ({ ...prev, customHeight: Math.max(0, parseInt(e.target.value) || 0) }))}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-card border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layout className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">Padding</span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{config.padding}px</span>
            </div>
            <Slider 
              min={0} 
              max={200} 
              step={4}
              value={[config.padding]} 
              onValueChange={(val) => setConfig(prev => ({ ...prev, padding: val[0] }))}
              className="py-2"
            />
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[0, 16, 32, 64, 128].map(p => (
                <button
                  key={p}
                  onClick={() => setConfig(prev => ({ ...prev, padding: p }))}
                  className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded border transition-all flex-shrink-0",
                    config.padding === p ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border hover:border-muted-foreground/30"
                  )}
                >
                  {p === 0 ? 'None' : `${p}px`}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="p-3 bg-card border border-border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">Border Radius</span>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{config.rounded}px</span>
        </div>
        <Slider 
          min={0} 
          max={64} 
          step={2}
          value={[config.rounded]} 
          onValueChange={(val) => setConfig(prev => ({ ...prev, rounded: val[0] }))}
          className="py-2"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[0, 8, 16, 24, 32, 48].map(r => (
            <button
              key={r}
              onClick={() => setConfig(prev => ({ ...prev, rounded: r }))}
              className={cn(
                "text-[10px] font-bold px-2 py-1 rounded border transition-all flex-shrink-0",
                config.rounded === r ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border hover:border-muted-foreground/30"
              )}
            >
              {r === 0 ? 'Sharp' : `${r}px`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-card border border-border rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Shadow</span>
            <span className="text-[10px] font-bold text-muted-foreground">{config.cardShadow}px</span>
          </div>
          <Slider 
            min={0} 
            max={100} 
            step={5}
            value={[config.cardShadow]} 
            onValueChange={(val) => setConfig(prev => ({ ...prev, cardShadow: val[0] }))}
          />
        </div>
        <div className="p-3 bg-card border border-border rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Opacity</span>
            <span className="text-[10px] font-bold text-muted-foreground">{config.cardOpacity}%</span>
          </div>
          <Slider 
            min={0} 
            max={100} 
            step={5}
            value={[config.cardOpacity]} 
            onValueChange={(val) => setConfig(prev => ({ ...prev, cardOpacity: val[0] }))}
          />
        </div>
      </div>

      <Toggle 
        icon={<XLogo className="w-3.5 h-3.5" />} 
        label="Icon" 
        active={config.showIcon} 
        onChange={(val) => setConfig(prev => ({ ...prev, showIcon: val }))} 
      />
      <Toggle 
        icon={<Layout className="w-3.5 h-3.5" />} 
        label="Username" 
        active={config.showUsername} 
        onChange={(val) => setConfig(prev => ({ ...prev, showUsername: val }))} 
      />
      <Toggle 
        icon={<CheckCircle2 className="w-3.5 h-3.5" />} 
        label="Verified" 
        active={config.showVerified} 
        onChange={(val) => setConfig(prev => ({ ...prev, showVerified: val }))} 
      />
      <Toggle 
        icon={<Sun className="w-3.5 h-3.5" />} 
        label="Date & Time" 
        active={config.showDateTime} 
        onChange={(val) => setConfig(prev => ({ ...prev, showDateTime: val }))} 
      />
      <Toggle 
        icon={<Heart className="w-3.5 h-3.5" />} 
        label="Responses" 
        active={config.showResponses} 
        onChange={(val) => setConfig(prev => ({ ...prev, showResponses: val }))} 
      />
      <Toggle 
        icon={<Repeat2 className="w-3.5 h-3.5" />} 
        label="Quote Post" 
        active={config.showQuotedPost} 
        onChange={(val) => setConfig(prev => ({ ...prev, showQuotedPost: val }))} 
      />
    </div>
  );
};
