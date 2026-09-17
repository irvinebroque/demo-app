import { renderToStaticMarkup } from "react-dom/server.browser";
import { App } from "./app";
import kumoCss from "./kumo-standalone.txt";

const HTML_HEADERS = {
  "Cache-Control": "private, no-store",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'",
  "Content-Type": "text/html; charset=UTF-8",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
} as const;

const CSS_HEADERS = {
  "Cache-Control": "public, max-age=86400",
  "Content-Type": "text/css; charset=UTF-8",
  "X-Content-Type-Options": "nosniff",
} as const;

export function renderHtml(email: string): string {
  return `<!doctype html>${renderToStaticMarkup(<App email={email} />)}`;
}

export default {
  async fetch(request, _env, ctx): Promise<Response> {
    if (!ctx.access) {
      return new Response("Access required", {
        status: 403,
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Type": "text/plain; charset=UTF-8",
        },
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/kumo.css") {
      return new Response(kumoCss, { headers: CSS_HEADERS });
    }

    if (url.pathname !== "/") {
      return new Response("Not found", {
        status: 404,
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Type": "text/plain; charset=UTF-8",
        },
      });
    }

    const identity = await ctx.access.getIdentity();
    const email = identity?.email ?? "unknown";

    return new Response(renderHtml(email), { headers: HTML_HEADERS });
  },
} satisfies ExportedHandler<Env>;
