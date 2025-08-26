// Financiera-Sifmex/client/src/pages/Contacts.jsx
import { useEffect, useState } from 'react';
import Notification from '../components/Notification.jsx';
import ContactModal from '../components/ContactModal.jsx';
import { apiFetch } from '../utils/api';
import { useAuth, hasRole } from '../context/AuthContext';

export default function Contacts() {
  const { user } = useAuth();
  const canEdit = hasRole(user, ['ADMIN', 'ROOT']);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [toast, setToast] = useState(null); // { type, message }

  /** Carga lista (manda SIEMPRE q=texto para que el backend haga OR en lastName/curp/cellphone). */
  const load = async (notify = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: (filter || '').trim(), // 👈 clave: solo q
        limit: '100',
        offset: '0',
      }).toString();

      const data = await apiFetch(`/api/contacts?${params}`);
      setItems(Array.isArray(data?.items) ? data.items : []);
      setTotal(typeof data?.total === 'number' ? data.total : 0);
      if (notify) setToast({ type: 'success', message: 'Contactos cargados correctamente' });
    } catch (e) {
      if (notify) setToast({ type: 'error', message: `No se pudieron cargar los contactos: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const openNew = () => {
    if (!canEdit) return;
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    if (!canEdit) return;
    setEditing(c);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const remove = async (id) => {
    if (!canEdit) return;
    if (!confirm('¿Eliminar contacto?')) return;
    try {
      await apiFetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setToast({ type: 'success', message: 'Contacto eliminado correctamente' });
      load(false); // recarga silenciosa
    } catch (e) {
      setToast({ type: 'error', message: `No se pudo eliminar el contacto: ${e.message}` });
    }
  };

  return (
    <div className="p-6 text-gray-200">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">Contactos</h1>

        <div className="flex flex-wrap items-center gap-3">
          <input
            placeholder="Buscar en Apellidos / CURP / Celular (ej: AV, GRES..., 551234...)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded w-96 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openNew}
            disabled={!canEdit}
            className={`px-4 py-2 rounded transition ${
              canEdit ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 opacity-50 cursor-not-allowed'
            }`}
            title={canEdit ? 'Nuevo contacto' : 'Solo Admin/Root pueden crear'}
          >
            Nuevo contacto
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && <div className="mb-3 text-sm text-slate-400">Cargando...</div>}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              {[
                '#',
                'Nombre',
                'Apellidos',
                'Celular',
                'CURP',
                'Calle & Nº',
                'Colonia',
                'Ciudad',
                'Estado',
                'Rol',
                'Acciones',
              ].map((h) => (
                <th key={h} className="px-2 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="px-2 py-2 text-center">{c.id}</td>
                <td className="px-2 py-2">{c.firstName}</td>
                <td className="px-2 py-2">{c.lastName}</td>
                <td className="px-2 py-2">{c.cellphone}</td>
                <td className="px-2 py-2">{c.curp}</td>
                <td className="px-2 py-2">{c.streetNumber}</td>
                <td className="px-2 py-2">{c.colony}</td>
                <td className="px-2 py-2">{c.city}</td>
                <td className="px-2 py-2">{c.state}</td>
                <td className="px-2 py-2">{c.role}</td>
                <td className="px-2 py-2">
                  <div className="flex gap-2">
                    <button
                      className={`px-2 py-1 rounded ${
                        canEdit ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canEdit && openEdit(c)}
                      disabled={!canEdit}
                      title={canEdit ? 'Editar' : 'Solo Admin/Root'}
                    >
                      Editar
                    </button>
                    <button
                      className={`px-2 py-1 rounded ${
                        canEdit ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canEdit && remove(c.id)}
                      disabled={!canEdit}
                      title={canEdit ? 'Eliminar' : 'Solo Admin/Root'}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td className="px-2 py-4 text-center text-slate-400" colSpan={11}>
                  No hay contactos que coincidan con tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer simple con total */}
      <div className="mt-3 text-xs text-slate-400">Total: {total}</div>

      {/* Modal crear/editar */}
      <ContactModal
        open={modalOpen}
        onClose={close}
        initialData={editing}
        onSaved={() => load(false)} // refresca sin toast extra
        onToast={(t) => setToast(t)} // muestra toasts de crear/editar
      />

      {/* Toast global */}
      {toast && <Notification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
