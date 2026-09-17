# Access Worker

A small server-rendered Worker protected by Cloudflare Access.

## Run locally

```sh
npm install
npm run dev
```

Wrangler supplies `developer@example.com` through the local Access identity.

## Verify

```sh
npm run check
```

## Deploy

```sh
npm run deploy
```

In the Cloudflare dashboard, enable Access for the Worker and attach an Allow
policy. Do not add a bypass policy. Access must remain the authentication
boundary.

The app reads identity from `ctx.access.getIdentity()`. It does not parse JWTs
or manage sessions.

The checked-in stylesheet is the unmodified Kumo standalone build. Run
`npm run styles:check` after dependency updates.
