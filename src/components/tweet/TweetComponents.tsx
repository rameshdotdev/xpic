import React from 'react';
import { cn } from '../../lib/utils';

export const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

export const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    className={cn("text-blue-500", className)}
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path>
  </svg>
);

export function StatItem({ 
  label, 
  value, 
  isDark, 
  onChange 
}: { 
  label: string; 
  value: string; 
  isDark: boolean; 
  onChange: (val: string) => void 
}) {
  const displayValue = value || '';
  return (
    <div className="flex items-center gap-1">
      <input 
        className={cn(
          "bg-transparent border-none p-0 focus:ring-0 w-fit min-w-[10px] text-center",
          isDark ? "text-white" : "text-foreground"
        )}
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: `${displayValue.length + 0.5}ch` }}
      />
      <span>{label}</span>
    </div>
  );
}
