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
          bg: "#050608",
          card: "rgba(10, 14, 20, 0.75)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-bright": "rgba(255, 255, 255, 0.25)",
          accent: "#ff2a5f",
          "accent-glow": "rgba(255, 42, 95, 0.35)",
          cyan: "#00f0ff",
          cyanGlow: "rgba(0, 240, 255, 0.25)",
          text: "#e1e7ec",
          dim: "#6b7d8d",
          amber: "#ffb703"
        },
        arvis: {
          bg: "#050608",
          card: "rgba(10, 14, 20, 0.75)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-bright": "rgba(255, 255, 255, 0.25)",
          accent: "#ff2a5f",
          "accent-glow": "rgba(255, 42, 95, 0.35)",
          cyan: "#00f0ff",
          cyanGlow: "rgba(0, 240, 255, 0.25)",
          text: "#e1e7ec",
          dim: "#6b7d8d",
          amber: "#ffb703"
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
