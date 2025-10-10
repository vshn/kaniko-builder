// @ts-ignore
import express from "express";
import { readFileSync } from "node:fs";
import { hostname } from "node:os";

function parsePortArg(defaultPort: number): number {
  const idx = process.argv.indexOf("--port");
  if (idx !== -1 && process.argv[idx + 1]) {
    const p = parseInt(process.argv[idx + 1], 10);
    if (!Number.isNaN(p)) return p;
  }
  return defaultPort;
}

const app = express();

app.get("/", (req: express.Request, res: express.Response) => {
  // req.query comes from qs; values can be string | string[] | ParsedQs | ParsedQs[] | undefined
  const rawName: unknown = (req.query as any)?.name;
  const name = Array.isArray(rawName)
    ? String(rawName[0] ?? "World")
    : String(rawName ?? "World");

  const appHome = process.env.APP_HOME ?? "Not set";
  const httpPort = process.env.HTTP_PORT ?? "Not set";
  const uid =
    typeof (process as any).getuid === "function"
      ? (process as any).getuid()
      : "N/A";

  const markerContent = readFileSync("marker.txt", "utf8");

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(
    `<h1>Hello, ${escapeHtml(name)} from Kaniko Node.js Multi-Stage!</h1>` +
      `<p>App Home: ${escapeHtml(String(appHome))}</p>` +
      `<p>HTTP Port: ${escapeHtml(String(httpPort))}</p>` +
      `<p>Running as user: ${escapeHtml(String(uid))}</p>` +
      `<p>Hostname: ${escapeHtml(String(hostname()))}</p>` +
      `<p>Content of marker.txt (if created during *build*):</p>` +
      `<pre>${escapeHtml(markerContent)}</pre>`,
  );
});

app.get("/health", (_req: Request, res: Response) => {
  res.type("text/plain").send("OK\n");
});

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const defaultPort = parseInt(process.env.HTTP_PORT || "8090", 10);
const port = parsePortArg(defaultPort);

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.error("Could not start app, reason: ", err);
    return;
  }
  console.log(`Starting Express app on port ${port}`);
});
