import { copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const mapPath = resolve(rootDir, "tmp", "dynamik-user-photo-card-map.json");
const sourceDir = process.env.DYNAMIK_USER_SCREENSHOT_DIR || "C:/Users/iwand/AppData/Local/Temp";
const targetDir = resolve(rootDir, "assets", "dynamik-user-intake", "raw");
const cardMap = JSON.parse(await readFile(mapPath, "utf8"));

const prefixes = [...new Set(cardMap
  .filter((frame) => frame.cards?.some((card) => card.kind === "producto"))
  .map((frame) => String(frame.sourcePrefix || "").trim().toLowerCase())
  .filter((prefix) => /^[a-f0-9-]+$/.test(prefix)))];

const availableFiles = await readdir(sourceDir);
await mkdir(targetDir, { recursive: true });

const staged = [];
for (const prefix of prefixes) {
  const candidates = availableFiles.filter((file) => file.toLowerCase().startsWith(`codex-clipboard-${prefix}-`) && file.toLowerCase().endsWith(".png"));
  if (candidates.length !== 1) {
    throw new Error(`Se esperaba una sola lámina para ${prefix}; se encontraron ${candidates.length}.`);
  }
  const file = candidates[0];
  await copyFile(resolve(sourceDir, file), resolve(targetDir, file));
  staged.push(file);
}

console.log(JSON.stringify({ inputFrames: staged.length, targetDir, files: staged.sort() }, null, 2));
