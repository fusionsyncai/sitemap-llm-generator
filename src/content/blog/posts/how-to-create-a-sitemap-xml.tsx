import {
  A,
  Callout,
  CodeBlock,
  H2,
  H3,
  InlineCode,
  Lead,
  LI,
  OL,
  P,
  Table,
  ToolCTA,
  UL,
} from "@/components/blog/prose";
import type { PostMeta } from "@/content/blog/types";

export const meta: PostMeta = {
  slug: "how-to-create-a-sitemap-xml",
  title: "How to Create a sitemap.xml File: A Step-by-Step Guide",
  description:
    "Learn how to create a valid sitemap.xml file, what tags to include, where to upload it, and how to submit it to Google Search Console — with copy-paste examples.",
  category: "Technical",
  date: "2026-06-10",
  readTime: "7 min read",
  keywords: [
    "sitemap.xml",
    "how to create a sitemap",
    "xml sitemap generator",
    "sitemap example",
    "submit sitemap to google",
    "SEO",
  ],
};

export function Content() {
  return (
    <>
      <Lead>
        A <InlineCode>sitemap.xml</InlineCode> file is a list of every important
        URL on your website, written in a format search engines understand. It
        helps Google, Bing, and AI crawlers discover and index your pages faster
        — especially pages that are not well linked internally.
      </Lead>

      <P>
        This guide walks through exactly what a sitemap is, the XML structure
        search engines expect, three ways to create one, and how to submit it to
        Google Search Console. Every example is copy-paste ready.
      </P>

      <H2 id="what">What is a sitemap.xml file?</H2>
      <P>
        A sitemap is a machine-readable inventory of your site. At minimum it
        lists each page&apos;s URL inside a{" "}
        <InlineCode>&lt;urlset&gt;</InlineCode> wrapper. Search engines read it
        to learn which URLs exist and, optionally, when they last changed.
      </P>
      <Callout title="Do you need one?">
        If your site is small and every page is linked from your navigation,
        Google can often find everything without a sitemap. But sitemaps become
        essential for large sites, new sites with few backlinks, sites with deep
        or orphaned pages, and sites that want faster re-indexing after updates.
      </Callout>

      <H2 id="structure">The structure of a valid sitemap</H2>
      <P>
        A sitemap is XML with a declaration, a namespaced{" "}
        <InlineCode>&lt;urlset&gt;</InlineCode>, and one{" "}
        <InlineCode>&lt;url&gt;</InlineCode> block per page. The only required
        child of each <InlineCode>&lt;url&gt;</InlineCode> is{" "}
        <InlineCode>&lt;loc&gt;</InlineCode> (the full URL).
      </P>
      <CodeBlock label="sitemap.xml">{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-06-10</lastmod>
  </url>
  <url>
    <loc>https://example.com/pricing</loc>
    <lastmod>2026-06-08</lastmod>
  </url>
  <url>
    <loc>https://example.com/blog/post-one</loc>
  </url>
</urlset>`}</CodeBlock>

      <H3>The available tags</H3>
      <Table
        head={["Tag", "Required", "Purpose"]}
        rows={[
          [<InlineCode key="l">&lt;loc&gt;</InlineCode>, "Yes", "The full, absolute URL of the page."],
          [<InlineCode key="m">&lt;lastmod&gt;</InlineCode>, "No", "Date the page last changed (YYYY-MM-DD)."],
          [<InlineCode key="c">&lt;changefreq&gt;</InlineCode>, "No", "Deprecated — search engines ignore it."],
          [<InlineCode key="p">&lt;priority&gt;</InlineCode>, "No", "Deprecated — search engines ignore it."],
        ]}
      />
      <Callout title="Skip changefreq and priority">
        Google has publicly stated it ignores <InlineCode>changefreq</InlineCode>{" "}
        and <InlineCode>priority</InlineCode>. A modern sitemap only needs{" "}
        <InlineCode>&lt;loc&gt;</InlineCode> and optionally{" "}
        <InlineCode>&lt;lastmod&gt;</InlineCode>.
      </Callout>

      <H2 id="methods">Three ways to create a sitemap</H2>
      <H3>1. Use a generator (fastest)</H3>
      <P>
        The quickest path is to crawl your live site and let a tool emit the XML.
        This catches every linked page without manual effort and is ideal for
        sites without a CMS plugin. Our{" "}
        <A href="/">free sitemap generator</A> does exactly this and produces a{" "}
        <A href="/blog/what-is-llms-txt">llms.txt</A> at the same time.
      </P>
      <H3>2. Use your CMS or framework</H3>
      <UL>
        <LI>
          <strong>WordPress:</strong> Yoast SEO or Rank Math generate and update
          a sitemap automatically at <InlineCode>/sitemap_index.xml</InlineCode>.
        </LI>
        <LI>
          <strong>Next.js:</strong> add an <InlineCode>app/sitemap.ts</InlineCode>{" "}
          file that returns your routes — Next builds{" "}
          <InlineCode>/sitemap.xml</InlineCode> for you.
        </LI>
        <LI>
          <strong>Shopify / Wix / Squarespace:</strong> a sitemap is generated
          for you automatically at <InlineCode>/sitemap.xml</InlineCode>.
        </LI>
      </UL>
      <H3>3. Write it by hand</H3>
      <P>
        For a handful of pages, you can author the XML manually using the example
        above. Keep it in sync as you add pages — which is why most teams
        automate it instead.
      </P>

      <ToolCTA />

      <H2 id="upload">Where to upload your sitemap</H2>
      <OL>
        <LI>
          Upload the file to your site root so it loads at{" "}
          <InlineCode>https://yourdomain.com/sitemap.xml</InlineCode>.
        </LI>
        <LI>
          Reference it from <InlineCode>robots.txt</InlineCode> so crawlers find
          it automatically:
        </LI>
      </OL>
      <CodeBlock label="robots.txt">{`User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`}</CodeBlock>

      <H2 id="submit">How to submit your sitemap to Google</H2>
      <OL>
        <LI>
          Open <A href="https://search.google.com/search-console">Google Search Console</A>{" "}
          and select your property.
        </LI>
        <LI>
          In the left menu, go to <strong>Indexing → Sitemaps</strong>.
        </LI>
        <LI>
          Enter <InlineCode>sitemap.xml</InlineCode> and click{" "}
          <strong>Submit</strong>.
        </LI>
        <LI>
          Check back for the &quot;Success&quot; status and the number of
          discovered URLs.
        </LI>
      </OL>
      <P>
        For Bing, repeat the process in{" "}
        <A href="https://www.bing.com/webmasters">Bing Webmaster Tools</A>.
      </P>

      <H2 id="mistakes">Common mistakes to avoid</H2>
      <UL>
        <LI>Including non-canonical, redirected, or <InlineCode>noindex</InlineCode> URLs.</LI>
        <LI>Listing pages blocked by <InlineCode>robots.txt</InlineCode>.</LI>
        <LI>Using relative URLs — every <InlineCode>&lt;loc&gt;</InlineCode> must be absolute.</LI>
        <LI>Exceeding 50,000 URLs or 50 MB per file (split into a sitemap index instead).</LI>
        <LI>Forgetting to regenerate after a big content update.</LI>
      </UL>

      <H2 id="faq">Frequently asked questions</H2>
      <H3>How many URLs can a sitemap contain?</H3>
      <P>
        Up to 50,000 URLs or 50 MB uncompressed per file. Larger sites use a
        sitemap index that points to multiple sitemap files.
      </P>
      <H3>How often should I update my sitemap?</H3>
      <P>
        Whenever you publish or significantly change pages. Automated generators
        and CMS plugins handle this for you on every change.
      </P>
      <H3>Does a sitemap guarantee indexing?</H3>
      <P>
        No. A sitemap helps discovery, but Google still decides what to index
        based on quality and crawl budget. It is a strong signal, not a command.
      </P>
    </>
  );
}
