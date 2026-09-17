import { Badge } from "@cloudflare/kumo/components/badge";
import { Grid, GridItem } from "@cloudflare/kumo/components/grid";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Link } from "@cloudflare/kumo/components/link";
import { Text } from "@cloudflare/kumo/components/text";

const GUIDE_URL =
  "https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/";

export function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MCP Server</title>
        <link rel="stylesheet" href="/kumo.css" />
      </head>
      <body>
        <main className="min-h-screen bg-kumo-canvas p-4 md:p-6">
          <Grid variant="3up" gap="base">
            <GridItem>
              <LayerCard>
                <LayerCard.Secondary>
                  <Badge variant="info">Public</Badge>
                </LayerCard.Secondary>
                <LayerCard.Primary>
                  <Text variant="heading" size="lg" as="h1">
                    MCP Server
                  </Text>
                  <Text variant="secondary">Endpoint</Text>
                  <Text variant="mono">/mcp</Text>
                </LayerCard.Primary>
              </LayerCard>
            </GridItem>

            <GridItem>
              <LayerCard>
                <LayerCard.Secondary>Tools</LayerCard.Secondary>
                <LayerCard.Primary>
                  <Text variant="mono">hello</Text>
                  <Text variant="secondary">Returns a greeting.</Text>
                </LayerCard.Primary>
              </LayerCard>
            </GridItem>

            <GridItem>
              <LayerCard>
                <LayerCard.Secondary>Docs</LayerCard.Secondary>
                <LayerCard.Primary>
                  <Link
                    href={GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cloudflare guide <Link.ExternalIcon />
                  </Link>
                </LayerCard.Primary>
              </LayerCard>
            </GridItem>
          </Grid>
        </main>
      </body>
    </html>
  );
}
