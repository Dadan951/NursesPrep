/**
 * Cache sessionStorage avec TTL (durée de vie en ms).
 * Les données sont conservées le temps de la session navigateur.
 * À la fermeture de l'onglet, tout est effacé automatiquement.
 */
const TTL = 5 * 60 * 1000; // 5 minutes

export function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL) { sessionStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

export function setCache(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export function clearCache(key) {
  try { sessionStorage.removeItem(key); } catch {}
}
