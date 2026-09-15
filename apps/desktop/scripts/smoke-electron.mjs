import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import electronPath from "electron";
import { tmpdir } from "node:os";
import { join } from "node:path";

const executable = process.env.VEYRA_EXECUTABLE || electronPath;
const args = process.env.VEYRA_EXECUTABLE ? [] : ["."];
const timeoutMs = 30_000;
const suppliedDataDirectory = process.env.VEYRA_USER_DATA_DIR;
const dataDirectory =
  suppliedDataDirectory || (await mkdtemp(join(tmpdir(), "veyra-smoke-")));

async function launch() {
  await new Promise((resolve, reject) => {
    let output = "";
    const child = spawn(executable, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        VEYRA_SMOKE_TEST: "1",
        VEYRA_USER_DATA_DIR: dataDirectory,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Electron smoke check timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    function capture(chunk) {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    }

    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code, signal) => {
      clearTimeout(timeout);
      if (code === 0 && output.includes("VEYRA_SMOKE_READY")) {
        resolve();
        return;
      }
      reject(
        new Error(
          `Electron smoke check failed (code=${code}, signal=${signal})\n${output}`,
        ),
      );
    });
  });
}

try {
  await launch();
  const first = JSON.parse(
    await readFile(join(dataDirectory, "state", "lifecycle.json"), "utf8"),
  );
  await launch();
  const second = JSON.parse(
    await readFile(join(dataDirectory, "state", "lifecycle.json"), "utf8"),
  );
  if (
    first.cleanShutdown !== true ||
    second.cleanShutdown !== true ||
    first.sessionId === second.sessionId
  ) {
    throw new Error("Lifecycle state did not survive a clean restart");
  }
  process.stdout.write("VEYRA_RESTART_READY lifecycle state persisted\n");
} finally {
  if (!suppliedDataDirectory) {
    await rm(dataDirectory, { force: true, recursive: true });
  }
}
