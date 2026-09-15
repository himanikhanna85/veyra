import { describe, expect, it } from "vitest";
import { resolveRendererAsset } from "./renderer-assets";

describe("resolveRendererAsset", () => {
  it("maps the trusted application origin to files under the renderer root", () => {
    expect(resolveRendererAsset("/opt/veyra/client", "veyra://app/")).toBe(
      "/opt/veyra/client/index.html",
    );
    expect(
      resolveRendererAsset(
        "/opt/veyra/client",
        "veyra://app/assets/index-a1b2.js",
      ),
    ).toBe("/opt/veyra/client/assets/index-a1b2.js");
  });

  it("rejects other origins and encoded paths that could escape the root", () => {
    expect(() =>
      resolveRendererAsset("/opt/veyra/client", "veyra://attacker/index.html"),
    ).toThrow("Untrusted renderer origin");
    expect(() =>
      resolveRendererAsset("/opt/veyra/client", "veyra://app/%2e%2e%2fsecret"),
    ).toThrow("Renderer path escapes asset root");
  });
});
