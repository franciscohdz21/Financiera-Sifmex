import { NavLink } from 'react-router-dom';

const links = [
  { to: '/bienvenida', label: 'Panel de Bienvenida' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/prestamos', label: 'Préstamos' },
  { to: '/pagos', label: 'Pagos' }
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-slate-900 text-slate-100 flex flex-col">
      <h1 className="text-xl font-semibold p-4">Financiera-Sifmex</h1>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-4 py-2 hover:bg-slate-700 ${isActive ? 'bg-slate-700' : ''}`
          }
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
