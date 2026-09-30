import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error("Run this script through npm run db:codegen.");
  process.exit(1);
}

try {
  // Invoke npm through Node so Windows does not need to execute a .cmd file.
  const types = execFileSync(
    process.execPath,
    [
      npmCli,
      "exec",
      "--",
      "supabase",
      "gen",
      "types",
      "typescript",
      "--project-id",
      "ovpngiqjmjwqsjgwrrph",
      "--schema",
      "public",
    ],
    {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "inherit"],
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  if (!types.trim()) {
    throw new Error("Supabase returned no types; the existing file was preserved.");
  }

  // Only replace the existing types after generation succeeds.
  writeFileSync(
    new URL("../types/databaseInterfaces.ts", import.meta.url),
    types,
    "utf8",
  );
  console.log("Generated types/databaseInterfaces.ts");
} catch (error) {
  console.error("Database type generation failed:", error.message);
  process.exitCode = error.status || 1;
}
