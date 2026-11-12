/* ============================================
   First-touch UTM：進站時保存，表單送出時一併帶上。
   不覆寫既有 source 欄位。
   ============================================ */

export const UTM_STORAGE_KEY = "rr_utm_first_touch";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type UtmFields = Partial<Record<UtmKey, string>> & {
  utm_landing_page?: string;
  utm_first_touch_at?: string;
};

const MAX_VALUE_LEN = 200;

export function parseUtmSearch(search: string): Partial<Record<UtmKey, string>> {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  const out: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, MAX_VALUE_LEN);
  }
  return out;
}

function hasUtm(fields: UtmFields): boolean {
  return UTM_KEYS.some((key) => Boolean(fields[key]));
}

function readStore(storage: Storage): UtmFields | null {
  try {
    const raw = storage.getItem(UTM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UtmFields;
    if (!parsed || typeof parsed !== "object" || !hasUtm(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStore(storage: Storage, fields: UtmFields) {
  try {
    storage.setItem(UTM_STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // private mode / quota：忽略，表單仍可從當下 URL 帶 UTM
  }
}

export function readStoredUtm(storage: Storage): UtmFields {
  return readStore(storage) || {};
}

/** 第一次帶 UTM 進站才寫入；後續活動不覆寫（first-touch）。 */
export function captureFirstTouchUtm(
  search: string,
  storages: Storage[],
  meta?: { landingPage?: string; now?: string }
): UtmFields {
  for (const storage of storages) {
    const existing = readStore(storage);
    if (existing && hasUtm(existing)) return existing;
  }

  const incoming = parseUtmSearch(search);
  if (!hasUtm(incoming)) return {};

  const fields: UtmFields = {
    ...incoming,
    utm_landing_page: (meta?.landingPage || "").slice(0, 500) || undefined,
    utm_first_touch_at: meta?.now || new Date().toISOString(),
  };

  for (const storage of storages) writeStore(storage, fields);
  return fields;
}

export function getBrowserStorages(): Storage[] {
  if (typeof window === "undefined") return [];
  const list: Storage[] = [];
  try {
    if (window.localStorage) list.push(window.localStorage);
  } catch {
    /* ignore */
  }
  try {
    if (window.sessionStorage) list.push(window.sessionStorage);
  } catch {
    /* ignore */
  }
  return list;
}

/** 進站捕捉（幂等）。在瀏覽器呼叫。 */
export function captureFirstTouchFromWindow(): UtmFields {
  if (typeof window === "undefined") return {};
  return captureFirstTouchUtm(
    window.location.search,
    getBrowserStorages(),
    { landingPage: window.location.pathname + window.location.search }
  );
}

export function getStoredUtm(): UtmFields {
  if (typeof window === "undefined") return {};
  const captured = captureFirstTouchFromWindow();
  if (hasUtm(captured)) return captured;
  for (const storage of getBrowserStorages()) {
    const existing = readStore(storage);
    if (existing && hasUtm(existing)) return existing;
  }
  return parseUtmSearch(window.location.search);
}

/** 併入既有 payload，絕不覆寫 source。 */
export function withUtmPayload<T extends object>(payload: T): T & UtmFields {
  const utm = getStoredUtm();
  const extra: UtmFields = {};
  for (const [key, value] of Object.entries(utm)) {
    if (value) (extra as Record<string, string>)[key] = value;
  }
  return { ...extra, ...payload };
}

/** 外連表單（如 n8n）補上已保存的 UTM；不覆寫網址上既有 utm_*。 */
export function appendUtmToUrl(url: string, utm: UtmFields = getStoredUtm()): string {
  if (!url || url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://rong-rise.com";
    const parsed = new URL(url, base);
    for (const key of UTM_KEYS) {
      const value = utm[key];
      if (value && !parsed.searchParams.get(key)) parsed.searchParams.set(key, value);
    }
    if (url.startsWith("/")) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
