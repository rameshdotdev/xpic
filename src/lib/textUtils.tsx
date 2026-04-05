import React from 'react';

export function renderTweetText(text: string) {
  if (!text) return null;

  // Regex to match mentions (@username), hashtags (#hashtag), and URLs
  const regex = /([@#][\w\d_]+|https?:\/\/[^\s]+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.match(regex)) {
      return (
        <span key={i} className="text-[#1D9BF0] hover:underline cursor-pointer break-all">
          {part}
        </span>
      );
    }
    return part;
  });
}
