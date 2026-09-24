const { cpSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");

const destination = resolve(__dirname, "../server/public/images/logos");
mkdirSync(destination, { recursive: true });
cpSync(resolve(__dirname, "../client/public/images/logos"), destination, {
  recursive: true,
});
