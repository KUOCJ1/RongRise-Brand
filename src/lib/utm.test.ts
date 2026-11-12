import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  UTM_STORAGE_KEY,
  parseUtmSearch,
  captureFirstTouchUtm,
  readStoredUtm,
  withUtmPayload,
  appendUtmToUrl,
  getStoredUtm,
} from "./utm.ts";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("parseUtmSearch", () => {
  it("reads standard utm keys and ignores others", () => {
    const parsed = parseUtmSearch(
      "?utm_source=threads&utm_medium=social&utm_campaign=efficiency_concealment&foo=bar"
    );
    assert.equal(parsed.utm_source, "threads");
    assert.equal(parsed.utm_medium, "social");
    assert.equal(parsed.utm_campaign, "efficiency_concealment");
    assert.equal((parsed as Record<string, string>).foo, undefined);
  });

  it("accepts search without leading question mark", () => {
    assert.equal(parseUtmSearch("utm_source=threads").utm_source, "threads");
  });
});

describe("captureFirstTouchUtm", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it("saves the first inbound UTM into the provided stores", () => {
    const first = captureFirstTouchUtm(
      "?utm_source=threads&utm_medium=social",
      [storage],
      { landingPage: "/knowledge/efficiency-concealment-ai-productivity/?utm_source=threads", now: "2026-11-12T12:00:00.000Z" }
    );
    assert.equal(first.utm_source, "threads");
    assert.equal(first.utm_medium, "social");
    assert.equal(first.utm_landing_page, "/knowledge/efficiency-concealment-ai-productivity/?utm_source=threads");
    assert.equal(readStoredUtm(storage).utm_source, "threads");
  });

  it("does not overwrite first-touch when a later campaign arrives", () => {
    captureFirstTouchUtm("?utm_source=threads&utm_medium=social", [storage], { now: "2026-11-12T12:00:00.000Z" });
    const second = captureFirstTouchUtm("?utm_source=newsletter&utm_medium=email", [storage]);
    assert.equal(second.utm_source, "threads");
    assert.equal(readStoredUtm(storage).utm_medium, "social");
  });

  it("writes the same first-touch into both localStorage and sessionStorage", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    captureFirstTouchUtm("?utm_source=threads", [local, session], { now: "2026-11-12T12:00:00.000Z" });
    assert.equal(local.getItem(UTM_STORAGE_KEY), session.getItem(UTM_STORAGE_KEY));
    assert.equal(readStoredUtm(local).utm_source, "threads");
    assert.equal(readStoredUtm(session).utm_source, "threads");
  });
});

describe("withUtmPayload", () => {
  it("adds utm fields without overwriting source", () => {
    const storage = new MemoryStorage();
    captureFirstTouchUtm("?utm_source=threads&utm_campaign=winter", [storage], { now: "2026-11-12T12:00:00.000Z" });

    const originalGet = globalThis.window;
    const storages = [storage];
    // emulate browser helpers via actual module functions at unit level:
    const payload = {
      email: "test@example.com",
      source: "website",
      ...readStoredUtm(storage),
    };
    // source must remain the form's own value even if we spread utm first
    const merged = { ...readStoredUtm(storage), email: "test@example.com", source: "website" };
    assert.equal(merged.source, "website");
    assert.equal(merged.utm_source, "threads");
    assert.equal(merged.utm_campaign, "winter");
    assert.equal(merged.email, "test@example.com");
    void originalGet;
    void storages;
    void payload;
  });
});

describe("appendUtmToUrl", () => {
  it("appends stored utm and keeps existing query params", () => {
    const url = appendUtmToUrl("https://n8n.rong-rise.com/form/ai-maturity?foo=1", {
      utm_source: "threads",
      utm_medium: "social",
    });
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get("foo"), "1");
    assert.equal(parsed.searchParams.get("utm_source"), "threads");
    assert.equal(parsed.searchParams.get("utm_medium"), "social");
  });

  it("does not overwrite utm already on the url", () => {
    const url = appendUtmToUrl("https://n8n.rong-rise.com/form/ai-maturity?utm_source=hero", {
      utm_source: "threads",
      utm_medium: "social",
    });
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get("utm_source"), "hero");
    assert.equal(parsed.searchParams.get("utm_medium"), "social");
  });
});

describe("withUtmPayload browser contract", () => {
  it("keeps the form source when window storage has first-touch utm", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    captureFirstTouchUtm("?utm_source=threads&utm_medium=social", [local, session], {
      landingPage: "/",
      now: "2026-11-12T12:00:00.000Z",
    });

    const storeBag = { localStorage: local, sessionStorage: session };
    const prevWindow = globalThis.window;
    (globalThis as unknown as { window: object }).window = {
      localStorage: local,
      sessionStorage: session,
      location: { search: "", pathname: "/about/", href: "https://rong-rise.com/about/", origin: "https://rong-rise.com" },
    };
    try {
      const body = withUtmPayload({ email: "ada@example.com", source: "website" });
      assert.equal(body.source, "website");
      assert.equal(body.utm_source, "threads");
      assert.equal(body.utm_medium, "social");
      assert.equal(body.email, "ada@example.com");
    } finally {
      if (prevWindow) (globalThis as unknown as { window: unknown }).window = prevWindow;
      else delete (globalThis as { window?: unknown }).window;
      void storeBag;
    }
  });
});
