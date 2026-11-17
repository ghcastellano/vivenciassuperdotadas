const STORAGE_KEY = "vs_dirty_routes";
const TTL_MS = 10 * 60 * 1000;

export function markRoutesDirty(paths: string[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const current: Record<string, number> = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    for (const p of paths) {
      current[p] = now;
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore storage errors
  }
}

export function consumeRouteDirty(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const current: Record<string, number> = JSON.parse(raw);
    const now = Date.now();
    const ts = current[pathname] ?? current["*"];
    if (ts && now - ts < TTL_MS) {
      delete current[pathname];
      delete current["*"];
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
