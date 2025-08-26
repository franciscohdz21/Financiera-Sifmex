// client/src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="text-slate-200 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Bienvenido{user ? `, ${user.email}` : ''}.</p>
      {user && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm text-slate-400">Rol actual</div>
          <div className="text-xl font-medium">{user.role}</div>
        </div>
      )}
      <p className="text-slate-400">
        Usa el menú superior para navegar. Contactos está protegido:
        solo <span className="font-medium text-slate-200">Admin</span> y <span className="font-medium text-slate-200">Root</span> pueden crear/editar/eliminar.
      </p>
    </div>
  );
}
