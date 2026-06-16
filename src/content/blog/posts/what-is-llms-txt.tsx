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
  slug: "what-is-llms-txt",
  title: "What Is llms.txt? The Complete Guide for 2026",
  description:
    "llms.txt is a simple Markdown file that tells AI models like ChatGPT, Perplexity, and Claude which pages on your site matter most. Here is what it is, why it matters, and how to create one.",
  category: "LLM Visibility",
  date: "2026-06-12",
  readTime: "6 min read",
  featured: true,
  keywords: [
    "llms.txt",
    "what is llms.txt",
    "llms.txt file",
    "llms.txt generator",
    "AI SEO",
    "generative engine optimization",
  ],
};

export function Content() {
  return (
    <>
      <Lead>
        <InlineCode>llms.txt</InlineCode> is a plain-text Markdown file you place
        at the root of your website that gives large language models a clean,
        curated map of your most important content. Think of it as a{" "}
        <InlineCode>robots.txt</InlineCode> for the AI era — but instead of
        blocking crawlers, it guides them to the pages you actually want cited.
      </Lead>

      <P>
        Search is splitting in two. Half of your future traffic still comes from
        Google&apos;s blue links. The other half is increasingly mediated by AI
        assistants — ChatGPT, Perplexity, Claude, Gemini, and Google AI
        Overviews — that read your site, summarize it, and decide whether to
        recommend you. The <InlineCode>llms.txt</InlineCode> standard, proposed
        at <A href="https://llmstxt.org/">llmstxt.org</A>, is the emerging
        convention for talking to that second half.
      </P>

      <H2 id="why">Why llms.txt exists</H2>
      <P>
        When an AI model fetches your page, it does not see your beautiful
        layout. It sees raw HTML — navigation, cookie banners, footers, ad slots,
        and JavaScript it may not even execute. The signal it actually needs
        (your content) is buried in noise. On large sites, the model also has no
        reliable way to know which of your thousands of URLs are canonical,
        high-value pages versus thin tag archives.
      </P>
      <P>
        <InlineCode>llms.txt</InlineCode> solves both problems at once. It is a
        short, human-readable file that lists your key pages with titles and
        one-line descriptions, grouped into logical sections. It is cheap to
        produce, trivial to parse, and gives the model exactly the context it
        needs.
      </P>

      <Callout title="The one-line version">
        <InlineCode>robots.txt</InlineCode> says what crawlers <em>can&apos;t</em>{" "}
        touch. <InlineCode>llms.txt</InlineCode> says what they <em>should</em>{" "}
        read first.
      </Callout>

      <H2 id="format">What an llms.txt file looks like</H2>
      <P>
        The format is intentionally minimal Markdown: an <InlineCode>H1</InlineCode>{" "}
        with your site name, an optional blockquote summary, then{" "}
        <InlineCode>H2</InlineCode> sections containing bulleted links.
      </P>
      <CodeBlock label="llms.txt">{`# Acme Analytics

> Acme is a privacy-first product analytics platform for SaaS teams.

## Product
- [Pricing](https://acme.com/pricing): Plans, limits, and billing FAQs.
- [Integrations](https://acme.com/integrations): Connect your stack in minutes.

## Docs
- [Quickstart](https://acme.com/docs/quickstart): Install and send your first event.
- [API Reference](https://acme.com/docs/api): Full REST and SDK documentation.

## Blog
- [What is product analytics?](https://acme.com/blog/product-analytics): A primer.`}</CodeBlock>

      <P>
        That is the whole standard. No XML, no schema, no required fields beyond
        the title. Its simplicity is the point — anything a model can read in one
        pass beats a sprawling document it has to guess at.
      </P>

      <H2 id="benefits">What you gain from publishing one</H2>
      <UL>
        <LI>
          <strong>Better citations.</strong> When an assistant can find your
          canonical page fast, it is more likely to quote and link it.
        </LI>
        <LI>
          <strong>Cleaner context.</strong> Your descriptions become the
          model&apos;s summary, instead of whatever it scrapes from a cluttered
          page.
        </LI>
        <LI>
          <strong>Control over priority.</strong> You decide which pages lead —
          docs, pricing, and product, not your privacy policy.
        </LI>
        <LI>
          <strong>Future-proofing.</strong> Adoption is early, which means
          publishing now is cheap and puts you ahead of competitors.
        </LI>
      </UL>

      <H2 id="vs-sitemap">How is it different from sitemap.xml?</H2>
      <P>
        They are complementary, not competing. A{" "}
        <A href="/blog/llms-txt-vs-sitemap-xml">
          sitemap.xml is for search engine crawlers
        </A>{" "}
        and lists every indexable URL. An <InlineCode>llms.txt</InlineCode> is a
        curated, human-readable shortlist for AI models. You want both.
      </P>
      <Table
        head={["", "sitemap.xml", "llms.txt"]}
        rows={[
          ["Audience", "Search crawlers (Google, Bing)", "AI models (ChatGPT, Perplexity)"],
          ["Format", "XML", "Markdown"],
          ["Goal", "Complete index coverage", "Curated, high-value context"],
          ["Descriptions", "No", "Yes (titles + summaries)"],
          ["Typical size", "All URLs", "Your best pages"],
        ]}
      />

      <H2 id="how-to">How to create an llms.txt file</H2>
      <OL>
        <LI>
          Collect your most valuable URLs — start from your existing{" "}
          <A href="/blog/how-to-create-a-sitemap-xml">sitemap.xml</A>.
        </LI>
        <LI>Group them into sections (Product, Docs, Blog, Company).</LI>
        <LI>Add a clear one-line description to each link.</LI>
        <LI>
          Save the file as <InlineCode>llms.txt</InlineCode> and upload it to your
          site root so it loads at <InlineCode>/llms.txt</InlineCode>.
        </LI>
      </OL>
      <P>
        You do not have to do this by hand. Our free generator crawls your site
        and produces a structured <InlineCode>llms.txt</InlineCode> (and a{" "}
        <InlineCode>sitemap.xml</InlineCode>) automatically.
      </P>

      <ToolCTA />

      <H2 id="faq">Frequently asked questions</H2>
      <H3>Where do I put the llms.txt file?</H3>
      <P>
        At your domain root, so it is reachable at{" "}
        <InlineCode>https://yourdomain.com/llms.txt</InlineCode> — exactly like{" "}
        <InlineCode>robots.txt</InlineCode>.
      </P>
      <H3>Is llms.txt an official standard?</H3>
      <P>
        It is a community proposal from <A href="https://llmstxt.org/">llmstxt.org</A>,
        gaining adoption across documentation tools and developer platforms. It
        is not yet enforced by any single AI vendor, but the cost of publishing
        is near zero and the upside is real.
      </P>
      <H3>Will llms.txt hurt my SEO?</H3>
      <P>
        No. It is a separate file that does not affect how Google crawls or ranks
        your pages. It only adds context for AI consumers.
      </P>
      <H3>How often should I update it?</H3>
      <P>
        Whenever your important pages change — typically the same cadence you
        regenerate your sitemap. Regenerating it takes seconds with an automated
        tool.
      </P>
    </>
  );
}
