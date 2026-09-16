export interface RuntimeSecretSource {
  configuredIds(projectId: string): string[];
  revealForRuntime(projectId: string, secretId: string): string;
}

const REDACTED = "[REDACTED]";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mapDeep(value: unknown, transform: (value: unknown) => unknown): unknown {
  const transformed = transform(value);
  if (transformed !== value) return transformed;
  if (Array.isArray(value)) return value.map((item) => mapDeep(item, transform));
  if (isRecord(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapDeep(item, transform)]));
  return value;
}

export class SecretProtection {
  readonly #source: RuntimeSecretSource;

  constructor(source: RuntimeSecretSource) {
    this.#source = source;
  }

  resolveForRuntime(projectId: string, definition: unknown): unknown {
    return mapDeep(definition, (value) => {
      if (!isRecord(value) || Object.keys(value).length !== 1 || typeof value.secretRef !== "string") return value;
      return this.#source.revealForRuntime(projectId, value.secretRef);
    });
  }

  redactForLog(projectId: string, payload: unknown): unknown {
    return this.#redactKnownValues(projectId, payload);
  }

  redactForReport(projectId: string, payload: unknown): unknown {
    return this.#redactKnownValues(projectId, payload);
  }

  prepareAiRequest(projectId: string, payload: unknown): unknown {
    const referencesRemoved = mapDeep(payload, (value) => {
      if (!isRecord(value) || Object.keys(value).length !== 1 || typeof value.secretRef !== "string") return value;
      return `[SECRET_REF:${value.secretRef}]`;
    });
    return this.#redactKnownValues(projectId, referencesRemoved);
  }

  #redactKnownValues(projectId: string, payload: unknown): unknown {
    const variants = this.#source.configuredIds(projectId).flatMap((id) => {
      const value = this.#source.revealForRuntime(projectId, id);
      if (!value) return [];
      return [value, encodeURIComponent(value), Buffer.from(value).toString("base64")];
    }).filter(Boolean).sort((left, right) => right.length - left.length);
    return mapDeep(payload, (value) => {
      if (typeof value !== "string") return value;
      return variants.reduce((redacted, secret) => redacted.split(secret).join(REDACTED), value);
    });
  }
}
