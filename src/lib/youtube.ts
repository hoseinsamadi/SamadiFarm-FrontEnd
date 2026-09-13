export interface YouTubeVideo {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  channelTitle: string;
}

export interface YouTubePage {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
  totalResults: number;
}

interface YouTubeApiResponse<T> {
  items?: T[];
  nextPageToken?: string;
  pageInfo?: { totalResults?: number };
}

interface ChannelItem {
  id: string;
}

interface UploadItem {
  contentDetails: { videoId: string };
}

interface VideoItem {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails?: { maxres?: { url: string }; high?: { url: string } };
  };
}

const API_URL = "https://www.googleapis.com/youtube/v3";
const PAGE_SIZE = 20;

async function youtubeRequest<T>(resource: string, params: Record<string, string>) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured");

  const searchParams = new URLSearchParams({ ...params, key: apiKey });
  const response = await fetch(`${API_URL}/${resource}?${searchParams.toString()}`);
  if (!response.ok) throw new Error(`YouTube API returned ${response.status}`);
  return response.json() as Promise<YouTubeApiResponse<T>>;
}

async function getChannelId() {
  if (process.env.YOUTUBE_CHANNEL_ID) return process.env.YOUTUBE_CHANNEL_ID;

  const handle = (process.env.YOUTUBE_CHANNEL_HANDLE || "SAmadiFarm").replace(/^@/, "");
  const response = await youtubeRequest<ChannelItem>("channels", {
    part: "id",
    forHandle: handle,
  });
  const channelId = response.items?.[0]?.id;
  if (!channelId) throw new Error("YouTube channel was not found");
  return channelId;
}

export async function getYouTubeVideos(pageToken?: string): Promise<YouTubePage> {
  const channelId = await getChannelId();
  const channel = await youtubeRequest<{ contentDetails: { relatedPlaylists: { uploads: string } } }>("channels", {
    part: "contentDetails",
    id: channelId,
  });
  const uploadsPlaylistId = channel.items?.[0]?.contentDetails.relatedPlaylists.uploads;
  if (!uploadsPlaylistId) throw new Error("YouTube uploads playlist was not found");

  const playlist = await youtubeRequest<UploadItem>("playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: String(PAGE_SIZE),
    ...(pageToken ? { pageToken } : {}),
  });
  const ids = (playlist.items || []).map((item) => item.contentDetails.videoId);
  if (!ids.length) {
    return { videos: [], nextPageToken: playlist.nextPageToken || null, totalResults: playlist.pageInfo?.totalResults || 0 };
  }

  const details = await youtubeRequest<VideoItem>("videos", {
    part: "snippet",
    id: ids.join(","),
  });
  const videos = (details.items || []).map((item) => ({
    videoId: item.id,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
    channelTitle: item.snippet.channelTitle,
  }));

  return {
    videos,
    nextPageToken: playlist.nextPageToken || null,
    totalResults: playlist.pageInfo?.totalResults || 0,
  };
}

export function formatYouTubeDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "medium" }).format(new Date(date));
}
