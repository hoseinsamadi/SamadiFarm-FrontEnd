import type { Product } from "../data/site";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export interface ProductListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Product[];
}

function normalizeProducts(payload: Product[] | ProductListResponse): Product[] {
  return Array.isArray(payload) ? payload : Array.isArray(payload.results) ? payload.results : [];
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`API request failed (${response.status})${body ? `: ${body}` : ""}`);
  }
  return response.json() as Promise<T>;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const url = new URL(`${API_BASE_URL}/api/products/`);
  if (category && category !== "all") url.searchParams.set("cat", category);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  return normalizeProducts(await readJson<Product[] | ProductListResponse>(response));
}

export async function getProduct(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(slug)}/`, {
    headers: { Accept: "application/json" },
  });
  return readJson<Product>(response);
}

export function productImageUrl(image?: string | null): string {
  if (!image) return "/images/product-placeholder.svg";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE_URL}/${image.replace(/^\//, "")}`;
}
