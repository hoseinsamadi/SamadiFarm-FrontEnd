import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getPost, type MagazinePost } from "../../src/lib/postsApi";

export const getServerSideProps: GetServerSideProps<{ post: MagazinePost }> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  if (!slug) return { notFound: true };

  try {
    const post = await getPost(slug);
    return { props: { post } };
  } catch {
    return { notFound: true };
  }
};

export default function PostDetail({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{post.title} | صمدی فارم</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.image ? <meta property="og:image" content={post.image} /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt,
              image: post.image ? [post.image] : undefined,
              datePublished: post.publishedAt || undefined,
              author: { "@type": "Organization", name: "صمدی فارم" },
            }),
          }}
        />
      </Head>
      <article className="post-detail shell">
        <nav className="breadcrumb" aria-label="مسیر صفحه">
          <Link href="/">خانه</Link>
          <span>/</span>
          <Link href="/posts">مقالات</Link>
          <span>/</span>
          <span>{post.title}</span>
        </nav>
        <header className="post-detail-head">
          <span>{post.categoryLabel}</span>
          <h1>{post.title}</h1>
          <time>{post.publishedAtLabel}</time>
          <p>{post.excerpt}</p>
        </header>
        {post.image ? (
          <div className="post-detail-image">
            <img src={post.image} alt={post.title} />
          </div>
        ) : null}
        <div className="post-content">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <footer className="seo-related">
          <Link href="/posts">← بازگشت به مجله</Link>
          <Link href="/products">مشاهده محصولات ←</Link>
        </footer>
      </article>
    </>
  );
}
