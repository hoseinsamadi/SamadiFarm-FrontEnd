import type { Product } from "../data/site";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

interface BackendProduct {
  id: number | string;
  slug: string;
  name: string;
  cat: Product["cat"];
  weight: string;
  price: number;
  desc: string;
  long_description?: string;
  img?: string | null;
  img_url?: string | null;
  tag?: string | null;
  tag_tone?: Product["tagTone"] | null;
  highlights?: string[];
  stock?: number;
  is_active?: boolean;
}

interface ProductListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: BackendProduct[];
}

export type ApiProduct = Product & {
  slug: string;
  long_description?: string;
  highlights: string[];
  stock?: number;
  is_active?: boolean;
};

function normalizeProduct(item: BackendProduct): ApiProduct {
  return {
    id: item.slug,
    slug: item.slug,
    cat: item.cat,
    name: item.name,
    weight: item.weight,
    price: Number(item.price),
    desc: item.desc ?? "",
    img: item.img ?? item.img_url ?? "",
    tag: item.tag ?? undefined,
    tagTone: item.tag_tone ?? undefined,
    long_description: item.long_description ?? "",
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    stock: item.stock,
    is_active: item.is_active,
  };
}

function normalizeProducts(payload: BackendProduct[] | ProductListResponse): ApiProduct[] {
  const items = Array.isArray(payload) ? payload : Array.isArray(payload.results) ? payload.results : [];
  return items.map(normalizeProduct);
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`API request failed (${response.status})${body ? `: ${body}` : ""}`);
  }
  return response.json() as Promise<T>;
}

export async function getProducts(category?: string): Promise<ApiProduct[]> {
  const url = new URL(`${API_BASE_URL}/api/products/`);
  if (category && category !== "all") url.searchParams.set("cat", category);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  return normalizeProducts(await readJson<BackendProduct[] | ProductListResponse>(response));
}

export async function getProduct(slug: string): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(slug)}/`, {
    headers: { Accept: "application/json" },
  });
  return normalizeProduct(await readJson<BackendProduct>(response));
}
