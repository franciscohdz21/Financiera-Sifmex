// client/src/components/Header.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function onLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-white font-semibold">Sifmex</span>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className="text-slate-300 hover:text-white">Dashboard</NavLink>
            <NavLink to="/contacts" className="text-slate-300 hover:text-white">Contactos</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-sm">
            {user.email} — <span className="uppercase">{user.role}</span>
          </span>
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
