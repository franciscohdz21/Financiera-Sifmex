// Financiera-Sifmex/client/src/components/ContactModal.jsx
import { useEffect, useState } from 'react';

export default function ContactModal({ open, onClose, initialData, onSaved }) {
  if (!open) return null;

  const blank = {
    nombre: '',
    apellidos: '',
    celular: '',
    curp: '',
    calleNumero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    rol: 'Ninguno'
  };

  const [form, setForm] = useState(blank);

  // Cargar datos al editar
  useEffect(() => {
    setForm(initialData ?? blank);
  }, [initialData]);

  // Validación mínima
  const requiredMissing = !form.celular || !form.curp;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const url  = initialData ? `/api/contacts/${initialData.id}` : '/api/contacts';
    const verb = initialData ? 'PUT' : 'POST';

    await fetch(import.meta.env.VITE_API_URL + url, {
      method: verb,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    onSaved();      // refresca lista en padre
    onClose();      // cierra modal
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
            ['estado', 'Estado', 20]
          ].map(([name, label, max]) => (
            <label key={name} className="flex flex-col text-sm">
              {label}
              <input
                type="text"
                name={name}
                value={form[name]}
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
              value={form.rol}
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
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={requiredMissing}
            className={`px-4 py-2 rounded ${
              requiredMissing
                ? 'bg-green-900 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500'
            }`}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
