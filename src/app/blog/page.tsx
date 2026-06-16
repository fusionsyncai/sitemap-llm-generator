import type { Metadata } from "next";
import Link from "next/link";
import { CategoryTag, PostCard } from "@/components/blog/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedPost, posts } from "@/content/blog";
import { formatDate } from "@/content/blog/types";

export const metadata: Metadata = {
  title: "The Playbook: Sitemaps, llms.txt & AI Search",
  description:
    "Research-backed guides on sitemaps, llms.txt, and getting your site discovered by search engines and AI assistants like ChatGPT and Perplexity.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Playbook: Sitemaps, llms.txt & AI Search",
    description:
      "Guides on sitemaps, llms.txt, and AI search visibility from FusionSync.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const featured = getFeaturedPost();
  const rest = posts.filter((post) => post.meta.slug !== featured.meta.slug);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-[color:var(--accent-soft)] to-white" />
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-20">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
              The Playbook
            </p>
            <h1 className="font-heading mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Get found by search &amp; AI
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Practical, research-backed guides on sitemaps, llms.txt, and
              getting your site seen, parsed, and cited by Google, ChatGPT, and
              Perplexity.
            </p>
            <Link
              href="/"
              className="accent-gradient mt-7 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Generate your files free
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <Link
            href={`/blog/${featured.meta.slug}`}
            className="group block rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-[color:var(--accent-border)] hover:shadow-md sm:p-9"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--accent-strong)]">
                Featured
              </span>
              <span className="text-xs text-slate-400">
                {featured.meta.readTime}
              </span>
            </div>
            <h2 className="font-heading mt-4 max-w-3xl text-2xl font-bold leading-tight text-slate-900 group-hover:text-[color:var(--accent-strong)] sm:text-3xl">
              {featured.meta.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              {featured.meta.description}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <CategoryTag category={featured.meta.category} />
              <span className="text-xs text-slate-400">
                {formatDate(featured.meta.date)}
              </span>
            </div>
          </Link>

          <div className="mt-10">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              All articles
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.meta.slug} meta={post.meta} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
