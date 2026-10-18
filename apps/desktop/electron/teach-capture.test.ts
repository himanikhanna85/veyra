import { afterEach, describe, expect, it, vi } from "vitest";
import { TeachRecorder, installTeachCapture, pageCaptureScript, parseCaptureMessage, describeEvent, normalizeTeachEvent, type TeachCaptureEvent } from "./teach-capture";

const NONCE = "abcd1234efgh";

function setup(html: string) {
  document.body.innerHTML = html;
  const messages: string[] = [];
  installTeachCapture(window, NONCE, (m) => messages.push(m));
  const events = () => messages.map((m) => parseCaptureMessage(NONCE, m)).flatMap((p) => (p && "event" in p ? [p.event] : []));
  return { events, messages };
}

const CARDS = `
  <main>
    <article><h2>Wireless Headphones</h2><p>$99</p><button>Add to cart</button></article>
    <article><h2>Travel Mug</h2><p>$15</p><button>Add to cart</button></article>
  </main>`;

afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ""; });

describe("teach capture fingerprints", () => {
  it("keeps same-name controls distinct by semantic ancestor and never emits an index locator", () => {
    const { events } = setup(CARDS);
    const buttons = document.querySelectorAll("button");
    buttons[0]!.click();
    buttons[1]!.click();
    const [first, second] = events();
    const a = first!.target!;
    const b = second!.target!;

    expect(a.accessibleName).toBe("Add to cart");
    expect(a.scopes[0]!.heading).toBe("Wireless Headphones");
    expect(b.scopes[0]!.heading).toBe("Travel Mug");
    expect(a.locators.map((l) => l.description)).not.toEqual(b.locators.map((l) => l.description));
    expect(a.locators.find((l) => l.kind === "role-name")!.matches).toBe(2);
    expect(a.locators.find((l) => l.kind === "role-name-in-scope")!.matches).toBe(1);
    expect(a.resolution).toBe("unique");
    expect(describeEvent(first!)).toBe("Click button “Add to cart” in “Wireless Headphones”");
    const normalized = [first, second].map((event, index) => normalizeTeachEvent({ ...event!, capturedAt: "2026-10-04T00:00:00.000Z", seq: index + 1, sessionId: "teach-1" }));
    expect(normalized.map((action) => action.targetMeaning?.scope)).toEqual(["Wireless Headphones", "Travel Mug"]);
    for (const target of [a, b]) {
      expect(JSON.stringify(target.locators)).not.toMatch(/nth|index|^\/\/|\[\d+\]|rect/i);
    }
  });

  it("marks identical controls with no distinguishing scope as ambiguous instead of guessing an index", () => {
    const { events } = setup(`<div><button>Add to cart</button></div><div><button>Add to cart</button></div>`);
    document.querySelectorAll("button")[1]!.click();
    const target = events()[0]!.target!;
    expect(target.resolution).toBe("ambiguous");
    expect(target.locators.every((l) => l.matches !== 1)).toBe(true);
    expect(JSON.stringify(target)).not.toMatch(/nth|index/i);
  });

  it("uses a stable test id and ignores generated ids", () => {
    const { events } = setup(`<button id="radix-:r12:" data-testid="checkout">Checkout</button>`);
    document.querySelector("button")!.click();
    const target = events()[0]!.target!;
    expect(target.attributes.id).toBeUndefined();
    expect(target.locators.find((l) => l.kind === "testId")).toMatchObject({ matches: 1 });
  });

  it("captures typed values but never sensitive values or their neighbourhood", () => {
    const { events, messages } = setup(`
      <form aria-label="Sign in">
        <label for="email">Email</label><input id="email" type="email">
        <label for="pw">Password</label><input id="pw" type="password" value="hunter2-secret">
        <input name="api_token" value="tok_live_123"><textarea>note tok_live_123</textarea>
      </form>`);
    const email = document.getElementById("email") as HTMLInputElement;
    email.value = "qa@example.com";
    email.dispatchEvent(new Event("change", { bubbles: true }));
    const password = document.getElementById("pw") as HTMLInputElement;
    password.value = "hunter2-secret";
    password.dispatchEvent(new Event("change", { bubbles: true }));
    const token = document.querySelector("[name=api_token]") as HTMLInputElement;
    token.value = "tok_live_123";
    token.dispatchEvent(new Event("change", { bubbles: true }));

    const [typed, pw, tok] = events();
    expect(typed).toMatchObject({ kind: "type", sensitive: false, value: "qa@example.com" });
    expect(pw).toMatchObject({ sensitive: true, value: null });
    expect(tok).toMatchObject({ sensitive: true, value: null });
    expect(describeEvent(pw!)).toBe("Enter protected value in textbox in “Sign in”");
    const wire = messages.join("\n");
    expect(wire).not.toContain("hunter2-secret");
    expect(wire).not.toContain("tok_live_123");
  });

  it("reports the post-action effect once the page settles", () => {
    vi.useFakeTimers();
    const { messages } = setup(`<button>Open</button>`);
    const button = document.querySelector("button")!;
    button.addEventListener("click", () => { document.title = "Opened"; document.body.append(document.createElement("p")); });
    button.click();
    vi.advanceTimersByTime(450);
    const effect = messages.map((m) => parseCaptureMessage(NONCE, m)).find((p) => p && "effect" in p) as { effect: { titleChanged?: boolean } } | undefined;
    expect(effect?.effect.titleChanged).toBe(true);
  });

  it("ignores repeated Enter and Escape keydown events", () => {
    const { events } = setup(`<button>Save</button>`);
    const button = document.querySelector("button")!;
    button.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    button.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter", repeat: true }));
    button.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape", repeat: true }));
    expect(events().map((event) => event.value)).toEqual(["Enter"]);
  });

  it("injects as a self-contained script", () => {
    expect(() => new Function(`return ${pageCaptureScript("n")}`)).not.toThrow();
    expect(pageCaptureScript("n")).toContain("veyra-teach:");
  });
});

