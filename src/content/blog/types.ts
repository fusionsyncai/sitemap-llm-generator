import type { ComponentType } from "react";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  readTime: string;
  keywords: string[];
  featured?: boolean;
}

export interface Post {
  meta: PostMeta;
  Content: ComponentType;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
