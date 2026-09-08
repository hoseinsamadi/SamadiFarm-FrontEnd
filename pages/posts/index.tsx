import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getPosts, type MagazineListPage } from "../../src/lib/postsApi";

export const getServerSideProps: GetServerSideProps<{ data: MagazineListPage }> = async ({ query }) => {
  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  try {
    const data = await getPosts(page);
    return { props: { data } };
  } catch {
    return { notFound: true };
  }
};

function buildPageHref(page: number) {
  return page <= 1 ? "/posts" : `/posts?page=${page}`;
}

export default function PostsPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { posts, page, totalPages, nextPage, previousPage, count } = data;

  return (
    <>
      <Head>
        <title>مقالات زنبورداری و راهنمای خرید عسل | صمدی فارم</title>
        <meta
          name="description"
          content="مقالات صمدی فارم درباره زنبورداری، عسل طبیعی، فرآورده‌های کندو و راهنمای خرید آگاهانه."
        />
      </Head>
      <section className="page-opener">
        <div className="shell">
          <nav className="breadcrumb" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link>
            <span>/</span>
            <span>مقالات</span>
          </nav>
          <h1 className="page-title">مجله صمدی فارم</h1>
          <p className="page-desc">
            مطالب آموزشی درباره زنبورداری، عسل، فرآورده‌های کندو و تجربه‌های واقعی زنبورستان خانوادگی.
          </p>
        </div>
      </section>
      <main className="posts-page shell">
        {posts.length ? (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <article className="post-card" key={post.slug}>
                  <Link href={`/posts/${post.slug}`} className="post-image">
                    {post.image ? <img src={post.image} alt={post.title} loading="lazy" /> : <div className="post-image-fallback" />}
                  </Link>
                  <div className="post-body">
                    <div className="post-meta">
                      <span>{post.categoryLabel}</span>
                      <time>{post.publishedAtLabel}</time>
                    </div>
                    <h2>
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p>{post.excerpt}</p>
                    <Link className="post-read" href={`/posts/${post.slug}`}>
                      ادامه مطلب ←
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <nav className="posts-pagination" aria-label="صفحه‌بندی مجله">
              <div className="posts-pagination-summary">
                صفحه {page} از {totalPages} · {count} پست
              </div>
              <div className="posts-pagination-links">
                <Link className={`pagination-link${previousPage ? "" : " is-disabled"}`} href={previousPage ? buildPageHref(previousPage) : "#"} aria-disabled={!previousPage} tabIndex={previousPage ? 0 : -1}>
                  قبلی
                </Link>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                  <Link
                    key={item}
                    className={`pagination-link${item === page ? " is-current" : ""}`}
                    href={buildPageHref(item)}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {item}
                  </Link>
                ))}
                <Link className={`pagination-link${nextPage ? "" : " is-disabled"}`} href={nextPage ? buildPageHref(nextPage) : "#"} aria-disabled={!nextPage} tabIndex={nextPage ? 0 : -1}>
                  بعدی
                </Link>
              </div>
            </nav>
          </>
        ) : (
          <div className="empty-page">
            <h2>هنوز پستی منتشر نشده است</h2>
            <p>وقتی از Django admin پست جدید اضافه کنید، اینجا نمایش داده می‌شود.</p>
          </div>
        )}
      </main>
    </>
  );
}
