// E06.T02 Teach capture. `installTeachCapture` runs inside the controlled page (isolated world) and
// reports sanitized, serializable target fingerprints; `TeachRecorder` validates and buffers them in main.
// It must stay self-contained (no imports/closures over module scope) because it is injected via toString().

export const TEACH_CAPTURE_PREFIX = "veyra-teach:";
export const TEACH_CAPTURE_LIMITS = Object.freeze({ events: 1000, text: 120, subtree: 400 });

export interface LocatorCandidate { description: string; kind: "testId" | "id" | "label" | "role-name" | "role-name-in-scope" | "text-in-scope"; matches: number; signals: string[] }
export interface TargetScope { heading: string | null; label: string | null; nearbyText: string; role: string | null; tag: string }
export interface TargetFingerprint {
  accessibleName: string; attributes: Record<string, string>; label: string | null; locators: LocatorCandidate[];
  page: { title: string; url: string }; resolution: "unique" | "ambiguous"; role: string | null;
  scopes: TargetScope[]; structure: { ancestors: string; siblings: string }; subtree: string; tag: string; text: string; type: string | null;
}
export interface TeachEffect { mutations?: number; navigatedTo?: string; titleChanged?: boolean; urlChanged?: string }
export interface TeachCaptureEvent {
  actionId: string; effect?: TeachEffect; kind: "click" | "type" | "select" | "key" | "navigate";
  sensitive: boolean; target: TargetFingerprint | null; url: string; value: string | null;
}
export interface RecordedTeachEvent extends TeachCaptureEvent { capturedAt: string; seq: number; sessionId: string }
export interface TeachParameterCandidate { source: "literal"; status: "suggested"; suggestedName: string; value: string }
export interface TeachTargetMeaning { name: string; role: string; scope: string | null }
export interface NormalizedTeachAction extends RecordedTeachEvent {
  parameterCandidate: TeachParameterCandidate | null;
  readable: string;
  resolution: "unique" | "ambiguous" | null;
  targetMeaning: TeachTargetMeaning | null;
}

type Emit = (message: string) => void;

