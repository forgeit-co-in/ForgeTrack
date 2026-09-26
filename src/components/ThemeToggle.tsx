import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2.5 rounded-lg text-sm font-medium text-muted hover:bg-surface hover:text-ink transition-colors ${
        compact ? 'p-2' : 'px-3 py-2 w-full text-left'
      }`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      {!compact && (theme === 'dark' ? 'Light mode' : 'Dark mode')}
    </button>
  )
}
