import { posts } from "@/content/blog";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sitemap.fusionsync.ai";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${brand.name} ${brand.nameAccent} — Sitemap & llms.txt Generator`);
  lines.push("");
  lines.push(
    "> Free tool to crawl any public website and generate publish-ready sitemap.xml and llms.txt files for search engines and AI discovery. Deterministic crawling — no API keys, no LLM.",
  );
  lines.push("");

  lines.push("## Tool");
  lines.push(
    `- [Sitemap & llms.txt Generator](${siteUrl}/): Enter a URL and export a sitemap.xml and llms.txt in seconds.`,
  );
  lines.push("");

  lines.push("## Guides");
  for (const { meta } of posts) {
    lines.push(
      `- [${meta.title}](${siteUrl}/blog/${meta.slug}): ${meta.description}`,
    );
  }
  lines.push("");

  lines.push("## Company");
  lines.push(
    `- [FusionSync AI](${brand.siteUrl}): Inbound automation and AI visibility for growing teams.`,
  );
  lines.push(`- [Book a call](${brand.bookCallUrl}): Talk to the FusionSync team.`);
  lines.push("");

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
