import { env } from "cloudflare:workers";
import { createExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src";

const IncomingRequest = Request as new (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Request<unknown, IncomingRequestCfProperties>;

function mcpRequest(
  id: number,
  method: string,
  params: Record<string, unknown>,
) {
  return worker.fetch(
    new IncomingRequest("https://example.com/mcp", {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
        "MCP-Protocol-Version": "2025-06-18",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id,
        method,
        params,
      }),
    }),
    env,
    createExecutionContext(),
  );
}

describe("MCP Worker", () => {
  it("renders the public Kumo page", async () => {
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/"),
      env,
      createExecutionContext(),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=UTF-8",
    );
    expect(html).toContain("MCP Server");
    expect(html).toContain("/mcp");
    expect(html).toContain(">Public<");
    expect(html).not.toContain("Log in");
  });

  it("serves the unmodified Kumo standalone stylesheet", async () => {
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/kumo.css"),
      env,
      createExecutionContext(),
    );
    const css = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/css; charset=UTF-8",
    );
    expect(css).toContain("--color-kumo-");
  });

  it("initializes the unauthenticated MCP endpoint", async () => {
    const response = await mcpRequest(1, "initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: {
        name: "test",
        version: "1.0.0",
      },
    });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('"name":"Cloudflare MCP Server"');
    expect(body).not.toContain("unauthorized");
  });

  it("lists the hello tool", async () => {
    const response = await mcpRequest(2, "tools/list", {});
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('"name":"hello"');
    expect(body).toContain('"description":"Returns a greeting"');
  });

  it("calls the hello tool", async () => {
    const response = await mcpRequest(3, "tools/call", {
      name: "hello",
      arguments: {
        name: "Brendan",
      },
    });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('"text":"Hello, Brendan!"');
  });

  it("returns 404 outside the public page and MCP endpoint", async () => {
    const response = await worker.fetch(
      new IncomingRequest("https://example.com/missing"),
      env,
      createExecutionContext(),
    );

    expect(response.status).toBe(404);
  });
});