export function installTeachCapture(win: Window & typeof globalThis, nonce: string, emit: Emit): void {
  const doc = win.document;
  const MAX = 120;
  const PREFIX = "veyra-teach:";
  const SENSITIVE = /pass(word|code)?|secret|token|otp|one-time|cvv|cvc|card|ssn|api[-_ ]?key|credential/i;
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "NOSCRIPT", "SVG"]);
  const IMPLICIT: Record<string, string> = { A: "link", BUTTON: "button", SELECT: "combobox", TEXTAREA: "textbox", H1: "heading", H2: "heading", H3: "heading", H4: "heading", H5: "heading", H6: "heading", ARTICLE: "article", LI: "listitem", TR: "row", FORM: "form", DIALOG: "dialog", SECTION: "region" };
  const INPUT_ROLE: Record<string, string> = { button: "button", submit: "button", reset: "button", checkbox: "checkbox", radio: "radio", range: "slider", search: "searchbox", email: "textbox", tel: "textbox", text: "textbox", url: "textbox", number: "spinbutton" };
  const SCOPE_ROLES = new Set(["article", "listitem", "row", "region", "form", "dialog", "group"]);
  const INTERACTIVE = "a[href],button,input,select,textarea,summary,label,[role=button],[role=link],[role=checkbox],[role=menuitem],[role=tab]";
  let counter = 0;
  const esc = (value: string) => value.replace(/["\\]/g, "\\$&");

  const clip = (value: string, max = MAX) => value.replace(/\s+/g, " ").trim().slice(0, max);
  const attr = (el: Element, name: string) => el.getAttribute(name);
  const isSensitive = (el: Element): boolean => {
    if ((el as HTMLInputElement).type === "password") return true;
    const autocomplete = attr(el, "autocomplete") ?? "";
    if (/password|one-time-code|cc-/.test(autocomplete)) return true;
    return SENSITIVE.test([autocomplete, attr(el, "name"), attr(el, "id"), attr(el, "aria-label"), attr(el, "placeholder"), attr(el, "data-testid")].filter(Boolean).join(" "));
  };
  const textOf = (node: Node, budget = 400): string => {
    let out = "";
    const walk = (current: Node) => {
      if (out.length >= budget) return;
      if (current.nodeType === 3) { out += ` ${current.nodeValue ?? ""}`; return; }
      if (current.nodeType !== 1) return;
      const el = current as Element;
      if (SKIP.has(el.tagName.toUpperCase()) || el.getAttribute("aria-hidden") === "true" || isSensitive(el)) return;
      el.childNodes.forEach(walk);
    };
    walk(node);
    return clip(out, budget);
  };
  const roleOf = (el: Element): string | null => {
    const explicit = attr(el, "role");
    if (explicit) return explicit;
    const tag = el.tagName.toUpperCase();
    if (tag === "INPUT") return INPUT_ROLE[(el as HTMLInputElement).type] ?? "textbox";
    return IMPLICIT[tag] ?? null;
  };
  const labelOf = (el: Element): string | null => {
    const id = attr(el, "id");
    const source = (id ? doc.querySelector(`label[for="${esc(id)}"]`) : null) ?? el.closest("label");
    return source ? textOf(source, MAX) || null : null;
  };
  const nameOf = (el: Element): string => {
    const labelledBy = attr(el, "aria-labelledby");
    const referenced = labelledBy ? labelledBy.split(/\s+/).map((id) => doc.getElementById(id)).filter((n): n is HTMLElement => !!n).map((n) => textOf(n, MAX)).join(" ") : "";
    const buttonValue = el.tagName === "INPUT" && /^(button|submit|reset)$/.test((el as HTMLInputElement).type) ? attr(el, "value") : null;
    return clip(attr(el, "aria-label") ?? (referenced || (labelOf(el) ?? (attr(el, "alt") ?? (textOf(el, MAX) || (buttonValue ?? attr(el, "title") ?? attr(el, "placeholder") ?? ""))))));
  };
  const headingOf = (el: Element): string | null => {
    const heading = el.querySelector("h1,h2,h3,h4,h5,h6,[role=heading]");
    return heading ? textOf(heading, MAX) || null : null;
  };
  const scopeEl = (el: Element): Element | null => {
    for (let cur = el.parentElement; cur && cur !== doc.body; cur = cur.parentElement) {
      const role = roleOf(cur);
      if (((role && SCOPE_ROLES.has(role)) || attr(cur, "data-testid")) && (attr(cur, "aria-label") || headingOf(cur))) return cur;
    }
    return null;
  };
  const describeScope = (el: Element, target: Element): TargetScope => ({
    heading: headingOf(el), label: attr(el, "aria-label"), role: roleOf(el), tag: el.tagName.toLowerCase(),
    nearbyText: clip(textOf(el, 300).replace(textOf(target, MAX), ""), 160),
  });
  const scopeKey = (el: Element | null): string => (el ? `${el.tagName}|${attr(el, "aria-label") ?? ""}|${headingOf(el) ?? ""}` : "");
  const pageIdentity = () => {
    const url = new URL(win.location.href);
    return { title: clip(doc.title), url: `${url.origin}${url.pathname}${url.search ? `?${Array.from(url.searchParams.keys()).join("&")}` : ""}` };
  };

  function fingerprint(el: Element): TargetFingerprint {
    const candidates = Array.from(doc.querySelectorAll("a,button,input,select,textarea,summary,[role]"));
    const countBy = (test: (el: Element) => boolean) => candidates.filter(test).length;
    const tag = el.tagName.toLowerCase();
    const role = roleOf(el);
    const name = nameOf(el);
    const label = labelOf(el);
    const sensitive = isSensitive(el);
    const testId = attr(el, "data-testid");
    const id = attr(el, "id");
    const scope = scopeEl(el);
    const key = scopeKey(scope);
    const chain: TargetScope[] = [];
    for (let cur: Element | null = scope; cur && chain.length < 3; cur = scopeEl(cur)) chain.push(describeScope(cur, el));
    const attributes: Record<string, string> = {};
    for (const field of ["data-testid", "name", "aria-label", "aria-describedby", "aria-controls", "placeholder", "title", "alt", "type"]) {
      const value = attr(el, field);
      if (value) attributes[field] = clip(value, 80);
    }
    if (id && !/\d{3,}|^[:_]|^(ember|react|radix|mui)/i.test(id)) attributes.id = clip(id, 80);
    const href = attr(el, "href");
    if (href) { try { attributes.hrefPath = new URL(href, win.location.href).pathname; } catch { /* unparsable href is simply not evidence */ } }
    const sameRoleName = (other: Element) => roleOf(other) === role && nameOf(other) === name;
    const locators: LocatorCandidate[] = [];
    if (testId) locators.push({ description: `test id “${clip(testId, 60)}”`, kind: "testId", matches: doc.querySelectorAll(`[data-testid="${esc(testId)}"]`).length, signals: ["data-testid"] });
    if (attributes.id) locators.push({ description: `id “${attributes.id}”`, kind: "id", matches: doc.querySelectorAll(`[id="${esc(attributes.id)}"]`).length, signals: ["id"] });
    if (label && role) locators.push({ description: `${role} labelled “${label}”`, kind: "label", matches: countBy((o) => roleOf(o) === role && labelOf(o) === label), signals: ["role", "label"] });
    if (role && name) {
      locators.push({ description: `${role} named “${name}”`, kind: "role-name", matches: countBy(sameRoleName), signals: ["role", "accessibleName"] });
      if (scope) {
        const described = describeScope(scope, el);
        locators.push({ description: `${role} named “${name}” in “${described.heading ?? described.label ?? described.tag}”`, kind: "role-name-in-scope", matches: countBy((o) => sameRoleName(o) && scopeKey(scopeEl(o)) === key), signals: ["role", "accessibleName", "scope"] });
      }
    }
    const text = sensitive ? "" : textOf(el, MAX);
    if (text && scope) locators.push({ description: `text “${text}” in scope`, kind: "text-in-scope", matches: countBy((o) => textOf(o, MAX) === text && scopeKey(scopeEl(o)) === key), signals: ["text", "scope"] });
    const ancestors: string[] = [];
    for (let cur: Element | null = el; cur && ancestors.length < 6; cur = cur.parentElement) ancestors.unshift(cur.tagName.toLowerCase());
    return {
      accessibleName: sensitive ? "" : name, attributes, label, locators, page: pageIdentity(), resolution: locators.some((c) => c.matches === 1) ? "unique" : "ambiguous",
      role, scopes: chain, structure: { ancestors: ancestors.join(">"), siblings: Array.from(el.parentElement?.children ?? []).slice(0, 8).map((s) => s.tagName.toLowerCase()).join(",") },
      subtree: sensitive ? "" : textOf(scope ?? el, 400), tag, text, type: attr(el, "type"),
    };
  }

  function send(kind: TeachCaptureEvent["kind"], el: Element, value: string | null, sensitive: boolean) {
    const actionId = `${nonce.slice(0, 8)}-${++counter}`;
    const startUrl = win.location.href;
    const startTitle = doc.title;
    let mutations = 0;
    const observer = new win.MutationObserver((records) => { mutations += records.length; });
    observer.observe(doc.documentElement, { attributes: true, childList: true, characterData: true, subtree: true });
    emit(`${PREFIX}${nonce}:${JSON.stringify({ actionId, kind, sensitive, target: fingerprint(el), url: pageIdentity().url, value: sensitive ? null : value })}`);
    win.setTimeout(() => {
      observer.disconnect();
      const effect: TeachEffect = { mutations: Math.min(mutations, 999), titleChanged: doc.title !== startTitle };
      if (win.location.href !== startUrl) effect.urlChanged = pageIdentity().url;
      emit(`${PREFIX}${nonce}:${JSON.stringify({ actionId, effect })}`);
    }, 400);
  }

  const isTextEntry = (el: Element) => el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && !/^(button|submit|reset|checkbox|radio)$/.test((el as HTMLInputElement).type));
  doc.addEventListener("click", (event) => {
    const hit = event.target instanceof win.Element ? event.target.closest(INTERACTIVE) : null;
    if (!hit || isTextEntry(hit) || hit.tagName === "SELECT") return;
    send("click", hit, null, isSensitive(hit));
  }, true);
  doc.addEventListener("change", (event) => {
    const el = event.target instanceof win.Element ? event.target : null;
    if (!el) return;
    if (el.tagName === "SELECT") send("select", el, clip((el as HTMLSelectElement).selectedOptions[0]?.textContent ?? ""), isSensitive(el));
    else if (isTextEntry(el)) send("type", el, clip((el as HTMLInputElement).value, 200), isSensitive(el));
  }, true);
  doc.addEventListener("keydown", (event) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== "Escape") || !(event.target instanceof win.Element)) return;
    send("key", event.target, event.key, isSensitive(event.target));
  }, true);
}

