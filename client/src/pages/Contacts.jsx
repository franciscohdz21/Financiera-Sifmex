// client/src/pages/Contacts.jsx
import React, { useEffect, useMemo, useState } from 'react';
import ContactModal from '../components/ContactModal';
import { Logger } from '../utils/logger';

/* Seed temporal — borrar cuando exista API */
const seed = [
  {
    id: 1,
    nombre: 'Juan',
    apellidos: 'Pérez',
    celular: '442 123 4567',
    curp: 'PEPJ800101HQTLLR04',
    calleNumero: 'Av. Reforma 123',
    colonia: 'Centro',
    ciudad: 'Querétaro',
    estado: 'QRO',
    rol: 'Cliente'
  }
];

export default function Contacts() {
  const logger = new Logger();
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  /* Modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = nuevo

  /* Cargar datos */
  useEffect(() => {
    logger.log('Contacts mounted');
    setContacts(seed);
  }, []);

  /* Filtrado */
  const visible = useMemo(() => {
    if (!filter.trim()) return contacts;
    const f = filter.toLowerCase();
    return contacts.filter(
      (c) =>
        c.apellidos.toLowerCase().includes(f) ||
        c.celular.toLowerCase().includes(f) ||
        c.curp.toLowerCase().includes(f)
    );
  }, [contacts, filter]);

  /* ------------ Handlers ------------ */
  const openNew   = () => { setEditing(null);      setModalOpen(true); };
  const openEdit  = () => { setEditing(selected);  setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const saveContact = (data) => {
    if (editing) {
      // Update existente
      setContacts((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...data, id: editing.id } : c))
      );
      logger.log('Updated', data);
    } else {
      // Crear nuevo
      const newId = Math.max(0, ...contacts.map((c) => c.id)) + 1;
      setContacts((prev) => [...prev, { ...data, id: newId }]);
      logger.log('Created', data);
    }
    setModalOpen(false);
  };

  const deleteContact = () => {
    if (!selected) return;
    setContacts((prev) => prev.filter((c) => c.id !== selected.id));
    setSelected(null);
    logger.warn('Deleted', selected);
  };

  /* ------------ UI ------------ */
  return (
    <section className="p-4 space-y-4">
      <h1 className="text-center text-2xl font-bold">Contacts</h1>

      <div className="flex flex-wrap gap-2">
        <button className="btn-success" onClick={openNew}>New Contact</button>
        <button
          className="btn-warning disabled:opacity-40"
          onClick={openEdit}
          disabled={!selected}
        >
          Edit Contact
        </button>
        <button
          className="btn-error disabled:opacity-40"
          onClick={deleteContact}
          disabled={!selected}
        >
          Delete Contact
        </button>

        <input
          className="input-filter flex-1 min-w-[240px]"
          placeholder="Filter: last name, phone or CURP"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Celular</th>
              <th>CURP</th>
              <th>Calle y Número</th>
              <th>Colonia</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={
                    selected?.id === c.id
                      ? 'bg-cyan-500 text-white cursor-pointer'
                      : 'cursor-pointer hover:bg-cyan-100'
                  }
                >
                  <td>{c.nombre}</td>
                  <td>{c.apellidos}</td>
                  <td>{c.celular}</td>
                  <td>{c.curp}</td>
                  <td>{c.calleNumero}</td>
                  <td>{c.colonia}</td>
                  <td>{c.ciudad}</td>
                  <td>{c.estado}</td>
                  <td>{c.rol}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ContactModal
        open={modalOpen}
        initialData={editing}
        onSave={saveContact}
        onClose={closeModal}
      />
    </section>
  );
}
