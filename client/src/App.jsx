// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Welcome from './pages/Welcome';
import Clients from './pages/Clients';
import Loans from './pages/Loans';
import Payments from './pages/Payments';
import UiDemo from "./components/UiDemo.jsx";   // demo

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/bienvenida" replace />} />
          <Route path="/bienvenida" element={<Welcome />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/prestamos" element={<Loans />} />
          <Route path="/pagos" element={<Payments />} />
        </Routes>
      </main>
    </div>
  );

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <UiDemo />
//     </div>
//   );

}
