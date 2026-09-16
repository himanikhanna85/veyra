export interface ContentProtectionTarget {
  setContentProtection(enabled: boolean): void;
}

export class SensitiveEvidenceGuard {
  readonly #target: ContentProtectionTarget;
  #sensitiveEntryActive = false;

  constructor(target: ContentProtectionTarget) {
    this.#target = target;
  }

  setSensitiveEntry(active: boolean): void {
    this.#sensitiveEntryActive = active;
    this.#target.setContentProtection(active);
  }

  canCaptureEvidence(): boolean {
    return !this.#sensitiveEntryActive;
  }

  assertCaptureAllowed(): void {
    if (!this.canCaptureEvidence()) throw new Error("Evidence capture is paused while a secret is being entered");
  }
}
