import { safeStorage } from "electron";
import type { SecretCipher } from "./secret-vault";

export function createElectronSecretCipher(): SecretCipher {
  const backend = process.platform === "linux"
    ? safeStorage.getSelectedStorageBackend()
    : process.platform === "darwin" ? "Keychain" : process.platform === "win32" ? "DPAPI" : "OS secure storage";
  return {
    backend,
    isAvailable: () => safeStorage.isEncryptionAvailable() && backend !== "basic_text",
    protect: (value) => safeStorage.encryptString(value),
    unprotect: (value) => safeStorage.decryptString(value),
  };
}
