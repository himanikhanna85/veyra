import { describe, expect, it } from "vitest";
import { isTrustedRendererSender, selectRendererUrl } from "./renderer-origin";

describe("desktop renderer origin", () => {
  it("uses the packaged application origin unless a loopback development URL is set", () => {
    expect(selectRendererUrl(undefined)).toBe("veyra://app/index.html");
    expect(selectRendererUrl("http://127.0.0.1:4173/")).toBe(
      "http://127.0.0.1:4173/",
    );
    expect(selectRendererUrl("http://localhost:5173")).toBe(
      "http://localhost:5173/",
    );
  });

  it("rejects remote development origins and trusts only the selected origin", () => {
    expect(() => selectRendererUrl("https://veyra.example")).toThrow(
      "Renderer development URL must use loopback HTTP",
    );
    expect(
      isTrustedRendererSender(
        "veyra://app/index.html",
        "veyra://app/assets/index.js",
      ),
    ).toBe(true);
    expect(
      isTrustedRendererSender(
        "http://127.0.0.1:4173/",
        "http://127.0.0.1:4173/src/main.jsx",
      ),
    ).toBe(true);
    expect(
      isTrustedRendererSender(
        "http://127.0.0.1:4173/",
        "http://localhost:4173/",
      ),
    ).toBe(false);
  });
});
