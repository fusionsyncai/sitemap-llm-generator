import type { Metadata } from "next";
import Link from "next/link";
import { GeneratorApp } from "@/components/generator-app";
import { PostCard } from "@/components/blog/post-card";
import { posts } from "@/content/blog";
import { brand } from "@/lib/brand";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sitemap.fusionsync.ai";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FAQS = [
  {
    question: "Is the sitemap and llms.txt generator free?",
    answer:
      "Yes. The tool is completely free to use with no signup and no API keys required.",
  },
  {
    question: "Does this tool use AI or an LLM to generate files?",
    answer:
      "No. It uses a deterministic HTTP crawler — it crawls your site and writes valid sitemap.xml and llms.txt files without calling any AI model.",
  },
  {
    question: "What is an llms.txt file?",
    answer:
      "llms.txt is a Markdown file placed at your site root that gives AI assistants like ChatGPT, Claude, and Perplexity a curated map of your most important pages.",
  },
  {
    question: "Where do I put the generated sitemap.xml and llms.txt files?",
    answer:
      "Upload both to your website root so they load at /sitemap.xml and /llms.txt, then submit your sitemap in Google Search Console.",
  },
  {
    question: "Can it crawl JavaScript-rendered sites?",
    answer:
      "The crawler is HTTP-only, so it reads server-rendered HTML. Links that appear only after client-side JavaScript may not be discovered.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "FusionSync AI",
      url: brand.siteUrl,
      logo: `${siteUrl}/brand/fusion-icon.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Sitemap & llms.txt Generator",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "Sitemap & llms.txt Generator",
      url: siteUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description:
        "Free tool that crawls any public website and generates sitemap.xml and llms.txt files for search engines and AI discovery.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function Home() {
  const latest = posts.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GeneratorApp
        playbook={
          <section className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                    From the Playbook
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
                    Guides on sitemaps, llms.txt, and getting cited by AI search.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="hidden shrink-0 text-sm font-medium text-[color:var(--accent-strong)] hover:underline sm:block"
                >
                  View all articles →
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {latest.map((post) => (
                  <PostCard key={post.meta.slug} meta={post.meta} />
                ))}
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
