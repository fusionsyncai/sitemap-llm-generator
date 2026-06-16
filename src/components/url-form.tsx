"use client";

import { useState } from "react";
import type { GenerateRequestBody } from "@/lib/types";

interface UrlFormProps {
  disabled: boolean;
  onSubmit: (payload: GenerateRequestBody) => void;
}

export function UrlForm({ disabled, onSubmit }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxPages, setMaxPages] = useState(200);
  const [maxDepth, setMaxDepth] = useState(3);
  const [concurrency, setConcurrency] = useState(6);
  const [budgetS, setBudgetS] = useState(50);
  const [enrich, setEnrich] = useState(true);
  const [includeLastmod, setIncludeLastmod] = useState(true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      url,
      maxPages,
      maxDepth,
      concurrency,
      budgetS,
      enrich,
      includeLastmod,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full sm:p-1.5">
        <input
          id="url"
          type="text"
          inputMode="url"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="yourwebsite.com"
          className="w-full rounded-xl bg-transparent px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none sm:rounded-full"
        />
        <button
          type="submit"
          disabled={disabled || !url.trim()}
          className="accent-gradient inline-flex shrink-0 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-full"
        >
          {disabled ? "Generating..." : "Generate files"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <p className="text-center text-sm text-slate-500">
          No signup required · sitemap.xml + llms.txt
        </p>
        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          className="text-sm font-medium text-[color:var(--accent-strong)] transition hover:underline"
        >
          {showAdvanced ? "Hide options" : "Options"}
        </button>
      </div>

      {showAdvanced ? (
        <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <Field
            label="Max pages"
            value={maxPages}
            min={1}
            max={1000}
            onChange={setMaxPages}
          />
          <Field
            label="Max depth"
            value={maxDepth}
            min={0}
            max={6}
            onChange={setMaxDepth}
          />
          <Field
            label="Concurrency"
            value={concurrency}
            min={1}
            max={16}
            onChange={setConcurrency}
          />
          <Field
            label="Time budget (seconds)"
            value={budgetS}
            min={10}
            max={55}
            onChange={setBudgetS}
          />

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={enrich}
              onChange={(event) => setEnrich(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[color:var(--accent)] accent-[color:var(--accent)]"
            />
            Enrich llms.txt with titles &amp; descriptions
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={includeLastmod}
              onChange={(event) => setIncludeLastmod(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[color:var(--accent)] accent-[color:var(--accent)]"
            />
            Include lastmod in sitemap.xml
          </label>
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-border)]"
      />
    </label>
  );
}
