// Financiera-Sifmex/client/src/components/ContactModal.jsx
import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Props:
 *  - open        : boolean
 *  - onClose     : () => void
 *  - initialData : contacto | null  (si existe → editar, si no → nuevo)
 *  - onSaved     : () => void       (para refrescar lista)
 *  - onToast     : ({type, message}) => void
 */
export default function ContactModal({ open, onClose, initialData, onSaved, onToast }) {
  if (!open) return null;

  const blank = {
    nombre: '', apellidos: '', celular: '', curp: '',
    calleNumero: '', colonia: '', ciudad: '', estado: '', rol: 'Ninguno'
  };

  const [form, setForm] = useState(blank);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos al abrir / editar
  useEffect(() => { setForm(initialData ?? blank); }, [initialData]);

  const requiredMissing = !form.celular?.trim() || !form.curp?.trim();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (requiredMissing || submitting) return;
    setSubmitting(true);

    // Prepara payload con trims y límites defensivos
    const payload = {
      nombre:       (form.nombre || '').slice(0, 20).trim(),
      apellidos:    (form.apellidos || '').slice(0, 30).trim(),
      celular:      (form.celular || '').slice(0, 10).trim(),
      curp:         (form.curp || '').slice(0, 25).trim(),
      calleNumero:  (form.calleNumero || '').slice(0, 20).trim(),
      colonia:      (form.colonia || '').slice(0, 20).trim(),
      ciudad:       (form.ciudad || '').slice(0, 25).trim(),
      estado:       (form.estado || '').slice(0, 20).trim(),
      rol:          form.rol || 'Ninguno'
    };

    const url  = initialData ? `${API}/contacts/${initialData.id}` : `${API}/contacts`;
    const verb = initialData ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: verb,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // intenta leer un mensaje de error JSON del backend
        let msg = 'Operación fallida';
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          msg = `${res.status} ${res.statusText}`;
        }
        throw new Error(msg);
      }

      // Éxito
      onToast?.({
        type: 'success',
        message: initialData ? 'Contacto actualizado correctamente' : 'Contacto creado correctamente'
      });
      onSaved?.();   // refresca lista
      onClose?.();   // cierra modal
    } catch (e) {
      onToast?.({
        type: 'error',
        message: initialData
          ? `No se pudo actualizar el contacto: ${e.message}`
          : `No se pudo crear el contacto: ${e.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-900 border border-gray-700 p-6 w-full max-w-2xl rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar contacto' : 'Nuevo contacto'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            ['nombre', 'Nombre', 20],
            ['apellidos', 'Apellidos', 30],
            ['celular', 'Celular', 10],
            ['curp', 'CURP', 25],
            ['calleNumero', 'Calle y Nº', 20],
            ['colonia', 'Colonia', 20],
            ['ciudad', 'Ciudad', 25],
            ['estado', 'Estado', 20],
          ].map(([name, label, max]) => (
            <label key={name} className="flex flex-col text-sm">
              {label}
              <input
                type="text"
                name={name}
                value={form[name] ?? ''}
                maxLength={max}
                onChange={handleChange}
                className="mt-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded"
              />
            </label>
          ))}

          {/* Rol dropdown ocupa ambas columnas */}
          <label className="flex flex-col text-sm col-span-2">
            Rol
            <select
              name="rol"
              value={form.rol ?? 'Ninguno'}
              onChange={handleChange}
              className="mt-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded">
              <option>Cliente</option>
              <option>Aval</option>
              <option>Ninguno</option>
            </select>
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
            disabled={requiredMissing || submitting}
            className={`px-4 py-2 rounded ${
              requiredMissing || submitting
                ? 'bg-green-900 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {initialData ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
