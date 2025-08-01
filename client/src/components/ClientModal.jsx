// Modal reutilizable para Nuevo / Editar Cliente
//  – open        : boolean        → muestra u oculta el popup
//  – onClose     : () => void     → cierra el modal sin guardar
//  – onSave      : (data) => void → devuelve datos validados al padre
//  – initialData : objeto cliente | null  (para modo edición)

import React, { useEffect, useState } from "react";

// plantilla vacía para 'Nuevo'
const EMPTY = {
  id: null,
  nombre: "",
  apellidos: "",
  celular: "",
  curp: "",
  calleNumero: "",
  colonia: "",
  ciudad: "",
  estado: "",
};

export default function ClientModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(EMPTY);

  // al abrir/editar pre-cargar datos
  useEffect(() => {
    setForm(initialData ? { ...initialData } : EMPTY);
  }, [initialData, open]);

  // helpers
  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valid = form.celular.trim() && form.curp.trim();

  if (!open) return null; // no renderiza si está cerrado

  return (
    // --- overlay & contenedor ---
    // <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm">
    //   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-xl mt-20 p-6 space-y-6">
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm">
      {/* Agregamos text-white en el wrapper para que hereden todos los textos */}
      <div className="bg-gray-800 text-white rounded-2xl shadow-lg w-full max-w-xl mt-20 p-6 space-y-6">
        {/* título dinámico */}
        <h2 className="text-xl font-semibold text-center">
          {form.id ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        {/* --- formulario --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="font-medium">Nombre</span>
            <input
              className="input-generic w-full"
              value={form.nombre}
              onChange={handle("nombre")}
            />
          </label>

          <label className="space-y-1">
            <span className="font-medium">Apellidos</span>
            <input
              className="input-generic w-full"
              value={form.apellidos}
              onChange={handle("apellidos")}
            />
          </label>

          <label className="space-y-1">
            <span className="font-medium">Celular *</span>
            <input
              className="input-generic w-full"
              value={form.celular}
              onChange={handle("celular")}
            />
          </label>

          <label className="space-y-1">
            <span className="font-medium">CURP *</span>
            <input
              className="input-generic w-full"
              value={form.curp}
              onChange={handle("curp")}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="font-medium">Calle y Número</span>
            <input
              className="input-generic w-full"
              value={form.calleNumero}
              onChange={handle("calleNumero")}
            />
          </label>

          <label className="space-y-1">
            <span className="font-medium">Colonia</span>
            <input
              className="input-generic w-full"
              value={form.colonia}
              onChange={handle("colonia")}
            />
          </label>

          <label className="space-y-1">
            <span className="font-medium">Ciudad</span>
            <input
              className="input-generic w-full"
              value={form.ciudad}
              onChange={handle("ciudad")}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="font-medium">Estado</span>
            <input
              className="input-generic w-full"
              value={form.estado}
              onChange={handle("estado")}
            />
          </label>
        </div>

        {/* --- botones --- */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="btn-generic px-4"
            type="button"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave(form)}
            disabled={!valid}
            className={`btn-success px-4 ${
              !valid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
