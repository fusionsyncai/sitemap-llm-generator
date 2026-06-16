import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";

function getLogoDataUrl() {
  const logo = readFileSync(join(process.cwd(), "public/brand/fusion-icon.png"));
  return `data:image/png;base64,${Buffer.from(logo).toString("base64")}`;
}

export function createSocialImage() {
  const logoUrl = getLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 52%, #ecfdf5 100%)",
          fontFamily: "Arial, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid #ccfbf1",
            borderRadius: 36,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 28px 80px rgba(15, 23, 42, 0.12)",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="FusionSync AI"
              width={54}
              height={54}
              style={{ objectFit: "contain" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              <span>FusionSync</span>
              <span style={{ color: "#0d9488" }}>AI</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                alignSelf: "flex-start",
                border: "1px solid #99f6e4",
                borderRadius: 999,
                background: "#f0fdfa",
                color: "#0f766e",
                fontSize: 22,
                fontWeight: 700,
                padding: "10px 18px",
              }}
            >
              Free SEO & AI visibility tool
            </div>
            <h1
              style={{
                margin: 0,
                maxWidth: 900,
                color: "#0f172a",
                fontSize: 72,
                lineHeight: 1.04,
                letterSpacing: "-0.045em",
                fontWeight: 900,
              }}
            >
              Generate sitemap.xml & llms.txt files in seconds
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 820,
                color: "#475569",
                fontSize: 30,
                lineHeight: 1.35,
              }}
            >
              Crawl any public website and export publish-ready files for search
              engines and AI discovery. No API keys. No LLM.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#64748b",
              fontSize: 22,
            }}
          >
            <span>sitemap.fusionsync.ai</span>
            <span style={{ color: "#0f766e", fontWeight: 700 }}>
              Built by FusionSync AI
            </span>
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
