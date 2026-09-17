import { readFile } from "node:fs/promises";

const [vendored, installed] = await Promise.all([
  readFile(new URL("../src/kumo-standalone.txt", import.meta.url)),
  readFile(
    new URL(
      "../node_modules/@cloudflare/kumo/dist/styles/kumo-standalone.css",
      import.meta.url,
    ),
  ),
]);

if (!vendored.equals(installed)) {
  throw new Error("src/kumo-standalone.txt must match Kumo standalone CSS");
}
