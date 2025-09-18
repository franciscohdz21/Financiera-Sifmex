// Financiera-Sifmex/client/src/components/ContactModal.jsx
import { useEffect, useState, useMemo } from 'react';
import { apiFetch } from '../utils/api';

/**
 * Props:
 *  - open        : boolean
 *  - onClose     : () => void
 *  - initialData : contacto | null  (si existe → editar, si no → nuevo)
 *  - onSaved     : () => void       (para refrescar lista)
 *  - onToast     : ({type, message}) => void
 */

// --- Helpers de compatibilidad y normalización ---
const BLANK = {
  firstName: '',
  lastName: '',
  cellphone: '',
  curp: '',
  streetNumber: '',
  colony: '',
  city: '',
  state: '',
  role: 'NINGUNO', // enum backend
  // nuevos
  fallos: 0,
  notas: '',
};

function toEnumRole(val) {
  const v = String(val ?? '').trim().toUpperCase();
  if (v.startsWith('CLI')) return 'CLIENTE';
  if (v.startsWith('AVA')) return 'AVAL';
  if (v === 'CLIENTE' || v === 'AVAL' || v === 'NINGUNO') return v;
  return 'NINGUNO';
}

// Acepta objetos con claves en español (legacy) o en inglés (backend) y devuelve forma backend
function normalizeInitial(data) {
  if (!data) return { ...BLANK };
  if ('firstName' in data) {
    // Ya viene con claves backend
    return {
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      cellphone: data.cellphone ?? '',
      curp: data.curp ?? '',
      streetNumber: data.streetNumber ?? '',
      colony: data.colony ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      role: toEnumRole(data.role),
      // nuevos
      fallos: Number.isInteger(data.fallos) ? data.fallos : 0,
      notas: data.notas ?? '',
      id: data.id, // por si edita
    };
  }
  // Legacy en español
  return {
    firstName: data.nombre ?? '',
    lastName: data.apellidos ?? '',
    cellphone: data.celular ?? '',
    curp: data.curp ?? '',
    streetNumber: data.calleNumero ?? '',
    colony: data.colonia ?? '',
    city: data.ciudad ?? '',
    state: data.estado ?? '',
    role: toEnumRole(data.rol),
    // nuevos
    fallos: Number.isInteger(data.fallos) ? data.fallos : 0,
    notas: data.notas ?? '',
    id: data.id,
  };
}

export default function ContactModal({ open, onClose, initialData, onSaved, onToast }) {
  if (!open) return null;

  const [form, setForm] = useState(BLANK);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos al abrir / editar (con compatibilidad)
  useEffect(() => {
    setForm(normalizeInitial(initialData));
  }, [initialData]);

  const requiredMissing =
    !form.cellphone?.toString().trim() || !form.curp?.toString().trim();

  const notasCount = useMemo(() => (form.notas || '').length, [form.notas]);
  const notasInvalid = notasCount > 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setForm((f) => ({ ...f, role: toEnumRole(value) }));
    } else if (name === 'fallos') {
      const n = parseInt(value, 10);
      setForm((f) => ({ ...f, fallos: Number.isNaN(n) ? 0 : Math.max(0, Math.min(5, n)) }));
    } else if (name === 'notas') {
      setForm((f) => ({ ...f, notas: value.slice(0, 100) })); // cap 100
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (requiredMissing || submitting || notasInvalid) return;
    setSubmitting(true);

    // Prepara payload con trims y límites defensivos
    const payload = {
      firstName: (form.firstName || '').slice(0, 50).trim(),
      lastName: (form.lastName || '').slice(0, 80).trim(),
      cellphone: (form.cellphone || '').slice(0, 20).trim(),
      curp: (form.curp || '').slice(0, 25).trim(),
      streetNumber: (form.streetNumber || '').slice(0, 50).trim(),
      colony: (form.colony || '').slice(0, 60).trim(),
      city: (form.city || '').slice(0, 60).trim(),
      state: (form.state || '').slice(0, 40).trim(),
      role: toEnumRole(form.role),
      // nuevos
      fallos: Math.max(0, Math.min(5, parseInt(form.fallos, 10) || 0)),
      notas: (form.notas || '').trim() ? (form.notas || '').trim().slice(0, 100) : null,
    };

    const isEdit = Boolean(form.id || initialData?.id);
    const id = form.id || initialData?.id;
    const path = isEdit ? `/api/contacts/${id}` : `/api/contacts`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      await apiFetch(path, {
        method,
        body: JSON.stringify(payload),
      });

      onToast?.({
        type: 'success',
        message: isEdit ? 'Contacto actualizado correctamente' : 'Contacto creado correctamente',
      });
      onSaved?.(); // refresca lista
      onClose?.(); // cierra modal
    } catch (e) {
      onToast?.({
        type: 'error',
        message: isEdit
          ? `No se pudo actualizar el contacto: ${e.message}`
          : `No se pudo crear el contacto: ${e.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-900 border border-gray-700 p-6 w-full max-w-2xl rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? 'Editar contacto' : 'Nuevo contacto'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            ['firstName', 'Nombre', 50],
            ['lastName', 'Apellidos', 80],
            ['cellphone', 'Celular *', 20],
            ['curp', 'CURP *', 25],
            ['streetNumber', 'Calle y Nº', 50],
            ['colony', 'Colonia', 60],
            ['city', 'Ciudad', 60],
            ['state', 'Estado', 40],
          ].map(([name, label, max]) => (
            <label key={name} className="flex flex-col text-sm">
              {label}
              <input
                type="text"
                name={name}
                value={form[name] ?? ''}
                maxLength={max}
                onChange={handleChange}
                className="mt-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          ))}

          {/* Rol dropdown ocupa ambas columnas */}
          <label className="flex flex-col text-sm col-span-2">
            Rol
            <select
              name="role"
              value={form.role ?? 'NINGUNO'}
              onChange={handleChange}
              className="mt-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="AVAL">Aval</option>
              <option value="NINGUNO">Ninguno</option>
            </select>
          </label>

          {/* Fallos dropdown (0..5) */}
          <label className="flex flex-col text-sm">
            Fallos
            <select
              name="fallos"
              value={form.fallos ?? 0}
              onChange={handleChange}
              className="mt-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          {/* Notas (máx 100 caracteres) */}
          <label className="flex flex-col text-sm">
            Notas (máx. 100)
            <input
              type="text"
              name="notas"
              value={form.notas ?? ''}
              maxLength={100}
              onChange={handleChange}
              className={`mt-1 px-2 py-1 bg-gray-800 border rounded outline-none focus:ring-2 ${
                notasInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Observaciones del contacto"
            />
            <span className={`mt-1 text-xs ${notasInvalid ? 'text-red-400' : 'text-slate-400'}`}>
              {notasCount}/100
            </span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={requiredMissing || submitting || notasInvalid}
            className={`px-4 py-2 rounded ${
              requiredMissing || submitting || notasInvalid
                ? 'bg-green-900 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {form.id ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
