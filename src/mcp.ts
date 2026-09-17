import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

export function createServer() {
  const server = new McpServer({
    name: "Cloudflare MCP Server",
    version: "1.0.0",
  });

  server.registerTool(
    "hello",
    {
      description: "Returns a greeting",
      inputSchema: {
        name: z.string().trim().min(1).max(100).optional(),
      },
    },
    async ({ name }) => ({
      content: [
        {
          type: "text",
          text: `Hello, ${name ?? "World"}!`,
        },
      ],
    }),
  );

  return server;
}

export function handleMcpRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  return createMcpHandler(createServer)(request, env, ctx);
}
