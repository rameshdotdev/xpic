import { PostData } from '../types';

export const fetchTweetData = async (tweetId: string): Promise<PostData> => {
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`;
  
  const res = await fetch(url).catch((error) => {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to connect to the tweet API: ${msg}. This might be due to a network issue or CORS restrictions in your browser.`);
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Tweet not found. It might be private, deleted, or the ID is incorrect.');
    }
    if (res.status === 403) {
      throw new Error('This tweet is private or restricted. The syndication API cannot access it.');
    }
    throw new Error(`Failed to fetch tweet (Status: ${res.status}). The API might be temporarily unavailable.`);
  }

  const data = await res.json().catch(() => {
    throw new Error('Failed to parse tweet data. The API response might be malformed.');
  });

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Received invalid data from the tweet API.');
  }

  const user = data.user;
  if (!user || typeof user !== 'object' || Array.isArray(user)) {
    throw new Error('Tweet data is incomplete (missing user information). This usually happens with private or restricted posts.');
  }

  const dateObj = new Date(data.created_at || Date.now());
  const formattedDate = isNaN(dateObj.getTime()) 
    ? 'Unknown Date' 
    : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const formattedTime = isNaN(dateObj.getTime())
    ? 'Unknown Time'
    : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const postData: PostData = {
    name: user.name || user.screen_name || 'Unknown User',
    handle: user.screen_name || 'unknown',
    avatar: user.profile_image_url_https 
      ? user.profile_image_url_https.replace('_normal', '') 
      : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
    content: data.text || data.full_text || '',
    date: formattedDate,
    time: formattedTime,
    views: '1.2M', 
    replies: (data.reply_count || 0).toLocaleString(),
    retweets: (data.retweet_count || 0).toLocaleString(),
    likes: (data.favorite_count || 0).toLocaleString(),
    bookmarks: (data.bookmark_count || 0).toLocaleString(),
    isVerified: !!user.verified,
    postImage: data.mediaDetails?.[0]?.media_url_https,
  };

  if (data.quoted_tweet && 
      typeof data.quoted_tweet === 'object' && 
      !Array.isArray(data.quoted_tweet) && 
      data.quoted_tweet.user && 
      typeof data.quoted_tweet.user === 'object' && 
      !Array.isArray(data.quoted_tweet.user)) {
    const qUser = data.quoted_tweet.user;
    const qDateObj = new Date(data.quoted_tweet.created_at || Date.now());
    postData.quotedPost = {
      name: qUser.name || qUser.screen_name || 'Unknown User',
      handle: qUser.screen_name || 'unknown',
      avatar: qUser.profile_image_url_https 
        ? qUser.profile_image_url_https.replace('_normal', '') 
        : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
      content: data.quoted_tweet.text || data.quoted_tweet.full_text || '',
      date: isNaN(qDateObj.getTime()) ? 'Unknown Date' : qDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      isVerified: !!qUser.verified,
    };
  }

  return postData;
};