// ---- main-process side ----

const KINDS = new Set(["click", "type", "select", "key", "navigate"]);
const DUPLICATE_EVENT_WINDOW_MS = 750;
const str = (value: unknown, max: number): string => (typeof value === "string" ? value.slice(0, max) : "");

export function pageCaptureScript(nonce: string): string {
  return `(${installTeachCapture.toString()})(window, ${JSON.stringify(nonce)}, (m) => console.debug(m))`;
}

export function parseCaptureMessage(nonce: string, message: string): { event: TeachCaptureEvent } | { actionId: string; effect: TeachEffect } | null {
  const prefix = `${TEACH_CAPTURE_PREFIX}${nonce}:`;
  if (!message.startsWith(prefix)) return null;
  let raw: unknown;
  try { raw = JSON.parse(message.slice(prefix.length)); } catch { return null; }
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const actionId = str(value.actionId, 64);
  if (!actionId) return null;
  if (value.effect && typeof value.effect === "object") {
    const e = value.effect as Record<string, unknown>;
    return { actionId, effect: { mutations: typeof e.mutations === "number" ? e.mutations : undefined, titleChanged: e.titleChanged === true || undefined, urlChanged: str(e.urlChanged, 300) || undefined } };
  }
  if (typeof value.kind !== "string" || !KINDS.has(value.kind)) return null;
  const sensitive = value.sensitive === true;
  const target = value.target && typeof value.target === "object" ? (value.target as TargetFingerprint) : null;
  return { event: { actionId, kind: value.kind as TeachCaptureEvent["kind"], sensitive, target, url: str(value.url, 300), value: sensitive || typeof value.value !== "string" ? null : value.value.slice(0, 200) } };
}

