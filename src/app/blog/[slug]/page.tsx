import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPost, getRelatedPosts, posts } from "@/content/blog";
import { formatDate } from "@/content/blog/types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sitemap.fusionsync.ai";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  const { meta } = post;
  const url = `/blog/${meta.slug}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
      publishedTime: meta.date,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const { meta, Content } = post;
  const related = getRelatedPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    keywords: meta.keywords.join(", "),
    articleSection: meta.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${meta.slug}`,
    },
    author: { "@type": "Organization", name: "FusionSync AI", url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: "FusionSync AI",
      url: siteUrl,
    },
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
          <Link
            href="/blog"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← All articles
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--accent-strong)]">
              {meta.category}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(meta.date)} · {meta.readTime}
            </span>
          </div>

          <h1 className="font-heading mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {meta.title}
          </h1>

          <div className="mt-8 border-t border-slate-200 pt-2">
            <Content />
          </div>
        </article>

        {related.length > 0 ? (
          <section className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                Keep reading
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <PostCard key={item.meta.slug} meta={item.meta} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
