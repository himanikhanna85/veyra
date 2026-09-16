import { describe, expect, it, vi } from "vitest";
import { SensitiveEvidenceGuard } from "./sensitive-evidence-guard";

describe("SensitiveEvidenceGuard", () => {
  it("blocks Veyra evidence capture and OS window capture during secret entry", () => {
    const setContentProtection = vi.fn();
    const guard = new SensitiveEvidenceGuard({ setContentProtection });

    guard.setSensitiveEntry(true);
    expect(guard.canCaptureEvidence()).toBe(false);
    expect(setContentProtection).toHaveBeenLastCalledWith(true);

    guard.setSensitiveEntry(false);
    expect(guard.canCaptureEvidence()).toBe(true);
    expect(setContentProtection).toHaveBeenLastCalledWith(false);
  });
});
