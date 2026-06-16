export type ProgressPhase =
  | "crawling"
  | "crawled"
  | "enriching"
  | "complete";

export interface ProgressEvent {
  phase: ProgressPhase;
  message: string;
  pageCount?: number;
  processed?: number;
  total?: number;
}

export interface PageResult {
  url: string;
  depth: number;
  status: number;
  title: string | null;
  lastModified: string | null;
  description?: string | null;
}

export interface GenerateResult {
  pages: PageResult[];
  sitemapXml: string;
  llmsTxt: string;
  hitCap: boolean;
  hitDeadline: boolean;
  siteName: string;
}

export interface GenerateOptions {
  maxPages?: number;
  maxDepth?: number;
  concurrency?: number;
  budgetS?: number;
  timeoutMs?: number;
  enrich?: boolean;
  includeLastmod?: boolean;
  onProgress?: (event: ProgressEvent) => void;
}

export interface GenerateRequestBody {
  url: string;
  maxPages?: number;
  maxDepth?: number;
  concurrency?: number;
  budgetS?: number;
  enrich?: boolean;
  includeLastmod?: boolean;
}

export type StreamEvent =
  | ({ type: "progress" } & ProgressEvent)
  | { type: "complete"; result: GenerateResult }
  | { type: "error"; message: string };
