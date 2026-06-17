import { crawlSite, renderSitemapXml } from "@geosuite/sitemap-builder";
import {
  enrichEntry,
  groupByPrefix,
  renderLlmsTxt,
  type LlmsEntry,
} from "@geosuite/llms-txt-generator";
import {
  loadSitemapTree,
  mergeDiscoveredPages,
  normalizePageUrl,
  resolveCanonicalUrl,
} from "./discovery";
import type { GenerateOptions, GenerateResult } from "./types";

export const HARD_CAPS = {
  maxPages: 1000,
  maxDepth: 6,
  concurrency: 16,
  budgetS: 55,
} as const;

const USER_AGENT =
  "fusionsync-sitemap-generator/0.1.0 (+https://fusionsync.ai)";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number(value) || min));
}

function deriveSiteName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "Website";
  }
}

export async function generate(
  startUrl: string,
  opts: GenerateOptions = {},
): Promise<GenerateResult> {
  const maxPages = clamp(opts.maxPages ?? 200, 1, HARD_CAPS.maxPages);
  const maxDepth = clamp(opts.maxDepth ?? 3, 0, HARD_CAPS.maxDepth);
  const concurrency = clamp(opts.concurrency ?? 6, 1, HARD_CAPS.concurrency);
  const budgetS = clamp(opts.budgetS ?? 50, 10, HARD_CAPS.budgetS);
  const timeoutMs = opts.timeoutMs ?? 8000;
  const enrich = opts.enrich ?? true;
  const includeLastmod = opts.includeLastmod ?? true;

  const inputUrl = normalizePageUrl(startUrl) ?? startUrl;

  opts.onProgress?.({
    phase: "resolving",
    message: "Resolving canonical URL...",
  });

  const canonicalUrl = await resolveCanonicalUrl(inputUrl, timeoutMs);
  const origin = new URL(canonicalUrl).origin;

  const sitemapEntries = await loadSitemapTree(origin, maxPages);

  if (sitemapEntries.length > 0) {
    opts.onProgress?.({
      phase: "sitemap",
      message: `Loaded ${sitemapEntries.length} URLs from sitemap.xml`,
      pageCount: sitemapEntries.length,
      sitemapCount: sitemapEntries.length,
      canonicalUrl,
    });
  }

  const shouldSupplementCrawl = sitemapEntries.length > 0;
  const crawlMaxPages = shouldSupplementCrawl
    ? Math.min(maxPages, 30)
    : maxPages;
  const crawlMaxDepth = shouldSupplementCrawl ? Math.min(maxDepth, 2) : maxDepth;
  const crawlBudgetS = shouldSupplementCrawl
    ? Math.min(budgetS, 15)
    : budgetS;

  opts.onProgress?.({
    phase: "crawling",
    message: shouldSupplementCrawl
      ? "Running a quick link crawl to catch any unlisted pages..."
      : "Discovering pages on your site...",
    canonicalUrl,
  });

  const crawlResult = await crawlSite(canonicalUrl, {
    maxPages: crawlMaxPages,
    maxDepth: crawlMaxDepth,
    concurrency,
    perPageTimeoutMs: timeoutMs,
    deadlineMs: Date.now() + crawlBudgetS * 1000,
    userAgent: USER_AGENT,
  });

  const merged = mergeDiscoveredPages(
    crawlResult.pages,
    sitemapEntries,
    maxPages,
    canonicalUrl,
  );

  if (merged.pages.length === 0) {
    throw new Error(
      "No pages were discovered. The site may be unreachable, block crawlers, or require JavaScript rendering.",
    );
  }

  opts.onProgress?.({
    phase: "crawled",
    message: `Found ${merged.pages.length} page${merged.pages.length === 1 ? "" : "s"}`,
    pageCount: merged.pages.length,
    discoverySource: merged.discoverySource,
    canonicalUrl: merged.canonicalUrl,
    sitemapCount: merged.sitemapCount,
    crawlCount: merged.crawlCount,
  });

  const sitemapXml = renderSitemapXml(
    merged.pages.map((page) => ({
      url: page.url,
      ...(includeLastmod && page.lastModified
        ? { lastmod: page.lastModified }
        : {}),
    })),
  );

  const siteName = deriveSiteName(merged.canonicalUrl);

  let entries: LlmsEntry[] = merged.pages.map((page) => ({
    loc: page.url,
    title: page.title ?? undefined,
  }));

  if (enrich) {
    opts.onProgress?.({
      phase: "enriching",
      message: "Enriching page metadata for llms.txt...",
      processed: 0,
      total: entries.length,
      discoverySource: merged.discoverySource,
      canonicalUrl: merged.canonicalUrl,
    });

    const enriched: LlmsEntry[] = [];

    for (let index = 0; index < entries.length; index += concurrency) {
      const batch = entries.slice(index, index + concurrency);
      const results = await Promise.all(
        batch.map((entry) =>
          enrichEntry({ ...entry }, { timeoutMs, userAgent: USER_AGENT }),
        ),
      );
      enriched.push(...results);

      opts.onProgress?.({
        phase: "enriching",
        message: "Enriching page metadata for llms.txt...",
        processed: Math.min(index + batch.length, entries.length),
        total: entries.length,
        discoverySource: merged.discoverySource,
        canonicalUrl: merged.canonicalUrl,
      });
    }

    entries = enriched;
  }

  const groups = groupByPrefix(entries);
  const llmsTxt = renderLlmsTxt(groups, { name: siteName });

  opts.onProgress?.({
    phase: "complete",
    message: "Generation complete",
    pageCount: merged.pages.length,
    discoverySource: merged.discoverySource,
    canonicalUrl: merged.canonicalUrl,
    sitemapCount: merged.sitemapCount,
    crawlCount: merged.crawlCount,
  });

  const descriptionByUrl = new Map(
    entries.map((entry) => [entry.loc, entry.description ?? null]),
  );

  return {
    pages: merged.pages.map((page) => ({
      url: page.url,
      depth: page.depth,
      status: page.status,
      title: page.title,
      lastModified: page.lastModified ?? null,
      description: descriptionByUrl.get(page.url) ?? null,
    })),
    sitemapXml,
    llmsTxt,
    hitCap: crawlResult.hitCap || merged.pages.length >= maxPages,
    hitDeadline: crawlResult.hitDeadline,
    siteName,
    discoverySource: merged.discoverySource,
    canonicalUrl: merged.canonicalUrl,
    inputUrl,
    sitemapCount: merged.sitemapCount,
    crawlCount: merged.crawlCount,
  };
}
