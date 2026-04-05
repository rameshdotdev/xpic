import React from 'react';
import { AspectRatio } from './types';

export const PRESET_BACKGROUNDS = [
  'linear-gradient(45deg, #8E2DE2, #4A00E0)',
  'linear-gradient(45deg, #f953c6, #b91d73)',
  'linear-gradient(45deg, #00c6ff, #0072ff)',
  'linear-gradient(45deg, #11998e, #38ef7d)',
  'linear-gradient(45deg, #ff9966, #ff5e62)',
  'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
  'linear-gradient(45deg, #000000, #434343)',
  '#ffffff',
  '#000000',
];

export const renderContent = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if ((part.startsWith('#') || part.startsWith('@')) && part.length > 1) {
      return <span key={index} className="text-[#1D9BF0]">{part}</span>;
    }
    return part;
  });
};

export const ASPECT_RATIOS: { label: string; value: AspectRatio; ratio: number }[] = [
  { label: 'Square (1:1)', value: '1:1', ratio: 1 },
  { label: 'Landscape (16:9)', value: '16:9', ratio: 16 / 9 },
  { label: 'Portrait (9:16)', value: '9:16', ratio: 9 / 16 },
  { label: 'Classic (4:3)', value: '4:3', ratio: 4 / 3 },
  { label: 'Golden (1.618:1)', value: 'linkedinPost', ratio: 1.618 },
  { label: 'Instagram Feed', value: 'instagramFeed', ratio: 4 / 5 },
  { label: 'Instagram Stories', value: 'instagramStories', ratio: 9 / 16 },
  { label: 'LinkedIn Post', value: 'linkedinPost', ratio: 1.91 / 1 },
  { label: 'Twitter Header', value: 'twitterProfileCover', ratio: 3 / 1 },
  { label: 'Custom', value: 'custom', ratio: 1 },
];

export const DEFAULT_POST: any = {
  name: 'Publer',
  handle: 'publer',
  avatar: 'https://picsum.photos/seed/publer/200/200',
  content: "Here's an idea 🧐 do something good and don't post about it on social media.\n\nBut if you really can't resist ... post it everywhere using Publer!",
  date: '27 Mar, 2026',
  time: '9:21 AM',
  views: '1.1M',
  replies: '1.2K',
  retweets: '5.5K',
  likes: '3.9K',
  bookmarks: '1.1K',
  isVerified: true,
  postImage: undefined,
  quotedPost: {
    name: 'X',
    handle: 'X',
    avatar: 'https://picsum.photos/seed/x/200/200',
    content: 'The future of social media is here.',
    date: '26 Mar',
    isVerified: true,
  }
};
