import { loadSitemap } from "@geosuite/llms-txt-generator";
import type { CrawledPage } from "@geosuite/sitemap-builder";
import type { DiscoverySource } from "./types";

const USER_AGENT =
  "fusionsync-sitemap-generator/0.1.0 (+https://fusionsync.ai)";

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

export interface MergedDiscovery {
  pages: CrawledPage[];
  discoverySource: DiscoverySource;
  canonicalUrl: string;
  sitemapCount: number;
  crawlCount: number;
}

export function normalizePageUrl(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    if (
      (url.protocol === "http:" && url.port === "80") ||
      (url.protocol === "https:" && url.port === "443")
    ) {
      url.port = "";
    }
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    url.pathname = pathname;
    return url.href;
  } catch {
    return null;
  }
}

function sameOrigin(a: string, b: string): boolean {
  try {
    const left = new URL(a);
    const right = new URL(b);
    return `${left.protocol}//${left.host}` === `${right.protocol}//${right.host}`;
  } catch {
    return false;
  }
}

function isHtmlPageUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const blocked = new Set([
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".webp",
      ".ico",
      ".css",
      ".js",
      ".mjs",
      ".map",
      ".pdf",
      ".zip",
      ".xml",
      ".json",
      ".txt",
      ".woff",
      ".woff2",
      ".ttf",
      ".mp4",
      ".mp3",
    ]);
    const dot = pathname.lastIndexOf(".");
    if (dot < 0) return true;
    return !blocked.has(pathname.slice(dot));
  } catch {
    return false;
  }
}

export async function resolveCanonicalUrl(
  startUrl: string,
  timeoutMs = 8000,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(startUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,*/*",
      },
    });

    const finalUrl = normalizePageUrl(response.url || startUrl);
    if (!finalUrl) {
      throw new Error("Could not resolve canonical URL");
    }
    return finalUrl;
  } finally {
    clearTimeout(timer);
  }
}

async function loadSitemapEntries(
  sitemapUrl: string,
  origin: string,
  maxPages: number,
  collected: SitemapEntry[],
  visited: Set<string>,
): Promise<void> {
  if (collected.length >= maxPages || visited.has(sitemapUrl)) {
    return;
  }
  visited.add(sitemapUrl);

  const parsed = await loadSitemap(sitemapUrl);

  if (parsed.type === "sitemapindex") {
    for (const entry of parsed.entries) {
      if (collected.length >= maxPages) break;
      await loadSitemapEntries(entry.loc, origin, maxPages, collected, visited);
    }
    return;
  }

  for (const entry of parsed.entries) {
    if (collected.length >= maxPages) break;
    const normalized = normalizePageUrl(entry.loc);
    if (!normalized || !sameOrigin(normalized, origin)) continue;
    if (!isHtmlPageUrl(normalized)) continue;
    collected.push({
      loc: normalized,
      lastmod: entry.lastmod,
    });
  }
}

export async function loadSitemapTree(
  origin: string,
  maxPages: number,
): Promise<SitemapEntry[]> {
  const candidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  const collected: SitemapEntry[] = [];
  const visited = new Set<string>();

  for (const candidate of candidates) {
    try {
      await loadSitemapEntries(candidate, origin, maxPages, collected, visited);
      if (collected.length > 0) {
        break;
      }
    } catch {
      // Try the next conventional sitemap path.
    }
  }

  const deduped = new Map<string, SitemapEntry>();
  for (const entry of collected) {
    const normalized = normalizePageUrl(entry.loc);
    if (!normalized) continue;
    const existing = deduped.get(normalized);
    if (!existing) {
      deduped.set(normalized, { loc: normalized, lastmod: entry.lastmod });
      continue;
    }
    if (!existing.lastmod && entry.lastmod) {
      deduped.set(normalized, { loc: normalized, lastmod: entry.lastmod });
    }
  }

  return [...deduped.values()].slice(0, maxPages);
}

export function mergeDiscoveredPages(
  crawlPages: CrawledPage[],
  sitemapEntries: SitemapEntry[],
  maxPages: number,
  canonicalUrl: string,
): MergedDiscovery {
  const merged = new Map<string, CrawledPage>();
  let crawlCount = 0;

  for (const page of crawlPages) {
    const normalized = normalizePageUrl(page.url);
    if (!normalized) continue;
    merged.set(normalized, { ...page, url: normalized });
    crawlCount += 1;
  }

  let sitemapCount = 0;
  for (const entry of sitemapEntries) {
    const normalized = normalizePageUrl(entry.loc);
    if (!normalized) continue;

    const existing = merged.get(normalized);
    if (existing) {
      if (!existing.lastModified && entry.lastmod) {
        existing.lastModified = entry.lastmod;
      }
      continue;
    }

    merged.set(normalized, {
      url: normalized,
      depth: 1,
      status: 0,
      title: null,
      lastModified: entry.lastmod ?? null,
    });
    sitemapCount += 1;
  }

  const pages = [...merged.values()]
    .sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.url.localeCompare(b.url);
    })
    .slice(0, maxPages);

  const discoverySource: DiscoverySource =
    crawlCount > 0 && sitemapCount > 0
      ? "hybrid"
      : sitemapCount > 0
        ? "sitemap"
        : "crawl";

  return {
    pages,
    discoverySource,
    canonicalUrl,
    sitemapCount,
    crawlCount,
  };
}
