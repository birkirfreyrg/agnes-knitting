interface InstagramPost {
  id: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramResponse {
  data: InstagramPost[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Fetches recent Instagram posts for a user
 * Requires Instagram Access Token and User ID
 */
export async function fetchInstagramPosts(): Promise<{
  id: number;
  image: string;
  likes: number;
  comments: number;
  permalink: string;
}[]> {
  const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
  const userId = import.meta.env.VITE_INSTAGRAM_USER_ID || 'birkirfreyr95';

  if (!accessToken) {
    console.warn('Instagram Access Token not found. Using mock data.');
    return [];
  }

  try {
    // Instagram Graph API endpoint
    // For Business/Creator accounts: use the Instagram Business Account ID
    // Format: https://graph.instagram.com/{user-id}/media
    const apiUrl = `https://graph.instagram.com/${userId}/media?fields=id,media_url,media_type,permalink,caption,timestamp,like_count,comments_count&limit=8&access_token=${accessToken}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data: InstagramResponse = await response.json();

    // Transform Instagram API response to our format
    return data.data
      .filter((post) => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
      .map((post, index) => ({
        id: index + 1,
        image: post.media_url,
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        permalink: post.permalink,
      }));
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

