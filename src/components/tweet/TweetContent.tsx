import React from 'react';
import { cn } from '../../lib/utils';
import { PostData, Config } from '../../types';
import { renderTweetText } from '../../lib/textUtils';

interface TweetContentProps {
  postData: PostData;
  setPostData: (data: PostData) => void;
  config: Config;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const TweetContent: React.FC<TweetContentProps> = ({
  postData,
  setPostData,
  config,
  videoRef,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [postData.content]);

  return (
    <div className="space-y-3">
      <div className="relative w-full">
        {/* Mirror div for highlighting */}
        <div 
          className={cn(
            "absolute inset-0 text-[23px] leading-[1.3] p-0 pointer-events-none whitespace-pre-wrap break-words overflow-hidden font-sans",
            config.isDarkMode ? "text-white" : "text-black"
          )}
          style={{ 
            fontFamily: 'inherit',
            letterSpacing: 'normal',
            wordSpacing: 'normal',
            textTransform: 'none',
            textAlign: 'start'
          }}
          aria-hidden="true"
        >
          {renderTweetText(postData.content)}
        </div>

        <textarea 
          ref={textareaRef}
          className={cn(
            "w-full text-[23px] leading-[1.3] bg-transparent border-none p-0 focus:ring-0 resize-none min-h-[40px] overflow-hidden relative z-10 font-sans outline-none",
            "selection:bg-[#1D9BF0]/30",
            config.isDarkMode ? "text-transparent" : "text-transparent"
          )}
          style={{ 
            color: 'transparent',
            caretColor: config.isDarkMode ? 'white' : 'black',
            fontFamily: 'inherit',
            letterSpacing: 'normal',
            wordSpacing: 'normal',
            textTransform: 'none',
            textAlign: 'start',
            boxSizing: 'border-box'
          }}
          value={postData.content}
          onChange={(e) => {
            setPostData({ ...postData, content: e.target.value });
          }}
          rows={1}
          spellCheck={false}
        />
      </div>

      {postData.postImage && (
        <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-sm group">
          <img 
            src={postData.postImage} 
            alt="Post content"
            className="w-full h-auto object-cover max-h-[600px]"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => setPostData({ ...postData, postImage: undefined })}
              className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white/30 transition-colors"
            >
              Remove Image
            </button>
          </div>
        </div>
      )}

      {postData.postVideo && (
        <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-sm group bg-black">
          <video 
            ref={videoRef}
            src={postData.postVideo} 
            className="w-full h-auto max-h-[600px]"
            controls
            playsInline
            muted
            crossOrigin="anonymous"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setPostData({ ...postData, postVideo: undefined })}
              className="p-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
