/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        surface: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E5E9F0',
        muted: '#64748B',
        accent: '#2563EB',
        green: { DEFAULT: '#16A34A', soft: '#DCFCE7' },
        amber: { DEFAULT: '#D97706', soft: '#FEF3C7' },
        red: { DEFAULT: '#DC2626', soft: '#FEE2E2' }
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
