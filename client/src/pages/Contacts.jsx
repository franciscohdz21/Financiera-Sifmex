// Financiera-Sifmex/client/src/pages/Contacts.jsx
import { useEffect, useState } from 'react';
import Notification   from '../components/Notification.jsx';
import ContactModal   from '../components/ContactModal.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Contacts() {
  // ────────────────  State
  const [contacts, setContacts]   = useState([]);
  const [filter, setFilter]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [toast, setToast]         = useState(null);   // { type, message }

  /** Carga contactos.
   *  @param {boolean} notify - si true muestra toast de éxito / error
   */
  const load = async (notify = true) => {
    try {
      const res   = await fetch(`${API}/contacts?q=${encodeURIComponent(filter)}`);
      if (!res.ok) throw new Error('Respuesta no OK');
      const data  = await res.json();
      setContacts(data);

      if (notify) {
        setToast({ type: 'success', message: 'Contactos cargados correctamente' });
      }
    } catch {
      if (notify) {
        setToast({ type: 'error', message: 'No se pudieron cargar los contactos' });
      }
    }
  };

  // ────────────────  Efecto inicial + filtro
  useEffect(() => {
    load(true);                    // muestra toast sólo cuando cambia filtro o se monta
  }, [filter]);

  // ────────────────  Handlers
  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c);   setModalOpen(true); };
  const close    = () => setModalOpen(false);

  const remove = async (id) => {
    if (!confirm('¿Eliminar contacto?')) return;
    try {
      const res = await fetch(`${API}/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setToast({ type: 'success', message: 'Contacto eliminado correctamente' });

      // Recarga lista sin mostrar toast de «cargados correctamente»
      load(false);
    } catch {
      setToast({ type: 'error', message: 'No se pudo eliminar el contacto' });
    }
  };

  // ────────────────  UI
  return (
    <div className="p-6 text-gray-200">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">Contactos</h1>

        <div className="flex gap-3">
          <input
            placeholder="Filtro…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded w-48"
          />
          <button
            onClick={openNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded">
            Nuevo contacto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              {[
                '#', 'Nombre', 'Apellidos', 'Celular', 'CURP',
                'Calle & Nº', 'Colonia', 'Ciudad', 'Estado', 'Rol', 'Acciones'
              ].map((h) => (
                <th key={h} className="px-2 py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="px-2 py-1 text-center">{c.id}</td>
                <td className="px-2 py-1">{c.nombre}</td>
                <td className="px-2 py-1">{c.apellidos}</td>
                <td className="px-2 py-1">{c.celular}</td>
                <td className="px-2 py-1">{c.curp}</td>
                <td className="px-2 py-1">{c.calleNumero}</td>
                <td className="px-2 py-1">{c.colonia}</td>
                <td className="px-2 py-1">{c.ciudad}</td>
                <td className="px-2 py-1">{c.estado}</td>
                <td className="px-2 py-1">{c.rol}</td>
                <td className="px-2 py-1 flex gap-2">
                  <button
                    className="px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-500"
                    onClick={() => openEdit(c)}>
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-500"
                    onClick={() => remove(c.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear / editar */}
      <ContactModal
        open={modalOpen}
        onClose={close}
        initialData={editing}
        onSaved={() => load(false)}   // recarga sin toast extra
      />

      {/* Toast de notificación */}
      {toast && (
        <Notification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
