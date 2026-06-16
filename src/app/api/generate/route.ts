import { generate } from "@/lib/engine";
import { checkRateLimit } from "@/lib/rate-limit";
import type { GenerateRequestBody, StreamEvent } from "@/lib/types";
import { validatePublicUrl } from "@/lib/validate-url";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function sendEvent(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  event: StreamEvent,
) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: `Rate limit exceeded. Try again in ${rateLimit.retryAfterSeconds}s.`,
      },
      { status: 429 },
    );
  }

  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = await validatePublicUrl(body.url);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const result = await generate(validation.url.href, {
          maxPages: body.maxPages,
          maxDepth: body.maxDepth,
          concurrency: body.concurrency,
          budgetS: body.budgetS,
          enrich: body.enrich,
          includeLastmod: body.includeLastmod,
          onProgress: (event) => {
            sendEvent(controller, encoder, { type: "progress", ...event });
          },
        });

        sendEvent(controller, encoder, { type: "complete", result });
      } catch (error) {
        sendEvent(controller, encoder, {
          type: "error",
          message:
            error instanceof Error ? error.message : "Generation failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
