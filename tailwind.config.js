/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
        green: {
          DEFAULT: 'rgb(var(--green) / <alpha-value>)',
          soft: 'rgb(var(--green-soft) / <alpha-value>)'
        },
        amber: {
          DEFAULT: 'rgb(var(--amber) / <alpha-value>)',
          soft: 'rgb(var(--amber-soft) / <alpha-value>)'
        },
        red: {
          DEFAULT: 'rgb(var(--red) / <alpha-value>)',
          soft: 'rgb(var(--red-soft) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px 0 rgba(15,23,42,0.06)',
        pop: '0 8px 24px -8px rgba(15,23,42,0.15)'
      },
      borderRadius: { xl2: '1.25rem' }
    }
  },
  plugins: []
}
