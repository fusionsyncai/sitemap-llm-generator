import Link from "next/link";
import type { PostMeta } from "@/content/blog/types";
import { formatDate } from "@/content/blog/types";

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--accent-strong)]">
      {category}
    </span>
  );
}

export function PostCard({ meta }: { meta: PostMeta }) {
  return (
    <Link
      href={`/blog/${meta.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[color:var(--accent-border)] hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <CategoryTag category={meta.category} />
        <span className="text-xs text-slate-400">{meta.readTime}</span>
      </div>
      <h3 className="font-heading mt-3 text-lg font-bold leading-snug text-slate-900 group-hover:text-[color:var(--accent-strong)]">
        {meta.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
        {meta.description}
      </p>
      <div className="mt-4 flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">{formatDate(meta.date)}</span>
        <span className="text-sm font-medium text-[color:var(--accent-strong)]">
          Read →
        </span>
      </div>
    </Link>
  );
}
