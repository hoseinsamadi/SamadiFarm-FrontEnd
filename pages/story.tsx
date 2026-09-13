import StoryPage from "../src/pages/StoryPage";
import { getYouTubeVideos, type YouTubePage } from "../src/lib/youtube";

interface StoryProps {
  youtube: YouTubePage | null;
  page: number;
  pageToken: string;
  previousPageToken: string;
}

export const getServerSideProps = async (context: { query: Record<string, string | string[] | undefined> }) => {
  const getQueryValue = (name: string) => {
    const value = context.query[name];
    return Array.isArray(value) ? value[0] || "" : value || "";
  };
  const pageToken = getQueryValue("pageToken");
  const previousPageToken = getQueryValue("previousPageToken");
  const parsedPage = Number.parseInt(getQueryValue("page"), 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  try {
    const youtube = await getYouTubeVideos(pageToken || undefined);
    return { props: { youtube, page, pageToken, previousPageToken } };
  } catch {
    return { props: { youtube: null, page, pageToken, previousPageToken } };
  }
};

export default function StoryRoute({ youtube, page, pageToken, previousPageToken }: StoryProps) {
  return <StoryPage youtube={youtube} page={page} pageToken={pageToken} previousPageToken={previousPageToken} />;
}
