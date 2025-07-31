import React from "react";

export default function UiDemo() {
  return (
    <div className="p-6 space-y-6">
      {/* ---------- BOTONES ---------- */}
      <div className="space-x-2">
        <button className="btn-success">Validar</button>
        <button className="btn-error">Eliminar</button>
        <button className="btn-warning">Editar</button>
        <button className="btn-generic">Acción</button>
      </div>

      {/* ---------- INPUTS ---------- */}
      <div className="space-y-2">
        <input className="input-filter"  placeholder="Filtrar por nombre…" />
        <input className="input-generic" placeholder="Nombre" />
      </div>

      {/* ---------- TABLA ---------- */}
      <table className="table-base">
        <thead>
          <tr>
            <th>ID</th><th>Cliente</th><th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Ana</td><td>$5,000</td></tr>
          <tr><td>2</td><td>Carlos</td><td>$8,000</td></tr>
        </tbody>
      </table>

      {/* ---------- DROPDOWN ---------- */}
      <div className="relative">
        <button className="btn-generic">Opciones ▼</button>
        <div className="dropdown-menu absolute">
          <span className="dropdown-item">Opción 1</span>
          <span className="dropdown-item">Opción 2</span>
        </div>
      </div>

      {/* ---------- POPUPS / TOASTS ---------- */}
      <div className="toast-success">Operación exitosa</div>
      <div className="toast-error">Algo salió mal</div>
      <div className="toast-warning">Advertencia</div>
    </div>
  );
}
