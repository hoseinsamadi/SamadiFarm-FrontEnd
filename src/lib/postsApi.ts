const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export interface ApiPost {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string[];
  image?: string | null;
  published_at?: string | null;
  is_published?: boolean;
}

export interface PostListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: ApiPost[];
}

export interface MagazinePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  content: string[];
  image: string;
  publishedAt: string;
  publishedAtLabel: string;
}

export interface MagazineListPage {
  posts: MagazinePost[];
  count: number;
  page: number;
  totalPages: number;
  nextPage: number | null;
  previousPage: number | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  guide: "راهنمای خرید",
  beekeeping: "عسل و زنبورداری",
  education: "آموزش زنبورداری",
  news: "اخبار و یادداشت",
};

function formatPersianDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalizePost(item: ApiPost): MagazinePost {
  const publishedAt = item.published_at ?? "";
  return {
    id: String(item.slug ?? item.id),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    categoryLabel: CATEGORY_LABELS[item.category] ?? item.category,
    content: Array.isArray(item.content) ? item.content : [],
    image: item.image ?? "",
    publishedAt,
    publishedAtLabel: formatPersianDate(publishedAt),
  };
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`API request failed (${response.status})${body ? `: ${body}` : ""}`);
  }
  return response.json() as Promise<T>;
}

export async function getPosts(page = 1): Promise<MagazineListPage> {
  const url = new URL(`${API_BASE_URL}/api/posts/`);
  if (page > 1) url.searchParams.set("page", String(page));

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  const payload = await readJson<ApiPost[] | PostListResponse>(response);
  const items = Array.isArray(payload) ? payload : Array.isArray(payload.results) ? payload.results : [];
  const count = Array.isArray(payload) ? items.length : payload.count ?? items.length;
  const totalPages = Math.max(1, Math.ceil(count / 10));
  return {
    posts: items.map(normalizePost),
    count,
    page,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
}

export async function getPost(slug: string): Promise<MagazinePost> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}/`, {
    headers: { Accept: "application/json" },
  });
  return normalizePost(await readJson<ApiPost>(response));
}
