// Dev-only Reticle state. The Vite plugin injects this module after connecting
// to the local Reticle daemon; App.jsx also imports it to publish navigation.
import { registerCapabilities, registerStore } from "@reticlehq/react";

type VerificationState = {
  activeProjectId: string | null;
  activeSection: string;
  teachRecording: boolean;
  teachStepCount: number;
  teachSteps: string[];
  workspaceStatus: "error" | "loading" | "ready";
};

let snapshot: VerificationState = {
  activeProjectId: null,
  activeSection: "overview",
  teachRecording: false,
  teachStepCount: 0,
  teachSteps: [],
  workspaceStatus: "loading",
};
const listeners = new Set<() => void>();

if (import.meta.env.DEV) {
  registerStore("veyra", {
    getState: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  });
  registerCapabilities({ stores: ["veyra"], testids: [], signals: [] });
}

export function updateReticleDevState(next: VerificationState): void {
  if (!import.meta.env.DEV) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

// Supply the dev flag type when the host does not include vite/client.
// These interfaces merge with vite/client when it is already present.
declare global {
  interface ImportMetaEnv {
    DEV: boolean;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
