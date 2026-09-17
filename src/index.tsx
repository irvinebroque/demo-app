import { renderToStaticMarkup } from "react-dom/server.browser";
import { App } from "./app";
import kumoCss from "./kumo-standalone.txt";
import { handleMcpRequest } from "./mcp";

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

export function renderHtml(): string {
  return `<!doctype html>${renderToStaticMarkup(<App />)}`;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return handleMcpRequest(request, env, ctx);
    }

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

    return new Response(renderHtml(), { headers: HTML_HEADERS });
  },
} satisfies ExportedHandler<Env>;
