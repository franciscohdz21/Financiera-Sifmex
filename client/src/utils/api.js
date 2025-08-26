// client/src/utils/api.js
export async function apiFetch(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;
  const headers = hasBody
    ? { 'Content-Type': 'application/json', ...(options.headers || {}) }
    : (options.headers || {});

  const res = await fetch(path, { credentials: 'include', headers, ...options });
  if (!res.ok) {
    let err = 'Request failed';
    try { const j = await res.json(); err = j.error || err; } catch {}
    throw new Error(err);
  }
  return res.status === 204 ? null : res.json();
}
