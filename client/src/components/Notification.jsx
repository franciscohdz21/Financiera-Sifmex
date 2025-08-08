// Financiera-Sifmex/client/src/components/Notification.jsx
import { useEffect } from 'react';

/**
 * Simple toast-popup.
 * props:
 *   type    → 'success' | 'error' | 'warning'
 *   message → string a mostrar
 *   onClose → callback cuando desaparece (auto-oculta a los 3 s)
 */
export default function Notification({ type = 'success', message, onClose }) {
  // Desaparecer automáticamente en 3 s
  useEffect(() => {
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [onClose]);

  // Colores según tailwind del commit 4c04a1c5…
  const palette = {
    success: 'bg-green-600 border-green-400',
    error:   'bg-red-600   border-red-400',
    warning: 'bg-yellow-400 border-yellow-300 text-black'
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        px-4 py-2 rounded-xl shadow-lg border
        text-white font-medium
        animate-fade-in
        ${palette[type] ?? palette.success}
      `}
    >
      {message}
    </div>
  );
}
