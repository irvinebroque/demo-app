import { Badge } from "@cloudflare/kumo/components/badge";
import { Grid, GridItem } from "@cloudflare/kumo/components/grid";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Link } from "@cloudflare/kumo/components/link";
import { LinkButton } from "@cloudflare/kumo/components/button";
import { Text } from "@cloudflare/kumo/components/text";

const ANNOUNCEMENT_URL = "https://blog.cloudflare.com/workers-protected-by-access/";
const SESSION_DOCS_URL =
  "https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/";

export function App({ email }: { email: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Access Worker</title>
        <link rel="stylesheet" href="/kumo.css" />
      </head>
      <body>
        <main className="min-h-screen bg-kumo-canvas p-4 md:p-6">
          <Grid variant="3up" gap="base">
            <GridItem>
              <LayerCard>
                <LayerCard.Secondary>
                  <Badge variant="success" appearance="dot">
                    Authenticated
                  </Badge>
                </LayerCard.Secondary>
                <LayerCard.Primary>
                  <Text variant="heading" size="lg" as="h1">
                    Access Worker
                  </Text>
                  <Text variant="secondary">Signed in as</Text>
                  <Text variant="mono">{email}</Text>
                  <Text>
                    Access authenticated this request before the Worker ran.
                  </Text>
                </LayerCard.Primary>
              </LayerCard>
            </GridItem>

            <GridItem>
              <LayerCard>
                <LayerCard.Secondary>Request flow</LayerCard.Secondary>
                <LayerCard.Primary>
                  <Text>1. Access checks the session.</Text>
                  <Text>2. Identity is attached to ctx.access.</Text>
                  <Text>3. The Worker renders this page.</Text>
                </LayerCard.Primary>
              </LayerCard>
            </GridItem>

            <GridItem>
              <LayerCard>
                <LayerCard.Secondary>Session</LayerCard.Secondary>
                <LayerCard.Primary>
                  <LinkButton href="/" variant="secondary">
                    Log in
                  </LinkButton>
                  <LinkButton
                    href="/cdn-cgi/access/logout"
                    variant="outline"
                  >
                    Log out
                  </LinkButton>
                  <Text variant="secondary" size="sm">
                    <Link
                      href={ANNOUNCEMENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Announcement <Link.ExternalIcon />
                    </Link>
                    {" · "}
                    <Link
                      href={SESSION_DOCS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Session docs <Link.ExternalIcon />
                    </Link>
                  </Text>
                </LayerCard.Primary>
              </LayerCard>
            </GridItem>
          </Grid>
        </main>
      </body>
    </html>
  );
}
