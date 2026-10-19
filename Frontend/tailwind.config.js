/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        surface: {
          base: '#0b0c0e',
          canvas: '#090a0c',
          card: '#13151b',
          cardHover: '#181b22',
          panel: '#161820',
          inset: '#0a0b0f',
          border: '#222631',
          borderHover: '#323846',
          borderSubtle: '#1a1c23',
        },
        nepal: {
          crimson: '#DC143C',
          blue: '#003893',
          gold: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        devanagari: ['Preeti', 'Kantipur', 'Mukti', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-violet': '0 0 40px -8px rgba(124, 58, 237, 0.35)',
        'glow-cyan': '0 0 40px -8px rgba(6, 182, 212, 0.35)',
        'glow-rose': '0 0 40px -8px rgba(244, 63, 94, 0.35)',
        'glow-amber': '0 0 40px -8px rgba(245, 158, 11, 0.35)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'card-hover': '0 12px 35px -4px rgba(124, 58, 237, 0.22), 0 0 0 1px rgba(139, 92, 246, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