export function describeEvent(event: TeachCaptureEvent): string {
  const t = event.target;
  const scope = t?.scopes[0];
  const subject = t ? `${t.role ?? t.tag}${t.accessibleName ? ` “${t.accessibleName}”` : ""}${scope ? ` in “${scope.heading ?? scope.label ?? scope.tag}”` : ""}` : "page";
  switch (event.kind) {
    case "click": return `Click ${subject}`;
    case "type": return event.sensitive ? `Enter protected value in ${subject}` : `Type “${event.value ?? ""}” in ${subject}`;
    case "select": return `Select “${event.value ?? ""}” in ${subject}`;
    case "key": return `Press ${event.sensitive ? "a key" : event.value} on ${subject}`;
    case "navigate": return `Go to ${event.url}`;
  }
}

function parameterName(event: TeachCaptureEvent): string {
  const raw = event.target?.label ?? event.target?.accessibleName ?? event.target?.attributes.name ?? "value";
  const words = raw.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  const camel = words.map((word, index) => index ? `${word[0]?.toUpperCase() ?? ""}${word.slice(1).toLowerCase()}` : word.toLowerCase()).join("");
  return camel.slice(0, 64) || "value";
}

function sanitizedUrl(value: string | undefined): string | undefined {
  if (!value) return value;
  try {
    const parsed = new URL(value);
    const keys = Array.from(parsed.searchParams.keys());
    return `${parsed.origin}${parsed.pathname}${keys.length ? `?${keys.join("&")}` : ""}`.slice(0, 300);
  } catch {
    return value.split(/[?#]/, 1)[0]!.slice(0, 300);
  }
}

function protectedTarget(target: TargetFingerprint | null): TargetFingerprint | null {
  if (!target) return null;
  return {
    ...target,
    accessibleName: "",
    attributes: target.type ? { type: target.type } : {},
    label: null,
    locators: [],
    page: { title: "", url: sanitizedUrl(target.page.url) ?? "" },
    scopes: target.scopes.map((scope) => ({ ...scope, heading: null, label: null, nearbyText: "" })),
    subtree: "",
    text: "",
  };
}

function duplicateKey(event: TeachCaptureEvent): string {
  const target = event.target;
  return JSON.stringify({
    kind: event.kind,
    sensitive: event.sensitive,
    target: target && {
      attributes: target.attributes,
      accessibleName: target.accessibleName,
      label: target.label,
      role: target.role,
      scopes: target.scopes.map((scope) => [scope.role, scope.heading, scope.label, scope.nearbyText]),
      tag: target.tag,
    },
    url: event.url,
    value: event.sensitive ? null : event.value,
  });
}

export function normalizeTeachEvent(event: RecordedTeachEvent): NormalizedTeachAction {
  const target = event.sensitive ? protectedTarget(event.target) : event.target;
  const scope = target?.scopes[0];
  const value = event.sensitive ? null : event.value;
  const normalizedEvent = {
    ...event,
    effect: event.effect ? {
      ...event.effect,
      navigatedTo: sanitizedUrl(event.effect.navigatedTo),
      urlChanged: sanitizedUrl(event.effect.urlChanged),
    } : undefined,
    target,
    url: sanitizedUrl(event.url) ?? "",
    value,
  };
  return {
    ...normalizedEvent,
    readable: describeEvent(normalizedEvent),
    resolution: target?.resolution ?? null,
    targetMeaning: target ? {
      name: event.sensitive ? (target.role ?? target.tag) : target.accessibleName || target.label || target.text || target.attributes.name || target.tag,
      role: target.role ?? target.tag,
      scope: scope ? (scope.heading ?? scope.label ?? scope.nearbyText) || null : null,
    } : null,
    parameterCandidate: !event.sensitive && value && (event.kind === "type" || event.kind === "select")
      ? { source: "literal", status: "suggested", suggestedName: parameterName(event), value }
      : null,
  };
}

export class TeachRecorder {
  readonly #now: () => Date;
  readonly #onChange: () => void;
  readonly #onAction: (action: NormalizedTeachAction) => void;
  readonly #nonce: string;
  #events: RecordedTeachEvent[] = [];
  #paused = false;
  #seq = 0;
  #sessionId: string | null = null;

  constructor({ nonce, now, onAction = () => {}, onChange = () => {} }: { nonce: string; now: () => Date; onAction?: (action: NormalizedTeachAction) => void; onChange?: () => void }) {
    this.#nonce = nonce;
    this.#now = now;
    this.#onChange = onChange;
    this.#onAction = onAction;
  }

  get nonce(): string { return this.#nonce; }
  get paused(): boolean { return this.#paused; }
  get sessionId(): string | null { return this.#sessionId; }

  begin(sessionId: string, existing: NormalizedTeachAction[] = []): void {
    if (this.#sessionId === sessionId) return;
    this.#sessionId = sessionId;
    this.#paused = false;
    this.#events = existing.map(({ readable: _readable, resolution: _resolution, targetMeaning: _targetMeaning, parameterCandidate: _parameterCandidate, ...event }) => event);
    this.#seq = this.#events.reduce((max, event) => Math.max(max, event.seq), 0);
    this.#onChange();
  }

  end(): void {
    if (this.#sessionId === null) return;
    this.#sessionId = null;
    this.#paused = false;
    this.#onChange();
  }

  pause(): void {
    if (!this.#sessionId || this.#paused) return;
    this.#paused = true;
    this.#onChange();
  }

  resume(): void {
    if (!this.#sessionId || !this.#paused) return;
    this.#paused = false;
    this.#onChange();
  }

  list(sessionId: string): NormalizedTeachAction[] {
    return this.#sessionId === sessionId ? this.#events.map(normalizeTeachEvent) : [];
  }

  ingest(message: string): void {
    const parsed = parseCaptureMessage(this.#nonce, message);
    if (!parsed) return;
    if ("effect" in parsed) {
      const target = this.#events.find((e) => e.actionId === parsed.actionId);
      if (target) { target.effect = { ...target.effect, ...parsed.effect }; this.#onAction(normalizeTeachEvent(target)); this.#onChange(); }
      return;
    }
    this.#append(parsed.event);
  }

  noteNavigation(url: string): void {
    const last = this.#events[this.#events.length - 1];
    if (last && last.kind !== "navigate" && this.#now().getTime() - Date.parse(last.capturedAt) < 2000) {
      last.effect = { ...last.effect, navigatedTo: url.slice(0, 300) };
      this.#onAction(normalizeTeachEvent(last));
    }
    this.#append({ actionId: `nav-${this.#seq + 1}`, kind: "navigate", sensitive: false, target: null, url: url.slice(0, 300), value: null });
  }

  #append(event: TeachCaptureEvent): void {
    if (!this.#sessionId || this.#paused) return;
    const capturedAt = this.#now();
    const previous = this.#events[this.#events.length - 1];
    if (previous
      && capturedAt.getTime() - Date.parse(previous.capturedAt) <= DUPLICATE_EVENT_WINDOW_MS
      && duplicateKey(previous) === duplicateKey(event)) return;
    if (this.#events.length >= TEACH_CAPTURE_LIMITS.events) this.#events.shift();
    const recorded = { ...event, value: event.sensitive ? null : event.value, capturedAt: capturedAt.toISOString(), seq: ++this.#seq, sessionId: this.#sessionId };
    this.#events.push(recorded);
    this.#onAction(normalizeTeachEvent(recorded));
    this.#onChange();
  }
}
