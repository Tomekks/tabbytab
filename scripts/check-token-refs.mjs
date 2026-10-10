// Every design token the source uses via var(--name) must exist in the committed generated CSS.
// Catches a renamed or removed token (the contract with design-system) before it silently renders as nothing.
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "app/design-tokens.generated.css"), "utf8");
const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

// Not design-system tokens: set by next/font in app/layout.tsx.
const FRAMEWORK = new Set(["--font-geist-sans", "--font-geist-mono"]);
// Variables also defined locally in the scanned source count as defined.
const SCAN = ["app", "components", "hooks", "lib"];
const EXT = new Set([".ts", ".tsx", ".css"]);
const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (EXT.has(extname(e.name)) && !/\.test\.ts$/.test(e.name) && e.name !== "design-tokens.generated.css") files.push(full);
  }
};
SCAN.forEach((d) => walk(join(ROOT, d)));

const texts = files.map((f) => [f, readFileSync(f, "utf8")]);
const localDefs = new Set(texts.flatMap(([, t]) => [...t.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1])));
const missing = [];
for (const [f, t] of texts) {
  for (const m of t.matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (!defined.has(m[1]) && !localDefs.has(m[1]) && !FRAMEWORK.has(m[1])) missing.push(`${f.slice(ROOT.length + 1)}: ${m[1]}`);
  }
}
if (missing.length) {
  console.error("token refs missing from app/design-tokens.generated.css:\n  " + [...new Set(missing)].join("\n  "));
  process.exit(1);
}
console.log(`token refs OK (${files.length} files, ${defined.size} tokens defined)`);
