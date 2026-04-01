import React from 'react';
import { Config } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface VideoExportControlsProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export const VideoExportControls: React.FC<VideoExportControlsProps> = ({ config, setConfig }) => {
  const options = {
    frameRate: config.videoExportOptions?.frameRate ?? 30,
    bitrate: config.videoExportOptions?.bitrate ?? 30000000,
    codec: config.videoExportOptions?.codec ?? 'video/webm;codecs=vp9,opus',
    exportScale: config.videoExportOptions?.exportScale ?? 3.0,
  };

  const updateOptions = (updates: Partial<typeof options>) => {
    setConfig(prev => ({
      ...prev,
      videoExportOptions: { ...options, ...updates }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resolution Scale</Label>
          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-primary">
            {typeof options.exportScale === 'number' ? options.exportScale.toFixed(1) : '3.0'}x
          </span>
        </div>
        <Slider 
          value={[options.exportScale]} 
          min={1} 
          max={4} 
          step={0.5} 
          onValueChange={(val) => updateOptions({ exportScale: val[0] ?? 3.0 })}
          className="py-2"
        />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Higher scale means sharper video but larger file size and longer export time.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Frame Rate (FPS)</Label>
          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-primary">{options.frameRate ?? 30}</span>
        </div>
        <Slider 
          value={[options.frameRate]} 
          min={15} 
          max={60} 
          step={5} 
          onValueChange={(val) => updateOptions({ frameRate: val[0] ?? 30 })}
          className="py-2"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bitrate (Mbps)</Label>
          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-primary">
            {typeof options.bitrate === 'number' ? (options.bitrate / 1000000).toFixed(1) : '30.0'}
          </span>
        </div>
        <Slider 
          value={[options.bitrate / 1000000]} 
          min={5} 
          max={50} 
          step={5} 
          onValueChange={(val) => updateOptions({ bitrate: (val[0] ?? 30) * 1000000 })}
          className="py-2"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Video Codec</Label>
        <Select 
          value={options.codec} 
          onValueChange={(val) => updateOptions({ codec: val })}
        >
          <SelectTrigger className="w-full bg-card border-border rounded-xl h-10 text-sm">
            <SelectValue placeholder="Select codec" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video/webm;codecs=vp9,opus">WebM (VP9) - Best Quality</SelectItem>
            <SelectItem value="video/webm;codecs=vp8,opus">WebM (VP8) - Faster</SelectItem>
            <SelectItem value="video/mp4">MP4 (H.264) - Compatible</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Note: MP4 support varies by browser. WebM is recommended for best results.
        </p>
      </div>
    </div>
  );
};
