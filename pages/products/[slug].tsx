import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { formatToman } from "../../src/hooks/useReveal";
import { SEO_PRODUCTS, type ProductSeo } from "../../src/data/seoContent";
import type { Product } from "../../src/data/site";

export const getStaticPaths:GetStaticPaths=async()=>({paths:SEO_PRODUCTS.map(p=>({params:{slug:p.slug}})),fallback:false});
export const getStaticProps:GetStaticProps<{product:ProductSeo}>=async({params})=>{const product=SEO_PRODUCTS.find(p=>p.slug===params?.slug);if(!product)return{notFound:true};return{props:{product}}};
interface ExtraProps{onAdd:(p:Product)=>void;justAddedId:string|null}
export default function ProductDetail({product,onAdd,justAddedId}:InferGetStaticPropsType<typeof getStaticProps>&ExtraProps){
  const pageUrl=`/products/${product.slug}`;
  return <>
    <Head><title>{product.seoTitle}</title><meta name="description" content={product.seoDescription}/><meta property="og:title" content={product.seoTitle}/><meta property="og:description" content={product.seoDescription}/><meta property="og:image" content={product.img}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Product",name:product.name,image:[product.img],description:product.seoDescription,offers:{"@type":"Offer",price:product.price,priceCurrency:"IRR",availability:"https://schema.org/InStock",url:pageUrl}})}}/></Head>
    <section className="seo-detail-hero"><div className="shell"><nav className="breadcrumb" aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><Link href="/products">محصولات</Link><span>/</span><span>{product.name}</span></nav><div className="product-detail-grid"><div className="product-detail-media"><img src={product.img} alt={product.name}/></div><div className="product-detail-copy"><span className="eyebrow">صمدی فارم · محصول زنبورستان</span><h1>{product.name}</h1><p className="product-detail-lead">{product.seoDescription}</p><div className="product-detail-price">{formatToman(product.price)} <small>تومان</small></div><div className="product-highlights">{product.highlights.map(x=><span key={x}>✓ {x}</span>)}</div><button type="button" className={`btn btn-primary product-detail-buy${justAddedId===product.id?" is-added":""}`} onClick={()=>onAdd(product)}>{justAddedId===product.id?"به سبد اضافه شد":"افزودن به سبد خرید"}</button></div></div></div></section>
    <main className="seo-article shell"><article><h2>درباره {product.name}</h2><p>{product.longDescription}</p><h2>مشخصات و نکات مهم</h2><ul className="seo-list">{product.highlights.map(x=><li key={x}>{x}</li>)}</ul>{product.faq.length>0&&<><h2>سؤالات متداول</h2><div className="faq-list">{product.faq.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></>}<div className="seo-related"><Link href="/products">← مشاهده همه محصولات</Link><Link href="/posts">خواندن مقالات زنبورداری ←</Link></div></article></main>
  </>;
}
