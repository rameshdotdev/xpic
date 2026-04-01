export interface PostData {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  date: string;
  time: string;
  views: string;
  replies: string;
  retweets: string;
  likes: string;
  bookmarks: string;
  isVerified: boolean;
  postImage?: string;
  postVideo?: string;
  quotedPost?: {
    name: string;
    handle: string;
    avatar: string;
    content: string;
    date: string;
    isVerified: boolean;
  };
}

export type AspectRatio = 
  | '1:1' | '16:9' | '4:3' | '9:16' | 'custom'
  | 'instagramFeed' | 'instagramStories' | 'linkedinPost' 
  | 'twitterProfileCover';

export type ExportFormat = 'png' | 'jpg';

export interface Config {
  background: string;
  customBackground?: string;
  isDarkMode: boolean;
  aspectRatio: AspectRatio;
  showIcon: boolean;
  showUsername: boolean;
  showVerified: boolean;
  showDateTime: boolean;
  showResponses: boolean;
  padding: number;
  rounded: number;
  cardShadow: number;
  cardOpacity: number;
  exportFormat: ExportFormat;
  showQuotedPost: boolean;
  customWidth: number;
  customHeight: number;
  showBackground: boolean;
  videoExportOptions?: {
    frameRate: number;
    bitrate: number;
    codec: string;
    exportScale: number;
  };
}
