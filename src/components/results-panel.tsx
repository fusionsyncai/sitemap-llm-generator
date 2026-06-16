"use client";

import { useMemo, useState } from "react";
import type { GenerateResult } from "@/lib/types";

type Tab = "sitemap" | "llms";

interface ResultsPanelProps {
  result: GenerateResult;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const [tab, setTab] = useState<Tab>("sitemap");
  const [copied, setCopied] = useState(false);

  const activeContent = tab === "sitemap" ? result.sitemapXml : result.llmsTxt;
  const filename = tab === "sitemap" ? "sitemap.xml" : "llms.txt";

  const warnings = useMemo(() => {
    const items: string[] = [];
    if (result.hitCap) {
      items.push(
        "Page limit reached. Increase max pages for larger sites.",
      );
    }
    if (result.hitDeadline) {
      items.push(
        "Time budget reached before the crawl finished. Try a higher time budget.",
      );
    }
    return items;
  }, [result.hitCap, result.hitDeadline]);

  async function handleCopy() {
    await navigator.clipboard.writeText(activeContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([activeContent], {
      type: tab === "sitemap" ? "application/xml" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Results
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {result.pages.length} pages for {result.siteName}
          </p>
        </div>

        <div className="inline-flex rounded-full bg-slate-100 p-1">
          <TabButton active={tab === "sitemap"} onClick={() => setTab("sitemap")}>
            sitemap.xml
          </TabButton>
          <TabButton active={tab === "llms"} onClick={() => setTab("llms")}>
            llms.txt
          </TabButton>
        </div>
      </div>

      {warnings.length > 0 ? (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-3">
          {warnings.map((warning) => (
            <p key={warning} className="text-sm text-amber-700">
              {warning}
            </p>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 border-b border-slate-200 px-5 py-4">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="accent-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
        >
          Download {filename}
        </button>
      </div>

      <pre className="max-h-[26rem] overflow-auto bg-slate-50 p-5 text-xs leading-6 text-slate-700 sm:text-sm">
        {activeContent}
      </pre>

      <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
        <p className="font-medium text-slate-700">How to publish</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Upload <code className="text-slate-700">sitemap.xml</code> to your
            site root so it loads at{" "}
            <code className="text-slate-700">/sitemap.xml</code>.
          </li>
          <li>
            Upload <code className="text-slate-700">llms.txt</code> to your site
            root so it loads at{" "}
            <code className="text-slate-700">/llms.txt</code>.
          </li>
          <li>
            Submit your sitemap in Google Search Console and reference it from{" "}
            <code className="text-slate-700">robots.txt</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}
