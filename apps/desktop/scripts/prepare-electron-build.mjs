import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDirectory = resolve("dist/electron");
await mkdir(outputDirectory, { recursive: true });
await rm(resolve(outputDirectory, "preload.js"), { force: true });
await writeFile(
  resolve(outputDirectory, "package.json"),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
  "utf8",
);
