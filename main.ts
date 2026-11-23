// news-image-20261123 — deterministic copier for the front-page image.
// Locates entry.png next to this module (import.meta.url), falling back to
// MAKEFUN_BOT_DIR, and copies it byte-for-byte into the output directory.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const candidates = [here];
if (process.env.MAKEFUN_BOT_DIR) candidates.push(process.env.MAKEFUN_BOT_DIR);

let source = "";
for (const dir of candidates) {
  const p = join(dir, "entry.png");
  try {
    if (existsSync(p) && statSync(p).isFile() && statSync(p).size > 0) {
      source = p;
      break;
    }
  } catch {
    // unreadable candidate path — try the next one
  }
}
if (!source) {
  throw new Error("entry.png not found next to main.ts or in MAKEFUN_BOT_DIR");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(source, dest);

const srcSize = statSync(source).size;
const dstSize = statSync(dest).size;
if (srcSize !== dstSize) {
  throw new Error(`copy size mismatch: source ${srcSize} bytes, output ${dstSize} bytes`);
}
