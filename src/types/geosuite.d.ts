declare module "@geosuite/sitemap-builder" {
  export interface CrawledPage {
    url: string;
    depth: number;
    status: number;
    title: string | null;
    lastModified?: string | null;
  }

  export interface CrawlOptions {
    maxPages?: number;
    maxDepth?: number;
    concurrency?: number;
    perPageTimeoutMs?: number;
    deadlineMs?: number;
    userAgent?: string;
    respectRobots?: boolean;
  }

  export function crawlSite(
    startUrl: string,
    opts?: CrawlOptions,
  ): Promise<{
    pages: CrawledPage[];
    hitCap: boolean;
    hitDeadline: boolean;
  }>;

  export function renderSitemapXml(
    entries: Array<{ url: string; lastmod?: string }>,
  ): string;
}

declare module "@geosuite/llms-txt-generator" {
  export interface LlmsEntry {
    loc: string;
    title?: string;
    description?: string;
  }

  export interface ParsedSitemap {
    type: "sitemap" | "sitemapindex";
    entries: Array<{ loc: string; lastmod?: string }>;
  }

  export function loadSitemap(urlOrPath: string): Promise<ParsedSitemap>;

  export function parseSitemap(xmlString: string): ParsedSitemap;

  export function enrichEntry(
    entry: LlmsEntry,
    opts?: { timeoutMs?: number; userAgent?: string },
  ): Promise<LlmsEntry>;

  export function groupByPrefix(
    entries: LlmsEntry[],
  ): Map<string, LlmsEntry[]>;

  export function renderLlmsTxt(
    groups: Map<string, LlmsEntry[]>,
    header?: { name?: string; summary?: string },
  ): string;
}
