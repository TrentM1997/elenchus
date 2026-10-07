import path from "node:path";

const PORT = 4173;
const clientDistPath = path.resolve(process.cwd(), "client/dist");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export { PORT, MIME_TYPES, clientDistPath };
