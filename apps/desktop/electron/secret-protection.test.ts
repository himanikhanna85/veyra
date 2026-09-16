import { describe, expect, it } from "vitest";
import { SecretProtection, type RuntimeSecretSource } from "./secret-protection";

const values = { api_token: "token-123", shop_password: "horse-battery" };
const source: RuntimeSecretSource = {
  configuredIds: () => Object.keys(values),
  revealForRuntime: (_projectId, secretId) => {
    const value = values[secretId as keyof typeof values];
    if (!value) throw new Error(`Secret reference ${secretId} is not configured`);
    return value;
  },
};

describe("SecretProtection", () => {
  it("resolves only explicit logical references at the runtime seam", () => {
    const protection = new SecretProtection(source);
    const definition = { action: "fill", value: { secretRef: "shop_password" }, literal: "shop_password" };

    expect(protection.resolveForRuntime("shop", definition)).toEqual({ action: "fill", value: "horse-battery", literal: "shop_password" });
    expect(() => protection.resolveForRuntime("shop", { value: { secretRef: "missing" } })).toThrow(/not configured/i);
  });

  it("redacts raw and encoded secret values from logs and reports", () => {
    const protection = new SecretProtection(source);
    const payload = { message: "login horse-battery", url: `?token=${encodeURIComponent("token-123")}`, encoded: Buffer.from("token-123").toString("base64") };

    expect(protection.redactForLog("shop", payload)).toEqual({ message: "login [REDACTED]", url: "?token=[REDACTED]", encoded: "[REDACTED]" });
    expect(protection.redactForReport("shop", payload)).toEqual(protection.redactForLog("shop", payload));
  });

  it("never resolves logical references while preparing an AI request", () => {
    const protection = new SecretProtection(source);

    expect(protection.prepareAiRequest("shop", { credential: { secretRef: "api_token" }, accidental: "token-123" })).toEqual({ credential: "[SECRET_REF:api_token]", accidental: "[REDACTED]" });
  });
});