describe("TeachRecorder", () => {
  const click = (nonce = NONCE): string => `veyra-teach:${nonce}:${JSON.stringify({ actionId: "a-1", kind: "click", sensitive: false, target: null, url: "https://shop.test/", value: null })}`;

  it("ignores spoofed messages and events outside an active session", () => {
    const recorder = new TeachRecorder({ nonce: NONCE, now: () => new Date("2026-10-04T00:00:00Z") });
    recorder.ingest(click());
    recorder.begin("s1");
    recorder.ingest(click("wrong"));
    recorder.ingest("console noise");
    expect(recorder.list("s1")).toEqual([]);
    recorder.ingest(click());
    expect(recorder.list("s1")).toHaveLength(1);
    expect(recorder.list("other")).toEqual([]);
  });

  it("drops a sensitive value even if the page sends one, and attaches effects and navigation", () => {
    const recorder = new TeachRecorder({ nonce: NONCE, now: () => new Date("2026-10-04T00:00:00Z") });
    recorder.begin("s1");
    const leaked: Partial<TeachCaptureEvent> = { actionId: "a-2", kind: "type", sensitive: true, target: null, url: "u", value: "hunter2" };
    recorder.ingest(`veyra-teach:${NONCE}:${JSON.stringify(leaked)}`);
    recorder.ingest(click());
    recorder.ingest(`veyra-teach:${NONCE}:${JSON.stringify({ actionId: "a-1", effect: { mutations: 3 } })}`);
    recorder.noteNavigation("https://shop.test/cart");
    const events = recorder.list("s1");
    expect(events[0]!.value).toBeNull();
    expect(events[1]!.effect).toMatchObject({ mutations: 3, navigatedTo: "https://shop.test/cart" });
    expect(events[2]).toMatchObject({ kind: "navigate", seq: 3 });
  });

  it("filters immediate duplicate actions but keeps repeated intentional actions", () => {
    let current = new Date("2026-10-04T00:00:00Z");
    const recorder = new TeachRecorder({ nonce: NONCE, now: () => current });
    recorder.begin("s1");
    recorder.ingest(click());
    recorder.ingest(click());
    expect(recorder.list("s1")).toHaveLength(1);

    current = new Date(current.getTime() + 751);
    recorder.ingest(click());
    expect(recorder.list("s1")).toHaveLength(2);
  });

  it("does not capture while paused and continues the same session when resumed", () => {
    const recorder = new TeachRecorder({ nonce: NONCE, now: () => new Date("2026-10-04T00:00:00Z") });
    recorder.begin("s1");
    recorder.pause();
    recorder.ingest(click());
    expect(recorder.paused).toBe(true);
    expect(recorder.list("s1")).toEqual([]);

    recorder.resume();
    recorder.ingest(click());
    expect(recorder.paused).toBe(false);
    expect(recorder.list("s1")).toHaveLength(1);
  });

  it("emits normalized actions and restores sequence from persisted actions", () => {
    const saved: ReturnType<typeof normalizeTeachEvent>[] = [];
    const recorder = new TeachRecorder({ nonce: NONCE, now: () => new Date("2026-10-04T00:00:00Z"), onAction: (action) => saved.push(action) });
    recorder.begin("s1");
    recorder.ingest(click());
    expect(saved[0]).toMatchObject({ kind: "click", readable: "Click page", seq: 1, sessionId: "s1" });

    const resumed = new TeachRecorder({ nonce: NONCE, now: () => new Date("2026-10-04T00:01:00Z") });
    resumed.begin("s1", saved);
    resumed.ingest(`veyra-teach:${NONCE}:${JSON.stringify({ actionId: "a-2", kind: "navigate", sensitive: false, target: null, url: "https://shop.test/cart", value: null })}`);
    expect(resumed.list("s1").at(-1)?.seq).toBe(2);
  });
});
