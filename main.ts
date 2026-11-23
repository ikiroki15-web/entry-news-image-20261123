// Entry for news-image-20261123: the day's front page ships in this repo
// as entry.png, and this program copies those exact bytes to the output
// directory the grader reads. No network, no randomness: every run
// writes the same file.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(repoDir, "entry.png");

if (!existsSync(sourceImage)) {
  throw new Error(`entry image missing next to main.ts: ${sourceImage}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });

copyFileSync(sourceImage, join(outputDir, "entry.png"));
