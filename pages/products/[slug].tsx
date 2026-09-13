import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { formatToman } from "../../src/hooks/useReveal";
import type { Product } from "../../src/data/site";
import { getProduct, type ApiProduct } from "../../src/lib/productsApi";

export const getServerSideProps: GetServerSideProps<{ product: ApiProduct }> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  if (!slug) return { notFound: true };

  try {
    const product = await getProduct(slug);
    return { props: { product } };
  } catch {
    return { notFound: true };
  }
};

interface ExtraProps {
  onAdd: (p: Product) => void;
  justAddedId: string | null;
}

export default function ProductDetail({
  product,
  onAdd,
  justAddedId,
}: InferGetServerSidePropsType<typeof getServerSideProps> & ExtraProps) {
  const pageUrl = `/products/${product.slug}`;
  const description = product.long_description || product.desc;
  const highlights = product.highlights.length > 0 ? product.highlights : [
    "محصول مستقیم از زنبورستان صمدی فارم",
    product.weight,
    "همراه با اطلاعات محصول و مشخصات کامل",
  ];
  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <>
      <Head>
        <title>{product.name} | صمدی فارم</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${product.name} | صمدی فارم`} />
        <meta property="og:description" content={description} />
        {product.img && <meta property="og:image" content={product.img} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: product.img ? [product.img] : [],
              description,
              offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "IRR",
                availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                url: pageUrl,
              },
            }),
          }}
        />
      </Head>

      <section className="seo-detail-hero">
        <div className="shell">
          <nav className="breadcrumb" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link>
            <span>/</span>
            <Link href="/products">محصولات</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail-grid">
            <div className="product-detail-media">
              {product.img ? (
                <img src={product.img} alt={product.name} />
              ) : (
                <div aria-label="تصویر محصول موجود نیست" />
              )}
            </div>

            <div className="product-detail-copy">
              <span className="eyebrow">صمدی فارم · محصول زنبورستان</span>
              <h1>{product.name}</h1>
              <p className="product-detail-lead">{product.desc}</p>
              <div className="product-detail-price">
                {formatToman(product.price)} <small>تومان</small>
              </div>
              <div className="product-highlights">
                {highlights.map((item) => <span key={item}>✓ {item}</span>)}
              </div>
              <button
                type="button"
                className={`btn btn-primary product-detail-buy${justAddedId === product.id ? " is-added" : ""}`}
                onClick={() => onAdd(product)}
                disabled={!inStock}
              >
                {justAddedId === product.id ? "به سبد اضافه شد" : inStock ? "افزودن به سبد خرید" : "ناموجود"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="seo-article shell">
        <article>
          <h2>درباره {product.name}</h2>
          <p>{description}</p>
          <h2>مشخصات و نکات مهم</h2>
          <ul className="seo-list">
            {highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="seo-related">
            <Link href="/products">← مشاهده همه محصولات</Link>
            <Link href="/posts">خواندن مقالات زنبورداری ←</Link>
          </div>
        </article>
      </main>
    </>
  );
}
