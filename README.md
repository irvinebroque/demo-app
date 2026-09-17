# MCP Server

A public, stateless MCP server on Cloudflare Workers.

## Run locally

```sh
npm install
npm run dev
```

The MCP endpoint is `http://localhost:8787/mcp`.

## Verify

```sh
npm run check
```

## Deploy

```sh
npm run deploy
```

The deployed endpoint is `https://<worker-domain>/mcp`.

The checked-in stylesheet is the unmodified Kumo standalone build. Run
`npm run styles:check` after dependency updates.
