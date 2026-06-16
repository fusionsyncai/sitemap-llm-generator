import { Logo } from "@/components/logo";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="text-slate-500">Built by</span>
          <a
            href={brand.footerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Logo />
          </a>
        </div>
        <p className="text-sm text-slate-400">
          Free sitemap.xml &amp; llms.txt generator · deterministic, no API keys
        </p>
      </div>
    </footer>
  );
}
