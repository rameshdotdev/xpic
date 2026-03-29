import React from 'react';
import { Moon, Maximize2, Layout, CheckCircle2, Sun, Heart, Repeat2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          setConfig({ ...config, isDarkMode: val });
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
              onValueChange={(val) => setConfig({ ...config, aspectRatio: val as AspectRatio })}
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
                    onChange={(e) => setConfig({ ...config, customWidth: Math.max(0, parseInt(e.target.value) || 0) })}
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
                    onChange={(e) => setConfig({ ...config, customHeight: Math.max(0, parseInt(e.target.value) || 0) })}
                  />
                </div>
              </div>
            </div>
          )}

      <div className="p-3 bg-card border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">Padding</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">{config.padding}px</span>
        </div>
        <Slider 
          min={0} 
          max={120} 
          step={1}
          value={[config.padding]} 
          onValueChange={(val) => setConfig(prev => ({ ...prev, padding: val[0] }))}
        />
      </div>
    </>
  )}

  <div className="p-3 bg-card border border-border rounded-xl space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm font-medium">Rounded</span>
      </div>
      <span className="text-xs font-bold text-muted-foreground">{config.rounded}px</span>
    </div>
    <Slider 
      min={0} 
      max={48} 
      step={1}
      value={[config.rounded]} 
      onValueChange={(val) => setConfig(prev => ({ ...prev, rounded: val[0] }))}
    />
  </div>

      <Toggle 
        icon={<XLogo className="w-3.5 h-3.5" />} 
        label="Icon" 
        active={config.showIcon} 
        onChange={(val) => setConfig({ ...config, showIcon: val })} 
      />
      <Toggle 
        icon={<Layout className="w-3.5 h-3.5" />} 
        label="Username" 
        active={config.showUsername} 
        onChange={(val) => setConfig({ ...config, showUsername: val })} 
      />
      <Toggle 
        icon={<CheckCircle2 className="w-3.5 h-3.5" />} 
        label="Verified" 
        active={config.showVerified} 
        onChange={(val) => setConfig({ ...config, showVerified: val })} 
      />
      <Toggle 
        icon={<Sun className="w-3.5 h-3.5" />} 
        label="Date & Time" 
        active={config.showDateTime} 
        onChange={(val) => setConfig({ ...config, showDateTime: val })} 
      />
      <Toggle 
        icon={<Heart className="w-3.5 h-3.5" />} 
        label="Responses" 
        active={config.showResponses} 
        onChange={(val) => setConfig({ ...config, showResponses: val })} 
      />
      <Toggle 
        icon={<Repeat2 className="w-3.5 h-3.5" />} 
        label="Quote Post" 
        active={config.showQuotedPost} 
        onChange={(val) => setConfig({ ...config, showQuotedPost: val })} 
      />
    </div>
  );
};
