/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      /* ===== Colores de marca ===== */
      colors: {
        "brand-green":  "#10B981",   // success
        "brand-red":    "#EF4444",   // error
        "brand-yellow": "#F59E0B",   // warning
        "brand-gray":   "#6B7280",   // acción genérica
        "panel-bg":     "#111827",   // navegación lateral
        "panel-hover":  "#1F2937",
        "table-header": "#374151",
        "table-row":    "#1F2937"
      },

      /* ===== Animaciones / keyframes ===== */
      keyframes: {
        "fade-in":   { "0%": {opacity:0, transform:"translateY(-4px)"}, "100%": {opacity:1, transform:"translateY(0)"} },
        "fade-out":  { "0%": {opacity:1, transform:"translateY(0)"},    "100%": {opacity:0, transform:"translateY(-4px)"} },
        "slide-down":{ "0%": {height:0},                                "100%": {height:"var(--radix-dropdown-menu-content-height)"} }
      },
      animation: {
        "fade-in":   "fade-in 0.20s ease-out forwards",
        "fade-out":  "fade-out 0.20s ease-in forwards",
        "slide-down":"slide-down 0.20s cubic-bezier(0.16,1,0.3,1) forwards"
      },

      /* Para suavizar alturas (dropdown) */
      transitionProperty: { height: "height" }
    }
  },
  plugins: []
};
