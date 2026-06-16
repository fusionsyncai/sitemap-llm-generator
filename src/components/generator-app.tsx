"use client";

import { useState, type ReactNode } from "react";
import { ProgressPanel } from "@/components/progress-panel";
import { ResultsPanel } from "@/components/results-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UrlForm } from "@/components/url-form";
import { brand } from "@/lib/brand";
import type {
  GenerateRequestBody,
  GenerateResult,
  ProgressEvent,
  StreamEvent,
} from "@/lib/types";

type Status = "idle" | "running" | "complete" | "error";

export function GeneratorApp({ playbook }: { playbook?: ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: GenerateRequestBody) {
    setStatus("running");
    setProgress(null);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Request failed");
      }

      if (!response.body) {
        throw new Error("No response stream received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const line = chunk
            .split("\n")
            .find((entry) => entry.startsWith("data: "));

          if (!line) continue;

          const event = JSON.parse(line.slice(6)) as StreamEvent;

          if (event.type === "progress") {
            setProgress(event);
          }

          if (event.type === "complete") {
            setResult(event.result);
            setStatus("complete");
          }

          if (event.type === "error") {
            setError(event.message);
            setStatus("error");
          }
        }
      }
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong",
      );
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-[color:var(--accent-soft)] to-white" />
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center sm:px-6 sm:pt-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-strong)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              {brand.tagline}
            </span>

            <h1 className="font-heading mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Generate a <span className="accent-text">sitemap.xml</span> &amp;{" "}
              <span className="accent-text">llms.txt</span> for any site
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Crawl any public website and export publish-ready{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-700">
                sitemap.xml
              </code>{" "}
              and{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-700">
                llms.txt
              </code>{" "}
              files in seconds. No API keys, no LLM — just fast, deterministic
              crawling.
            </p>

            <div className="mt-8">
              <UrlForm disabled={status === "running"} onSubmit={handleSubmit} />
            </div>
          </div>
        </section>

        {/* Live output */}
        {status !== "idle" ? (
          <section className="mx-auto max-w-3xl px-5 pb-4 sm:px-6">
            <div className="space-y-6">
              <ProgressPanel
                status={status}
                progress={progress}
                error={error}
              />
              {result ? <ResultsPanel result={result} /> : null}
            </div>
          </section>
        ) : null}

        {/* 3 steps */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
            <h2 className="font-heading text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              From URL to ready files in 3 steps
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="font-heading text-sm font-bold text-[color:var(--accent-strong)]">
                    {step.number}
                  </span>
                  <h3 className="font-heading mt-3 text-base font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <h2 className="font-heading text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            What this tool does
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500 sm:text-base">
            A deterministic crawler that produces the two files modern search
            engines and AI assistants look for.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="accent-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
                  {feature.icon}
                </div>
                <h3 className="font-heading mt-4 text-base font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Playbook teaser */}
        {playbook}

        {/* Dark CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-border)]">
              Built by {brand.name} {brand.nameAccent}
            </p>
            <h2 className="font-heading mx-auto mt-4 max-w-2xl text-2xl font-bold text-white sm:text-3xl">
              Getting found is step one. Converting that traffic is step two.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              FusionSync AI installs the inbound infrastructure that turns
              attention into booked revenue — instant lead response, AI voice
              agents, and CRM automation across web, WhatsApp, and calls.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={brand.bookCallUrl}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Book a discovery call
              </a>
              <a
                href={brand.geoReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Run a free GEO report
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

const STEPS = [
  {
    number: "01",
    title: "Paste a URL",
    description:
      "Enter any public website. No account, no setup — just the link.",
  },
  {
    number: "02",
    title: "We crawl it",
    description:
      "A bounded, same-origin crawler discovers your pages in seconds.",
  },
  {
    number: "03",
    title: "Download files",
    description:
      "Copy or download a ready-to-publish sitemap.xml and llms.txt.",
  },
];

const FEATURES = [
  {
    title: "Search-ready sitemap",
    description:
      "A valid sitemaps.org XML file with loc and optional lastmod entries.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
        <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "AI-friendly llms.txt",
    description:
      "Pages grouped into sections with titles and descriptions for LLM discovery.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Bounded & safe",
    description:
      "Same-origin HTTP crawling with caps, SSRF protection, and rate limiting.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
        <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" strokeLinejoin="round" />
      </svg>
    ),
  },
];
