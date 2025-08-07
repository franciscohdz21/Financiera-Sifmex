// client/src/components/ContactModal.jsx
import React, { useEffect, useState } from 'react';

/**
 * Modal reutilizable para crear / editar un Contacto.
 *
 * Props:
 *   open        : boolean               →  ¿Mostrar modal?
 *   initialData : objeto Contacto | null →  Datos existentes (edición) o null (nuevo)
 *   onSave      : (contacto) => void     →  Devuelve datos al guardar
 *   onClose     : () => void             →  Cerrar sin guardar
 */
export default function ContactModal({ open, initialData, onSave, onClose }) {
  /* ---------- Estado local de formulario ---------- */
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    celular: '',
    curp: '',
    calleNumero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    rol: 'Cliente'
  });

  /* Sincronizar cuando cambie initialData */
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  /* ---------- Helpers ---------- */
  const requiredMissing = !form.celular.trim() || !form.curp.trim();

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSave = () => {
    if (requiredMissing) return; // seguridad extra
    onSave(form);
  };

  if (!open) return null; // no se muestra

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Edit Contact' : 'New Contact'}
        </h2>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input-generic"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange('nombre')}
          />
          <input
            className="input-generic"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={handleChange('apellidos')}
          />
          <input
            className="input-generic"
            placeholder="Celular*"
            value={form.celular}
            onChange={handleChange('celular')}
          />
          <input
            className="input-generic"
            placeholder="CURP*"
            value={form.curp}
            onChange={handleChange('curp')}
          />
          <input
            className="input-generic col-span-full"
            placeholder="Calle y Número"
            value={form.calleNumero}
            onChange={handleChange('calleNumero')}
          />
          <input
            className="input-generic"
            placeholder="Colonia"
            value={form.colonia}
            onChange={handleChange('colonia')}
          />
          <input
            className="input-generic"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange('ciudad')}
          />
          <input
            className="input-generic"
            placeholder="Estado"
            value={form.estado}
            onChange={handleChange('estado')}
          />

          {/* Dropdown Rol */}
          <select
            className="input-generic"
            value={form.rol}
            onChange={handleChange('rol')}
          >
            <option value="Cliente">Cliente</option>
            <option value="Aval">Aval</option>
            <option value="Inactivo">Ninguno</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-2">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary disabled:opacity-40"
            disabled={requiredMissing}
            onClick={handleSave}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
