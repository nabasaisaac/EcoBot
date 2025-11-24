/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#17563a",
        "primary-hover": "#11422c",
        "primary-light": "#e8f5ee",
        "background-light": "#ffffff",
        "background-dark": "#f7fafc",
        background: "#f7fafc",
        surface: "#f8fafc",
        card: "#ffffff",
        container: "#ffffff",
        "on-surface": "#0f172a",
        "on-surface-secondary": "#64748b",
        "text-primary": "#1a202c",
        "text-secondary": "#4a5568",
        "border-color": "#e2e8f0",
        "light-gray": "#f0f2f5",
        "gray-text": "#6b7280",
        "dark-text": "#111827",
        success: "#38a169",
        warning: "#dd6b20",
        critical: "#c53030",
        error: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
