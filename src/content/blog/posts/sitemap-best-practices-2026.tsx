import {
  A,
  Callout,
  CodeBlock,
  H2,
  InlineCode,
  Lead,
  LI,
  P,
  ToolCTA,
  UL,
} from "@/components/blog/prose";
import type { PostMeta } from "@/content/blog/types";

export const meta: PostMeta = {
  slug: "sitemap-best-practices-2026",
  title: "Sitemap.xml Best Practices for SEO and AI Search in 2026",
  description:
    "A practical checklist of sitemap.xml best practices: what to include, what to leave out, how to handle large sites, lastmod accuracy, and AI-era discovery.",
  category: "Google AI",
  date: "2026-06-05",
  readTime: "6 min read",
  keywords: [
    "sitemap best practices",
    "sitemap.xml SEO",
    "sitemap index",
    "lastmod sitemap",
    "technical SEO 2026",
    "AI search",
  ],
};

export function Content() {
  return (
    <>
      <Lead>
        A sitemap is one of the highest-leverage, lowest-effort technical SEO
        assets you can ship. But a sloppy sitemap can waste crawl budget and send
        mixed signals. Here is a practical, 2026-ready checklist for getting it
        right — for both classic search and AI crawlers.
      </Lead>

      <H2 id="include">1. Only include indexable, canonical URLs</H2>
      <P>
        Your sitemap is a list of pages you are proud of and want indexed. Every
        URL should return <InlineCode>200 OK</InlineCode>, be the canonical
        version, and be allowed for indexing.
      </P>
      <UL>
        <LI>No redirects (3xx) or error pages (4xx/5xx).</LI>
        <LI>No <InlineCode>noindex</InlineCode> pages.</LI>
        <LI>No URLs blocked by <InlineCode>robots.txt</InlineCode>.</LI>
        <LI>No non-canonical duplicates, parameter URLs, or session IDs.</LI>
      </UL>
      <Callout title="Why this matters">
        A sitemap full of redirects and dead pages tells Google your data is
        unreliable, which reduces trust in the whole file and wastes crawl
        budget on pages you do not care about.
      </Callout>

      <H2 id="lastmod">2. Use accurate lastmod dates</H2>
      <P>
        The <InlineCode>&lt;lastmod&gt;</InlineCode> tag is a genuinely useful
        signal — but only if it is honest. Google has said it largely ignores{" "}
        <InlineCode>lastmod</InlineCode> when sites lie (for example, setting
        today&apos;s date on every URL on every crawl). Set it to the date the
        content actually changed.
      </P>
      <CodeBlock label="Good lastmod usage">{`<url>
  <loc>https://example.com/pricing</loc>
  <lastmod>2026-05-28</lastmod>
</url>`}</CodeBlock>

      <H2 id="drop">3. Drop changefreq and priority</H2>
      <P>
        Both tags are deprecated in practice. Google ignores them, and they only
        add noise. A clean modern sitemap contains{" "}
        <InlineCode>&lt;loc&gt;</InlineCode> and, where meaningful,{" "}
        <InlineCode>&lt;lastmod&gt;</InlineCode> — nothing more. See our{" "}
        <A href="/blog/how-to-create-a-sitemap-xml">full sitemap format guide</A>.
      </P>

      <H2 id="large">4. Split large sites with a sitemap index</H2>
      <P>
        A single sitemap is capped at 50,000 URLs or 50 MB. Past that, use a
        sitemap index file that references multiple sitemaps — often grouped by
        type (products, blog, docs) so you can monitor each section&apos;s
        indexing separately.
      </P>
      <CodeBlock label="sitemap_index.xml">{`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
  </sitemap>
</sitemapindex>`}</CodeBlock>

      <H2 id="discoverable">5. Make your sitemap discoverable</H2>
      <UL>
        <LI>
          Reference it in <InlineCode>robots.txt</InlineCode> with a{" "}
          <InlineCode>Sitemap:</InlineCode> line.
        </LI>
        <LI>Submit it in Google Search Console and Bing Webmaster Tools.</LI>
        <LI>
          Keep it at a predictable path — <InlineCode>/sitemap.xml</InlineCode>{" "}
          or <InlineCode>/sitemap_index.xml</InlineCode>.
        </LI>
      </UL>

      <H2 id="ai">6. Don&apos;t forget AI crawlers</H2>
      <P>
        In 2026, your sitemap is also read by AI systems building their indexes.
        Pair it with an <A href="/blog/what-is-llms-txt">llms.txt</A> file to give
        AI models a curated view of your best content. The two together cover
        both classic and generative search — see{" "}
        <A href="/blog/llms-txt-vs-sitemap-xml">
          llms.txt vs sitemap.xml
        </A>{" "}
        for how they fit together.
      </P>

      <H2 id="automate">7. Automate generation and keep it fresh</H2>
      <P>
        A stale sitemap is a liability. Whether you use a CMS plugin, a framework
        route, or a crawler-based generator, make sure your sitemap regenerates
        when content changes. Manual sitemaps drift out of date fast.
      </P>

      <ToolCTA />

      <H2 id="checklist">Quick checklist</H2>
      <UL>
        <LI>Only canonical, indexable, 200-status URLs.</LI>
        <LI>Absolute URLs, correctly escaped.</LI>
        <LI>Honest <InlineCode>lastmod</InlineCode>; no <InlineCode>changefreq</InlineCode>/<InlineCode>priority</InlineCode>.</LI>
        <LI>Under 50,000 URLs / 50 MB per file; index for more.</LI>
        <LI>Referenced in <InlineCode>robots.txt</InlineCode> and submitted to search consoles.</LI>
        <LI>Paired with an <InlineCode>llms.txt</InlineCode> for AI discovery.</LI>
        <LI>Regenerated automatically on content changes.</LI>
      </UL>
    </>
  );
}
