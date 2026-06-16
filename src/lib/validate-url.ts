import { isIP } from "node:net";
import dns from "node:dns/promises";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
]);

function isPrivateIp(ip: string): boolean {
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
    return true;
  }

  if (
    ip.startsWith("fe80:") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("::ffff:127.") ||
    ip.startsWith("::ffff:10.") ||
    ip.startsWith("::ffff:192.168.")
  ) {
    return true;
  }

  if (!isIP(ip)) {
    return false;
  }

  if (ip.includes(":")) {
    return false;
  }

  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 0) return true;

  return false;
}

export type ValidateUrlResult =
  | { ok: true; url: URL }
  | { ok: false; error: string };

export async function validatePublicUrl(
  input: string,
): Promise<ValidateUrlResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "URL is required" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return { ok: false, error: "Invalid URL format" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only HTTP and HTTPS URLs are allowed" };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { ok: false, error: "This hostname is not allowed" };
  }

  if (
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".localhost")
  ) {
    return { ok: false, error: "Local or internal hostnames are not allowed" };
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    return {
      ok: false,
      error: "Private or local network addresses are not allowed",
    };
  }

  if (!isIP(hostname)) {
    try {
      const [ipv4, ipv6] = await Promise.all([
        dns.resolve4(hostname).catch(() => [] as string[]),
        dns.resolve6(hostname).catch(() => [] as string[]),
      ]);

      const addresses = [...ipv4, ...ipv6];

      if (addresses.length === 0) {
        return { ok: false, error: "Could not resolve hostname" };
      }

      for (const address of addresses) {
        if (isPrivateIp(address)) {
          return {
            ok: false,
            error: "URL resolves to a private or local network address",
          };
        }
      }
    } catch {
      return { ok: false, error: "Could not resolve hostname" };
    }
  }

  return { ok: true, url: parsed };
}
