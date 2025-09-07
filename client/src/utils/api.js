// client/src/utils/api.js

// URL base de la API, configurada desde las variables de entorno de Vite
const API = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;

  const headers = hasBody
    ? { 'Content-Type': 'application/json', ...(options.headers || {}) }
    : (options.headers || {});

  const res = await fetch(`${API}${path}`, {
    credentials: 'include', // si usas cookies. Si no, puedes quitarlo
    headers,
    ...options,
  });

  if (!res.ok) {
    let err = `Request failed with status ${res.status}`;
    try {
      const j = await res.json();
      err = j.error || j.message || err;
    } catch {
      // ignorar si no se puede parsear el body
    }
    throw new Error(err);
  }

  return res.status === 204 ? null : res.json();
}
