import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { MIME_TYPES, clientDistPath, PORT } from "./serveClientConfigs";

async function serveIndex(res: http.ServerResponse) {
  const filePath = path.join(clientDistPath, "index.html");
  const file = await fs.readFile(filePath);

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(file);
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end("Missing request URL");
    return;
  }

  try {
    const pathname = new URL(req.url, "http://localhost").pathname;

    const requestedPath =
      pathname === "/"
        ? path.join(clientDistPath, "index.html")
        : path.join(clientDistPath, pathname);

    try {
      const file = await fs.readFile(requestedPath);
      const ext = path.extname(requestedPath);

      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
      });

      res.end(file);
      return;
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        error.code !== "ENOENT"
      ) {
        throw error;
      }
    }

    const acceptsHtml = req.headers.accept?.includes("text/html");

    if (acceptsHtml) {
      console.log("SPA fallback hit:", pathname);
      await serveIndex(res);
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  } catch (error) {
    console.error(error);

    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Static client server listening on http://localhost:${PORT}`);
});
