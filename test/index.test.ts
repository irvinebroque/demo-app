import { env } from "cloudflare:workers";
import { createExecutionContext } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import worker from "../src";

const IncomingRequest = Request as new (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Request<unknown, IncomingRequestCfProperties>;

function accessContext(email: string | undefined) {
  const ctx = createExecutionContext();
  const getIdentity = vi.fn(async () => ({ email }));

  Object.defineProperty(ctx, "access", {
    value: {
      aud: "cloudflare-access-basic-web-app",
      getIdentity,
    } satisfies CloudflareAccessContext,
  });

  return { ctx, getIdentity };
}

describe("Access Worker", () => {
  it("renders the simulated Access identity", async () => {
    const { ctx, getIdentity } = accessContext("developer@example.com");
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/"),
      env,
      ctx,
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=UTF-8",
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(html).toContain("developer@example.com");
    expect(html).toContain("/cdn-cgi/access/logout");
    expect(html).toContain('href="/"');
    expect(getIdentity).toHaveBeenCalledOnce();
  });

  it("serves the unmodified Kumo standalone stylesheet", async () => {
    const { ctx, getIdentity } = accessContext("developer@example.com");
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/kumo.css"),
      env,
      ctx,
    );
    const css = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/css; charset=UTF-8",
    );
    expect(css).toContain("--color-kumo-");
    expect(getIdentity).not.toHaveBeenCalled();
  });

  it("returns 403 without an Access context", async () => {
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/"),
      env,
      createExecutionContext(),
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Access required");
  });

  it("escapes identity values through React server rendering", async () => {
    const { ctx } = accessContext('<script>alert("xss")</script>@example.com');
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/"),
      env,
      ctx,
    );
    const html = await response.text();

    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });

  it("falls back when Access has no email", async () => {
    const { ctx } = accessContext(undefined);
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/"),
      env,
      ctx,
    );

    expect(await response.text()).toContain(">unknown<");
  });
});
