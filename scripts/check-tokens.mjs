// Stale check for the committed generated token CSS (app/design-tokens.generated.css).
// Real check only where design-system sits two levels up (~/Projects/design-system); elsewhere (CI, Vercel-style builds) the file must exist.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const copy = resolve(ROOT, "app/design-tokens.generated.css");
const sync = resolve(ROOT, "../../design-system/src/sync-tokens.mjs");

if (!existsSync(copy)) { console.error(`missing ${copy}; run "npm run sync" in ~/Projects/design-system`); process.exit(1); }
if (!existsSync(sync)) { console.log("note: ../../design-system not found, token copy exists but was not compared"); process.exit(0); }
const r = spawnSync(process.execPath, [sync, "--check", "--only", "web-app"], { stdio: "inherit" });
process.exit(r.status ?? 1);
