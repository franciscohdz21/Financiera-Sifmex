// client/src/utils/api.js

const API = import.meta.env.VITE_API_URL; // p.ej. https://financiera-sifmex-web.onrender.com

export async function apiFetch(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;

  const headers = {
    Accept: 'application/json',
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API}${path}`, {
    credentials: 'include', // necesitamos la cookie del backend
    headers,
    ...options,
  });

  // Leemos el body como texto una sola vez
  let raw = '';
  try {
    raw = await res.text();
  } catch {
    raw = '';
  }

  // Intentamos parsear JSON si hay texto
  let data = null;
  if (raw && raw.trim().length > 0) {
    try {
      data = JSON.parse(raw);
    } catch {
      // No es JSON válido: lo dejamos en null y seguimos
      data = null;
    }
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  // Éxito: puede venir JSON o cuerpo vacío (p.ej. 204)
  return data; // si no había body, será null
}
