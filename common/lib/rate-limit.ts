const hits = new Map<string, number[]>();

/**
 * Allows `limit` calls per `windowMs` for each key. The counts live in memory,
 * so this is a per-instance safeguard against a single visitor flooding the
 * inbox, not a global limit.
 */
export function rateLimit(key: string, limit = 5, windowMs = 15 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  hits.set(key, [...recent, now]);
  // Keep the map from growing forever.
  if (hits.size > 1000) {
    for (const [k, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(k);
    }
  }
  return true;
}
