import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 text-lg leading-8 text-slate-600">{children}</p>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-heading mt-12 scroll-mt-24 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
    >
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="font-heading mt-8 scroll-mt-24 text-xl font-bold tracking-tight text-slate-900"
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-8 text-slate-700">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-slate-700 marker:text-[color:var(--accent)]">
      {children}
    </ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 list-decimal space-y-2 pl-6 leading-8 text-slate-700 marker:font-semibold marker:text-[color:var(--accent-strong)]">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const isInternal = href.startsWith("/");
  const className =
    "font-medium text-[color:var(--accent-strong)] underline decoration-[color:var(--accent-border)] underline-offset-2 transition hover:decoration-[color:var(--accent)]";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] text-slate-800">
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      {label ? (
        <div className="border-b border-slate-800 px-4 py-2 text-xs font-medium text-slate-400">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Callout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] p-5">
      {title ? (
        <p className="font-heading text-sm font-bold text-[color:var(--accent-strong)]">
          {title}
        </p>
      ) : null}
      <div className="mt-1 text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-50/50">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-slate-100 px-4 py-3 align-top text-slate-600"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ToolCTA() {
  return (
    <div className="accent-gradient mt-10 rounded-2xl p-[1px]">
      <div className="rounded-2xl bg-white p-6 sm:p-8">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
          Free tool
        </p>
        <h3 className="font-heading mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
          Generate your sitemap.xml &amp; llms.txt in seconds
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Paste any URL and export both files free — no signup, no API keys, no
          LLM. Built by {brand.name} {brand.nameAccent}.
        </p>
        <Link
          href="/"
          className="accent-gradient mt-5 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
        >
          Try the generator
        </Link>
      </div>
    </div>
  );
}
