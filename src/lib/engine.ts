import { crawlSite, renderSitemapXml } from "@geosuite/sitemap-builder";
import {
  enrichEntry,
  groupByPrefix,
  renderLlmsTxt,
  type LlmsEntry,
} from "@geosuite/llms-txt-generator";
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

  opts.onProgress?.({
    phase: "crawling",
    message: "Discovering pages on your site...",
  });

  const { pages, hitCap, hitDeadline } = await crawlSite(startUrl, {
    maxPages,
    maxDepth,
    concurrency,
    perPageTimeoutMs: timeoutMs,
    deadlineMs: Date.now() + budgetS * 1000,
    userAgent: USER_AGENT,
  });

  if (pages.length === 0) {
    throw new Error(
      "No pages were discovered. The site may be unreachable, block crawlers, or require JavaScript rendering.",
    );
  }

  opts.onProgress?.({
    phase: "crawled",
    message: `Found ${pages.length} page${pages.length === 1 ? "" : "s"}`,
    pageCount: pages.length,
  });

  const sitemapXml = renderSitemapXml(
    pages.map((page) => ({
      url: page.url,
      ...(includeLastmod && page.lastModified
        ? { lastmod: page.lastModified }
        : {}),
    })),
  );

  const siteName = deriveSiteName(startUrl);

  let entries: LlmsEntry[] = pages.map((page) => ({
    loc: page.url,
    title: page.title ?? undefined,
  }));

  if (enrich) {
    opts.onProgress?.({
      phase: "enriching",
      message: "Enriching page metadata for llms.txt...",
      processed: 0,
      total: entries.length,
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
      });
    }

    entries = enriched;
  }

  const groups = groupByPrefix(entries);
  const llmsTxt = renderLlmsTxt(groups, { name: siteName });

  opts.onProgress?.({
    phase: "complete",
    message: "Generation complete",
    pageCount: pages.length,
  });

  const descriptionByUrl = new Map(
    entries.map((entry) => [entry.loc, entry.description ?? null]),
  );

  return {
    pages: pages.map((page) => ({
      url: page.url,
      depth: page.depth,
      status: page.status,
      title: page.title,
      lastModified: page.lastModified ?? null,
      description: descriptionByUrl.get(page.url) ?? null,
    })),
    sitemapXml,
    llmsTxt,
    hitCap,
    hitDeadline,
    siteName,
  };
}
