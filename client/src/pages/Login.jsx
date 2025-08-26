// client/src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import Notification from '../components/Notification';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [toast, setToast] = useState(null); // {type:'success'|'error'|'warning', message:''}

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      setToast({ type: 'success', message: 'Login exitoso' });
      navigate('/', { replace: true });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Error de login' });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-slate-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl text-white font-semibold mb-6 text-center">Iniciar Sesión</h1>

        <label className="block text-sm text-slate-300 mb-1">Email</label>
        <input
          type="email"
          className="w-full mb-4 px-3 py-2 rounded-xl bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="usuario@empresa.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <label className="block text-sm text-slate-300 mb-1">Contraseña</label>
        <input
          type="password"
          className="w-full mb-6 px-3 py-2 rounded-xl bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="••••••••"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
          disabled={!email || !password}
        >
          Entrar
        </button>
      </form>

      {toast && (
        <div className="fixed bottom-4 right-4">
          <Notification type={toast.type} message={toast.message} onClose={()=>setToast(null)} />
        </div>
      )}
    </div>
  );
}
