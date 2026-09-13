import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Products, { type Filter } from "../components/Products";
import OrderSection from "../components/OrderSection";
import type { Product } from "../data/site";
import { getProducts } from "../lib/productsApi";
import { toFa, useReveal } from "../hooks/useReveal";
import { IconHex } from "../components/icons";

const VALID_FILTERS: Filter[] = ["single", "multi", "hive"];

interface ProductsPageProps {
  onAdd: (p: Product) => void;
  justAddedId: string | null;
}

export default function ProductsPage({ onAdd, justAddedId }: ProductsPageProps) {
  const router = useRouter();
  const raw = typeof router.query.cat === "string" ? router.query.cat : null;
  const filter: Filter = VALID_FILTERS.includes(raw as Filter) ? (raw as Filter) : "all";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useReveal([filter, products.length]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const data = await getProducts(filter);
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) {
          setProducts([]);
          setError(err instanceof Error ? err.message : "خطا در دریافت محصولات");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const shown = products.length;

  const setFilter = (nextFilter: Filter) => {
    void router.push(
      nextFilter === "all" ? "/products" : `/products?cat=${nextFilter}`,
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <section className="page-opener">
        <div className="honeycomb pattern-abs" />
        <div className="shell" style={{ position: "relative" }}>
          <nav className="breadcrumb" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link>
            <span>/</span>
            <span>محصولات</span>
          </nav>
          <div className="opener-flex">
            <div>
              <h1 className="page-title">برداشتِ تازه‌ی کندوها</h1>
              <p className="page-desc">
                همه‌ی شیشه‌ها همان روزِ برداشت درب‌موم می‌شوند و همراه با برگه‌ی آزمایش ساکارز و رطوبت به دست شما می‌رسند.
              </p>
            </div>
            <div className="opener-facts">
              <span className="fact">
                <IconHex size={15} />
                {loading ? "در حال دریافت محصولات..." : `${toFa(shown)} محصول آماده‌ی ارسال`}
              </span>
            </div>
          </div>
        </div>
      </section>

      <Products
        filter={filter}
        products={products}
        loading={loading}
        error={error}
        onFilter={setFilter}
        onAdd={onAdd}
        justAddedId={justAddedId}
      />
      <OrderSection />
    </>
  );
}
