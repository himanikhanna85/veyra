import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { SecretVault, type SecretCipher } from "./secret-vault";

const roots: string[] = [];
const cipher: SecretCipher = {
  backend: "test-keychain",
  isAvailable: () => true,
  protect: (value) => Buffer.from([...Buffer.from(value)].map((byte) => byte ^ 0xa5)),
  unprotect: (value) => Buffer.from([...value].map((byte) => byte ^ 0xa5)).toString("utf8"),
};

afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

describe("SecretVault", () => {
  it("persists a project secret without writing plaintext and never lists its value", async () => {
    const root = await mkdtemp(join(tmpdir(), "veyra-secret-vault-")); roots.push(root);
    const vault = new SecretVault(root, cipher);

    vault.set("shop", "shop_password", "correct horse battery staple");

    expect(vault.status("shop", "shop_password")).toEqual({ configured: true, backend: "test-keychain" });
    expect(vault.revealForRuntime("shop", "shop_password")).toBe("correct horse battery staple");
    expect(await readFile(join(root, "secrets.v1.json"), "utf8")).not.toContain("correct horse battery staple");
    expect(Object.keys(vault.status("shop", "shop_password"))).not.toContain("value");
  });
});
