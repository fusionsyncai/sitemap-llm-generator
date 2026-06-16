import type { Post } from "@/content/blog/types";
import {
  Content as WhatIsLlmsTxt,
  meta as whatIsLlmsTxtMeta,
} from "@/content/blog/posts/what-is-llms-txt";
import {
  Content as HowToCreateSitemap,
  meta as howToCreateSitemapMeta,
} from "@/content/blog/posts/how-to-create-a-sitemap-xml";
import {
  Content as LlmsVsSitemap,
  meta as llmsVsSitemapMeta,
} from "@/content/blog/posts/llms-txt-vs-sitemap-xml";
import {
  Content as SitemapBestPractices,
  meta as sitemapBestPracticesMeta,
} from "@/content/blog/posts/sitemap-best-practices-2026";

const registry: Post[] = [
  { meta: whatIsLlmsTxtMeta, Content: WhatIsLlmsTxt },
  { meta: howToCreateSitemapMeta, Content: HowToCreateSitemap },
  { meta: llmsVsSitemapMeta, Content: LlmsVsSitemap },
  { meta: sitemapBestPracticesMeta, Content: SitemapBestPractices },
];

export const posts: Post[] = [...registry].sort((a, b) =>
  b.meta.date.localeCompare(a.meta.date),
);

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.meta.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  return posts.filter((post) => post.meta.slug !== slug).slice(0, limit);
}

export function getFeaturedPost(): Post {
  return posts.find((post) => post.meta.featured) ?? posts[0];
}
