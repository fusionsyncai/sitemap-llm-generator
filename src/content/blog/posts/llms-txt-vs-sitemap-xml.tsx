import {
  A,
  Callout,
  H2,
  H3,
  InlineCode,
  Lead,
  LI,
  P,
  Table,
  ToolCTA,
  UL,
} from "@/components/blog/prose";
import type { PostMeta } from "@/content/blog/types";

export const meta: PostMeta = {
  slug: "llms-txt-vs-sitemap-xml",
  title: "llms.txt vs sitemap.xml: What's the Difference (and Do You Need Both)?",
  description:
    "llms.txt and sitemap.xml look similar but serve different audiences. Here is how they compare, when to use each, and why most modern sites should publish both.",
  category: "Strategy",
  date: "2026-06-08",
  readTime: "5 min read",
  keywords: [
    "llms.txt vs sitemap.xml",
    "difference between llms.txt and sitemap",
    "do i need llms.txt",
    "sitemap vs llms.txt",
    "AI SEO",
    "GEO",
  ],
};

export function Content() {
  return (
    <>
      <Lead>
        Both files sit at your site root, both list URLs, and both help machines
        understand your content. But <InlineCode>sitemap.xml</InlineCode> talks to
        search engine crawlers, while <InlineCode>llms.txt</InlineCode> talks to
        AI models. They are complementary — and most sites should ship both.
      </Lead>

      <H2 id="tldr">The short answer</H2>
      <UL>
        <LI>
          <strong>sitemap.xml</strong> = a complete, machine-readable index of
          every page you want crawled and indexed by Google and Bing.
        </LI>
        <LI>
          <strong>llms.txt</strong> = a curated, human-readable shortlist of your
          best pages, written for AI assistants like ChatGPT and Perplexity.
        </LI>
      </UL>
      <Callout title="Do you need both?">
        Yes, for most sites. They target different consumers and do not overlap.
        A sitemap maximizes <em>coverage</em> for classic search; an{" "}
        <InlineCode>llms.txt</InlineCode> maximizes <em>clarity</em> for AI
        search.
      </Callout>

      <H2 id="comparison">Side-by-side comparison</H2>
      <Table
        head={["Dimension", "sitemap.xml", "llms.txt"]}
        rows={[
          ["Primary audience", "Search crawlers (Googlebot, Bingbot)", "AI models (ChatGPT, Perplexity, Claude)"],
          ["File format", "XML", "Markdown"],
          ["Philosophy", "Complete coverage", "Curated priority"],
          ["Descriptions", "None", "Title + one-line summary per link"],
          ["Grouping", "Flat list", "Sections (Docs, Product, Blog)"],
          ["Established standard", "Yes (sitemaps.org)", "Emerging (llmstxt.org)"],
          ["Location", "/sitemap.xml", "/llms.txt"],
        ]}
      />

      <H2 id="when-sitemap">When sitemap.xml matters most</H2>
      <P>
        Your sitemap is about discovery and indexing in traditional search. It
        matters most when you have a large site, a new domain with few backlinks,
        deep pages buried several clicks from the homepage, or frequently updated
        content you want re-crawled quickly. If you are unsure how to build one,
        see our{" "}
        <A href="/blog/how-to-create-a-sitemap-xml">
          step-by-step sitemap.xml guide
        </A>
        .
      </P>

      <H2 id="when-llms">When llms.txt matters most</H2>
      <P>
        Your <InlineCode>llms.txt</InlineCode> is about being understood and cited
        by AI assistants. It matters most when you have documentation, a
        knowledge base, or product pages you want quoted accurately — and when
        you want control over how a model summarizes you. For the full breakdown,
        read{" "}
        <A href="/blog/what-is-llms-txt">what llms.txt is and how it works</A>.
      </P>

      <H2 id="workflow">The ideal workflow</H2>
      <P>
        Generate your sitemap first, then derive your{" "}
        <InlineCode>llms.txt</InlineCode> from it — curating down to your highest
        value pages and adding descriptions. That is exactly the pipeline our
        free tool automates: one crawl produces both files.
      </P>

      <ToolCTA />

      <H2 id="faq">Frequently asked questions</H2>
      <H3>Can llms.txt replace my sitemap?</H3>
      <P>
        No. They serve different audiences. Removing your sitemap would hurt how
        Google discovers your pages. Keep both.
      </P>
      <H3>Will having both confuse crawlers?</H3>
      <P>
        No. Search engines read <InlineCode>sitemap.xml</InlineCode> and ignore{" "}
        <InlineCode>llms.txt</InlineCode>; AI tools that support{" "}
        <InlineCode>llms.txt</InlineCode> read it specifically. There is no
        conflict.
      </P>
      <H3>Which should I create first?</H3>
      <P>
        Start with the sitemap — it has the most established impact — then add an{" "}
        <InlineCode>llms.txt</InlineCode> to get ahead on AI search visibility.
      </P>
    </>
  );
}
