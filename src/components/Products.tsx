import type React from "react";
import Link from "next/link";
import type { CategoryId, Product } from "../data/site";
import { formatToman, toFa } from "../hooks/useReveal";
import { IconBag, IconCheck, IconFlask, IconHex } from "./icons";

export type Filter = CategoryId | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "همه‌ی محصولات" },
  { id: "single", label: "تک‌گل" },
  { id: "multi", label: "چندگیاه" },
  { id: "hive", label: "فرآورده‌های کندو" },
];

const TAG_CLASS: Record<string, string> = {
  honey: "",
  olive: "tag--olive",
  ember: "tag--ember",
};

interface ProductsProps {
  filter: Filter;
  products: Product[];
  loading: boolean;
  error: string | null;
  onFilter: (f: Filter) => void;
  onAdd: (p: Product) => void;
  justAddedId: string | null;
}

export default function Products({
  filter,
  products,
  loading,
  error,
  onFilter,
  onAdd,
  justAddedId,
}: ProductsProps) {
  const list = products ?? [];

  return (
    <section id="products" className="products-band">
      <div className="shell" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div className="catalog-toolbar">
          <div className="catalog-toolbar-title">
            <strong>فیلتر و انتخاب محصول</strong>
            <span>{loading ? "در حال دریافت..." : `${toFa(list.length)} محصول`}</span>
          </div>
          <div className="filters" role="tablist" aria-label="فیلتر دسته‌بندی محصولات">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`filter-chip${filter === f.id ? " is-active" : ""}`}
                onClick={() => onFilter(f.id)}
                disabled={loading && filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="products-note reveal" role="alert">
            <IconFlask size={17} />
            دریافت محصولات از سرور انجام نشد. مطمئن شوید Django روی پورت ۸۰۰۰ در حال اجراست.
          </div>
        )}

        {loading ? (
          <div className="products-grid" aria-busy="true" aria-live="polite">
            {Array.from({ length: 6 }).map((_, index) => (
              <article key={index} className="product-card" aria-hidden="true">
                <div className="product-media" style={{ minHeight: 280 }} />
                <div className="product-body">
                  <div style={{ height: 18, marginBottom: 12 }} />
                  <div style={{ height: 28, marginBottom: 12 }} />
                  <div style={{ height: 48 }} />
                </div>
              </article>
            ))}
          </div>
        ) : list.length === 0 && !error ? (
          <div className="products-note reveal">در حال حاضر محصولی برای نمایش وجود ندارد.</div>
        ) : (
          <div className="products-grid">
            {list.map((p, i) => (
              <article
                key={p.id}
                className="product-card reveal"
                style={{ "--d": `${(i % 3) * 0.1}s` } as React.CSSProperties}
              >
                <Link
                  href={`/products/${p.id}`}
                  className="product-media product-media-link"
                  aria-label={`مشاهده جزئیات ${p.name}`}
                >
                  <img src={p.img} alt={p.name} loading="lazy" />
                  {p.tag && <span className={`tag ${TAG_CLASS[p.tagTone ?? "honey"]}`}>{p.tag}</span>}
                </Link>
                <div className="product-body">
                  <div className="product-meta">
                    <span className="weight">
                      <IconHex size={12} />
                      {p.weight}
                    </span>
                    <span>{toFa(FILTERS.find((f) => f.id === p.cat)?.label ?? "")}</span>
                  </div>
                  <h2 className="product-card-title">
                    <Link href={`/products/${p.id}`}>{p.name}</Link>
                  </h2>
                  <p>{p.desc}</p>
                  <div className="product-foot">
                    <div className="price">
                      {formatToman(p.price)} <small>تومان</small>
                    </div>
                    <button
                      type="button"
                      className={`add-btn${justAddedId === p.id ? " is-added" : ""}`}
                      onClick={() => onAdd(p)}
                    >
                      {justAddedId === p.id ? (
                        <>
                          <IconCheck size={16} />اضافه شد
                        </>
                      ) : (
                        <>
                          <IconBag size={16} />افزودن
                        </>
                      )}
                    </button>
                  </div>
                  <Link href={`/products/${p.id}`} className="product-details-link">
                    مشاهده مشخصات کامل و راهنمای خرید ←
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="products-note reveal">
          <IconFlask size={17} />هر شیشه همراه با برگه‌ی آزمایش معتبر — ساکارز زیر ۳٪ و رطوبت زیر ۱۸٪
        </p>
      </div>
    </section>
  );
}
