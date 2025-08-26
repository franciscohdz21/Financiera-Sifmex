import { Routes, Route, Outlet } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'

import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Login from './pages/Login'

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Login />} />

      {/* Requiere estar logueado (cualquier rol) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
        </Route>
      </Route>
    </Routes>
  )
}
