import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const packageJson = JSON.parse(await readFile(resolve("package.json"), "utf8"));
const expectedArtifacts = [
  `release/Veyra-${packageJson.version}-mac-arm64.dmg`,
  `release/Veyra-${packageJson.version}-mac-arm64.zip`,
  `release/Veyra-${packageJson.version}-mac-x64.dmg`,
  `release/Veyra-${packageJson.version}-mac-x64.zip`,
  `release/Veyra-${packageJson.version}-win-x64.exe`,
];

for (const artifact of expectedArtifacts) {
  const metadata = await stat(resolve(artifact));
  if (!metadata.isFile() || metadata.size < 1_000_000) {
    throw new Error(`Package artifact is missing or unexpectedly small: ${artifact}`);
  }
  process.stdout.write(
    `VERIFIED_PACKAGE ${artifact} ${Math.round(metadata.size / 1_000_000)}MB\n`,
  );
}
