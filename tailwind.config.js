/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orion: {
          bg: "#0B0F1A", // DEEP SPACE
          deep: "#070A13",
          card: "rgba(11, 15, 26, 0.82)",
          border: "rgba(59, 130, 246, 0.22)",
          "border-bright": "rgba(139, 92, 246, 0.45)",
          primary: "#3B82F6", // ORION BLUE
          accent: "#8B5CF6", // ORION VIOLET
          "accent-glow": "rgba(139, 92, 246, 0.45)",
          cyan: "#38BDF8", // ELECTRIC CYAN
          cyanGlow: "rgba(56, 189, 248, 0.35)",
          blueGlow: "rgba(59, 130, 246, 0.45)",
          text: "#FFFFFF", // STAR WHITE
          dim: "#94A3B8",
          amber: "#F59E0B"
        },
        arvis: {
          bg: "#0B0F1A",
          deep: "#070A13",
          card: "rgba(11, 15, 26, 0.82)",
          border: "rgba(59, 130, 246, 0.22)",
          "border-bright": "rgba(139, 92, 246, 0.45)",
          accent: "#8B5CF6",
          "accent-glow": "rgba(139, 92, 246, 0.45)",
          cyan: "#38BDF8",
          cyanGlow: "rgba(56, 189, 248, 0.35)",
          text: "#FFFFFF",
          dim: "#94A3B8",
          amber: "#F59E0B"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 25s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
