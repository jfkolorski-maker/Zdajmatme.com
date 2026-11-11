/** Storage helpers that never throw (private mode, blocked storage, SSR). */
type Kind = "local" | "session";
const store = (k: Kind): Storage | null => {
  try {
    if (typeof window === "undefined") return null;
    return k === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};
export function readJSON<T>(key: string, kind: Kind = "local"): T | null {
  try {
    const raw = store(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
export function writeJSON(key: string, value: unknown, kind: Kind = "local") {
  try {
    store(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
export function remove(key: string, kind: Kind = "local") {
  try {
    store(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}
