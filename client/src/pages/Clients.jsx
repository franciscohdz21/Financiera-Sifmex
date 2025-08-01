// Página Clientes con modal reutilizable
import React, { useMemo, useState } from "react";
import ClientModal from "../components/ClientModal";

export default function Clients() {
  // ---- estado general ----
  const [clients, setClients]       = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter]         = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null); // null = nuevo

  // ---- filtrado local ----
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(c =>
      `${c.apellidos} ${c.celular} ${c.curp}`.toLowerCase().includes(q)
    );
  }, [clients, filter]);

  // ---- handlers ----
  const openNew  = () => { setEditing(null);               setModalOpen(true); };
  const openEdit = () => {
    if (!selectedId) return;
    setEditing(clients.find(c => c.id === selectedId) || null);
    setModalOpen(true);
  };
  const handleSave = (data) => {
    setModalOpen(false);
    if (data.id) {
      // edición
      setClients(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
      // nuevo
      data.id = crypto.randomUUID();
      setClients(prev => [...prev, data]);
    }
  };
  const handleDelete = () =>
    setClients(prev => prev.filter(c => c.id !== selectedId));

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">Clientes</h1>

      {/* acciones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button onClick={openNew}  className="btn-success w-full">Nuevo Cliente</button>
        <button onClick={openEdit}
                disabled={!selectedId}
                className={`btn-warning w-full ${!selectedId ? "opacity-50 cursor-not-allowed" : ""}`}>
          Editar Cliente
        </button>
        <button onClick={handleDelete}
                disabled={!selectedId}
                className={`btn-error w-full ${!selectedId ? "opacity-50 cursor-not-allowed" : ""}`}>
          Eliminar Cliente
        </button>
        <input
          className="input-filter w-full"
          placeholder="Filtro: Apellidos, Celular o CURP"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {/* tabla */}
      <div className="overflow-x-auto">
        <table className="table-base min-w-full">
          <thead>
            <tr>
              <th className="w-20">#</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Celular</th>
              <th>CURP</th>
              <th>Calle y Número</th>
              <th>Colonia</th>
              <th>Ciudad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center italic text-gray-400">
                  Sin registros…
                </td>
              </tr>
            )}
            {filtered.map((c, i) => (
              <tr key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`
                    hover:bg-brand-gray/30 cursor-pointer
                    ${selectedId === c.id ? "bg-brand-gray/40" : ""}
                  `}>
                <td>{i + 1}</td>
                <td>{c.nombre}</td>
                <td>{c.apellidos}</td>
                <td>{c.celular}</td>
                <td>{c.curp}</td>
                <td>{c.calleNumero}</td>
                <td>{c.colonia}</td>
                <td>{c.ciudad}</td>
                <td>{c.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- modal reutilizable --- */}
      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />
    </section>
  );
}
