import type { ProgressEvent } from "@/lib/types";

interface ProgressPanelProps {
  status: "idle" | "running" | "complete" | "error";
  progress: ProgressEvent | null;
  error: string | null;
}

const STEPS = ["Queued", "Crawling site", "Generating files", "Ready"] as const;

function activeStepIndex(
  status: ProgressPanelProps["status"],
  progress: ProgressEvent | null,
): number {
  if (status === "complete") return 3;
  if (!progress) return 0;
  switch (progress.phase) {
    case "resolving":
      return 0;
    case "sitemap":
    case "crawling":
      return 1;
    case "crawled":
      return 1;
    case "enriching":
      return 2;
    case "complete":
      return 3;
    default:
      return 0;
  }
}

function discoveryLabel(source?: ProgressEvent["discoverySource"]): string | null {
  switch (source) {
    case "hybrid":
      return "via sitemap.xml + crawl";
    case "sitemap":
      return "via sitemap.xml";
    case "crawl":
      return "via link crawl";
    default:
      return null;
  }
}

export function ProgressPanel({ status, progress, error }: ProgressPanelProps) {
  if (status === "idle") return null;

  const current = activeStepIndex(status, progress);
  const isError = status === "error";

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        {status === "running" ? (
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-[color:var(--accent)]" />
        ) : null}

        <p className="font-heading text-base font-bold text-slate-900">
          {isError
            ? "Generation failed"
            : status === "complete"
              ? "Your files are ready"
              : progress?.message || "Working..."}
        </p>

        {progress?.pageCount ? (
          <p className="mt-1 text-sm text-slate-500">
            {progress.pageCount} page{progress.pageCount === 1 ? "" : "s"}{" "}
            discovered
            {discoveryLabel(progress.discoverySource)
              ? ` ${discoveryLabel(progress.discoverySource)}`
              : ""}
          </p>
        ) : null}

        {progress?.canonicalUrl &&
        progress.phase !== "resolving" &&
        progress.canonicalUrl !== progress.message ? (
          <p className="mt-1 text-xs text-slate-400">
            Canonical URL: {progress.canonicalUrl}
          </p>
        ) : null}

        {progress?.phase === "enriching" && progress.total ? (
          <p className="mt-1 text-sm text-slate-500">
            Enriched {progress.processed ?? 0} of {progress.total}
          </p>
        ) : null}

        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
      </div>

      {!isError ? (
        <div className="mt-6 flex items-center justify-between gap-2">
          {STEPS.map((step, index) => {
            const done = index < current;
            const active = index === current;
            return (
              <div key={step} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
                      done
                        ? "accent-gradient text-white"
                        : active
                          ? "border-2 border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                          : "border border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {done ? (
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span
                      className={`mx-1 h-0.5 flex-1 rounded-full ${
                        done ? "bg-[color:var(--accent)]" : "bg-slate-200"
                      }`}
                    />
                  ) : null}
                </div>
                <span
                  className={`text-center text-[11px] font-medium leading-tight ${
                    active || done ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
